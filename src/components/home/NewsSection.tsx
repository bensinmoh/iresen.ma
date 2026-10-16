import { Heading } from '@/components/ui/Heading'
import { CalendarBlank } from '@phosphor-icons/react/dist/ssr/CalendarBlank'
import { SiteIcon } from '@/components/ui/SiteIcon'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { newsListingHref } from '@/lib/site'
import {
  homeNewsPosts,
  homeNewsSectionId,
  linkedInPostHref,
  type LinkedInNewsPost,
} from '@/lib/home-news'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { NewsRail } from './NewsRail'
import styles from './NewsSection.module.css'

export async function NewsSection({
  locale,
  posts = homeNewsPosts,
}: {
  locale: Locale
  posts?: readonly LinkedInNewsPost[]
}) {
  const t = await getTranslations({ locale, namespace: 'HomeNews' })
  return (
    <section id={homeNewsSectionId} aria-labelledby="home-news-heading" className={styles.section}>
      <header className={styles.header}>
        <div>
          <SectionEyebrow>{t('eyebrow')}</SectionEyebrow>
          <Heading as="h2" size="display" id="home-news-heading">
            {t('title')}
          </Heading>
        </div>
        <a data-ui-link href={newsListingHref(locale)} className={styles.all}>
          {t('all')}
          <NavigationIcon name="arrow" />
        </a>
      </header>
      {posts.length ? (
        <NewsRail label={t('list')} previous={t('previous')} next={t('next')}>
          {posts.map((post) => (
            <li key={post.id} id={`news-${post.id.split(':').at(-1)}`} className={styles.card}>
              <p className={styles.source}>
                <bdi>{t('source')}</bdi>
              </p>
              <Heading as="h3" size="card" lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                <a href={linkedInPostHref(post.id)} target="_blank" rel="noopener noreferrer">
                  {t.has(`posts.${post.id.split(':').at(-1)}.title`)
                    ? t(`posts.${post.id.split(':').at(-1)}.title`)
                    : post.commentary || t('shared')}
                </a>
              </Heading>
              {(post.publishedAt || post.publicationMonth) && (
                <time dateTime={post.publishedAt ?? post.publicationMonth}>
                  <SiteIcon icon={CalendarBlank} size={22} />
                  {new Intl.DateTimeFormat(locale, {
                    ...(post.publishedAt ? { day: 'numeric' as const } : {}),
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'Africa/Casablanca',
                  }).format(new Date(post.publishedAt ?? `${post.publicationMonth}-01T12:00:00Z`))}
                </time>
              )}
              <a
                data-ui-link
                href={linkedInPostHref(post.id)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.read}
              >
                {t('read')}
                <NavigationIcon name="arrow" />
              </a>
            </li>
          ))}
        </NewsRail>
      ) : (
        <p className={styles.empty}>{t('empty')}</p>
      )}
    </section>
  )
}
