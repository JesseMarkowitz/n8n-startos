import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const completeSetup = sdk.Action.withoutInput(
  'complete-setup',

  async ({ effects }) => ({
    name: i18n('Complete Owner Account Setup'),
    description: i18n(
      'Open the n8n Web UI and complete the owner-account setup wizard to create your admin account.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => ({
    version: '1' as const,
    title: i18n('First-Time Setup'),
    message: i18n(
      'Open the n8n Web UI using the interface URL and complete the owner-account setup wizard. Once done, this task can be dismissed.',
    ),
    result: null,
  }),
)
