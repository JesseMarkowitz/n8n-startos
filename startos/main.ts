import { T } from '@start9labs/start-sdk'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { n8nPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting n8n!'))

  const store = await storeJson.read().const(effects)
  if (!store) {
    throw new Error(i18n('store.json not found'))
  }

  const { encryptionKey, primaryUrl, smtp } = store

  // Derive URL-based env vars
  const urlEnv: Record<string, string> = {}
  if (primaryUrl) {
    const parsed = new URL(primaryUrl)
    const protocol = parsed.protocol === 'https:' ? 'https' : 'http'
    const webhookUrl = primaryUrl.endsWith('/') ? primaryUrl : primaryUrl + '/'
    urlEnv['N8N_HOST'] = parsed.hostname
    urlEnv['N8N_PROTOCOL'] = protocol
    urlEnv['N8N_SECURE_COOKIE'] = protocol === 'https' ? 'true' : 'false'
    urlEnv['WEBHOOK_URL'] = webhookUrl
    urlEnv['N8N_EDITOR_BASE_URL'] = webhookUrl
  }

  // Resolve SMTP credentials
  let smtpCredentials: T.SmtpValue | null = null

  if (smtp?.selection === 'system') {
    smtpCredentials = await sdk.getSystemSmtp(effects).const()
    const customFrom = smtp.value.customFrom as string | undefined
    if (smtpCredentials && customFrom) smtpCredentials.from = customFrom
  } else if (smtp?.selection === 'custom') {
    const { host, from, username, password, security } =
      smtp.value.provider.value
    smtpCredentials = {
      host,
      port: Number(security.value.port),
      from,
      username,
      password: password ?? null,
      security: security.selection,
    }
  }

  const smtpEnv: Record<string, string> = {}
  if (smtpCredentials) {
    smtpEnv['N8N_EMAIL_MODE'] = 'smtp'
    smtpEnv['N8N_SMTP_HOST'] = smtpCredentials.host
    smtpEnv['N8N_SMTP_PORT'] = String(smtpCredentials.port)
    smtpEnv['N8N_SMTP_USER'] = smtpCredentials.username
    smtpEnv['N8N_SMTP_SENDER'] = smtpCredentials.from
    smtpEnv['N8N_SMTP_SSL'] =
      smtpCredentials.security === 'tls' ? 'true' : 'false'
    if (smtpCredentials.password) {
      smtpEnv['N8N_SMTP_PASS'] = smtpCredentials.password
    }
  }

  const n8nMounts = sdk.Mounts.of().mountVolume({
    volumeId: 'main',
    subpath: null,
    mountpoint: '/home/node/.n8n',
    readonly: false,
  })

  const n8nSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'n8n' },
    n8nMounts,
    'n8n-sub',
  )

  return sdk.Daemons.of(effects)
    .addOneshot('chown', {
      subcontainer: n8nSub,
      exec: {
        command: ['chown', '-R', 'node:node', '/home/node/.n8n'],
        user: 'root',
      },
      requires: [],
    })
    .addDaemon('primary', {
    subcontainer: n8nSub,
    exec: {
      command: sdk.useEntrypoint(),
      env: {
        // Hardcoded constants
        N8N_LISTEN_ADDRESS: '0.0.0.0',
        N8N_PORT: '5678',
        DB_TYPE: 'sqlite',
        DB_SQLITE_POOL_SIZE: '5',
        TINI_SUBREAPER: '1',
        N8N_REINSTALL_MISSING_PACKAGES: 'true',
        N8N_LOG_LEVEL: 'info',
        N8N_METRICS: 'false',
        N8N_DIAGNOSTICS_ENABLED: 'false',
        N8N_VERSION_NOTIFICATIONS_ENABLED: 'false',
        N8N_TEMPLATES_ENABLED: 'false',
        N8N_PERSONALIZATION_ENABLED: 'false',
        GENERIC_TIMEZONE: 'UTC',
        TZ: 'UTC',
        // Derived from store
        N8N_ENCRYPTION_KEY: encryptionKey,
        ...urlEnv,
        ...smtpEnv,
      },
    },
    ready: {
      display: i18n('Web Interface'),
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, n8nPort, {
          successMessage: i18n('n8n is ready'),
          errorMessage: i18n('n8n is not ready'),
        }),
    },
    requires: ['chown'],
  })
})
