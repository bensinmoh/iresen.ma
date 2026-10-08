export function NavigationIcon({ name }: { name: 'search' | 'chevron' | 'arrow' }) {
  return (
    <svg
      className={`navigation-icon navigation-icon-${name}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {name === 'search' ? (
        <>
          <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.7" />
          <path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </>
      ) : (
        <path
          d={name === 'chevron' ? 'm6 9 6 6 6-6' : 'M5 12h14m-6-6 6 6-6 6'}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}
