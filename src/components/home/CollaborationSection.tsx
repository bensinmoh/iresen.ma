import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { collaborationCount, collaborationPaths } from '@/lib/home-collaboration'
import { pageHref } from '@/lib/site'
import styles from './CollaborationSection.module.css'

export async function CollaborationSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'HomeCollaboration' })
  return (
    <section id="collaboration" aria-labelledby="collaboration-heading" className={styles.section}>
      <div className={styles.layout}>
        <header className={styles.introduction}>
          <h2 id="collaboration-heading">{t('title')}</h2>
          <p>{t('description')}</p>
          <a
            className={styles.primary}
            href={`${pageHref('contact', locale)}?subject=partnerships#send-request`}
          >
            {t('action')} <NavigationIcon name="arrow" />
          </a>
        </header>
        <div className={styles.paths}>
          {collaborationPaths.map((path) => (
            <article key={path.id} className={styles.path}>
              <p className={styles.audience}>{t(`paths.${path.id}.audience`)}</p>
              <h3>{t(`paths.${path.id}.title`)}</h3>
              <p className={styles.description}>{t(`paths.${path.id}.description`)}</p>
              <a
                className={styles.link}
                href={
                  'topic' in path
                    ? `${pageHref(path.pageId, locale)}?subject=${path.topic}#send-request`
                    : pageHref(path.pageId, locale)
                }
              >
                {t(`paths.${path.id}.action`)} <NavigationIcon name="arrow" />
              </a>
            </article>
          ))}
        </div>
      </div>
      <div className={styles.proof}>
        <p className={styles.count}>
          <bdi dir="ltr">{collaborationCount}</bdi>
          <span>{t('collaborators')}</span>
        </p>
        <aside className={styles.certification} aria-label={`${t('certified')} ISO 9001:2015`}>
          <svg
            viewBox="0 0 40 44"
            width="40"
            height="44"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M20 3 35 9v12c0 9-8 16-15 20C13 37 5 30 5 21V9L20 3Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="m12 21 6 6 11-12" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <div>
            <p>
              {t('certified')} <bdi dir="ltr">ISO 9001:2015</bdi>
            </p>
            <p>{t('certification')}</p>
          </div>
        </aside>
      </div>
    </section>
  )
}
