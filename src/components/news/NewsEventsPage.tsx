import { publicNewsHighlight } from '@/lib/cms-workspace/public-news-highlight'
import { Heading } from '@/components/ui/Heading'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { findPublicNewsCards, type PublicNewsCard } from '@/lib/content/news-cards'
import {
  selectedNews,
  newsImages,
  eventImages,
  newsEvents,
  newsSocialLinks,
} from '@/lib/news-events'
import { linkedInPostHref } from '@/lib/home-news'
import { pageHref, newsListingHref } from '@/lib/site'
import { SocialIcon } from './SocialIcon'
import { EventRail } from './EventRail'
import styles from './NewsEventsPage.module.css'

type Card = Omit<PublicNewsCard, 'source'> & { source: 'cms' | 'linkedin' }

export async function NewsEventsPage({
  locale,
  listing = false,
  page = 1,
}: {
  locale: Locale
  listing?: boolean
  page?: number
}) {
  const t = await getTranslations({ locale, namespace: 'NewsEvents' })
  const news: Card[] = selectedNews.map((post) => {
    const id = post.id.split(':').at(-1)!
    const image = newsImages[id]
    return {
      id: `news-${id}`,
      title: t(`newsTitles.${id}`),
      summary: t(`summaries.${id}`),
      href: linkedInPostHref(post.id),
      date: post.publicationMonth,
      source: 'linkedin',
      image: image ? { src: image.src, alt: t(`photos.${image.altKey}`) } : undefined,
    }
  })
  let cms: Awaited<ReturnType<typeof findPublicNewsCards>> = {
    cards: [],
    next: false,
    previous: false,
  }
  let unavailable = false
  let highlightId: string | null = null
  try {
    highlightId = await publicNewsHighlight(locale)
  } catch {
    unavailable = true
  }
  try {
    cms = await findPublicNewsCards(locale, page, listing ? undefined : highlightId)
  } catch {
    unavailable = true
  }
  const cards = page === 1 ? [...news, ...cms.cards] : cms.cards
  const highlighted = cards.find((card) => card.id === highlightId)
  const otherNews = cards.filter((card) => card.id !== highlighted?.id)
  function dateLabel(date: string) {
    return new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric',
      timeZone: 'Africa/Casablanca',
    }).format(new Date(date.length === 7 ? `${date}-01T12:00:00Z` : date))
  }
  function media(card: Card, large = false) {
    return (
      <div
        className={`${styles.media} ${large ? styles.largeMedia : ''} ${card.id === 'news-7514300639057797120' && large ? styles.podcastMedia : ''}`}
      >
        {card.id === 'news-7514300639057797120' && large && card.image && (
          <Image
            src={card.image.src}
            alt=""
            fill
            sizes="(max-width: 800px) 100vw, 56vw"
            aria-hidden="true"
            className={styles.echo}
          />
        )}
        {card.image ? (
          <Image
            src={card.image.src}
            alt={card.image.alt}
            fill
            unoptimized={card.source === 'cms'}
            sizes={large ? '(max-width: 800px) 100vw, 56vw' : '(max-width: 800px) 32vw, 15vw'}
          />
        ) : (
          <div className={styles.noImage}>
            <Image src="/brand/logo-primary.svg" alt="IRESEN" width={160} height={48} unoptimized />
          </div>
        )}
      </div>
    )
  }
  function article(card: Card, compact = false) {
    const linkedInProps =
      card.source === 'linkedin' ? { target: '_blank', rel: 'noopener noreferrer' } : {}
    return (
      <article
        id={card.id}
        key={card.id}
        className={`${styles.article} ${compact ? styles.compact : ''}`}
      >
        <a
          href={card.href}
          {...linkedInProps}
          className={styles.imageLink}
          tabIndex={-1}
          aria-hidden="true"
        >
          {media(card, !compact)}
        </a>
        <div className={styles.articleCopy}>
          <p className={styles.meta}>
            {card.date && <time dateTime={card.date}>{dateLabel(card.date)}</time>}
            <span>{card.source === 'linkedin' ? 'LinkedIn' : t('source')}</span>
          </p>
          <Heading as="h3" size="card">
            <a href={card.href} {...linkedInProps}>
              {card.title}
            </a>
          </Heading>
          {!compact && <p>{card.summary}</p>}
          <a data-ui-link className={styles.read} href={card.href} {...linkedInProps}>
            <span>{t('read')}</span>
            <NavigationIcon name="arrow" />
          </a>
        </div>
      </article>
    )
  }
  return (
    <div className={styles.page} data-news-events-page={listing ? 'listing' : 'overview'}>
      <section className={styles.hero} aria-labelledby="hero-title">
        <Image
          src="/images/news/hero.webp"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className={styles.heroPhoto}
        />
        <div className={styles.shade} />
        <div className={`container ${styles.heroContent}`}>
          <SectionEyebrow tone="white">{t('eyebrow')}</SectionEyebrow>
          <h1 id="hero-title">
            {t('titleStart')}
            <br />
            {t('titleMiddle')} <span>{t('titleAccent')}</span>
          </h1>
          <p className={styles.heroDescription}>{t('description')}</p>
          <a className="button button-primary" href={pageHref('news', locale, 'events')}>
            {t('eventsAction')}
            <NavigationIcon name="chevron" />
          </a>
        </div>
      </section>
      <div id="page-sections">
        <section className={styles.news} id="news" aria-labelledby="news-title">
          <div className="container">
            {!listing && (
              <>
                <span id="featured-news" />
                <span id="find-news" />
                <span id="all-news" />
              </>
            )}
            <header className={styles.heading}>
              <Heading as="h2" size="section" id="news-title">
                {listing ? t('allNews') : t('news')}
              </Heading>
              <a
                className="button button-primary"
                href={listing ? pageHref('news', locale, 'news') : newsListingHref(locale)}
              >
                {listing ? t('back') : t('allNews')}
                <NavigationIcon name="arrow" />
              </a>
            </header>
            {unavailable && (
              <p role="status" className={styles.notice}>
                {t('unavailable')}
              </p>
            )}
            {listing ? (
              <div className={styles.listing}>{cards.map((card) => article(card, true))}</div>
            ) : (
              <div className={highlighted ? styles.newsGrid : styles.listing}>
                {highlighted && <div>{article(highlighted)}</div>}
                <div className={styles.sideNews}>
                  {otherNews.map((card) => article(card, true))}
                </div>
              </div>
            )}
            {listing && (cms.next || cms.previous) && (
              <nav className={styles.pagination} aria-label={t('pagination')}>
                {cms.previous && (
                  <a
                    className="button button-primary"
                    href={`${newsListingHref(locale)}${page > 2 ? `?page=${page - 1}` : ''}`}
                  >
                    {t('previous')}
                  </a>
                )}
                <span>{page}</span>
                {cms.next && (
                  <a
                    className="button button-primary"
                    href={`${newsListingHref(locale)}?page=${page + 1}`}
                  >
                    {t('next')}
                  </a>
                )}
              </nav>
            )}
          </div>
        </section>
        {!listing && (
          <>
            <section className={styles.training} aria-labelledby="training-title">
              <div className={`container ${styles.trainingGrid}`}>
                <div className={styles.trainingPhoto}>
                  <Image
                    src="/images/news/learning.webp"
                    alt={t('trainingAlt')}
                    fill
                    sizes="(max-width: 800px) 100vw, 32vw"
                  />
                </div>
                <div className={styles.trainingCopy}>
                  <span id="knowledge-sharing" />
                  <Heading as="h2" size="section" id="training-title">
                    {t('trainingTitle')}
                  </Heading>
                  <div className={styles.trainingLower}>
                    <div>
                      <SectionEyebrow tone="white">{t('trainingHeading')}</SectionEyebrow>
                      <p>{t('trainingDescription')}</p>
                      <a className="button button-primary" href={pageHref('network', locale)}>
                        {t('trainingAction')}
                        <NavigationIcon name="arrow" />
                      </a>
                    </div>
                    <div className={styles.exchangePhoto}>
                      <Image
                        src="/images/news/exchange.webp"
                        alt={t('trainingAlt')}
                        fill
                        sizes="(max-width: 800px) 38vw, 20vw"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className={styles.events} id="events" aria-labelledby="events-title">
              <div className="container">
                <span id="related-events-resources" />
                <header className={styles.eventHeader}>
                  <Heading as="h2" size="section" id="events-title">
                    {t('eventTitle')}
                  </Heading>
                  <p>{t('eventIntro')}</p>
                </header>
                <EventRail
                  className={styles.eventGrid}
                  locale={locale}
                  label={t('eventTitle')}
                  navigationLabel={t('eventNavigation')}
                  previousLabel={t('previousEvents')}
                  nextLabel={t('nextEvents')}
                  itemLabels={newsEvents.map(
                    (event, index) =>
                      `${t('eventPosition', { current: index + 1, total: newsEvents.length })} — ${t(`events.${event.id}.name`)}`,
                  )}
                >
                  {newsEvents.map((event) => (
                    <article key={event.id} id={`event-${event.id}`} className={styles.eventCard}>
                      <div className={styles.eventMedia}>
                        <Image
                          src={eventImages[event.id].src}
                          alt={t(`photos.${eventImages[event.id].altKey}`)}
                          fill
                          sizes="(max-width: 800px) 100vw, 32vw"
                        />
                      </div>
                      <div className={styles.eventCopy}>
                        <p className={styles.role}>{t(event.role)}</p>
                        <Heading as="h3" size="card">
                          {t(`events.${event.id}.name`)}
                        </Heading>
                        <p>{t(`events.${event.id}.description`)}</p>
                        <dl className={styles.eventFacts}>
                          <div>
                            <dt>{t('date')}</dt>
                            <dd>{t(`events.${event.id}.meta`)}</dd>
                          </div>
                          <div>
                            <dt>{t('location')}</dt>
                            <dd>{t(`events.${event.id}.place`)}</dd>
                          </div>
                        </dl>
                        <p className={styles.status}>
                          {event.past ? t('past') : event.id === 'cop31' ? t('planned') : ''}
                        </p>
                        <details className={styles.details}>
                          <summary>
                            {t('details')}
                            <NavigationIcon name="arrow" />
                          </summary>
                          <div>
                            <p>{t(`events.${event.id}.detail`)}</p>
                            {event.id === 'cop31' && (
                              <>
                                <ul>
                                  {(t.raw('events.cop31.topics') as string[]).map((topic) => (
                                    <li key={topic}>{topic}</li>
                                  ))}
                                </ul>
                                <p>{t('programmePending')}</p>
                              </>
                            )}
                            {event.href && (
                              <a data-ui-link href={event.href} className={styles.read}>
                                <span>{event.id === 'oman' ? t('source') : t('official')}</span>
                                <NavigationIcon name="arrow" />
                              </a>
                            )}
                          </div>
                        </details>
                      </div>
                    </article>
                  ))}
                </EventRail>
              </div>
            </section>
            <section className={styles.follow} id="follow-iresen" aria-labelledby="follow-title">
              <div className="container">
                <header className={styles.heading}>
                  <Heading as="h2" size="section" id="follow-title">
                    {t('follow')}
                  </Heading>
                  <p>{t('followDescription')}</p>
                </header>
                <ul className={styles.socials}>
                  {newsSocialLinks.map((social) => (
                    <li key={social.id}>
                      <a
                        href={social.href}
                        target={social.id === 'linkedin' ? '_blank' : undefined}
                        rel={social.id === 'linkedin' ? 'noopener noreferrer' : undefined}
                        aria-label={social.name}
                      >
                        <SocialIcon name={social.id} />
                        <bdi>{social.name}</bdi>
                        <NavigationIcon name="arrow" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
