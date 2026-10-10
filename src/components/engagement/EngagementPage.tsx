import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { PageShell } from '@/components/layout/PageShell'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { PublishedPageContent } from '@/components/content/PublishedPageContent'
import { ValorisationIcon, type ValorisationIconName } from '@/components/transfer/ValorisationIcon'
import { heroImages } from '@/lib/hero-images'
import { pageHref } from '@/lib/site'
import {
  engagementSections,
  engagementContactHref,
  type EngagementSectionCopy,
} from '@/lib/engagement'
import styles from './EngagementPage.module.css'

const audienceIcons: ValorisationIconName[] = [
  'building-factory-2',
  'flask',
  'chart-line',
  'arrows-exchange',
]

export async function EngagementPage({ pageId, locale }: { pageId: 'workWithUs'; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Engagement' })
  const sections = await getTranslations({ locale, namespace: `PageSections.${pageId}` })
  const pages = await getTranslations({ locale, namespace: 'Pages' })
  const photo = heroImages.team

  return (
    <PageShell title={pages(pageId)} locale={locale} pageId={pageId} showBreadcrumb={false}>
      <PublishedPageContent pageId={pageId} locale={locale} />
      <div className={styles.page} data-engagement-page={pageId}>
        {engagementSections[pageId].map(({ id, kind, destinations }) => {
          const copy = t.raw(`${pageId}.sections.${id}`) as EngagementSectionCopy
          const needs = kind === 'pathways'
          const contact = kind === 'contact'
          return (
            <section
              key={id}
              id={id}
              aria-labelledby={`${id}-heading`}
              className={`${styles.section} ${needs || kind === 'audiences' || contact ? styles.ink : ''} ${kind === 'partnerships' || kind === 'process' ? styles.light : ''} ${needs ? styles.needs : ''} ${contact ? styles.contact : ''}`}
              data-kind={kind}
            >
              <div className={styles.editorial}>
                <header className={styles.introduction}>
                  <div>
                    <p className={styles.eyebrow}>{copy.label}</p>
                    <h2 id={`${id}-heading`}>{sections(`${id}.title`)}</h2>
                  </div>
                  <p>{sections(`${id}.description`)}</p>
                </header>
                {contact ? (
                  <a className="button button-primary" href={engagementContactHref(locale)}>
                    {t('workWithUs.contactAction')}
                    <NavigationIcon name="arrow" />
                  </a>
                ) : (
                  <div
                    className={`${styles.items} ${needs ? styles.needItems : ''} ${kind === 'audiences' ? styles.audiences : ''} ${kind === 'partnerships' || kind === 'arrangements' ? styles.rows : ''} ${kind === 'process' ? styles.process : ''}`}
                  >
                    {copy.items.map(({ title, description }, index) => {
                      const destination = destinations?.[index]
                      return (
                        <article key={title}>
                          {kind === 'audiences' && (
                            <ValorisationIcon
                              className={styles.audienceIcon}
                              name={audienceIcons[index]}
                            />
                          )}
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
                              href={pageHref(destination.pageId, locale, destination.anchor)}
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
              {needs && (
                <div className={styles.needPhoto}>
                  <Image
                    src={photo.src}
                    width={photo.width}
                    height={photo.height}
                    alt=""
                    sizes="(max-width: 63.999rem) 100vw, 50vw"
                  />
                </div>
              )}
            </section>
          )
        })}
      </div>
    </PageShell>
  )
}
