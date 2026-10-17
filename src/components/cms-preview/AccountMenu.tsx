'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import { roleLabels, type Role } from '@/lib/cms-preview/model'

export function AccountMenu({
  name,
  role,
  busy,
  onLogout,
  avatarUrl,
}: {
  name: string
  role: Role
  busy?: boolean
  onLogout?: () => void
  avatarUrl?: string
}) {
  const [open, setOpen] = useState(false)
  const [failedImage, setFailedImage] = useState<string>()
  const container = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const id = useId()
  const initials = name
    .split('@')[0]
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toLocaleUpperCase('fr')
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        trigger.current?.focus()
      }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [open])
  return (
    <div
      className="cms-profile cms-account"
      ref={container}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <div className="cms-account-identity">
        <strong dir="auto">{name}</strong>
        <span>{roleLabels[role]}</span>
      </div>
      <button
        ref={trigger}
        className="cms-avatar cms-account-trigger"
        type="button"
        aria-label={`Compte de ${name}`}
        aria-expanded={open}
        aria-controls={id}
        disabled={busy || !onLogout}
        onClick={() => setOpen((value) => !value)}
      >
        {avatarUrl && failedImage !== avatarUrl ? (
          <Image
            src={avatarUrl}
            width={44}
            height={44}
            alt=""
            unoptimized
            className="cms-account-photo"
            onError={() => setFailedImage(avatarUrl)}
          />
        ) : (
          <span aria-hidden="true">{initials || '?'}</span>
        )}
      </button>
      <div id={id} hidden={!open} className="cms-account-dropdown">
        <button
          className="cms-button"
          type="button"
          disabled={busy}
          onClick={() => {
            setOpen(false)
            onLogout?.()
          }}
        >
          Se déconnecter
        </button>
      </div>
    </div>
  )
}
