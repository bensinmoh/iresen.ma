'use client'
import { canTransition, type Entry, type Language, type Role } from '@/lib/cms-preview/model'
import type { ContentAction } from '@/lib/cms-preview/store'
import { CmsIcon, type IconName } from './CmsIcon'
export function EntryActions({
  entry,
  language,
  role,
  compact = false,
  action,
  open,
}: {
  entry: Entry
  language: Language
  role: Role
  compact?: boolean
  action: (entry: Entry, action: ContentAction, language: Language) => void
  open?: (entry: Entry) => void
}) {
  const controls: {
    key: string
    label: string
    icon: IconName
    run: () => void
    disabled?: boolean
  }[] = []
  if (open)
    controls.push({
      key: 'open',
      label: `Ouvrir ${entry.variants[language].title || entry.reference}`,
      icon: 'arrow',
      run: () => open(entry),
    })
  if (entry.module === 'news' && (role === 'admin' || entry.shared.highlight === 'true'))
    controls.push({
      key: 'highlight',
      label: entry.shared.highlight === 'true' ? 'À la une' : 'Mettre à la une',
      icon: 'star',
      disabled: entry.shared.highlight === 'true',
      run: () => action(entry, 'highlight', language),
    })
  for (const target of ['draft', 'review'] as const) {
    if (
      canTransition(role, entry.variants[language].status, target) &&
      target !== entry.variants[language].status
    ) {
      controls.push({
        key: target,
        label: target === 'draft' ? 'Remettre en brouillon' : 'Remettre en revue',
        icon: target === 'draft' ? 'edit' : 'review',
        run: () => action(entry, target, language),
      })
    }
  }
  if (role === 'admin')
    controls.push({
      key: 'delete',
      label: 'Supprimer',
      icon: 'trash',
      run: () => action(entry, 'delete', language),
    })
  return (
    <div
      className={`cms-entry-actions${compact ? ' cms-entry-actions-compact' : ''}`}
      role="group"
      aria-label="Actions sur cette fiche"
    >
      {controls.map(({ key, label, icon, run, disabled }) => (
        <button
          key={key}
          type="button"
          className={`cms-entry-action cms-entry-action-${key}`}
          aria-label={label}
          title={label}
          disabled={disabled}
          aria-pressed={key === 'highlight' ? entry.shared.highlight === 'true' : undefined}
          onClick={run}
        >
          <span className="cms-entry-action-icon">
            <CmsIcon
              name={icon}
              filled={key === 'highlight' && entry.shared.highlight === 'true'}
            />
          </span>
          <span
            className={compact ? 'cms-entry-action-tooltip' : 'cms-entry-action-label'}
            aria-hidden="true"
          >
            {key === 'open' ? 'Ouvrir la fiche' : label}
          </span>
        </button>
      ))}
    </div>
  )
}
