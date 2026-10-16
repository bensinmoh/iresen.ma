import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import { callCards } from '@/lib/call-archives'
import { callCopy } from '@/lib/call-copy'
import { findPublishedCalls } from '@/lib/content/call-queries'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { CallsCatalogue } from './CallsCatalogue'
import styles from './CallsCatalogue.module.css'

export async function CallsListingPage({ locale }: { locale: Locale }) {
  const t = callCopy[locale]
  const calls = callCards(locale, await findPublishedCalls(locale))
  return (
    <div data-calls-listing>
      <header className={styles.listHeader}>
        <div className="container">
          <a className={styles.back} href={pageHref('programmes', locale, 'calls-for-projects')}>
            <NavigationIcon name="arrow" />
            {t.programme}
          </a>
          <SectionEyebrow>{t.eyebrow}</SectionEyebrow>
          <h1>{t.title}</h1>
          <p>{t.description}</p>
        </div>
      </header>
      <section className={styles.surface} aria-label={t.all} id="all-calls">
        <div className="container">
          <CallsCatalogue calls={calls} locale={locale} />
        </div>
      </section>
    </div>
  )
}
