import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { PageShell } from '@/components/layout/PageShell'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { pageHref } from '@/lib/site'
import { mediaPhotos, mediaReports, mediaLinks } from '@/lib/media-library'
import { findPublicLibraryVideos } from '@/lib/content/media-library'
import { PhotoGallery } from './PhotoGallery'
import { VideoRail } from './VideoRail'
import styles from './MediaLibrary.module.css'

export async function MediaLibraryPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'MediaLibrary' })
  let failed = false
  const videos = await findPublicLibraryVideos(locale).catch(() => {
    failed = true
    return []
  })
  const sections = [
    ['collections-content', 'photos'],
    ['videos', 'videos'],
    ['reports', 'reports'],
    ['press-resources', 'links'],
  ] as const
  const header = (label: string, number: string, description?: string) => (
    <header className={styles.heading}>
      <div>
        <span className={styles.eyebrow}>
          {number} / {t('label')}
        </span>
        <h2>{label}</h2>
      </div>
      {description && <p>{description}</p>}
    </header>
  )
  const nextSection = (id: string, label: string) => (
    <a className={styles.sectionReturn} href={`#${id}`}>
      {label}
      <NavigationIcon name="arrow" />
    </a>
  )
  return (
    <PageShell title={t('label')} locale={locale} pageId="media" showBreadcrumb={false}>
      <div className={styles.page} data-media-library>
        <section id="featured-media" className={styles.intro}>
          <p className={styles.eyebrow}>{t('label')}</p>
          <h2>{t('intro')}</h2>
          <p>{t('description')}</p>
        </section>
        <nav id="find-media" className={styles.navigation} aria-label={t('label')}>
          {sections.map(([id, key]) => (
            <a key={id} href={`#${id}`}>
              {t(key)} <NavigationIcon name="arrow" />
            </a>
          ))}
        </nav>
        <section id="collections-content" className={styles.section} aria-label={t('photos')}>
          {header(t('photos'), '01')}
          <PhotoGallery
            photos={mediaPhotos}
            locale={locale}
            copy={{
              all: t('all'),
              open: t('open'),
              download: t('download'),
              close: t('close'),
              previous: t('previous'),
              next: t('next'),
              found: t('found'),
              categories: t.raw('categories'),
            }}
          />
          {nextSection('videos', t('videos'))}
        </section>
        <section id="videos" className={`${styles.section} ${styles.ink}`} aria-label={t('videos')}>
          {header(t('videos'), '02', t('videoNote'))}
          {videos.length ? (
            <VideoRail
              videos={videos}
              locale={locale}
              label={t('videos')}
              previous={t('previousVideos')}
              next={t('nextVideos')}
              close={t('close')}
              download={t('downloadVideo')}
            />
          ) : (
            <p className={styles.notice} role={failed ? 'alert' : undefined}>
              {t(failed ? 'unavailable' : 'empty')}
            </p>
          )}
          {nextSection('reports', t('reports'))}
        </section>
        <section
          id="reports"
          className={`${styles.section} ${styles.light}`}
          aria-label={t('reports')}
        >
          {header(t('reports'), '03', t('sourceNote'))}
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
                    {(report.bytes / 1000000).toLocaleString(locale, { maximumFractionDigits: 1 })}{' '}
                    MB
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
          {nextSection('press-resources', t('links'))}
        </section>
        <section id="press-resources" className={styles.section} aria-label={t('links')}>
          {header(t('links'), '04', t('linkNote'))}
          <div className={styles.links}>
            {mediaLinks.map((link) => (
              <a
                id={`link-${link.id}`}
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>
                  <strong>
                    <bdi>{link.name}</bdi>
                  </strong>
                  <span>
                    <bdi>{link.title}</bdi>
                  </span>
                </span>
                <span className={styles.externalIcon}>
                  <NavigationIcon name="arrow" />
                </span>
              </a>
            ))}
          </div>
        </section>
        <section id="credits-reuse" className={styles.credits}>
          <h2>{t('credits')}</h2>
          <p>{t('rights')}</p>
          <a href={pageHref('contact', locale)}>
            {t('contact')} <NavigationIcon name="arrow" />
          </a>
        </section>
      </div>
    </PageShell>
  )
}
