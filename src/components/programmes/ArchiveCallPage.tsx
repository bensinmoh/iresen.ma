import { CallThemeIcon } from './CallThemeIcon'
import Image from 'next/image'
import { callPartners } from '@/lib/call-partners'
import type { Locale } from '@/i18n/locales'
import { archiveCalls, archiveCard, archiveProfile, formatArchivePeriod } from '@/lib/call-archives'
import { callCopy } from '@/lib/call-copy'
import { callsListingHref } from '@/lib/calls'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { CallCards } from './CallCards'
import styles from './CallsCatalogue.module.css'

export function ArchiveCallPage({
  call,
  locale,
}: {
  call: (typeof archiveCalls)[number]
  locale: Locale
}) {
  const t = callCopy[locale]
  const profile = archiveProfile(call)
  const related = archiveCalls
    .filter((other) => other.reference !== call.reference && other.profile === call.profile)
    .slice(-2)
    .reverse()
  return (
    <article data-archive-call>
      <header className={styles.detailHeader}>
        <div className="container">
          <a className={styles.back} href={callsListingHref(locale)}>
            <NavigationIcon name="arrow" />
            {t.back}
          </a>
          <h1>
            <bdi>{call.title}</bdi>
          </h1>
          <p>{profile.summary[locale]}</p>
          <p className={styles.editorial}>{t.draft}</p>
          <div className={styles.detailFooter}>
            <dl className={styles.facts}>
              <div>
                <dt>{t.period}</dt>
                <dd>{call.periodLabel?.[locale] || formatArchivePeriod(call.period, locale)}</dd>
              </div>
              <div>
                <dt>{t.kind}</dt>
                <dd>{t.kinds[call.kind as keyof typeof t.kinds]}</dd>
              </div>
              <div>
                <dt>{t.status}</dt>
                <dd>{t.states.closed}</dd>
              </div>
            </dl>
            <div className={styles.closedActions}>
              {[t.submissionForm, t.termsOfReference].map((label) => (
                <button
                  key={label}
                  type="button"
                  aria-disabled="true"
                  aria-label={`${label} — ${t.closedAction}`}
                  className={styles.closedAction}
                >
                  <span aria-hidden="true">{label}</span>
                  <span aria-hidden="true" className={styles.closedActionMessage}>
                    {t.closedAction}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
      <div className={`container ${styles.detailBody}`}>
        <div>
          <section className={styles.chapter} id="call-description">
            <h2>{t.presentation}</h2>
            <p>{profile.summary[locale]}</p>
            <div className={styles.themeBlock}>
              <h2>{t.themes}</h2>
              <ul className={styles.themeList}>
                {profile.themes[locale].map((theme, index) => (
                  <li key={theme}>
                    <CallThemeIcon profile={call.profile} index={index} />
                    <span>{theme}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className={styles.chapter} id="call-eligibility">
            <h2>{t.audience}</h2>
            <p>{profile.audience[locale]}</p>
          </section>
          <section className={styles.chapter} id="call-calendar">
            <h2>{t.calendar}</h2>
            <p>{t.original}</p>
            <p>{call.note?.[locale] || formatArchivePeriod(call.period, locale)}</p>
          </section>
          <section className={styles.chapter} id="call-documents">
            <h2>{t.practical}</h2>
            {call.funding?.[locale] && <p>{call.funding[locale]}</p>}
            {call.duration?.[locale] && <p>{call.duration[locale]}</p>}
            <p>{t.pending}</p>
          </section>
        </div>
        <aside className={styles.sidebar}>
          <section className={styles.sidebarBlock} aria-labelledby="call-partners-title">
            <h2 id="call-partners-title">{t.partners}</h2>
            <ul className={styles.partnerLogos}>
              {(call.partners || profile.partners).map((name) => {
                const partner = callPartners[name]
                return (
                  <li key={name}>
                    {partner ? (
                      <a
                        className={styles.partnerLink}
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${partner.name} — ${t.newTab}`}
                      >
                        <Image src={partner.logo} alt="" width={240} height={80} unoptimized />
                        <span>
                          <bdi>{partner.name}</bdi>
                          <NavigationIcon name="arrow-up-right" />
                        </span>
                      </a>
                    ) : (
                      <bdi>{name}</bdi>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
          <section className={styles.sidebarBlock} aria-labelledby="call-sources-title">
            <h2 id="call-sources-title">{t.sources}</h2>
            <p className={styles.editorial}>{t.sourceNote}</p>
            <ul className={styles.sourceList}>
              {call.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url}>{source.title}</a>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
      {related.length > 0 && (
        <section className={styles.related} aria-labelledby="related-calls-title">
          <div className="container">
            <h2 id="related-calls-title">{t.related}</h2>
            <CallCards calls={related.map((other) => archiveCard(other, locale))} locale={locale} />
          </div>
        </section>
      )}
    </article>
  )
}
