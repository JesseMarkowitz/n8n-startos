import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.42.5:1',
  releaseNotes: {
    en_US:
      "Replaces the placeholder service icon with n8n's own logo. No change to n8n itself.",
    es_ES:
      'Sustituye el icono provisional del servicio por el logotipo propio de n8n. Sin cambios en n8n.',
    de_DE:
      'Ersetzt das vorläufige Dienstsymbol durch das eigene Logo von n8n. Keine Änderung an n8n selbst.',
    pl_PL:
      'Zastępuje tymczasową ikonę usługi własnym logo n8n. Bez zmian w samym n8n.',
    fr_FR:
      "Remplace l'icône provisoire du service par le logo officiel de n8n. Aucun changement dans n8n lui-même.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
