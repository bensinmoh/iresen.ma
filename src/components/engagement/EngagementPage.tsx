import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { PageShell } from '@/components/layout/PageShell'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { PublishedPageContent } from '@/components/content/PublishedPageContent'
import { homeAchievements } from '@/lib/home-achievements'
import { pageHref } from '@/lib/site'
import {
  engagementSections,
  engagementContactHref,
  type EngagementPageId,
  type EngagementSectionCopy,
} from '@/lib/engagement'
import styles from './EngagementPage.module.css'

export async function EngagementPage({
  pageId,
  locale,
}: {
  pageId: EngagementPageId
  locale: Locale
}) {
  const t = await getTranslations({ locale, namespace: 'Engagement' })
  const sections = await getTranslations({ locale, namespace: `PageSections.${pageId}` })
  const pages = await getTranslations({ locale, namespace: 'Pages' })
  const achievements = await getTranslations({ locale, namespace: 'HomeAchievements' })
  const definitions = engagementSections[pageId]
  const related = pageId === 'workWithUs' ? 'transfer' : 'workWithUs'

  return (
    <PageShell title={pages(pageId)} locale={locale} pageId={pageId}>
      <PublishedPageContent pageId={pageId} locale={locale} />
      <div className={styles.page} data-engagement-page={pageId}>
        <nav aria-label={t('navigation')} className={styles.navigation}>
          {definitions.map(({ id }) => (
            <a key={id} href={`#${id}`}>
              {t(`${pageId}.sections.${id}.label`)}
            </a>
          ))}
        </nav>
        {definitions.map(({ id, kind, destinations, references }) => {
          const copy = t.raw(`${pageId}.sections.${id}`) as EngagementSectionCopy
          return (
            <section
              key={id}
              id={id}
              aria-labelledby={`${id}-heading`}
              className={`${styles.section} ${kind === 'audiences' || kind === 'contact' ? styles.ink : ''}`}
              data-kind={kind}
            >
              <header className={styles.introduction}>
                <p className={styles.eyebrow}>{copy.label}</p>
                <h2 id={`${id}-heading`}>{sections(`${id}.title`)}</h2>
                <p>{sections(`${id}.description`)}</p>
              </header>
              <div className={styles.content}>
                {kind === 'disclosures' ? (
                  <div className={styles.disclosures}>
                    {copy.items.map(({ title, description }) => (
                      <details key={title}>
                        <summary>
                          {title}
                          <span aria-hidden="true">+</span>
                        </summary>
                        <p>{description}</p>
                      </details>
                    ))}
                  </div>
                ) : kind === 'references' ? (
                  <div className={styles.references}>
                    {references?.map((reference, index) => {
                      const image = homeAchievements.find(({ id }) => id === reference)!
                      return (
                        <article key={reference}>
                          <Image
                            src={`/images/achievements/${reference}.webp`}
                            alt={achievements(`items.${reference}.imageDescription`)}
                            width={image.width}
                            height={image.height}
                            sizes="(max-width: 63.999rem) 94vw, (min-width: 128rem) 40rem, 32vw"
                          />
                          <h3>
                            <bdi>{achievements(`items.${reference}.name`)}</bdi>
                          </h3>
                          <p>{copy.items[index].description}</p>
                          <a
                            className={styles.link}
                            href={pageHref('home', locale, `achievement-${reference}`)}
                          >
                            {t('referenceAction')}
                            <NavigationIcon name="arrow" />
                          </a>
                        </article>
                      )
                    })}
                  </div>
                ) : kind === 'contact' ? (
                  <>
                    <ul className={styles.checklist}>
                      {copy.checklist.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <div className={styles.actions}>
                      <a className="button button-primary" href={engagementContactHref(locale)}>
                        {t('contactAction')}
                        <NavigationIcon name="arrow" />
                      </a>
                      <a className={styles.link} href={pageHref(related, locale)}>
                        {pages(related)}
                        <NavigationIcon name="arrow" />
                      </a>
                    </div>
                  </>
                ) : (
                  <div className={`${styles.items} ${kind === 'audiences' ? styles.rows : ''}`}>
                    {copy.items.map(({ title, description }, index) => {
                      const destination = destinations?.[index]
                      return (
                        <article key={title}>
                          {kind === 'process' && (
                            <span className={styles.number} aria-hidden="true">
                              {new Intl.NumberFormat(locale, { minimumIntegerDigits: 2 }).format(
                                index + 1,
                              )}
                            </span>
                          )}
                          <h3>{title}</h3>
                          <p>{description}</p>
                          {destination && (
                            <a
                              className={styles.link}
                              href={
                                destination.pageId === 'contact'
                                  ? engagementContactHref(locale)
                                  : pageHref(destination.pageId, locale, destination.anchor)
                              }
                            >
                              {pages(destination.pageId)}
                              <NavigationIcon name="arrow" />
                            </a>
                          )}
                        </article>
                      )
                    })}
                  </div>
                )}
                {copy.note && <p className={styles.note}>{copy.note}</p>}
              </div>
            </section>
          )
        })}
      </div>
    </PageShell>
  )
}
