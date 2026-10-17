import 'server-only'
import { WorkspaceError } from './auth'
export async function limitedBody(request: Request, max: number): Promise<Uint8Array> {
  const reader = request.body?.getReader()
  if (!reader) throw new WorkspaceError('Requête vide.')
  const chunks: Uint8Array[] = []
  let length = 0
  while (true) {
    const item = await reader.read()
    if (item.done) break
    length += item.value.byteLength
    if (length > max) {
      await reader.cancel()
      throw new WorkspaceError('Le document dépasse la taille autorisée.', 413)
    }
    chunks.push(item.value)
  }
  return new Uint8Array(Buffer.concat(chunks))
}
export function documentMime(name: string, bytes: Uint8Array): string {
  if (bytes.length < 8 || bytes.length > 5_000_000)
    throw new WorkspaceError('Pièce jointe invalide ou supérieure à 5 Mo.')
  const lower = name.toLowerCase()
  if (lower.endsWith('.pdf') && Buffer.from(bytes.subarray(0, 5)).toString() === '%PDF-')
    return 'application/pdf'
  if (
    lower.endsWith('.doc') &&
    [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1].every((byte, index) => bytes[index] === byte)
  )
    return 'application/msword'
  if (lower.endsWith('.docx')) {
    const buffer = Buffer.from(bytes)
    let end = -1
    for (let offset = buffer.length - 22; offset >= Math.max(0, buffer.length - 65557); offset--)
      if (buffer.readUInt32LE(offset) === 0x06054b50) {
        end = offset
        break
      }
    if (end >= 0) {
      let cursor = buffer.readUInt32LE(end + 16)
      const count = buffer.readUInt16LE(end + 10)
      const names = new Set<string>()
      if (count > 10000) throw new WorkspaceError('Archive documentaire invalide.')
      for (let i = 0; i < count; i++) {
        if (cursor + 46 > buffer.length || buffer.readUInt32LE(cursor) !== 0x02014b50)
          throw new WorkspaceError('Structure DOCX invalide.')
        const size = buffer.readUInt16LE(cursor + 28)
        const extra = buffer.readUInt16LE(cursor + 30)
        const comment = buffer.readUInt16LE(cursor + 32)
        if (cursor + 46 + size + extra + comment > buffer.length)
          throw new WorkspaceError('Structure DOCX invalide.')
        names.add(buffer.subarray(cursor + 46, cursor + 46 + size).toString('utf8'))
        cursor += 46 + size + extra + comment
      }
      if (
        names.has('[Content_Types].xml') &&
        names.has('word/document.xml') &&
        !Array.from(names).some((value) => /vbaProject\.bin$/i.test(value))
      )
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }
  }
  throw new WorkspaceError(
    'Le fichier doit être un PDF, DOC ou DOCX reconnu ; les documents à macros ne sont pas acceptés.',
  )
}

export function safeDocumentName(value: string, max = 240) {
  return Array.from(value)
    .map((character) =>
      character.charCodeAt(0) < 32 || character === '/' || character === '\\' ? '_' : character,
    )
    .join('')
    .slice(0, max)
}
