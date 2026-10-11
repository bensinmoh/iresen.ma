import type { Payload } from 'payload'
import type { User } from '../../src/payload-types'
export const callActor = { id: 0, role: 'admin', collection: 'users' } as User & {
  collection: 'users'
}
export const callTestDates = {
  openingAt: '2020-01-01T09:00:00Z',
  deadlineAt: '2099-02-01T17:00:00Z',
  evaluationStartsAt: '2099-03-01T09:00:00Z',
  evaluationEndsAt: '2099-03-31T17:00:00Z',
  resultsAt: '2099-04-01T09:00:00Z',
}
export const callTestCopy = (locale: 'fr' | 'en' | 'ar') => ({
  title: locale === 'ar' ? 'اختبار دعوة مشاريع للبحث' : 'CMS call test for research projects',
  description:
    locale === 'ar'
      ? 'سجل اختبار مؤقت للتحقق من عرض معلومات الدعوة.'
      : 'Temporary test record for call information and publication boundaries.',
  recipients:
    locale === 'ar' ? 'جامعات اختبار\nمقاولات اختبار' : 'Test universities\nTest companies',
  themes: locale === 'ar' ? 'الهيدروجين الأخضر\nتخزين الطاقة' : 'Green hydrogen\nEnergy storage',
  fundingPartners: locale === 'ar' ? 'شريك اختبار' : 'Test funding partner',
  submissionUrl: 'https://example.org/call-test-form',
})
export async function createCallTestPdf(payload: Payload, reference: string) {
  const pdf = textPdf('Temporary call terms for automated validation.')
  return payload.create({
    collection: 'media',
    locale: 'fr',
    user: callActor,
    overrideAccess: true,
    data: {
      title: 'Call terms test PDF',
      alt: 'Temporary test conditions',
      rights: 'Generated test-only file',
      publicationStatus: 'published',
      visibility: 'public',
      _status: 'published',
    },
    file: {
      name: `${reference}.pdf`,
      mimetype: 'application/pdf',
      size: pdf.length,
      data: pdf,
    },
  })
}

export function textPdf(text: string): Buffer {
  const content = `BT /F1 12 Tf 72 720 Td (${text}) Tj ET\n`
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}endstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  for (const [index, object] of objects.entries()) {
    offsets.push(Buffer.byteLength(pdf))
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  }
  const xref = Buffer.byteLength(pdf)
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (const offset of offsets.slice(1)) pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return Buffer.from(pdf)
}
