import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.43.7:0',
  releaseNotes: {
    en_US: `Updated n8n from 2.42.5 to 2.43.7.

**Highlights**
- Agents: an instance setting turns Agents on or off, and agent runs can be given an opt-in spend budget whose usage is tracked and shown in the editor.
- Executions can pause at node boundaries and resume later, and in-flight production executions are suspended rather than lost when n8n shuts down.
- Legacy Cron node schedules now run on the durable scheduler.
- The editor shows whose credential a node uses, lets others switch to their own, and stops Execute and Publish when the credential is not yours to use.
- n8n now refuses to save new or edited workflows that use deprecated nodes.
- Many node and editor fixes across the ten intervening releases.

Full notes: https://github.com/n8n-io/n8n/releases`,
    es_ES: `n8n actualizado de 2.42.5 a 2.43.7.

**Novedades destacadas**
- Agentes: un ajuste de la instancia activa o desactiva los Agentes, y a las ejecuciones de agentes se les puede asignar un presupuesto de gasto opcional cuyo consumo se registra y se muestra en el editor.
- Las ejecuciones pueden pausarse en los límites de un nodo y reanudarse después, y las ejecuciones de producción en curso se suspenden en lugar de perderse cuando n8n se apaga.
- Las programaciones del nodo Cron heredado ahora se ejecutan en el planificador duradero.
- El editor muestra de quién es la credencial que usa un nodo, permite a otros cambiar a la suya propia y detiene Ejecutar y Publicar cuando la credencial no es tuya.
- n8n ahora se niega a guardar flujos de trabajo nuevos o editados que usen nodos obsoletos.
- Numerosas correcciones en nodos y en el editor a lo largo de las diez versiones intermedias.

Notas completas: https://github.com/n8n-io/n8n/releases`,
    de_DE: `n8n von 2.42.5 auf 2.43.7 aktualisiert.

**Höhepunkte**
- Agenten: Eine Instanzeinstellung schaltet Agenten ein oder aus, und Agentenläufe können ein optionales Ausgabenbudget erhalten, dessen Verbrauch erfasst und im Editor angezeigt wird.
- Ausführungen können an Knotengrenzen pausieren und später fortgesetzt werden, und laufende Produktionsausführungen werden beim Herunterfahren von n8n angehalten statt verloren.
- Zeitpläne des alten Cron-Knotens laufen jetzt auf dem dauerhaften Scheduler.
- Der Editor zeigt, wessen Zugangsdaten ein Knoten verwendet, lässt andere auf ihre eigenen wechseln und stoppt Ausführen und Veröffentlichen, wenn die Zugangsdaten nicht die eigenen sind.
- n8n verweigert jetzt das Speichern neuer oder bearbeiteter Workflows, die veraltete Knoten verwenden.
- Zahlreiche Korrekturen an Knoten und am Editor über die zehn dazwischenliegenden Versionen.

Vollständige Hinweise: https://github.com/n8n-io/n8n/releases`,
    pl_PL: `Zaktualizowano n8n z wersji 2.42.5 do 2.43.7.

**Najważniejsze zmiany**
- Agenci: ustawienie instancji włącza lub wyłącza Agentów, a uruchomieniom agentów można przypisać opcjonalny budżet wydatków, którego zużycie jest śledzone i pokazywane w edytorze.
- Wykonania mogą zatrzymywać się na granicach węzłów i być wznawiane później, a trwające wykonania produkcyjne są wstrzymywane zamiast tracone, gdy n8n się wyłącza.
- Harmonogramy starego węzła Cron działają teraz na trwałym harmonogramie.
- Edytor pokazuje, czyje poświadczenia wykorzystuje węzeł, pozwala innym przełączyć się na własne i blokuje Wykonaj oraz Opublikuj, gdy poświadczenia nie należą do Ciebie.
- n8n odmawia teraz zapisania nowych lub edytowanych przepływów pracy, które używają przestarzałych węzłów.
- Liczne poprawki węzłów i edytora w dziesięciu pośrednich wydaniach.

Pełne informacje: https://github.com/n8n-io/n8n/releases`,
    fr_FR: `n8n mis à jour de 2.42.5 vers 2.43.7.

**Points forts**
- Agents : un réglage d'instance active ou désactive les Agents, et les exécutions d'agents peuvent recevoir un budget de dépenses facultatif dont la consommation est suivie et affichée dans l'éditeur.
- Les exécutions peuvent se mettre en pause aux limites d'un nœud et reprendre plus tard, et les exécutions de production en cours sont suspendues plutôt que perdues lorsque n8n s'arrête.
- Les planifications de l'ancien nœud Cron s'exécutent désormais sur le planificateur durable.
- L'éditeur indique à qui appartient l'identifiant utilisé par un nœud, permet aux autres de passer au leur et bloque Exécuter et Publier lorsque l'identifiant ne vous appartient pas.
- n8n refuse désormais d'enregistrer des workflows nouveaux ou modifiés qui utilisent des nœuds obsolètes.
- De nombreuses corrections de nœuds et de l'éditeur sur les dix versions intermédiaires.

Notes complètes : https://github.com/n8n-io/n8n/releases`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
