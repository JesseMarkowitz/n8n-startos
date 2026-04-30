import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const exportCredentials = sdk.Action.withoutInput(
  'export-credentials',

  async ({ effects }) => ({
    name: i18n('Export Credentials'),
    description: i18n(
      'Export all credentials in plain text as JSON. The result is displayed inline as a copyable, masked string.',
    ),
    warning: i18n(
      'SECURITY WARNING: This exports your credentials in PLAIN TEXT including API keys, passwords, and tokens. Handle the copied content with extreme care. Do not paste it into untrusted locations.',
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    let stdout = ''
    let stderr = ''
    let exitCode = 1

    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'n8n' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/home/node/.n8n',
        readonly: true,
      }),
      'n8n-action-export-credentials',
      async (sub) => {
        const res = await sub.exec([
          'n8n',
          'export:credentials',
          '--all',
          '--decrypted',
        ])
        stdout = (res.stdout as string) || ''
        stderr = (res.stderr as string) || ''
        exitCode = res.exitCode ?? 1
      },
    )

    if (exitCode !== 0) {
      return {
        version: '1' as const,
        title: i18n('Export Failed'),
        message: i18n('Failed to export credentials.'),
        result: {
          type: 'single' as const,
          name: i18n('Error'),
          description: null,
          value: (stderr || i18n('Unknown error')).slice(0, 2000),
          masked: false,
          copyable: true,
          qr: false,
        },
      }
    }

    let output = stdout.trim()
    const jsonStart = output.search(/[\[{]/)
    if (jsonStart > 0) {
      output = output.slice(jsonStart)
    }

    return {
      version: '1' as const,
      title: i18n('Credentials Export (DECRYPTED)'),
      message: i18n(
        'Click the eye icon to reveal, then copy. Save to a secure location and delete the copy when done.',
      ),
      result: {
        type: 'single' as const,
        name: i18n('Credentials JSON (Plain Text)'),
        description: i18n(
          'All credentials decrypted with your encryption key. Treat as highly sensitive.',
        ),
        value: output || i18n('No credentials found.'),
        masked: true,
        copyable: true,
        qr: false,
      },
    }
  },
)
