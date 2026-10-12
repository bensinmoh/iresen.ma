'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import { ViewerIcon } from '@/components/media/ViewerIcon'
import { CookieGearIcon } from './CookieGearIcon'
import { CookieNecessaryLabel } from './CookieNecessaryLabel'
import { openPreferences, openPreferencesEvent, saveConsent, useConsent } from './consent-store'

export function CookiePreferencesButton() {
  const t = useTranslations('CookieConsent')
  const { ready } = useConsent()
  return (
    <button
      type="button"
      className="cookie-preferences-link"
      onClick={openPreferences}
      disabled={!ready}
    >
      {t('manage')}
    </button>
  )
}

export function CookieConsent({ locale }: { locale: Locale }) {
  const t = useTranslations('CookieConsent')
  const { ready, consent } = useConsent()
  const dialog = useRef<HTMLDialogElement>(null)
  const checkbox = useRef<HTMLInputElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const [storageError, setStorageError] = useState(false)

  useEffect(() => {
    function open() {
      returnFocus.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null
      if (checkbox.current) checkbox.current.checked = consent?.external ?? false
      if (!dialog.current?.open) dialog.current?.showModal()
    }
    window.addEventListener(openPreferencesEvent, open)
    return () => window.removeEventListener(openPreferencesEvent, open)
  }, [consent?.external])

  function save(external: boolean) {
    const stored = saveConsent(external)
    setStorageError(!stored)
    if (!stored && checkbox.current) checkbox.current.checked = false
    if (stored) {
      if (dialog.current?.open) dialog.current.close()
      else document.querySelector<HTMLElement>('#main-content')?.focus({ preventScroll: true })
    }
  }

  return (
    <>
      {ready && !consent && (
        <section className="cookie-banner" aria-labelledby="cookie-banner-title" data-cookie-banner>
          <div className="cookie-copy">
            <h2 id="cookie-banner-title">{t('title')}</h2>
            <p>
              {t('description')} <a href={pageHref('cookies', locale)}>{t('details')}</a>
            </p>
          </div>
          <div className="cookie-actions">
            <button type="button" className="cookie-accept" onClick={() => save(true)}>
              {t('accept')}
            </button>
            <button type="button" className="cookie-reject" onClick={() => save(false)}>
              {t('reject')}
            </button>
            <div className="cookie-secondary-actions">
              <button
                type="button"
                className="cookie-necessary"
                aria-label={t('necessaryOnly')}
                onClick={() => save(false)}
              >
                <CookieNecessaryLabel />
              </button>
              <button
                type="button"
                className="cookie-customize"
                aria-label={t('customize')}
                onClick={openPreferences}
              >
                <CookieGearIcon />
                <span className="cookie-customize-label">
                  <span>{t('customize')}</span>
                </span>
              </button>
            </div>
          </div>
          {storageError && <p role="alert">{t('storageError')}</p>}
        </section>
      )}
      <dialog
        className="cookie-dialog"
        ref={dialog}
        aria-labelledby="cookie-dialog-title"
        onClose={() => {
          const target = returnFocus.current?.isConnected
            ? returnFocus.current
            : document.querySelector<HTMLElement>('#main-content')
          target?.focus({ preventScroll: true })
        }}
      >
        <div className="cookie-dialog-heading">
          <h2 id="cookie-dialog-title">{t('manage')}</h2>
          <button
            type="button"
            className="cookie-close"
            aria-label={t('close')}
            onClick={() => dialog.current?.close()}
          >
            <ViewerIcon name="close" />
          </button>
        </div>
        <p>{t('description')}</p>
        <div className="cookie-category">
          <h3>{t('necessary')}</h3>
          <p>{t('necessaryDescription')}</p>
          <strong>{t('alwaysActive')}</strong>
        </div>
        <div className="cookie-category">
          <h3>{t('optional')}</h3>
          <label>
            <input type="checkbox" ref={checkbox} aria-describedby="cookie-external-description" />{' '}
            {t('external')}
          </label>
          <p id="cookie-external-description">{t('externalDescription')}</p>
        </div>
        <p>
          {t('retention')} <a href={pageHref('cookies', locale)}>{t('details')}</a>
        </p>
        <div className="cookie-actions">
          <button type="button" className="cookie-accept" onClick={() => save(true)}>
            {t('accept')}
          </button>
          <button type="button" className="cookie-reject" onClick={() => save(false)}>
            {t('reject')}
          </button>
          <div className="cookie-secondary-actions">
            <button
              type="button"
              className="cookie-necessary"
              aria-label={t('necessaryOnly')}
              onClick={() => save(false)}
            >
              <CookieNecessaryLabel />
            </button>
            <button
              type="button"
              className="cookie-save"
              aria-label={t('save')}
              onClick={() => save(checkbox.current?.checked ?? false)}
            >
              <span className="cookie-label-full">{t('save')}</span>
              <span className="cookie-label-short">{t('saveShort')}</span>
              <span className="cookie-save-icon">
                <CookieGearIcon />
              </span>
            </button>
          </div>
        </div>
        {storageError && <p role="alert">{t('storageError')}</p>}
      </dialog>
    </>
  )
}
