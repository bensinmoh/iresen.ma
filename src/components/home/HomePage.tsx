import { getTranslations, getMessages } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { PageShell } from '@/components/layout/PageShell'
import { PageSections } from '@/components/content/PageSections'
import { PublishedPageContent } from '@/components/content/PublishedPageContent'
import { HomeSectionNavigation } from './HomeSectionNavigation'
import { ResearchSection } from './ResearchSection'
import type { ResearchCopy } from '@/lib/home-research'
import { MissionSection } from './MissionSection'
import { homeNavigation } from '@/lib/home-navigation'

export async function HomePage({ locale }: { locale: Locale }) {
  const pageTitle = await getTranslations({ locale, namespace: 'Pages' })
  const messages = await getMessages({ locale })

  return (
    <PageShell
      title={pageTitle('home')}
      locale={locale}
      pageId="home"
      home
      sectionNavigation={<HomeSectionNavigation {...homeNavigation[locale]} />}
    >
      <MissionSection locale={locale} />
      <ResearchSection locale={locale} copy={messages.HomeResearch as unknown as ResearchCopy} />
      <PublishedPageContent pageId="home" locale={locale} />
      <PageSections
        pageId="home"
        locale={locale}
        excludeSections={['develop-test-transfer', 'figures', 'research-priorities']}
      />
    </PageShell>
  )
}
