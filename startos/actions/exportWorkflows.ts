import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const exportWorkflows = sdk.Action.withoutInput(
  'export-workflows',

  async ({ effects }) => ({
    name: i18n('Export Workflows'),
    description: i18n(
      'Export all workflows as JSON. The result is displayed inline as a copyable string.',
    ),
    warning: null,
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
      'n8n-action-export-workflows',
      async (sub) => {
        const res = await sub.exec(['n8n', 'export:workflow', '--all'])
        stdout = (res.stdout as string) || ''
        stderr = (res.stderr as string) || ''
        exitCode = res.exitCode ?? 1
      },
    )

    if (exitCode !== 0) {
      return {
        version: '1' as const,
        title: i18n('Export Failed'),
        message: i18n('Failed to export workflows.'),
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

    // Trim whitespace and handle potential preamble noise
    let output = stdout.trim()
    const jsonStart = output.search(/[\[{]/)
    if (jsonStart > 0) {
      output = output.slice(jsonStart)
    }

    return {
      version: '1' as const,
      title: i18n('Workflows Export'),
      message: i18n(
        'Click the copy icon to copy the JSON. Save it to a file on your local machine.',
      ),
      result: {
        type: 'single' as const,
        name: i18n('Workflows JSON'),
        description: null,
        value: output || i18n('No workflows found.'),
        masked: false,
        copyable: true,
        qr: false,
      },
    }
  },
)
