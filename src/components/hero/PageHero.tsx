import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { heroes } from '@/lib/heroes'
import { homeFigures } from '@/lib/figures'
import { pageHref, type PageId } from '@/lib/site'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { HeroViewport } from './HeroViewport'

export async function PageHero({ pageId, locale }: { pageId: PageId; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Hero' })
  const titles = await getTranslations({ locale, namespace: 'Pages' })
  const definition = heroes[pageId]
  const pathways = [
    { key: 'develop', page: 'programmes' },
    { key: 'test', page: 'platforms' },
    { key: 'transfer', page: 'transfer' },
  ] as const

  return (
    <HeroViewport className={`page-hero hero--${definition.layout}`}>
      <div className="hero-scene">
        <div className="hero-media" aria-hidden="true">
          <Image
            src={`/images/heroes/${definition.photo}.webp`}
            alt=""
            fill
            sizes={definition.layout === 'split' ? '(min-width: 70rem) 60vw, 100vw' : '100vw'}
            loading="eager"
            fetchPriority="high"
            className="hero-photo"
          />
        </div>
        <div className="hero-shade" />
        <div className="container hero-body">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              <span aria-hidden="true" />
              {t(`stages.${definition.stage}`)}
            </p>
            <h1 id="hero-title">{pageId === 'home' ? t('homeTitle') : titles(pageId)}</h1>
            <p className="hero-description">{t(`descriptions.${pageId}`)}</p>
            <div className="hero-actions">
              <a className="button button-primary hero-primary" href="#page-sections">
                {t('discover')}
                <NavigationIcon name="arrow" />
              </a>
              <a className="hero-related" href={pageHref(definition.related, locale)}>
                {titles(definition.related)}
                <NavigationIcon name="arrow" />
              </a>
            </div>
          </div>
          <a className="hero-scroll" href="#page-sections" aria-label={t('continue')}>
            <span>{t('continue')}</span>
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
      <div className="hero-highlights">
        {pageId === 'home' ? (
          <dl className="container hero-figures" aria-label={t('figuresLabel')}>
            {homeFigures.map(({ id, value }) => (
              <div className="key-figure" key={id}>
                <dt className="key-figure-label">{t(`figures.${id}`)}</dt>
                <dd className="key-figure-value">
                  <bdi dir="ltr">{value}</bdi>
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="container hero-highlights-inner">
            {pageId === 'institute' && (
              <p className="key-figure hero-founding">
                <strong className="key-figure-value">
                  <bdi>2011</bdi>
                </strong>
                <span className="key-figure-label">{t('founded')}</span>
              </p>
            )}
            <nav aria-label={t('pathways')} className="hero-pathways">
              {pathways.map(({ key, page }) => (
                <a
                  key={key}
                  href={pageHref(page, locale)}
                  className={definition.stage === key ? 'hero-pathway-active' : undefined}
                >
                  <span>{t(`stages.${key}`)}</span>
                  <NavigationIcon name="arrow" />
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </HeroViewport>
  )
}
