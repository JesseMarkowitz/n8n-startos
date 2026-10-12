import { utils } from '@start9labs/start-sdk'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { dataDir } from '../utils'

// Runs inside a temporary n8n container. Hashes the new password with n8n's own
// bundled bcryptjs (so the on-disk format matches exactly) and updates only the
// owner row via Node's built-in sqlite. No other users or data are touched, and
// n8n reads the hash fresh on each login, so no restart is needed. It fails loud
// if it does not update exactly one owner row (e.g. schema drift on an upstream
// bump), rather than silently corrupting anything.
const RESET_SCRIPT = `
const fs = require('fs'), path = require('path')
const base = '/usr/local/lib/node_modules/n8n/node_modules'
let bp
try {
  bp = require.resolve('bcryptjs', { paths: [base] })
} catch (e) {
  const pnpm = path.join(base, '.pnpm')
  const dir = fs.readdirSync(pnpm).find((d) => d.startsWith('bcryptjs@'))
  bp = path.join(pnpm, dir, 'node_modules', 'bcryptjs')
}
const bcrypt = require(bp)
const { DatabaseSync } = require('node:sqlite')
const db = new DatabaseSync(process.env.N8N_DB)
db.exec('PRAGMA busy_timeout=8000')
const hash = bcrypt.hashSync(process.env.NEW_PASSWORD, 10)
const res = db
  .prepare('UPDATE [user] SET password = ? WHERE roleSlug = ?')
  .run(hash, 'global:owner')
db.close()
if (res.changes === 0) {
  console.error('No n8n owner account exists yet. Open the Web UI to create the owner account, then try again.')
  process.exit(1)
}
if (res.changes !== 1) {
  console.error('Expected to update exactly one owner account, updated ' + res.changes + '.')
  process.exit(1)
}
`

export const resetOwnerPassword = sdk.Action.withoutInput(
  'reset-owner-password',

  async ({ effects }) => ({
    name: i18n('Reset Owner Password'),
    description: i18n(
      'Generate a new password for the n8n owner account — use this if you are locked out and have not set up SMTP password resets. Your workflows, credentials, and any other user accounts are left untouched.',
    ),
    warning: i18n(
      'Replaces the n8n owner account password. The current password stops working, and the new one is shown only once.',
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const password = utils.getDefaultString({ charset: 'a-z,A-Z,1-9', len: 22 })

    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'n8n' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: dataDir,
        readonly: false,
      }),
      'reset-owner-password',
      async (sub) => {
        await sub.execFail(['node', '-e', RESET_SCRIPT], {
          env: {
            NEW_PASSWORD: password,
            N8N_DB: `${dataDir}/database.sqlite`,
          },
        })
      },
    )

    return {
      version: '1',
      title: i18n('Owner Password Reset'),
      message: i18n(
        'Sign in to n8n with the new owner password below. It is shown only once — copy it now.',
      ),
      result: {
        type: 'single' as const,
        value: password,
        masked: true,
        copyable: true,
        qr: false,
        launchable: false,
      },
    }
  },
)
