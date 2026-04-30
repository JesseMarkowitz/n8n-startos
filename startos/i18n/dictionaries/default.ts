export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting n8n!': 0,
  'store.json not found': 1,
  'Web Interface': 2,
  'n8n is ready': 3,
  'n8n is not ready': 4,

  // interfaces.ts
  'Web UI': 5,
  'n8n workflow editor and dashboard': 6,
  'REST API & Webhooks': 7,
  'Programmatic access and webhook endpoints for external services (e.g. GitHub, Stripe triggers). Use this URL when configuring external services to call your n8n instance.': 8,

  // actions/setPrimaryUrl.ts
  URL: 9,
  'Set Primary URL': 10,
  'Choose which of your n8n URLs should serve as the primary URL for generating webhook links and editor base URL.': 11,

  // actions/manageSmtp.ts
  'Configure SMTP': 12,
  'Add SMTP credentials for sending emails (password resets, notifications, etc.)': 13,

  // actions/resetUserManagement.ts
  'Reset User Management': 14,
  'Reset n8n to its initial setup state, removing all user accounts. Workflows and credentials are NOT deleted.': 15,
  'This returns n8n to its initial setup state and removes all user accounts. You will need to complete the owner-account setup wizard again. Your workflows and credentials are NOT deleted.': 16,
  'User Management Reset': 17,
  'User management has been reset. Start n8n and complete the owner account setup wizard.': 18,

  // actions/disableMfa.ts
  'Email Address': 19,
  'The email address of the user whose MFA should be disabled': 20,
  'Must be a valid email address': 21,
  'user@example.com': 22,
  'Disable MFA for User': 23,
  'Disable multi-factor authentication for a specific user who has lost access to their MFA device or recovery codes.': 24,
  'The specified user will lose their MFA protection and must reconfigure it after logging in.': 25,
  'MFA Disabled': 26,
  'MFA has been disabled for ${email}. The user must reconfigure MFA after logging in.': 27,

  // actions/exportWorkflows.ts
  'Export Workflows': 28,
  'Export all workflows as JSON. The result is displayed inline as a copyable string.': 29,
  'Export Failed': 30,
  'Failed to export workflows.': 31,
  Error: 32,
  'Unknown error': 33,
  'Workflows Export': 34,
  'Click the copy icon to copy the JSON. Save it to a file on your local machine.': 35,
  'Workflows JSON': 36,
  'No workflows found.': 37,

  // actions/exportCredentials.ts
  'Export Credentials': 38,
  'Export all credentials in plain text as JSON. The result is displayed inline as a copyable, masked string.': 39,
  'SECURITY WARNING: This exports your credentials in PLAIN TEXT including API keys, passwords, and tokens. Handle the copied content with extreme care. Do not paste it into untrusted locations.': 40,
  'Failed to export credentials.': 41,
  'Credentials Export (DECRYPTED)': 42,
  'Click the eye icon to reveal, then copy. Save to a secure location and delete the copy when done.': 43,
  'Credentials JSON (Plain Text)': 44,
  'All credentials decrypted with your encryption key. Treat as highly sensitive.': 45,
  'No credentials found.': 46,

  // actions/securityAudit.ts
  'Run Security Audit': 47,
  "Run n8n's built-in security audit and display the results.": 48,
  'Security Audit Results': 49,
  'Review any warnings or recommendations below.': 50,
  'Audit Output': 51,
  'No findings.': 52,

  // init/initializeService.ts
  'Configure which URL n8n uses for generating webhook links before starting the service.': 53,
  'Open the n8n Web UI and complete the owner-account setup wizard.': 54,
  'Primary URL removed. Select a new primary URL.': 55,

  // actions/completeSetup.ts
  'Complete Owner Account Setup': 56,
  'Open the n8n Web UI and complete the owner-account setup wizard to create your admin account.': 57,
  'First-Time Setup': 58,
  'Open the n8n Web UI using the interface URL and complete the owner-account setup wizard. Once done, this task can be dismissed.': 59,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
