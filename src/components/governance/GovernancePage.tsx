import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import {
  governanceBoard,
  governanceScientists,
  governanceDepartments,
  governanceBoardLogo,
  governanceBoardSites,
} from '@/lib/governance'
import { samirCutout } from '@/lib/samir-biography'
import { PageHero } from '@/components/hero/PageHero'
import { PublishedPageContent } from '@/components/content/PublishedPageContent'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import styles from './GovernancePage.module.css'

export async function GovernancePage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Governance' })
  const pages = await getTranslations({ locale, namespace: 'Pages' })
  const paragraphs = (key: string, count: number) =>
    Array.from({ length: count }, (_, i) => <p key={i}>{t(`${key}.${i}`)}</p>)
  return (
    <div data-governance-page className={styles.page}>
      <PageHero pageId="governance" locale={locale} />
      <div id="page-sections">
        <section
          id="bodies-responsibilities"
          className={`container ${styles.intro}`}
          aria-labelledby="governance-mission-title"
        >
          <p className={styles.eyebrow}>{t('title')}</p>
          <h2 id="governance-mission-title">{t('mission.title')}</h2>
          <p className={styles.lead}>{t('introduction')}</p>
          <div className={styles.missionCopy}>{paragraphs('mission.paragraphs', 3)}</div>
        </section>
        <nav className={`container ${styles.navigation}`} aria-label={t('navigation')}>
          <a href="#council-representatives">{t('tabs.councils')}</a>
          <a href="#leadership-organisation">{t('tabs.organisation')}</a>
          <a href="#department-responsibilities">{t('tabs.responsibilities')}</a>
        </nav>
        <section
          id="council-representatives"
          className={`container ${styles.councils}`}
          aria-labelledby="administration-title"
        >
          <header className={styles.heading}>
            <div>
              <p className={styles.eyebrow}>01</p>
              <h2 id="administration-title">{t('councils.administration.title')}</h2>
              <p className={styles.tagline}>{t('councils.administration.tagline')}</p>
            </div>
            <div className={styles.reading}>
              {paragraphs('councils.administration.paragraphs', 2)}
            </div>
          </header>
          <h3 className={styles.membersHeading}>{t('councils.administration.membersTitle')}</h3>
          <ul className={styles.board}>
            {governanceBoard.map((id) => (
              <li key={id}>
                <a className={styles.memberLink} href={governanceBoardSites[id]}>
                  <div className={styles.logoSlot}>
                    <Image
                      src={governanceBoardLogo(id)}
                      alt=""
                      width={240}
                      height={130}
                      unoptimized
                    />
                  </div>
                  <p>{t(`board.${id}`)}</p>
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section
          id="scientific-council"
          className={`${styles.science} ${styles.section}`}
          aria-labelledby="science-title"
        >
          <div className="container">
            <header className={styles.heading}>
              <div>
                <p className={styles.eyebrow}>02</p>
                <h2 id="science-title">{t('councils.science.title')}</h2>
                <p className={styles.tagline}>{t('councils.science.tagline')}</p>
              </div>
              <div className={styles.reading}>{paragraphs('councils.science.paragraphs', 3)}</div>
            </header>
            <h3 className={styles.membersHeading}>{t('councils.science.membersTitle')}</h3>
            <div className={styles.scientists}>
              {governanceScientists.map((id, i) => (
                <article
                  key={id}
                  id={`scientific-member-${id}`}
                  className={i === 0 ? styles.chair : undefined}
                >
                  <Image
                    src={`/images/governance/${id}.webp`}
                    alt={t('portrait', { name: t(`scientists.${id}.name`) })}
                    width={220}
                    height={220}
                    sizes="(max-width: 40rem) 112px, 160px"
                  />
                  <div>
                    {i === 0 && <p className={styles.badge}>{t('president')}</p>}
                    <h4>
                      <bdi>{t(`scientists.${id}.name`)}</bdi>
                    </h4>
                    <p>{t(`scientists.${id}.role`)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          id="governance-oversight"
          className={`container ${styles.oversight}`}
          aria-labelledby="oversight-title"
        >
          <h2 id="oversight-title">{t('oversight.title')}</h2>
          <div className={styles.committees}>
            {[0, 1, 2].map((i) => (
              <article key={i}>
                <span className={styles.number} aria-hidden="true">
                  0{i + 1}
                </span>
                <h3>{t(`oversight.items.${i}.title`)}</h3>
                <p>{t(`oversight.items.${i}.description`)}</p>
              </article>
            ))}
          </div>
        </section>
        <section
          id="leadership-organisation"
          className={`${styles.organisation} ${styles.section}`}
          aria-labelledby="organisation-title"
        >
          <div className="container">
            <header className={styles.heading}>
              <div>
                <p className={styles.eyebrow}>{t('tabs.organisation')}</p>
                <h2 id="organisation-title">{t('organisation.title')}</h2>
                <p className={styles.tagline}>{t('organisation.summary')}</p>
              </div>
              <p className={styles.reading}>{t('organisation.description')}</p>
            </header>
            <div className={styles.management}>
              <Image
                src={samirCutout}
                alt={t('portrait', { name: 'Samir RACHIDI' })}
                width={220}
                height={280}
                sizes="220px"
              />
              <div>
                <p className={styles.eyebrow}>{t('directorGeneral')}</p>
                <h3>
                  <bdi>Samir RACHIDI</bdi>
                </h3>
              </div>
            </div>
            <div className={styles.poles}>
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  <span aria-hidden="true" className={styles.connector} />
                  <h3>{t(`organisation.poles.${i}.title`)}</h3>
                  <p>{t(`organisation.poles.${i}.tagline`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="department-responsibilities"
          className={`container ${styles.departments}`}
          aria-labelledby="departments-title"
        >
          <h2 id="departments-title">{t('teamTitle')}</h2>
          <div className={styles.departmentGrid}>
            {governanceDepartments.map((departments, pole) => (
              <div key={pole} className={styles.departmentColumn}>
                <h3>{t(`organisation.poles.${pole}.title`)}</h3>
                {departments.map((person, i) => (
                  <article key={i} className={styles.department}>
                    {person && (
                      <>
                        <div className={styles.teamPhoto}>
                          <Image
                            src={`/images/governance/${person}-portrait.webp`}
                            alt={t('portrait', { name: t(`team.${person}.name`) })}
                            fill
                            sizes="(max-width: 48rem) 90vw, 30vw"
                          />
                        </div>
                        <div className={styles.person}>
                          <h4>
                            <bdi>{t(`team.${person}.name`)}</bdi>
                          </h4>
                          <p>{t(`team.${person}.role`)}</p>
                        </div>
                      </>
                    )}
                    <div className={styles.departmentCopy}>
                      <h4>{t(`organisation.poles.${pole}.directions.${i}.title`)}</h4>
                      <p>{t(`organisation.poles.${pole}.directions.${i}.description`)}</p>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </section>
        <section
          id="science-platforms"
          className={`${styles.contributions} ${styles.section}`}
          aria-labelledby="contributions-title"
        >
          <div className={`container ${styles.heading}`}>
            <h2 id="contributions-title">{t('contributions.title')}</h2>
            <div className={styles.reading}>{paragraphs('contributions.paragraphs', 3)}</div>
          </div>
        </section>
        <section
          id="documents-contact"
          className={`container ${styles.resources}`}
          aria-labelledby="resources-title"
        >
          <h2 id="resources-title">{t('resourcesTitle')}</h2>
          <div>
            {(['priorities', 'platforms', 'publications', 'contact'] as const).map((id) => (
              <a
                key={id}
                href={`${pageHref(id, locale)}${id === 'publications' ? '#institutional-reports' : ''}`}
              >
                <span>{pages(id)}</span>
                <NavigationIcon name="arrow" />
              </a>
            ))}
          </div>
        </section>
        <div className="container">
          <PublishedPageContent pageId="governance" locale={locale} />
        </div>
      </div>
    </div>
  )
}
