import { i18n } from './i18n'
import { sdk } from './sdk'
import { n8nPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const multi = sdk.MultiHost.of(effects, 'web')
  const origin = await multi.bindPort(n8nPort, {
    protocol: 'http',
  })

  const ui = sdk.createInterface(effects, {
    name: i18n('Web UI'),
    id: 'ui',
    description: i18n('n8n workflow editor and dashboard'),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const api = sdk.createInterface(effects, {
    name: i18n('REST API & Webhooks'),
    id: 'api',
    description: i18n(
      'Programmatic access and webhook endpoints for external services (e.g. GitHub, Stripe triggers). Use this URL when configuring external services to call your n8n instance.',
    ),
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  return [await origin.export([ui, api])]
})
