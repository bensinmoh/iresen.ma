import { Heading } from '@/components/ui/Heading'
import { ShieldCheck } from '@phosphor-icons/react/dist/ssr/ShieldCheck'
import { SiteIcon } from '@/components/ui/SiteIcon'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { collaborationCount, collaborationPaths } from '@/lib/home-collaboration'
import { pageHref } from '@/lib/site'
import { CollaborationRail } from './CollaborationRail'
import styles from './CollaborationSection.module.css'

export async function CollaborationSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'HomeCollaboration' })
  return (
    <section id="collaboration" aria-labelledby="collaboration-heading" className={styles.section}>
      <div className={styles.layout}>
        <header className={styles.introduction}>
          <Heading as="h2" size="display" id="collaboration-heading">
            {t('title')}
          </Heading>
          <p>{t('description')}</p>
          <a className={styles.primary} href={pageHref('workWithUs', locale, 'choose-pathway')}>
            {t('action')} <NavigationIcon name="arrow" />
          </a>
        </header>
        <CollaborationRail
          className={styles.paths}
          locale={locale}
          label={t('navigation')}
          navigationLabel={t('navigation')}
          itemLabels={collaborationPaths.map(({ id }) => t(`paths.${id}.audience`))}
        >
          {collaborationPaths.map((path) => (
            <article key={path.id} className={styles.path} data-audience={path.id}>
              <p className={styles.audience}>{t(`paths.${path.id}.audience`)}</p>
              <Heading as="h3" size="card">
                {t(`paths.${path.id}.title`)}
              </Heading>
              <p className={styles.description}>{t(`paths.${path.id}.description`)}</p>
              <a
                data-ui-link
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
        </CollaborationRail>
      </div>
      <div className={styles.proof}>
        <p className={styles.count}>
          <bdi dir="ltr">{collaborationCount}</bdi>
          <span>{t('collaborators')}</span>
        </p>
        <aside className={styles.certification} aria-label={`${t('certified')} ISO 9001:2015`}>
          <SiteIcon icon={ShieldCheck} size={40} />
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
