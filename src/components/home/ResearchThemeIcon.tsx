import type { ResearchThemeId } from '@/lib/home-research'

const paths: Record<ResearchThemeId, string> = {
  renewables: 'M3 15h18l-2-9H5l-2 9Zm5-9-1 9m9-9 1 9M4 10h16M12 15v5m-4 0h8',
  hydrogen:
    'M9 3h6m-5 0v6L4 19a1.3 1.3 0 0 0 1 2h14a1.3 1.3 0 0 0 1-2L14 9V3M7 14h10m-7 3h.01M14 18h.01',
  industry: 'M3 21V10l6 3V9l6 3V5h5l1 16H3Zm4-4h1m4 0h1m4 0h1M16 5V2h3v3',
  water: 'M12 2C9 7 5 10 5 14a7 7 0 0 0 14 0c0-4-4-7-7-12Zm-3 12c0 2 1 3 3 3',
  circular:
    'M5 7a8 8 0 0 1 14 2m0-5v5h-5M19 17A8 8 0 0 1 5 15m0 5v-5h5M9 12c3-4 6-3 6-3s1 5-4 6m-2 1 4-4',
  buildings:
    'M3 21V9l6-5v17m0-14 6-4 6 4v14H3M6 12h.01M6 16h.01M13 9h.01M17 9h.01M13 13h.01M17 13h.01M13 21v-4h4v4',
  mobility:
    'M5 17H3v-5l3-6h11l3 6v5h-2M6 6l-1 6h15M8 17h7m-9 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0Zm9 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0Z',
}

export function ResearchThemeIcon({ theme }: { theme: ResearchThemeId }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={paths[theme]}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
