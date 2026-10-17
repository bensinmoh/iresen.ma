import { Heading } from '@/components/ui/Heading'
import { FilePdf } from '@phosphor-icons/react/dist/ssr/FilePdf'
import { SiteIcon } from '@/components/ui/SiteIcon'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { siteMedia } from '@/lib/cms-workspace/public-corpora'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import styles from './MediaLibrary.module.css'

export async function ReportList({ locale }: { locale: Locale }) {
  const { reports: mediaReports } = await siteMedia()
  const t = await getTranslations({ locale, namespace: 'MediaLibrary' })
  return (
    <div className={styles.reports}>
      {mediaReports.map((report) => (
        <article id={`report-${report.id}`} key={report.id}>
          <div className={styles.reportMark} aria-hidden="true">
            <SiteIcon icon={FilePdf} size={32} />
            <span>PDF</span>
          </div>
          <div>
            <p className={styles.meta}>
              MTEDD · {t(`languages.${report.language}`)} ·{' '}
              {(report.bytes / 1000000).toLocaleString(locale, { maximumFractionDigits: 1 })} MB
            </p>
            <Heading as="h3" size="compact">
              <bdi>{report.title}</bdi>
            </Heading>
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
