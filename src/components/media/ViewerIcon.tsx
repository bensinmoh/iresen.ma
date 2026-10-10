export function ViewerIcon({ name }: { name: 'close' | 'previous' | 'next' }) {
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
        d={
          name === 'close'
            ? 'm6 6 12 12M18 6 6 18'
            : name === 'previous'
              ? 'm14 5-7 7 7 7'
              : 'm10 5 7 7-7 7'
        }
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
