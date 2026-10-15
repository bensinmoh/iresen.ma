'use client'

import { SectionEyebrow } from '@/components/ui/SectionEyebrow'

import Image from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'
import { FooterIcon } from '@/components/layout/FooterIcon'
import { ViewerIcon } from '@/components/media/ViewerIcon'
import styles from './GovernancePage.module.css'
import diagramStyles from './GovernanceDiagrams.module.css'

type Props = {
  id: string
  name: string
  role: string
  photo: string
  biographyPhoto?: string
  biographyFullWidth?: boolean
  portraitAlt: string
  paragraphs: string[]
  linkedin?: string
  biographyLabel: string
  linkedinLabel: string
  closeLabel: string
  management?: boolean
  diagram?: boolean
}

export function TeamBiography({
  id,
  name,
  role,
  photo,
  biographyPhoto = photo,
  biographyFullWidth = false,
  portraitAlt,
  paragraphs,
  linkedin,
  biographyLabel,
  linkedinLabel,
  closeLabel,
  management = false,
  diagram = false,
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
        className={
          diagram
            ? diagramStyles.portraitTrigger
            : management
              ? styles.managementTrigger
              : styles.personTrigger
        }
        onClick={() => {
          dialog.current?.showModal()
          setOpen(true)
        }}
      >
        <span
          className={
            diagram
              ? diagramStyles.portrait
              : management
                ? styles.managementPhoto
                : styles.teamPhoto
          }
        >
          <Image
            src={photo}
            alt={portraitAlt}
            fill
            quality={90}
            sizes={
              diagram
                ? '(max-width: 70rem) 260px, 24vw'
                : management
                  ? '220px'
                  : '(max-width: 48rem) 90vw, 30vw'
            }
          />
        </span>
        <span
          className={
            diagram
              ? diagramStyles.portraitPerson
              : management
                ? styles.managementPerson
                : styles.person
          }
        >
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
          <div
            className={`${styles.biographyPhoto} ${biographyFullWidth ? styles.biographyFullWidth : ''}`}
          >
            <Image
              src={biographyPhoto}
              quality={90}
              alt={portraitAlt}
              {...(biographyFullWidth ? { width: 919, height: 1711 } : { fill: true })}
              sizes="(max-width: 48rem) 90vw, 420px"
            />
          </div>
          <div className={styles.biographyCopy}>
            <SectionEyebrow>{biographyLabel}</SectionEyebrow>
            <div className={styles.biographyName}>
              <h2 id={titleId}>
                <bdi>{name}</bdi>
              </h2>
              {linkedin && (
                <a
                  className={styles.biographyLinkedin}
                  href={linkedin}
                  aria-label={`${linkedinLabel} — ${name}`}
                  title={linkedinLabel}
                >
                  <FooterIcon name="linkedin" />
                </a>
              )}
            </div>
            <p className={styles.biographyRole}>{role}</p>
            {paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </dialog>
    </>
  )
}
