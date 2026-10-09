'use client'

import { useCallback, useEffect, useId, useRef, type MouseEvent } from 'react'
import { NavigationIcon } from './NavigationIcon'

type HeaderSearchProps = {
  action: string
  label: string
  placeholder: string
  restoreQuery: boolean
  onReveal: (hover: boolean) => boolean
}

export function HeaderSearch({
  action,
  label,
  placeholder,
  restoreQuery,
  onReveal,
}: HeaderSearchProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const inputId = useId()

  const measure = useCallback(() => {
    const details = detailsRef.current
    const container = details?.closest('.header-container')
    if (!details || !container) return
    const trigger = details.getBoundingClientRect()
    const bounds = container.getBoundingClientRect()
    const rtl = getComputedStyle(details).direction === 'rtl'
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const startSpace = rtl ? bounds.right - trigger.left : trigger.right - bounds.left
    const endSpace = rtl ? trigger.right - bounds.left : bounds.right - trigger.left
    const flip = startSpace < trigger.width + 8 * rem && endSpace > startSpace
    const space = flip ? endSpace : startSpace
    details.dataset.searchSide = flip ? 'end' : 'start'
    details.style.setProperty(
      '--header-search-field-width',
      `${Math.max(0, Math.min(22 * rem, space) - trigger.width + 1)}px`,
    )
  }, [])

  useEffect(() => {
    const details = detailsRef.current!
    details.dataset.searchReady = 'true'
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(details)
    const container = details.closest('.header-container')
    if (container) observer.observe(container)

    function closeOutside(event: Event) {
      if (event.target instanceof Node && !details.contains(event.target)) details.open = false
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape' || event.defaultPrevented || !details.open) return
      const restoreFocus = details.contains(document.activeElement)
      details.open = false
      event.preventDefault()
      if (restoreFocus) details.querySelector<HTMLElement>('summary')?.focus()
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('focusin', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      observer.disconnect()
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('focusin', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [measure])

  useEffect(() => {
    if (restoreQuery && inputRef.current) {
      inputRef.current.value = new URL(window.location.href).searchParams.get('q') ?? ''
    }
  }, [restoreQuery])

  function activate(event: MouseEvent<HTMLElement>) {
    event.preventDefault()
    const details = detailsRef.current!
    if (!details.open) {
      if (!onReveal(false)) return
      measure()
      details.open = true
      inputRef.current?.focus()
    } else if (inputRef.current?.value.trim()) {
      formRef.current?.requestSubmit()
    } else {
      inputRef.current?.focus()
    }
  }

  return (
    <details
      className="header-search-disclosure"
      ref={detailsRef}
      onToggle={(event) => {
        if (event.currentTarget.open) measure()
      }}
      onPointerEnter={(event) => {
        if (
          event.pointerType === 'mouse' &&
          window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
          onReveal(true)
        ) {
          measure()
          event.currentTarget.open = true
        }
      }}
      onPointerLeave={(event) => {
        if (
          event.pointerType === 'mouse' &&
          !event.currentTarget.contains(document.activeElement)
        ) {
          event.currentTarget.open = false
        }
      }}
    >
      <summary className="header-search" aria-label={label} onClick={activate}>
        <NavigationIcon name="search" />
      </summary>
      <form
        className="header-search-form"
        action={action}
        method="get"
        role="search"
        aria-label={label}
        ref={formRef}
        onSubmit={(event) => {
          const input = inputRef.current!
          input.value = input.value.trim()
          if (!input.value) {
            event.preventDefault()
            input.reportValidity()
          }
        }}
      >
        <label className="header-search-label" htmlFor={inputId}>
          {label}
        </label>
        <input
          id={inputId}
          ref={inputRef}
          type="search"
          name="q"
          placeholder={placeholder}
          autoComplete="off"
          required
        />
      </form>
    </details>
  )
}
