import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { mediaReports } from '@/lib/media-library'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import styles from './MediaLibrary.module.css'

export async function ReportList({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'MediaLibrary' })
  return (
    <div className={styles.reports}>
      {mediaReports.map((report) => (
        <article id={`report-${report.id}`} key={report.id}>
          <div className={styles.reportMark} aria-hidden="true">
            <svg width="32" height="38" viewBox="0 0 32 38" fill="none">
              <path
                d="M4 1h16l8 8v28H4zM20 1v9h8M9 17h14M9 23h14M9 29h9"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <span>PDF</span>
          </div>
          <div>
            <p className={styles.meta}>
              MTEDD · {t(`languages.${report.language}`)} ·{' '}
              {(report.bytes / 1000000).toLocaleString(locale, { maximumFractionDigits: 1 })} MB
            </p>
            <h3>
              <bdi>{report.title}</bdi>
            </h3>
            <p>{report.description[locale]}</p>
            <a href={report.url} target="_blank" rel="noopener noreferrer">
              {t('source')}{' '}
              <span className={styles.externalIcon}>
                <NavigationIcon name="arrow" />
              </span>
            </a>
          </div>
        </article>
      ))}
    </div>
  )
}
