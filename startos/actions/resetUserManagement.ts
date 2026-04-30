import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const resetUserManagement = sdk.Action.withoutInput(
  'reset-user-management',

  async ({ effects }) => ({
    name: i18n('Reset User Management'),
    description: i18n(
      'Reset n8n to its initial setup state, removing all user accounts. Workflows and credentials are NOT deleted.',
    ),
    warning: i18n(
      'This returns n8n to its initial setup state and removes all user accounts. You will need to complete the owner-account setup wizard again. Your workflows and credentials are NOT deleted.',
    ),
    allowedStatuses: 'only-stopped',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'n8n' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/home/node/.n8n',
        readonly: false,
      }),
      'n8n-action-reset-user-management',
      async (sub) => {
        await sub.execFail(['n8n', 'user-management:reset'])
      },
    )

    return {
      version: '1' as const,
      title: i18n('User Management Reset'),
      message: i18n(
        'User management has been reset. Start n8n and complete the owner account setup wizard.',
      ),
      result: null,
    }
  },
)
