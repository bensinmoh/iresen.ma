import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import styles from './Narrative.module.css'

export async function EcosystemModel({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Narrative' })
  return (
    <figure className={styles.ecosystem} aria-labelledby="ecosystem-caption">
      <figcaption id="ecosystem-caption">{t('ecosystem.title')}</figcaption>
      <div className={styles.interface}>
        <ul>
          {(['priorities', 'science', 'needs'] as const).map((id) => (
            <li key={id}>{t(`ecosystem.${id}`)}</li>
          ))}
        </ul>
        <p className={styles.hub}>
          <strong>IRESEN</strong>
          <span>{t('ecosystem.role')}</span>
        </p>
      </div>
      <p>{t('ecosystem.partners')}</p>
      <p className={styles.relationship}>{t('ecosystem.note')}</p>
    </figure>
  )
}
