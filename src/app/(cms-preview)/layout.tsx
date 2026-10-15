import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import localFont from 'next/font/local'
import '@/styles/tokens.css'
import '@/styles/selects.css'
import '@/components/cms-preview/cms-preview.css'

const latin = localFont({
  src: '../../fonts/plus-jakarta-sans/plus-jakarta-sans-latin-variable.woff2',
  variable: '--cms-latin',
  display: 'swap',
})
const arabic = localFont({
  src: '../../fonts/alexandria/alexandria-arabic-variable.woff2',
  variable: '--cms-arabic',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Atelier de contenu | IRESEN',
  description: 'Interface locale de validation du CMS IRESEN.',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${latin.variable} ${arabic.variable}`}>
      <body>{children}</body>
    </html>
  )
}
