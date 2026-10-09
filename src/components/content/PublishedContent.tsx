import type {
  LinkFields,
  SerializedAutoLinkNode,
  SerializedLinkNode,
} from '@payloadcms/richtext-lexical'
import {
  RichText,
  type JSXConverter,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'
import { sanitizeUrl } from 'payload/shared'
import type { Locale } from '@/i18n/locales'
import { findPublishedLinkTargets } from '@/lib/content/queries'
import type { Page } from '@/payload-types'

type ContentBody = NonNullable<Page['body']>

function internalReference(
  doc: LinkFields['doc'],
): { collection: 'pages' | 'news'; id: number } | null {
  if (!doc || (doc.relationTo !== 'pages' && doc.relationTo !== 'news')) return null
  const id = typeof doc.value === 'object' ? doc.value.id : doc.value
  if (typeof id !== 'number' || !Number.isSafeInteger(id) || id <= 0) return null
  return { collection: doc.relationTo, id }
}

function collectInternalReferences(body: ContentBody) {
  const references: { pages: number[]; news: number[] } = { pages: [], news: [] }
  function visit(value: unknown) {
    if (!value || typeof value !== 'object') return
    const node = value as { type?: string; fields?: LinkFields; children?: unknown[] }
    if (node.type === 'link' && node.fields?.linkType === 'internal') {
      const reference = internalReference(node.fields.doc)
      if (reference) references[reference.collection].push(reference.id)
    }
    if (Array.isArray(node.children)) node.children.forEach(visit)
  }
  visit(body.root)
  return references
}

export async function PublishedRichText({ body, locale }: { body: ContentBody; locale: Locale }) {
  const targets = await findPublishedLinkTargets(collectInternalReferences(body), locale)
  const link: JSXConverter<SerializedLinkNode | SerializedAutoLinkNode> = ({
    node,
    nodesToJSX,
  }) => {
    const children = nodesToJSX({ nodes: node.children })
    const reference =
      node.fields.linkType === 'internal' ? internalReference(node.fields.doc) : null
    const href =
      node.fields.linkType === 'internal'
        ? reference && targets[`${reference.collection}:${reference.id}`]
        : sanitizeUrl(node.fields.url ?? '')
    // Keep readable text when the related translation is private/missing or the URL is unsafe.
    if (!href || href === '#') return <>{children}</>
    return (
      <a
        href={href}
        target={node.fields.newTab ? '_blank' : undefined}
        rel={node.fields.newTab ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    )
  }
  const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    link,
    autolink: link,
    heading: ({ node, nodesToJSX }) => {
      // The shared hero supplies the page's H1.
      const Heading = ['h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tag)
        ? (node.tag as 'h2' | 'h3' | 'h4' | 'h5' | 'h6')
        : 'h2'
      return <Heading>{nodesToJSX({ nodes: node.children })}</Heading>
    },
    // Depth-zero public queries deliberately do not populate uploads or related record data.
    upload: () => null,
    relationship: () => null,
    unknown: () => null,
  })
  return <RichText className="published-richtext" data={body} converters={converters} />
}

export function PublishedContent({
  title,
  summary,
  body,
  locale,
}: {
  title?: string | null
  summary?: string | null
  body?: Page['body']
  locale: Locale
}) {
  return (
    <div className="published-content">
      {title && <h2>{title}</h2>}
      {summary && <p className="published-summary">{summary}</p>}
      {body && <PublishedRichText body={body} locale={locale} />}
    </div>
  )
}
