'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'
import { ViewerIcon } from '@/components/media/ViewerIcon'
import styles from './GovernancePage.module.css'

type Props = {
  id: string
  name: string
  role: string
  photo: string
  portraitAlt: string
  paragraphs: string[]
  linkedin?: string
  biographyLabel: string
  linkedinLabel: string
  closeLabel: string
  management?: boolean
}

export function TeamBiography({
  id,
  name,
  role,
  photo,
  portraitAlt,
  paragraphs,
  linkedin,
  biographyLabel,
  linkedinLabel,
  closeLabel,
  management = false,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])
  return (
    <>
      <button
        id={id}
        ref={trigger}
        type="button"
        aria-haspopup="dialog"
        aria-label={`${biographyLabel} — ${name}`}
        className={management ? styles.managementTrigger : styles.personTrigger}
        onClick={() => {
          dialog.current?.showModal()
          setOpen(true)
        }}
      >
        <span className={management ? styles.managementPhoto : styles.teamPhoto}>
          <Image
            src={photo}
            alt={portraitAlt}
            fill
            sizes={management ? '220px' : '(max-width: 48rem) 90vw, 30vw'}
          />
        </span>
        <span className={management ? styles.managementPerson : styles.person}>
          <strong>
            <bdi>{name}</bdi>
          </strong>
          <span>{role}</span>
        </span>
      </button>
      <dialog
        ref={dialog}
        closedby="any"
        className={styles.biographyDialog}
        aria-labelledby={titleId}
        onClose={() => {
          setOpen(false)
          trigger.current?.focus({ preventScroll: true })
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return
          const box = event.currentTarget.getBoundingClientRect()
          if (
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom
          )
            event.currentTarget.close()
        }}
      >
        <button
          type="button"
          className={styles.biographyClose}
          aria-label={closeLabel}
          onClick={() => dialog.current?.close()}
        >
          <ViewerIcon name="close" />
        </button>
        <div className={styles.biographyLayout}>
          <div className={styles.biographyPhoto}>
            <Image src={photo} alt={portraitAlt} fill sizes="(max-width: 48rem) 80vw, 360px" />
          </div>
          <div className={styles.biographyCopy}>
            <p className={styles.eyebrow}>{biographyLabel}</p>
            <h2 id={titleId}>
              <bdi>{name}</bdi>
            </h2>
            <p className={styles.biographyRole}>{role}</p>
            {paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            {linkedin && (
              <a className={styles.biographyLinkedin} href={linkedin}>
                {linkedinLabel}
                <span aria-hidden="true"> ↗</span>
              </a>
            )}
          </div>
        </div>
      </dialog>
    </>
  )
}
