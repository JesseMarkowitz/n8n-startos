import { sdk } from '../sdk'
import { setPrimaryUrl } from './setPrimaryUrl'
import { manageSmtp } from './manageSmtp'
import { resetUserManagement } from './resetUserManagement'
import { disableMfa } from './disableMfa'
import { exportWorkflows } from './exportWorkflows'
import { exportCredentials } from './exportCredentials'
import { securityAudit } from './securityAudit'
import { completeSetup } from './completeSetup'

export const actions = sdk.Actions.of()
  .addAction(setPrimaryUrl)
  .addAction(manageSmtp)
  .addAction(resetUserManagement)
  .addAction(disableMfa)
  .addAction(exportWorkflows)
  .addAction(exportCredentials)
  .addAction(securityAudit)
  .addAction(completeSetup)
