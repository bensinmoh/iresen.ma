'use client'

import Image from 'next/image'
import { useId, useState } from 'react'
import type { Entry, Field, Language } from '@/lib/cms-preview/model'
import { contentConnected, uploadConnectedMedia } from '@/lib/cms-preview/store'

export function PhotoUpload({
  field,
  entry,
  language,
  entries,
  value,
  change,
}: {
  field: Field
  entry: Entry
  language: Language
  entries: Entry[]
  value: string
  change: (value: string) => void
}) {
  const id = useId()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const media = entries.find((candidate) => candidate.module === 'media' && candidate.id === value)
  const path = media?.shared.assetPath
  // Display only same-origin files; private uploads retain the authenticated file gate.
  const preview = path?.startsWith('/') && !path.startsWith('//') ? path : ''
  return (
    <div className="cms-photo-upload" aria-busy={busy}>
      <label htmlFor={id}>
        <span>
          {field.label} {field.required && <span className="cms-required">requis avant revue</span>}
        </span>
        <input
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={field.readOnly || busy || !contentConnected()}
          aria-describedby={`${id}-help ${id}-status`}
          aria-invalid={Boolean(error)}
          onChange={async (event) => {
            const file = event.currentTarget.files?.[0]
            event.currentTarget.value = ''
            if (!file) return
            setError('')
            setMessage('')
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
              setError('Choisir une image JPEG, PNG ou WebP.')
              return
            }
            if (file.size < 1 || file.size > 10_000_000) {
              setError('Choisir une image non vide de 10 Mo maximum.')
              return
            }
            setBusy(true)
            try {
              const uploaded = await uploadConnectedMedia(
                file,
                `${field.label} · ${entry.variants[language].title || entry.reference || file.name}`,
                'image',
              )
              change(uploaded.id)
              setMessage(
                'Image téléversée. Enregistrez le brouillon pour conserver cette association.',
              )
            } catch (cause) {
              setError(
                cause instanceof Error ? cause.message : 'Le téléversement a échoué. Réessayez.',
              )
            } finally {
              setBusy(false)
            }
          }}
        />
      </label>
      <small id={`${id}-help`}>JPEG, PNG ou WebP · 10 Mo maximum. {field.help}</small>
      {value && (
        <div className="cms-photo-current">
          {preview && (
            <Image
              className="cms-photo-preview"
              src={preview}
              alt={`Image associée au champ « ${field.label} »`}
              width={320}
              height={180}
              unoptimized
            />
          )}
          <small>
            Image associée : {media?.shared.fileName || media?.variants.fr.title || value}
          </small>
          <button
            className="cms-button"
            type="button"
            disabled={field.readOnly || busy}
            onClick={() => {
              change('')
              setError('')
              setMessage('Image dissociée du brouillon. Le fichier reste dans la médiathèque.')
            }}
          >
            Retirer l’image de cette fiche
          </button>
        </div>
      )}
      <small id={`${id}-status`} role="status">
        {busy ? 'Téléversement en cours…' : message}
      </small>
      {error && <small role="alert">{error}</small>}
      <small>
        <code>{field.key}</code> · image · partagé → media
      </small>
    </div>
  )
}
