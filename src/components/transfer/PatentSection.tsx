import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { Heading } from '@/components/ui/Heading'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { patents, patentThemes } from '@/lib/patents'
import { PatentCatalog } from './PatentCatalog'
import styles from './TransferPage.module.css'

export async function PatentSection({
  locale,
  standalone = false,
}: {
  locale: Locale
  standalone?: boolean
}) {
  const t = await getTranslations({ locale, namespace: 'Transfer' })
  return (
    <section
      id="adoption-initiatives"
      aria-labelledby="adoption-initiatives-heading"
      className={`${styles.section} ${styles.light}`}
    >
      <header className={styles.header}>
        <div>
          <SectionEyebrow>{t('catalog.label')}</SectionEyebrow>
          <Heading as={standalone ? 'h1' : 'h2'} size="section" id="adoption-initiatives-heading">
            {t('catalog.title')}
          </Heading>
        </div>
        <p>{t('catalog.description')}</p>
      </header>
      <div
        id="valorisation-figures"
        className={styles.figures}
        aria-labelledby="valorisation-figures-heading"
      >
        <Heading as={standalone ? 'h2' : 'h3'} size="label" id="valorisation-figures-heading">
          {t('figures.label')}
        </Heading>
        <dl>
          <div>
            <dt>{t('figures.filed')}</dt>
            <dd>
              <bdi>{patents.length}</bdi>
            </dd>
          </div>
          <div>
            <dt>{t('figures.themes')}</dt>
            <dd>
              <bdi>{patentThemes.length}</bdi>
            </dd>
          </div>
          <div>
            <dt>{t('figures.date')}</dt>
            <dd>
              <span className={styles.period}>{t('figures.period')}</span>
            </dd>
          </div>
        </dl>
        <p>{t('figures.note')}</p>
      </div>
      <PatentCatalog locale={locale} headingLevel={standalone ? 'h2' : 'h3'} />
    </section>
  )
}
