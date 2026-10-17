import { mediaTypes, mediaType, type MediaType } from '@/lib/cms-preview/media-types'
import type { Entry } from '@/lib/cms-preview/model'
import { CmsIcon, type IconName } from './CmsIcon'
const icons: Record<MediaType, IconName> = {
  photos: 'media',
  videos: 'video',
  reports: 'document',
  links: 'link',
  resources: 'folder',
}
export function MediaTypeChooser({
  entries,
  value,
  change,
}: {
  entries: Entry[]
  value: MediaType
  change: (value: MediaType) => void
}) {
  const selected = mediaTypes.find((type) => type.id === value)!
  return (
    <section className="cms-media-chooser" aria-label="Type de ressources à gérer">
      <h2>Que souhaitez-vous gérer ?</h2>
      <div className="cms-media-types">
        {mediaTypes.map((type) => (
          <button
            key={type.id}
            className={`cms-media-type${value === type.id ? ' active' : ''}`}
            aria-pressed={value === type.id}
            onClick={() => change(type.id)}
          >
            <CmsIcon name={icons[type.id]} />
            <span>{type.label}</span>
            <strong>
              {
                entries.filter((entry) => entry.module === 'media' && mediaType(entry) === type.id)
                  .length
              }
            </strong>
          </button>
        ))}
      </div>
      <p className="cms-help">{selected.description}</p>
    </section>
  )
}
