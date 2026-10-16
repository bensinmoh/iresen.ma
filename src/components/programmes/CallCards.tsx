import type { Locale } from '@/i18n/locales'
import { CalendarBlank } from '@phosphor-icons/react/dist/ssr/CalendarBlank'
import { SiteIcon } from '@/components/ui/SiteIcon'
import type { CallCardData } from '@/lib/call-archives'
import { callCopy } from '@/lib/call-copy'
import styles from './CallsCatalogue.module.css'

export function CallCards({ calls, locale }: { calls: CallCardData[]; locale: Locale }) {
  const t = callCopy[locale]
  return (
    <div className={styles.grid} data-call-rail role="region" aria-label={t.title} tabIndex={0}>
      {calls.map((call) => (
        <article
          key={call.reference}
          id={`call-${call.reference}`}
          className={styles.card}
          data-call-card
          data-call-origin={call.origin}
        >
          <div className={styles.cardTop}>
            <span className={styles.status} data-state={call.state}>
              {t.states[call.state]}
            </span>
          </div>
          <h3>
            <bdi>{call.title}</bdi>
          </h3>
          <p className={styles.summary}>{call.summary}</p>
          <div className={styles.metadataRow}>
            <p className={styles.metadata}>
              <SiteIcon icon={CalendarBlank} size={20} />
              <span>
                {t.launchPeriod} : {call.period}
              </span>
            </p>
            <ul className={styles.topics}>
              {(call.shortThemes || call.themes).slice(0, 2).map((theme) => (
                <li key={theme}>{theme}</li>
              ))}
            </ul>
          </div>
          {(call.state === 'closed' || call.state === 'cancelled') && (
            <div className={styles.submission}>
              <div>
                <span>{t.submissionPeriod}</span>
                <span>{t.states[call.state]}</span>
              </div>
              <span className={styles.submissionTrack} data-state={call.state} aria-hidden="true" />
            </div>
          )}
          <a className={styles.cardAction} href={call.href}>
            {t.view}
            <span className="sr-only"> — {call.title}</span>
          </a>
        </article>
      ))}
    </div>
  )
}
