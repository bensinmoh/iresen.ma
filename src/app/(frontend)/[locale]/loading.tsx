import { getTranslations } from 'next-intl/server'

export default async function LocaleLoading() {
  const t = await getTranslations('States')
  return (
    <div className="container page-shell">
      <p role="status">{t('loading')}</p>
    </div>
  )
}
