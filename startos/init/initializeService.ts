import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { setPrimaryUrl } from '../actions/setPrimaryUrl'
import { completeSetup } from '../actions/completeSetup'
import { storeJson } from '../fileModels/store.json'
import { getNonLocalUrls } from '../utils'

export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  if (kind === 'install') {
    await sdk.action.createOwnTask(effects, setPrimaryUrl, 'critical', {
      reason: i18n(
        'Configure which URL n8n uses for generating webhook links before starting the service.',
      ),
    })

    await sdk.action.createOwnTask(effects, completeSetup, 'important', {
      reason: i18n(
        'Open the n8n Web UI and complete the owner-account setup wizard.',
      ),
    })
  }
})

export const watchPrimaryUrl = sdk.setupOnInit(async (effects) => {
  const availableUrls = await getNonLocalUrls(effects)
  const url = await storeJson.read((s) => s.primaryUrl).const(effects)

  if (!url) {
    const localUrl = availableUrls.find((u) => u.includes('.local'))
    if (localUrl) {
      await storeJson.merge(
        effects,
        { primaryUrl: localUrl },
        { allowWriteAfterConst: true },
      )
    }
  } else if (!availableUrls.includes(url)) {
    await sdk.action.createOwnTask(effects, setPrimaryUrl, 'critical', {
      reason: i18n(
        'Primary URL removed. Select a new primary URL.',
      ),
    })
  }
})
