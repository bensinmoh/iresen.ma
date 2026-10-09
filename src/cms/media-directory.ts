import path from 'node:path'

/** Shared by guarded CMS delivery and indexing; launchers resolve this before cwd changes. */
export function mediaDirectory(): string {
  const configured = process.env.CMS_UPLOAD_DIRECTORY
  if (!configured) return path.resolve(process.cwd(), '.local/uploads')
  if (!path.isAbsolute(configured)) {
    throw new Error(
      'CMS_UPLOAD_DIRECTORY must be absolute. The project launcher resolves relative paths from the repository root.',
    )
  }
  return path.normalize(configured)
}
