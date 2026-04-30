import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (kind === 'install') {
    await storeJson.merge(effects, {
      encryptionKey: utils.getDefaultString({
        charset: 'a-z,A-Z,0-9',
        len: 32,
      }),
      primaryUrl: null,
      smtp: { selection: 'disabled', value: {} },
    })
  } else {
    await storeJson.merge(effects, {})
  }
})
