import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import { pageSections } from '@/lib/page-sections'
import {
  networkLaboratories,
  laboratoryAnchor,
  suppliedLaboratoryContact,
  laboratoryTopics,
} from '@/lib/network'
import { heroImages } from '@/lib/hero-images'
import { PageHero } from '@/components/hero/PageHero'
import { PublishedPageContent } from '@/components/content/PublishedPageContent'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { ValorisationIcon } from '@/components/transfer/ValorisationIcon'
import { LaboratoryDirectory } from './LaboratoryDirectory'
import styles from './NetworkPage.module.css'

export async function NetworkPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Network' })
  const original = await getTranslations({ locale: 'fr', namespace: 'Network' })
  const sections = await getTranslations({ locale, namespace: 'PageSections.network' })
  const navigation = await getTranslations({ locale, namespace: 'Navigation' })
  const photo = heroImages.workshop
  const records = networkLaboratories.map(({ id, topic, location }) => ({
    id,
    topic,
    location,
    anchor: laboratoryAnchor(id),
    title: t(`labs.${id}.title`),
    institution: t(`labs.${id}.institution`),
    city: t(`labs.${id}.city`),
    discovery: `${original(`labs.${id}.title`)} ${original(`labs.${id}.institution`)} ${original(`labs.${id}.city`)} ${id === 'power-electronics' ? original('directory.name') : ''}`,
    ...(id === suppliedLaboratoryContact.id
      ? { contact: { name: t('directory.name'), email: suppliedLaboratoryContact.email } }
      : id === 'solar-energy'
        ? { contact: { name: t('directory.gepName'), email: 'ghennioui@iresen.org' } }
        : {}),
  }))
  const icons = ['search', 'flask', 'chart-line', 'arrows-exchange'] as const
  return (
    <div className={styles.page} data-network-page>
      <PageHero pageId="network" locale={locale} description={t('description')} />
      <div id="page-sections">
        <nav className={`container ${styles.navigation}`} aria-label={navigation('sections')}>
          {pageSections.network.map(({ id }) => (
            <a key={id} href={`#${id}`}>
              {sections(`${id}.title`)}
            </a>
          ))}
        </nav>
        <section
          id="competence-domains"
          className={`container ${styles.section}`}
          aria-labelledby="network-domains-title"
        >
          <header className={styles.heading}>
            <div>
              <SectionEyebrow>{t('eyebrow')}</SectionEyebrow>
              <h2 id="network-domains-title">{t('domains.title')}</h2>
            </div>
            <p>{t('domains.description')}</p>
          </header>
          <div className={styles.domains}>
            {[0, 1, 2].map((i) => (
              <article key={i}>
                <span className={styles.index} aria-hidden="true">
                  0{i + 1}
                </span>
                <h3>{t(`domains.items.${i}.title`)}</h3>
                <p>{t(`domains.items.${i}.description`)}</p>
              </article>
            ))}
          </div>
        </section>
        <section
          id="intervention-modes"
          className={`${styles.modes} ${styles.section}`}
          aria-labelledby="network-modes-title"
        >
          <div className="container">
            <header className={styles.heading}>
              <h2 id="network-modes-title">{t('modes.title')}</h2>
              <p>{t('modes.description')}</p>
            </header>
            <div className={styles.modeGrid}>
              {icons.map((icon, i) => (
                <article key={icon}>
                  <ValorisationIcon name={icon} />
                  <h3>{t(`modes.items.${i}.title`)}</h3>
                  <p>{t(`modes.items.${i}.description`)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          id="scientific-network"
          className={`container ${styles.section} ${styles.directorySection}`}
          aria-labelledby="network-directory-title"
        >
          <LaboratoryDirectory
            introduction={
              <header className={styles.directoryHeading}>
                <div>
                  <SectionEyebrow>{t('directory.eyebrow')}</SectionEyebrow>
                  <h2 id="network-directory-title">{t('directory.title')}</h2>
                  <p>{t('directory.description')}</p>
                </div>
              </header>
            }
            records={records}
            labels={{
              map: t('directory.map'),
              list: t('directory.list'),
              close: t('directory.close'),
              label: t('directory.label'),
              placeholder: t('directory.placeholder'),
              search: t('directory.search'),
              all: t('directory.all'),
              reset: t('directory.reset'),
              empty: t('directory.empty'),
              results: t('directory.results', { count: '{count}' }),
              city: t('directory.city'),
              theme: t('directory.theme'),
              contact: t('directory.contact'),
              topics: Object.fromEntries(
                laboratoryTopics.map((id) => [id, t(`directory.topics.${id}`)]),
              ) as Record<(typeof laboratoryTopics)[number], string>,
            }}
          />
        </section>
        <section
          id="skills-training"
          className={styles.skills}
          aria-labelledby="network-skills-title"
        >
          <div className={`container ${styles.skillsInner}`}>
            <div className={styles.practicePhoto}>
              <Image
                src={photo.src}
                width={photo.width}
                height={photo.height}
                alt={t('skills.imageAlt')}
                sizes="(max-width: 63.999rem) 92vw, 45vw"
              />
            </div>
            <div>
              <SectionEyebrow tone="cyan">{sections('skills-training.title')}</SectionEyebrow>
              <h2 id="network-skills-title">{t('skills.title')}</h2>
              <p>{t('skills.description')}</p>
              <ul>
                {[0, 1, 2].map((i) => (
                  <li key={i}>{t(`skills.items.${i}`)}</li>
                ))}
              </ul>
              <div className={styles.actions}>
                <a className="button button-primary" href={pageHref('opportunities', locale)}>
                  {t('skills.action')}
                  <NavigationIcon name="arrow" />
                </a>
                <a href={pageHref('news', locale, 'events')}>
                  {t('skills.secondary')}
                  <NavigationIcon name="arrow" />
                </a>
              </div>
            </div>
          </div>
        </section>
        <section
          id="expertise-in-action"
          className={`container ${styles.section}`}
          aria-labelledby="network-examples-title"
        >
          <header className={styles.heading}>
            <div>
              <SectionEyebrow>{sections('expertise-in-action.title')}</SectionEyebrow>
              <h2 id="network-examples-title">{t('examples.title')}</h2>
            </div>
            <p>{t('examples.description')}</p>
          </header>
          <div className={styles.examples}>
            {[0, 1, 2].map((i) => (
              <article key={i}>
                <p className={styles.index} aria-hidden="true">
                  0{i + 1}
                </p>
                <h3>{t(`examples.items.${i}.title`)}</h3>
                <p>{t(`examples.items.${i}.description`)}</p>
                {(
                  t.raw(`examples.items.${i}.labs`) as (typeof networkLaboratories)[number]['id'][]
                ).map((id) => (
                  <a key={id} href={pageHref('network', locale, laboratoryAnchor(id))}>
                    {t(`labs.${id}.title`)}
                    <NavigationIcon name="arrow" />
                  </a>
                ))}
              </article>
            ))}
          </div>
        </section>
        <div className="container">
          <PublishedPageContent pageId="network" locale={locale} />
        </div>
      </div>
    </div>
  )
}
