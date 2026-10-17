'use client'

import { contentConnected } from '@/lib/cms-preview/store'
import { audienceService } from '@/lib/cms-preview/integrations'
import { useState } from 'react'
import {
  languages,
  fieldApplies,
  editorialTextComplete,
  modules,
  statusLabels,
  type Entry,
  type Workspace,
} from '@/lib/cms-preview/model'

export function Analytics({
  workspace,
  compact = false,
  navigate,
}: {
  workspace: Workspace
  compact?: boolean
  navigate: (view: string) => void
}) {
  const [period, setPeriod] = useState('30')
  const [locale, setLocale] = useState('all')
  const [section, setSection] = useState('all')
  const entries = workspace.entries.filter((entry) => section === 'all' || entry.module === section)
  const variants = entries
    .flatMap((entry) =>
      languages
        .filter((language) => locale === 'all' || language === locale)
        .map((language) => entry.variants[language]),
    )
    .filter((variant) => variant.title.trim())
  const states = (['draft', 'review', 'published'] as const).map((status) => ({
    status,
    count: variants.filter((variant) => variant.status === status).length,
  }))
  const completeness = languages.map((language) => ({
    language,
    complete: entries.filter((entry) => editorialTextComplete(entry, language)).length,
  }))
  const csv = () => {
    const rows = [
      'source,locale,status,count',
      ...states.map(
        (item) =>
          `${contentConnected() ? 'postgresql' : 'browser-preview'},${locale},${item.status},${item.count}`,
      ),
    ]
    const href = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' }))
    const anchor = document.createElement('a')
    anchor.href = href
    anchor.download = 'analytics-editoriales-locales.csv'
    anchor.click()
    URL.revokeObjectURL(href)
  }
  return (
    <section className="cms-panel cms-analytics">
      <div className="cms-panel-heading">
        <div>
          <h2>Analytics et pilotage</h2>
          <p className="cms-help">Audience du site et qualité éditoriale dans une même vue.</p>
        </div>
        {compact && (
          <button className="cms-button" onClick={() => navigate('analytics')}>
            Ouvrir les analytics
          </button>
        )}
      </div>
      <div className="cms-analytics-filters">
        <label>
          Période d’audience
          <select value={period} onChange={(event) => setPeriod(event.target.value)}>
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">90 derniers jours</option>
          </select>
        </label>
        <label>
          Langue analysée
          <select value={locale} onChange={(event) => setLocale(event.target.value)}>
            <option value="all">Toutes les langues</option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
        {!compact && (
          <label>
            Module éditorial
            <select value={section} onChange={(event) => setSection(event.target.value)}>
              <option value="all">Tous les modules</option>
              {modules
                .filter((module) => module.id !== 'users')
                .map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.label}
                  </option>
                ))}
            </select>
          </label>
        )}
      </div>
      <div className="cms-analytics-metrics">
        {['Visites', 'Visiteurs uniques', 'Pages vues', 'Engagement'].map((label) => (
          <div key={label}>
            <span>{label}</span>
            <strong>—</strong>
            <small>Source non connectée</small>
          </div>
        ))}
      </div>
      <p className="cms-context">
        {audienceService.name} non connecté · {period} derniers jours ·{' '}
        {locale === 'all' ? 'toutes les langues' : locale.toUpperCase()}. Aucune collecte active.
        Les valeurs absentes ne sont pas des zéros.
      </p>
      {!compact && (
        <div className="cms-analytics-reports">
          {[
            ['Évolution de l’audience', 'Jour · visites · visiteurs · pages vues'],
            [
              'Pages et contenus consultés',
              'URL canonique · titre · langue · pages vues · temps de lecture',
            ],
            ['Acquisition', 'Source · canal · campagne · visites · engagement'],
            ['Appareils et langues', 'Appareil · langue · visites · part du trafic'],
            ['Recherche interne', 'Requête · langue · recherches · recherches sans résultat'],
            [
              'Actions et téléchargements',
              'Destination · type de ressource · clics · téléchargements',
            ],
          ].map(([title, columns]) => (
            <section key={title}>
              <h3>{title}</h3>
              <p>{columns}</p>
              <p className="cms-help">
                Aucune donnée disponible pour les filtres sélectionnés. Le raccordement devra
                fournir un rapport agrégé ; aucun suivi n’est déclenché par ce preview.
              </p>
            </section>
          ))}
        </div>
      )}
      <div className="cms-section-divider">
        <h3>{contentConnected() ? 'Pilotage éditorial de la base' : 'Pilotage éditorial local'}</h3>
        <p>
          {contentConnected()
            ? 'Calculé à partir des fiches enregistrées dans PostgreSQL, toutes dates confondues. Ces nombres décrivent le contenu éditorial, pas l’audience du site.'
            : 'Calculé à partir des fiches de cet atelier, toutes dates confondues. Ces nombres ne décrivent pas le site public.'}
        </p>
      </div>
      <div className="cms-analytics-editorial">
        <div>
          <h3>Répartition des étapes</h3>
          {states.map(({ status, count }) => (
            <div key={status} className="cms-metric-row">
              <span>{statusLabels[status]}</span>
              <meter
                min={0}
                max={Math.max(variants.length, 1)}
                value={count}
                aria-label={statusLabels[status]}
              />
              <strong>{count}</strong>
            </div>
          ))}
        </div>
        <div>
          <h3>Contenus renseignés par langue</h3>
          {completeness
            .filter(({ language }) => locale === 'all' || locale === language)
            .map(({ language, complete }) => (
              <div key={language} className="cms-metric-row">
                <span>{language.toUpperCase()}</span>
                <meter
                  min={0}
                  max={Math.max(entries.length, 1)}
                  value={complete}
                  aria-label={`Contenus renseignés en ${language}`}
                />
                <strong>
                  {complete}/{entries.length}
                </strong>
              </div>
            ))}
        </div>
      </div>
      {!compact && (
        <div className="cms-table-scroll">
          <table>
            <caption>État éditorial par module · fiches de cet atelier</caption>
            <thead>
              <tr>
                <th>Module</th>
                <th>Fiches</th>
                <th>En revue</th>
                <th>Validées / publiées</th>
                <th>Langues à compléter</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {modules
                .filter(
                  (module) => module.id !== 'users' && (section === 'all' || module.id === section),
                )
                .map((module) => {
                  const records = entries.filter((entry) => entry.module === module.id)
                  const selectedLanguages = languages.filter(
                    (language) => locale === 'all' || language === locale,
                  )
                  return (
                    <tr key={module.id}>
                      <th>{module.label}</th>
                      <td>{records.length}</td>
                      <td>
                        {
                          records
                            .flatMap((entry) =>
                              selectedLanguages.map((language) => entry.variants[language]),
                            )
                            .filter((variant) => variant.status === 'review').length
                        }
                      </td>
                      <td>
                        {
                          records
                            .flatMap((entry) =>
                              selectedLanguages.map((language) => entry.variants[language]),
                            )
                            .filter((variant) => variant.status === 'published').length
                        }
                      </td>
                      <td>
                        {
                          records
                            .flatMap((entry) =>
                              selectedLanguages.map((language) =>
                                editorialTextComplete(entry, language),
                              ),
                            )
                            .filter((complete) => !complete).length
                        }
                      </td>
                      <td>
                        <button className="cms-text-button" onClick={() => navigate(module.id)}>
                          Ouvrir {module.label}
                        </button>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      )}
      <div className="cms-actions">
        <button className="cms-button" onClick={csv}>
          Exporter le bilan éditorial
        </button>
        <button className="cms-text-button" onClick={() => navigate('integrations')}>
          Voir les connexions à préparer
        </button>
      </div>
    </section>
  )
}
export function displayField(
  entry: Entry,
  key: string,
  language: 'fr' | 'en' | 'ar',
  entries: Entry[],
): string {
  const field = modules
    .find((module) => module.id === entry.module)
    ?.fields.find((candidate) => candidate.key === key)
  if (key === 'highlight' && entry.module === 'news')
    return entry.shared.highlight === 'true' ? 'À la une' : '—'
  if (field && !fieldApplies(entry, field)) return 'Sans objet'
  const value =
    (field?.localized ? entry.variants[language].fields?.[key] : entry.shared[key]) ?? ''
  if (!value && key === 'publishedAt' && entry.shared.publicationMonth)
    return entry.shared.publicationMonth
  if (!value && key === 'start')
    return (
      entry.variants[language].fields.dateLabel || entry.shared.archivePeriod || 'Non renseigné'
    )
  if (
    !value &&
    ['heroImage', 'portraitId', 'logoId', 'imageId'].includes(key) &&
    entry.shared.sourceImagePath
  )
    return 'Image source'
  if (!value) return 'Non renseigné'
  if (field?.optionLabels) return field.optionLabels[value] ?? value
  if (field?.type === 'relation')
    return value
      .split('\n')
      .map(
        (id) =>
          entries.find((candidate) => candidate.id === id)?.variants[language].title ||
          entries.find((candidate) => candidate.id === id)?.variants.fr.title ||
          id,
      )
      .join(', ')
  return value
}
