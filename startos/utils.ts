import { T } from '@start9labs/start-sdk'
import { sdk } from './sdk'

export const n8nPort = 5678

export async function getNonLocalUrls(effects: T.Effects) {
  return sdk.serviceInterface
    .getOwn(effects, 'ui', (i) => i?.addressInfo?.nonLocal.format() || [])
    .const()
}
