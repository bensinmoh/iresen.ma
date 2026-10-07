import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'
import { importMap } from '../importMap.js'

type Props = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = async ({ params, searchParams }: Props) => ({
  ...(await generatePageMetadata({ config, params, searchParams })),
  robots: { index: false, follow: false },
})

export default function CMSPage({ params, searchParams }: Props) {
  return RootPage({ config, params, searchParams, importMap })
}
