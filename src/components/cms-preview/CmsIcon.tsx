const paths = {
  dashboard: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  document: 'M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6',
  calendar: 'M4 5h16v16H4zM8 3v4M16 3v4M4 10h16M8 14h2M14 14h2',
  media: 'M3 4h18v16H3zM3 17l6-6 4 4 3-3 5 5M15 8h.01',
  research: 'M9 3h6M10 3v7L5 19q-1 2 2 2h10q3 0 2-2l-5-9V3M8 15h8',
  network: 'M9 3h6v6H9zM3 15h6v6H3zM15 15h6v6h-6zM12 9v3M6 15v-3h12v3',
  users:
    'M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M2 21v-2a7 7 0 0 1 14 0v2M17 4a4 4 0 0 1 0 8M19 15q3 1 3 5',
  settings: 'M4 6h16M4 12h16M4 18h16M8 3v6M16 9v6M10 15v6',
  search: 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16m6-2 6 6',
  plus: 'M12 5v14M5 12h14',
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  back: 'M19 12H5m5-5-5 5 5 5',
  close: 'm6 6 12 12M18 6 6 18',
  check: 'm5 12 4 4L19 6',
  globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M3 12h18M12 3q-7 9 0 18M12 3q7 9 0 18',
  menu: 'M4 6h16M4 12h16M4 18h16',
  chevron: 'm9 5 7 7-7 7',
  upload: 'M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6',
  clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M12 7v5l3 2',
  shield: 'm12 3 8 3v6q0 6-8 9-8-3-8-9V6zM8 12l3 3 5-5',
  link: 'm10 14 4-4M8 16l-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0M16 8l2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0',
} as const
export type IconName = keyof typeof paths
export function CmsIcon({ name }: { name: IconName }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={paths[name]}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
