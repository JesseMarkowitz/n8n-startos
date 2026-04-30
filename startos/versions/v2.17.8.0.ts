import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_2_17_8_0 = VersionInfo.of({
  version: '2.17.8:0',
  releaseNotes: {
    en_US: 'Initial release for StartOS',
    es_ES: 'Version inicial para StartOS',
    de_DE: 'Erstveroeffentlichung fuer StartOS',
    pl_PL: 'Pierwsze wydanie dla StartOS',
    fr_FR: 'Version initiale pour StartOS',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
