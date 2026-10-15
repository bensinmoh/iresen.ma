import { Heading } from '@/components/ui/Heading'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import {
  governanceBoard,
  governanceScientists,
  governanceBoardLogo,
  governanceBoardSites,
  governanceScientistLinkedin,
  governanceScientistRegions,
} from '@/lib/governance'
import { PageHero } from '@/components/hero/PageHero'
import { PublishedPageContent } from '@/components/content/PublishedPageContent'
import { FooterIcon } from '@/components/layout/FooterIcon'
import { GovernanceDiagram, OrganisationDiagram } from './GovernanceDiagrams'
import { CountryFlag } from './CountryFlag'
import { ScientificNetwork } from './ScientificNetwork'
import { AdaptiveOrganisationText } from './AdaptiveOrganisationText'
import styles from './GovernancePage.module.css'

export async function GovernancePage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Governance' })
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
          <SectionEyebrow>{t('title')}</SectionEyebrow>
          <Heading as="h2" size="section" id="governance-mission-title">
            {t('mission.title')}
          </Heading>
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
              <Heading as="h2" size="section" id="administration-title">
                {t('councils.administration.title')}
              </Heading>
              <p className={styles.tagline}>{t('councils.administration.tagline')}</p>
            </div>
            <div className={styles.reading}>
              {paragraphs('councils.administration.paragraphs', 2)}
            </div>
          </header>
          <div className={styles.boardNetwork}>
            <svg
              className={styles.boardConnections}
              viewBox="0 0 1000 1000"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              {governanceBoard.map((id, index) => (
                <path
                  key={id}
                  d={`M${index < 8 ? 360 : 640} ${(index % 8) * 125 + 62.5} Q500 ${(index % 8) * 125 + 62.5} 500 500`}
                />
              ))}
            </svg>
            <div className={styles.boardCore}>
              <Image
                src="/brand/logo-primary.svg"
                alt="IRESEN"
                width={280}
                height={80}
                unoptimized
              />
            </div>
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
          </div>
        </section>
        <section
          id="scientific-council"
          className={`${styles.science} ${styles.section}`}
          aria-labelledby="science-title"
        >
          <div className="container">
            <header className={styles.heading}>
              <div>
                <Heading as="h2" size="section" id="science-title">
                  {t('councils.science.title')}
                </Heading>
                <p className={styles.tagline}>{t('councils.science.tagline')}</p>
              </div>
              <div className={styles.reading}>{paragraphs('councils.science.paragraphs', 3)}</div>
            </header>
            <ScientificNetwork>
              {governanceScientists.map((id, i) => (
                <article
                  key={id}
                  id={`scientific-member-${id}`}
                  className={i === 0 ? styles.chair : undefined}
                  data-scientist={id}
                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                >
                  <a
                    href={governanceScientistLinkedin[id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.scientistLink}
                    aria-label={`${t('biography.linkedin')} — ${t(`scientists.${id}.name`)} — ${t(`scientists.${id}.country`)}`}
                  >
                    <Image
                      src={`/images/governance/${id}.webp`}
                      alt={t('portrait', { name: t(`scientists.${id}.name`) })}
                      width={220}
                      height={220}
                      sizes="96px"
                    />
                    <div>
                      {i === 0 && <p className={styles.badge}>{t('president')}</p>}
                      <Heading as="h3" size="compact">
                        <bdi>{t(`scientists.${id}.name`)}</bdi>
                        <span className={styles.profileHint} aria-hidden="true">
                          <FooterIcon name="linkedin" />
                        </span>
                      </Heading>
                      <p className={styles.country}>
                        <CountryFlag region={governanceScientistRegions[id]} />
                        <span>{t(`scientists.${id}.country`)}</span>
                      </p>
                      <p className={styles.scientistRole}>{t(`scientists.${id}.role`)}</p>
                    </div>
                  </a>
                </article>
              ))}
            </ScientificNetwork>
          </div>
        </section>
        <section
          id="governance-oversight"
          className={`container ${styles.oversight}`}
          aria-labelledby="oversight-title"
        >
          <Heading as="h2" size="section" id="oversight-title">
            {t('oversight.title')}
          </Heading>
          <div className={styles.committees}>
            {[0, 1, 2].map((i) => (
              <article key={i}>
                <Heading as="h3" size="card">
                  {t(`oversight.items.${i}.title`)}
                </Heading>
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
                <SectionEyebrow>{t('tabs.organisation')}</SectionEyebrow>
                <Heading as="h2" size="section" id="organisation-title">
                  {t('organisation.title')}
                </Heading>
                <p className={styles.tagline}>{t('organisation.summary')}</p>
              </div>
              <AdaptiveOrganisationText
                paragraphs={[
                  t('organisation.description'),
                  t('organisation.descriptionResearch'),
                  t('organisation.descriptionDivisions'),
                ]}
              />
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
            <Heading as="h2" size="section" id="contributions-title">
              {t('contributions.title')}
            </Heading>
            <div className={styles.reading}>{paragraphs('contributions.paragraphs', 3)}</div>
          </div>
        </section>
        <span id="documents-contact" className={styles.legacyAnchor} aria-hidden="true" />
        <div className="container">
          <PublishedPageContent pageId="governance" locale={locale} />
        </div>
      </div>
    </div>
  )
}
