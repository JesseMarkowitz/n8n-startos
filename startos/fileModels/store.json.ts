import { FileHelper, smtpShape, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  encryptionKey: z.string().catch(''),
  primaryUrl: z.string().nullable().catch(null),
  smtp: smtpShape,
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: './store.json' },
  shape,
)
