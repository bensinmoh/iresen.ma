import { Heading } from '@/components/ui/Heading'
import type { ReactNode } from 'react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import type { PageId } from '@/lib/site'
import { pageSections } from '@/lib/page-sections'

// Editorial scaffolding only: no collection data or service controls are implied.
export async function PageSections({
  pageId,
  locale,
  contentBySection = {},
  excludeSections = [],
}: {
  pageId: PageId
  locale: Locale
  contentBySection?: Readonly<Record<string, ReactNode>>
  excludeSections?: readonly string[]
}) {
  const t = await getTranslations({ locale, namespace: `PageSections.${pageId}` })
  const navigation = await getTranslations({ locale, namespace: 'Navigation' })

  return (
    <>
      {pageId === 'institute' && (
        <nav aria-label={navigation('sections')} className="section-navigation">
          {['about', 'mission', 'key-figures'].map((id) => (
            <a key={id} href={`#${id}`}>
              {t(`${id}.title`)}
            </a>
          ))}
        </nav>
      )}
      <div className="page-sections">
        {pageSections[pageId]
          .filter((section) => !excludeSections.includes(section.id))
          .map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              className="empty-section"
            >
              {pageId === 'institute' && section.id === 'mission' ? (
                <Heading
                  as="h2"
                  size="section"
                  id={`${section.id}-heading`}
                  className="section-heading"
                >
                  <Image
                    src="/brand/apex-leaf.svg"
                    alt=""
                    aria-hidden="true"
                    width={1773}
                    height={2870}
                    unoptimized
                  />
                  <span>{t(`${section.id}.title`)}</span>
                </Heading>
              ) : (
                <Heading as="h2" size="section" id={`${section.id}-heading`}>
                  {t(`${section.id}.title`)}
                </Heading>
              )}
              <p>{t(`${section.id}.description`)}</p>
              {section.children?.map((child) => (
                <section
                  key={child.id}
                  id={child.id}
                  aria-labelledby={`${child.id}-heading`}
                  className="placeholder-subsection"
                >
                  <Heading as="h3" size="card" id={`${child.id}-heading`}>
                    {t(`${child.id}.title`)}
                  </Heading>
                  <p>{t(`${child.id}.description`)}</p>
                </section>
              ))}
              {contentBySection[section.id]}
            </section>
          ))}
      </div>
    </>
  )
}
