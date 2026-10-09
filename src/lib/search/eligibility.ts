/** Shared by results and vocabulary: no stale/private/withdrawn/missing locale disclosures. */
export function publicSearchEligibility(alias: string, revisionParameter: string): string {
  // Alias and placeholder are developer constants, never request strings.
  return `(
    (${alias}.origin='static' AND ${alias}.source_revision=${revisionParameter}) OR
    EXISTS (SELECT 1 FROM search_public_sources s WHERE s.origin=${alias}.origin
      AND s.source_id=${alias}.source_id AND s.locale=${alias}.locale
      AND s.source_revision=${alias}.source_revision)
  )`
}
