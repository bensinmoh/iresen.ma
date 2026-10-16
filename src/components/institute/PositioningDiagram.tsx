import Image from 'next/image'
import { Target } from '@phosphor-icons/react/dist/ssr/Target'
import { Atom } from '@phosphor-icons/react/dist/ssr/Atom'
import { Buildings } from '@phosphor-icons/react/dist/ssr/Buildings'
import { SiteIcon } from '@/components/ui/SiteIcon'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import styles from './PositioningDiagram.module.css'

/** Labels remain native text; the decorative geometry conveys the common interface. */
export async function PositioningDiagram({ locale }: { locale: Locale }) {
  const icons = { priorities: Target, science: Atom, needs: Buildings }
  const t = await getTranslations({ locale, namespace: 'Institute.editorial' })
  const narrative = await getTranslations({ locale, namespace: 'Narrative' })
  return (
    <figure
      className={styles.figure}
      aria-label={narrative('ecosystem.title')}
      data-positioning-diagram
    >
      <div className={styles.diagram}>
        <svg
          className={styles.geometry}
          data-structural-diagram="institute-positioning"
          viewBox="0 0 600 500"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <circle className={styles.priorities} cx="300" cy="175" r="158" />
          <circle className={styles.science} cx="202" cy="325" r="158" />
          <circle className={styles.needs} cx="398" cy="325" r="158" />
        </svg>
        <ul className={styles.labels}>
          {(['priorities', 'science', 'needs'] as const).map((id) => (
            <li className={styles[id]} key={id}>
              <SiteIcon icon={icons[id]} size={32} />
              <span>{t(`interface.${id}`)}</span>
            </li>
          ))}
        </ul>
        <div className={styles.hub}>
          <Image src="/brand/logo-white.svg" alt="IRESEN" width={696} height={195} />
        </div>
      </div>
    </figure>
  )
}
