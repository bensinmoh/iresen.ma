import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { PageShell } from '@/components/layout/PageShell'
import { PublishedPageContent } from '@/components/content/PublishedPageContent'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { engagementContactHref } from '@/lib/engagement'
import { patents, patentThemes } from '@/lib/patents'
import { ValorisationIcon, type ValorisationIconName } from './ValorisationIcon'
import { PatentCatalog } from './PatentCatalog'
import styles from './TransferPage.module.css'

const processIcons: ValorisationIconName[] = [
  'search',
  'chart-line',
  'shield-lock',
  'flask',
  'arrows-exchange',
  'rocket',
]
const pathwayIcons: ValorisationIconName[] = [
  'file-certificate',
  'building-factory-2',
  'bulb',
  'rocket',
]
type Item = { title: string; description: string; action?: string }
export async function TransferPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Transfer' })
  const pages = await getTranslations({ locale, namespace: 'Pages' })
  const header = (key: 'process' | 'ip' | 'pathways' | 'catalog' | 'doors', id: string) => (
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>
          <Image src="/brand/apex-leaf.svg" alt="" width={1773} height={2870} unoptimized />
          {t(`${key}.label`)}
        </p>
        <h2 id={`${id}-heading`}>{t(`${key}.title`)}</h2>
      </div>
      <p>{t(`${key}.${key === 'doors' ? 'note' : 'description'}`)}</p>
    </header>
  )
  return (
    <PageShell title={pages('transfer')} locale={locale} pageId="transfer">
      <PublishedPageContent pageId="transfer" locale={locale} />
      <div className={styles.page} data-engagement-page="transfer">
        <section
          id="results-to-transfer"
          aria-labelledby="results-to-transfer-heading"
          className={styles.intro}
        >
          <div className={styles.introCopy}>
            <p className={styles.eyebrow}>{t('eyebrow')}</p>
            <h2 id="results-to-transfer-heading">{t('title')}</h2>
            <p>{t('intro')}</p>
            <div className={styles.actions}>
              <a className="button button-primary" href="#build-transfer">
                {t('innovationAction')}
                <NavigationIcon name="arrow" />
              </a>
              <a className={styles.link} href="#adoption-initiatives">
                {t('exploreAction')}
                <NavigationIcon name="arrow" />
              </a>
            </div>
          </div>
          <div className={styles.introPhoto}>
            <Image
              src="/images/missions/develop-cf05d9355bc5.webp"
              alt={t('photos.intro')}
              fill
              sizes="(max-width: 1023px) 100vw, 45vw"
            />
          </div>
        </section>
        <section
          id="research-to-use"
          aria-labelledby="research-to-use-heading"
          className={`${styles.section} ${styles.light}`}
        >
          {header('process', 'research-to-use')}
          <ol className={styles.process}>
            {(t.raw('process.steps') as string[]).map((step, index) => (
              <li key={step}>
                <div className={styles.stageVisual}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <ValorisationIcon name={processIcons[index]} />
                </div>
                <h3>{step}</h3>
              </li>
            ))}
          </ol>
          <p className={styles.note}>{t('process.note')}</p>
        </section>
        <section
          id="intellectual-property"
          aria-labelledby="intellectual-property-heading"
          className={styles.section}
        >
          <div className={styles.ipLayout}>
            <div className={styles.ipCopy}>
              {header('ip', 'intellectual-property')}
              <div className={styles.disclosures}>
                {(t.raw('ip.items') as Item[]).map((item) => (
                  <details key={item.title}>
                    <summary>
                      <span>{item.title}</span>
                      <span aria-hidden="true">+</span>
                    </summary>
                    <p>{item.description}</p>
                  </details>
                ))}
              </div>
            </div>
            <aside
              id="ismart-example"
              className={styles.ipExample}
              aria-labelledby="ismart-example-heading"
            >
              <h3 id="ismart-example-heading">{t('example.title')}</h3>
              <Image
                className={styles.productLogo}
                src="/brand/transfer/ismart-iresen.svg"
                alt={t('example.logoAlt')}
                width={1656.57}
                height={362.63}
                unoptimized
              />
              <p className={styles.productDescription}>{t('example.description')}</p>
              <p className={styles.productOrigin}>{t('example.origin')}</p>
              <a
                className={styles.productLink}
                href="https://www.i-smart.ma/"
                aria-label={t('example.visit')}
              >
                <Image
                  className={styles.productImage}
                  src="/images/transfer/ismart-product.webp"
                  alt={t('example.imageAlt')}
                  width={1200}
                  height={1312}
                  sizes="(max-width: 639px) 90vw, (max-width: 1023px) 384px, 30vw"
                  quality={90}
                />
              </a>
            </aside>
          </div>
        </section>
        <section
          id="transfer-pathways"
          aria-labelledby="transfer-pathways-heading"
          className={`${styles.section} ${styles.ink}`}
        >
          <div className={styles.pathwayPhoto} aria-hidden="true">
            <Image src="/images/missions/test-f25f80001b78.webp" alt="" fill sizes="100vw" />
          </div>
          {header('pathways', 'transfer-pathways')}
          <div className={styles.pathways}>
            {(t.raw('pathways.items') as Item[]).map((item, index) => (
              <article key={item.title}>
                <ValorisationIcon name={pathwayIcons[index]} className={styles.pathwayIcon} />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
        <section
          id="adoption-initiatives"
          aria-labelledby="adoption-initiatives-heading"
          className={`${styles.section} ${styles.light}`}
        >
          {header('catalog', 'adoption-initiatives')}
          <div
            id="valorisation-figures"
            className={styles.figures}
            aria-labelledby="valorisation-figures-heading"
          >
            <h3 id="valorisation-figures-heading">{t('figures.label')}</h3>
            <dl>
              <div>
                <dt>{t('figures.filed')}</dt>
                <dd>
                  <bdi>{patents.length}</bdi>
                </dd>
              </div>
              <div>
                <dt>{t('figures.themes')}</dt>
                <dd>
                  <bdi>{patentThemes.length}</bdi>
                </dd>
              </div>
              <div>
                <dt>{t('figures.date')}</dt>
                <dd>
                  <span className={styles.period}>{t('figures.period')}</span>
                </dd>
              </div>
            </dl>
            <p>{t('figures.note')}</p>
          </div>
          <PatentCatalog locale={locale} />
        </section>
        <section
          id="build-transfer"
          aria-labelledby="build-transfer-heading"
          data-kind="contact"
          className={styles.section}
        >
          {header('doors', 'build-transfer')}
          <div className={styles.doors}>
            {(t.raw('doors.items') as Item[]).map((item, index) => (
              <article key={item.title}>
                <div
                  className={`${styles.doorPhoto} ${index === 0 ? styles.innovationPhoto : styles.technologyPhoto}`}
                >
                  <Image
                    src={
                      index === 0
                        ? '/images/heroes/research-1dc2b1d2ea42.webp'
                        : '/images/missions/transfer-6934b2efdfe4.webp'
                    }
                    alt={t(index === 0 ? 'photos.innovation' : 'photos.technology')}
                    fill
                    sizes="(max-width: 639px) 150vw, 50vw"
                  />
                </div>
                <div className={styles.doorCopy}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a
                    className={index === 0 ? 'button button-primary' : styles.link}
                    href={index === 0 ? engagementContactHref(locale) : '#adoption-initiatives'}
                  >
                    {item.action}
                    <NavigationIcon name="arrow" />
                  </a>
                </div>
              </article>
            ))}
          </div>
          <a className={styles.link} href={engagementContactHref(locale)}>
            {t('doors.contact')}
            <NavigationIcon name="arrow" />
          </a>
        </section>
      </div>
    </PageShell>
  )
}
