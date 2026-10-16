import type { Locale } from '@/i18n/locales'
import { PatentSection } from './PatentSection'
import styles from './TransferPage.module.css'

export function PatentsPage({ locale }: { locale: Locale }) {
  return (
    <div className="container page-shell" id="page-sections" data-patents-page>
      <div className={styles.page}>
        <PatentSection locale={locale} standalone />
      </div>
    </div>
  )
}
