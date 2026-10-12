import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.42.5:1',
  releaseNotes: {
    en_US: `- Replaces the placeholder service icon with n8n's own logo.
- Restarting n8n while it is still starting stops every process of the previous run.`,
    es_ES: `- Sustituye el icono provisional del servicio por el logotipo propio de n8n.
- Reiniciar n8n mientras aún se está iniciando detiene todos los procesos de la ejecución anterior.`,
    de_DE: `- Ersetzt das vorläufige Dienstsymbol durch das eigene Logo von n8n.
- Ein Neustart von n8n, während es noch startet, beendet alle Prozesse des vorherigen Laufs.`,
    pl_PL: `- Zastępuje tymczasową ikonę usługi własnym logo n8n.
- Ponowne uruchomienie n8n w trakcie uruchamiania zatrzymuje wszystkie procesy poprzedniego uruchomienia.`,
    fr_FR: `- Remplace l'icône provisoire du service par le logo officiel de n8n.
- Redémarrer n8n pendant son démarrage arrête tous les processus de l'exécution précédente.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
