import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
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
          <p className={styles.eyebrow}>
            <Image
              src="/brand/apex-leaf.svg"
              alt=""
              aria-hidden="true"
              width={1773}
              height={2870}
              unoptimized
            />
            {t('eyebrow')}
          </p>
          <h2 id="home-news-heading">{t('title')}</h2>
        </div>
        <a href={pageHref('news', locale)} className={styles.all}>
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
              <h3 lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                <a href={linkedInPostHref(post.id)}>
                  {t.has(`posts.${post.id.split(':').at(-1)}.title`)
                    ? t(`posts.${post.id.split(':').at(-1)}.title`)
                    : post.commentary || t('shared')}
                </a>
              </h3>
              {(post.publishedAt || post.publicationMonth) && (
                <time dateTime={post.publishedAt ?? post.publicationMonth}>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="16"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <path
                      d="M7 3v5m10-5v5M3 11h18"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                  {new Intl.DateTimeFormat(locale, {
                    ...(post.publishedAt ? { day: 'numeric' as const } : {}),
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'Africa/Casablanca',
                  }).format(new Date(post.publishedAt ?? `${post.publicationMonth}-01T12:00:00Z`))}
                </time>
              )}
              <a href={linkedInPostHref(post.id)} className={styles.read}>
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
