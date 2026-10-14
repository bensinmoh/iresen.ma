import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import {
  governanceBoard,
  governanceScientists,
  governanceBoardLogo,
  governanceBoardSites,
  governanceScientistLinkedin,
} from '@/lib/governance'
import { PageHero } from '@/components/hero/PageHero'
import { PublishedPageContent } from '@/components/content/PublishedPageContent'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { FooterIcon } from '@/components/layout/FooterIcon'
import { GovernanceDiagram, OrganisationDiagram } from './GovernanceDiagrams'
import styles from './GovernancePage.module.css'

export async function GovernancePage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Governance' })
  const pages = await getTranslations({ locale, namespace: 'Pages' })
  const paragraphs = (key: string, count: number) =>
    Array.from({ length: count }, (_, i) => <p key={i}>{t(`${key}.${i}`)}</p>)
  return (
    <div data-governance-page className={styles.page}>
      {/* Small reversible channel corrections preserve source pixels and alpha. */}
      <svg
        width="0"
        height="0"
        className={styles.portraitTones}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id="governance-portrait-neutral" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="linear" slope="0.99" />
              <feFuncG type="linear" slope="1" />
              <feFuncB type="linear" slope="1.015" />
            </feComponentTransfer>
            <feColorMatrix type="saturate" values="0.96" />
          </filter>
          <filter id="governance-portrait-warm-source" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="linear" slope="0.975" />
              <feFuncG type="linear" slope="1" />
              <feFuncB type="linear" slope="1.025" />
            </feComponentTransfer>
            <feColorMatrix type="saturate" values="0.97" />
          </filter>
        </defs>
      </svg>
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
          <GovernanceDiagram locale={locale} />
        </section>
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
                  <a
                    href={governanceScientistLinkedin[id]}
                    className={styles.scientistLink}
                    aria-label={`${t('biography.linkedin')} — ${t(`scientists.${id}.name`)}`}
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
                        <span className={styles.profileHint} aria-hidden="true">
                          <FooterIcon name="linkedin" />
                        </span>
                      </h4>
                      <p>{t(`scientists.${id}.role`)}</p>
                    </div>
                  </a>
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
            <OrganisationDiagram locale={locale} />
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
