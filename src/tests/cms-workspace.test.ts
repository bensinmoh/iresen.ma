import { describe, expect, it, vi } from 'vitest'
vi.mock('@/lib/cms-workspace/auth', () => ({
  WorkspaceError: class extends Error {
    constructor(
      message: string,
      public status = 400,
    ) {
      super(message)
    }
  },
}))
import { documentMime, limitedBody, safeDocumentName } from '@/lib/cms-workspace/documents'

describe('private database document boundary', () => {
  it('validates bytes independently of the browser MIME declaration', () => {
    expect(documentMime('CV.PDF', new TextEncoder().encode('%PDF-1.7\n'))).toBe('application/pdf')
    expect(() =>
      documentMime('cv.pdf', new TextEncoder().encode('<html>pretend PDF</html>')),
    ).toThrow()
    expect(() => documentMime('cv.docx', new TextEncoder().encode('PK ordinary text'))).toThrow()
    expect(() => documentMime('cv.pdf', new Uint8Array(5_000_001))).toThrow()
  })
  it('bounds streamed request bodies even without a Content-Length header', async () => {
    const request = new Request('http://localhost/upload', { method: 'POST', body: '123456789' })
    await expect(limitedBody(request, 8)).rejects.toMatchObject({ status: 413 })
  })
  it('keeps file names out of path and response-header syntax', () => {
    expect(safeDocumentName('folder/cv\\name\r\n.pdf')).toBe('folder_cv_name__.pdf')
    expect(safeDocumentName('x'.repeat(300))).toHaveLength(240)
  })
})
