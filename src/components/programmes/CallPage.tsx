import { Heading } from '@/components/ui/Heading'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import type { PublicCall } from '@/lib/content/call-queries'
import { findCallTerms } from '@/lib/content/call-queries'
import { callState } from '@/lib/calls'
import { pageHref } from '@/lib/site'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import styles from './CallPage.module.css'

export function formatCallDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Africa/Casablanca',
  }).format(new Date(value))
}
export async function CallPage({ call, locale }: { call: PublicCall; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Calls' })
  const state = callState(call)
  const terms = await findCallTerms(call, locale)
  const date = (value: string) => <time dateTime={value}>{formatCallDate(value, locale)}</time>
  return (
    <article className={styles.detail} data-call-page>
      <header className={styles.header}>
        <div className="container">
          <a className={styles.back} href={pageHref('programmes', locale, 'participate')}>
            <NavigationIcon name="arrow" />
            {t('back')}
          </a>
          <p className={styles.callMeta}>
            <bdi>{call.acronym}</bdi>
            <span className={styles.status}>{t(`states.${state}`)}</span>
          </p>
          <h1>{call.title}</h1>
          <dl className={styles.facts}>
            <div>
              <dt>{t('launchYear')}</dt>
              <dd>
                <bdi>{call.launchYear}</bdi>
              </dd>
            </div>
            <div>
              <dt>{t('budget')}</dt>
              <dd>
                {new Intl.NumberFormat(locale, {
                  style: 'currency',
                  currency: call.budgetCurrency,
                  maximumFractionDigits: 2,
                }).format(call.budgetAmount)}
              </dd>
            </div>
            <div>
              <dt>{t('deadline')}</dt>
              <dd>{date(call.deadlineAt)}</dd>
            </div>
          </dl>
          <div className={styles.actions}>
            {terms ? (
              <a className="button button-primary" href={terms.url!} download>
                {t('download')}
                <NavigationIcon name="arrow" />
              </a>
            ) : (
              <p>{t('termsUnavailable')}</p>
            )}
            {state === 'open' ? (
              terms && (
                <a className="button button-secondary" href={call.submissionUrl}>
                  {t('submit')}
                  <NavigationIcon name="arrow" />
                </a>
              )
            ) : (
              <p>{t(`submission.${state}`)}</p>
            )}
          </div>
        </div>
      </header>
      <div className="container">
        <section
          id="call-description"
          aria-labelledby="call-description-title"
          className={styles.section}
        >
          <Heading as="h2" size="section" id="call-description-title">
            {t('description')}
          </Heading>
          <div className={styles.prose}>
            {call.description.split(/\n\s*\n/).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          {call.budgetNote && <p>{call.budgetNote}</p>}
        </section>
        <section
          id="call-calendar"
          aria-labelledby="call-calendar-title"
          className={styles.section}
        >
          <Heading as="h2" size="section" id="call-calendar-title">
            {t('calendar')}
          </Heading>
          <p className={styles.muted}>{t('timezone')}</p>
          <ol className={styles.calendar}>
            {(
              [
                ['opening', call.openingAt],
                ['submission', call.deadlineAt],
                ['evaluation', call.evaluationStartsAt],
                ['results', call.resultsAt],
              ] as const
            ).map(([stage, value], i) => (
              <li key={stage}>
                <span aria-hidden="true">0{i + 1}</span>
                <Heading as="h3" size="card">
                  {t(`stages.${stage}`)}
                </Heading>
                {date(value)}
                {stage === 'evaluation' && call.evaluationEndsAt && (
                  <p>
                    {t('until')} {date(call.evaluationEndsAt)}
                  </p>
                )}
              </li>
            ))}
          </ol>
          {call.calendarNote && <p>{call.calendarNote}</p>}
        </section>
        <section
          id="call-eligibility"
          aria-labelledby="call-eligibility-title"
          className={styles.section}
        >
          <Heading as="h2" size="section" id="call-eligibility-title">
            {t('eligibility')}
          </Heading>
          <div className={styles.columns}>
            {(
              [
                ['recipients', call.recipients],
                ['themes', call.themes],
              ] as const
            ).map(([key, value]) => (
              <div key={key}>
                <Heading as="h3" size="card">
                  {t(key)}
                </Heading>
                <ul>
                  {value
                    .split('\n')
                    .filter((line) => line.trim())
                    .map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <section id="call-funders" aria-labelledby="call-funders-title" className={styles.section}>
          <Heading as="h2" size="section" id="call-funders-title">
            {t('fundingPartners')}
          </Heading>
          <ul>
            {call.fundingPartners
              .split('\n')
              .filter((line) => line.trim())
              .map((line, i) => (
                <li key={i}>{line}</li>
              ))}
          </ul>
        </section>
      </div>
    </article>
  )
}
