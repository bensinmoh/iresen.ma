import { createElement } from 'react'
import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { Page } from '@/payload-types'

function publicLink(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  if (/^(?:https?:|mailto:|tel:)/i.test(value)) return value
  if (value.startsWith('#') || (value.startsWith('/') && !value.startsWith('//'))) return value
  return undefined
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, childIndex, nodesToJSX }) =>
    createElement(
      ['h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tag) ? node.tag : 'h2',
      { id: `content-section-${childIndex}` },
      nodesToJSX({ nodes: node.children }),
    ),
  // Resolve file relationships through guarded public metadata before rendering them.
  // A depth-zero relationship alone never establishes public-file eligibility.
  upload: () => null,
  link: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const href = node.fields.linkType === 'internal' ? undefined : publicLink(node.fields.url)
    return href ? <a href={href}>{children}</a> : <span>{children}</span>
  },
  autolink: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const href = publicLink(node.fields.url)
    return href ? <a href={href}>{children}</a> : <span>{children}</span>
  },
})

export function PublishedBody({ body }: { body: Page['body'] }) {
  return body ? (
    <RichText className="published-rich-text" data={body} converters={converters} />
  ) : null
}
