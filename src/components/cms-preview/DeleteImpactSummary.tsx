import type { DeleteImpact, DeleteReference } from '@/lib/cms-preview/delete-impact'
function References({
  title,
  entries,
  empty,
}: {
  title: string
  entries: DeleteReference[]
  empty: string
}) {
  return (
    <section className="cms-delete-impact-section">
      <h3>
        {title} · {entries.length}
      </h3>
      {entries.length ? (
        <ul>
          {entries.map((entry) => (
            <li key={entry.id}>
              <strong>{entry.title}</strong>
              <small>
                {entry.module} · {entry.fields.join(', ')}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p>{empty}</p>
      )}
    </section>
  )
}
export function DeleteImpactSummary({ impact }: { impact: DeleteImpact }) {
  return (
    <div className="cms-delete-impact">
      <p className={impact.blockers.length ? 'cms-error' : 'cms-delete-policy'} role="status">
        {impact.blockers.length
          ? 'Suppression bloquée : des dépendances doivent être résolues.'
          : 'Suppression récupérable · aucune suppression en cascade.'}
      </p>
      <section className="cms-delete-impact-section">
        <h3>Langues concernées</h3>
        <ul>
          {impact.languages.map((item) => (
            <li key={item.language}>
              <strong>{item.language.toUpperCase()}</strong> · {item.status}
              {item.published
                ? ' · version publique à retirer'
                : ' · aucune version publique active'}
            </li>
          ))}
        </ul>
      </section>
      <section className="cms-delete-impact-section">
        <h3>Ce qui sera impacté</h3>
        <ul>
          {impact.effects.map((effect) => (
            <li key={effect}>{effect}</li>
          ))}
        </ul>
      </section>
      <References
        title="Fiches qui utilisent ce contenu"
        entries={impact.inbound}
        empty="Aucune relation entrante détectée dans le CMS."
      />
      <References
        title="Fiches liées conservées"
        entries={impact.outgoing}
        empty="Aucune fiche liée par un champ de relation."
      />
      {(impact.module === 'Carrières' || impact.applications > 0) && (
        <p>
          <strong>Candidatures associées : {impact.applications}</strong>
        </p>
      )}
      {impact.blockers.length > 0 && (
        <ul className="cms-error">
          {impact.blockers.map((blocker) => (
            <li key={blocker}>{blocker}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
