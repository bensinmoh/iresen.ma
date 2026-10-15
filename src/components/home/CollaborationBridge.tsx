import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import styles from './CollaborationBridge.module.css'

export async function CollaborationBridge({ locale }: { locale: Locale }) {
  const t = await getTranslations({
    locale,
    namespace: 'PageSections.home.capabilities-cooperation',
  })
  return (
    <section
      id="capabilities-cooperation"
      aria-labelledby="capabilities-cooperation-heading"
      className={styles.section}
    >
      <h2 id="capabilities-cooperation-heading">{t('title')}</h2>
      <p>{t('description')}</p>
    </section>
  )
}
