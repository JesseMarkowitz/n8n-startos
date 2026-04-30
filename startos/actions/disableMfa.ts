import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  email: Value.text({
    name: i18n('Email Address'),
    description: i18n(
      'The email address of the user whose MFA should be disabled',
    ),
    required: true,
    default: null,
    patterns: [
      {
        regex: '^[^@]+@[^@]+\\.[^@]+$',
        description: i18n('Must be a valid email address'),
      },
    ],
    masked: false,
    placeholder: i18n('user@example.com'),
    inputmode: 'email',
    minLength: null,
    maxLength: null,
  }),
})

export const disableMfa = sdk.Action.withInput(
  'disable-mfa',

  {
    name: i18n('Disable MFA for User'),
    description: i18n(
      'Disable multi-factor authentication for a specific user who has lost access to their MFA device or recovery codes.',
    ),
    warning: i18n(
      'The specified user will lose their MFA protection and must reconfigure it after logging in.',
    ),
    allowedStatuses: 'only-stopped' as const,
    group: null,
    visibility: 'enabled' as const,
  },

  inputSpec,

  async ({ effects }) => ({ email: undefined }),

  async ({ effects, input }) => {
    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'n8n' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/home/node/.n8n',
        readonly: false,
      }),
      'n8n-action-disable-mfa',
      async (sub) => {
        await sub.execFail(['n8n', 'mfa:disable', '--email', input.email])
      },
    )

    return {
      version: '1' as const,
      title: i18n('MFA Disabled'),
      message: i18n(
        'MFA has been disabled for ${email}. The user must reconfigure MFA after logging in.',
        { email: input.email },
      ),
      result: null,
    }
  },
)
