import Image from 'next/image'
import { DownloadSimple } from '@phosphor-icons/react/dist/ssr/DownloadSimple'
import { SiteIcon } from '@/components/ui/SiteIcon'
import { Heading } from '@/components/ui/Heading'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { PageShell } from '@/components/layout/PageShell'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { pageHref } from '@/lib/site'
import { siteLibraryLinks } from '@/lib/cms-workspace/media-links'
import { siteMedia } from '@/lib/cms-workspace/public-corpora'
import { findPublicLibraryVideos } from '@/lib/content/media-library'
import { ReportList } from './ReportList'
import { PhotoGallery } from './PhotoGallery'
import { VideoRail } from './VideoRail'
import styles from './MediaLibrary.module.css'

export async function MediaLibraryPage({ locale }: { locale: Locale }) {
  const { photos: mediaPhotos } = await siteMedia()
  const t = await getTranslations({ locale, namespace: 'MediaLibrary' })
  const usefulLinks = await siteLibraryLinks(locale)
  let failed = false
  const videos = await findPublicLibraryVideos().catch(() => {
    failed = true
    return []
  })
  const sections = [
    ['collections-content', 'photos'],
    ['videos', 'videos'],
    ['reports', 'reports'],
    ['press-resources', 'links'],
    ['brand-assets', 'brand.title'],
  ] as const
  const header = (label: string, number: string, description?: string) => (
    <header className={styles.heading}>
      <div>
        <SectionEyebrow tone={number === '02' ? 'white' : 'blue'}>
          {number} / {t('label')}
        </SectionEyebrow>
        <Heading as="h2" size="section">
          {label}
        </Heading>
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
          <SectionEyebrow>{t('label')}</SectionEyebrow>
          <Heading as="h2" size="section">
            {t('intro')}
          </Heading>
          <p>{t('description')}</p>
        </section>
        <nav
          id="find-media"
          className={styles.navigation}
          aria-label={t('label')}
          data-ui-rail="stretch"
          tabIndex={0}
        >
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
              biography: t('biography'),
              biographyLanguage: t('biographyLanguage'),
              copyBiography: t('copyBiography'),
              copiedBiography: t('copiedBiography'),
              copyBiographyError: t('copyBiographyError'),
              downloadPortrait: t('downloadPortrait'),
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
          <ReportList locale={locale} />
          {nextSection('press-resources', t('links'))}
        </section>
        <section id="press-resources" className={styles.section} aria-label={t('links')}>
          {header(t('links'), '04', t('linkNote'))}
          <div className={styles.links}>
            {usefulLinks.map((link) => (
              <a
                id={`link-${link.id}`}
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>
                  <strong>
                    <bdi>{link.title}</bdi>
                  </strong>
                  <span>
                    <bdi>{link.description}</bdi>
                  </span>
                </span>
                <span className={styles.externalIcon}>
                  <NavigationIcon name="arrow" />
                </span>
              </a>
            ))}
          </div>
        </section>
        <section id="brand-assets" className={styles.brand} aria-labelledby="brand-assets-title">
          <Image
            className={styles.brandLogo}
            src="/brand/logo-color.svg"
            width={696}
            height={195}
            alt={t('brand.alt')}
            unoptimized
          />
          <div className={styles.brandCopy}>
            <Heading id="brand-assets-title" as="h2" size="compact">
              {t('brand.title')}
            </Heading>
            <p>{t('brand.description')}</p>
            <small className={styles.brandFormat}>
              <bdi>PNG</bdi> · {t('brand.raster')}
            </small>
          </div>
          <div className={styles.brandDownloads}>
            <a href="/brand/logo-color.svg" download="IRESEN-logo.svg" aria-label={t('brand.svg')}>
              <bdi>SVG</bdi>
              <SiteIcon icon={DownloadSimple} size={20} />
            </a>
            <a
              href="/brand/downloads/iresen-logo-color.png"
              download="IRESEN-logo.png"
              aria-label={t('brand.png')}
            >
              <bdi>PNG</bdi>
              <SiteIcon icon={DownloadSimple} size={20} />
            </a>
          </div>
        </section>
        <section id="credits-reuse" className={styles.credits}>
          <Heading as="h2" size="compact">
            {t('credits')}
          </Heading>
          <p>{t('rights')}</p>
          <a href={pageHref('contact', locale)}>
            {t('contact')} <NavigationIcon name="arrow" />
          </a>
        </section>
      </div>
    </PageShell>
  )
}
