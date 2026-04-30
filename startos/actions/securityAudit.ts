import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const securityAudit = sdk.Action.withoutInput(
  'security-audit',

  async ({ effects }) => ({
    name: i18n('Run Security Audit'),
    description: i18n(
      "Run n8n's built-in security audit and display the results.",
    ),
    warning: null,
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    let stdout = ''

    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'n8n' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/home/node/.n8n',
        readonly: true,
      }),
      'n8n-action-security-audit',
      async (sub) => {
        const res = await sub.exec(['n8n', 'audit'])
        stdout = (res.stdout as string) || ''
      },
    )

    return {
      version: '1' as const,
      title: i18n('Security Audit Results'),
      message: i18n('Review any warnings or recommendations below.'),
      result: {
        type: 'single' as const,
        name: i18n('Audit Output'),
        description: null,
        value: stdout.trim() || i18n('No findings.'),
        masked: false,
        copyable: true,
        qr: false,
      },
    }
  },
)
