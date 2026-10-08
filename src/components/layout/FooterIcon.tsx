type FooterIconName = 'location' | 'phone' | 'email' | 'linkedin' | 'youtube'

const linePaths = {
  location: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  phone: 'M20 21a18 18 0 0 1-17-17l4-1 3 5-3 2a13 13 0 0 0 7 7l2-3 5 3-1 4Z',
  email: 'M3 5h18v14H3V5Zm0 1 9 7 9-7',
} as const

export function FooterIcon({ name }: { name: FooterIconName }) {
  const linePath = name in linePaths ? linePaths[name as keyof typeof linePaths] : undefined

  return (
    <svg
      className="footer-icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {linePath ? (
        <path
          d={linePath}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : name === 'linkedin' ? (
        <path
          fill="currentColor"
          d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5V9h3v10ZM6.5 7.7a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4ZM19 19h-3v-5.2c0-1.4-.5-2-1.5-2-1.1 0-1.5.8-1.5 2V19h-3V9h2.9v1.4A3.4 3.4 0 0 1 16 8.8c2.1 0 3 1.4 3 4V19Z"
        />
      ) : (
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M21.6 5.2C22.8 6.4 23 9 23 12s-.2 5.6-1.4 6.8C20.4 20 16.7 20 12 20s-8.4 0-9.6-1.2C1.2 17.6 1 15 1 12s.2-5.6 1.4-6.8C3.6 4 7.3 4 12 4s8.4 0 9.6 1.2ZM10 8v8l6-4-6-4Z"
          clipRule="evenodd"
        />
      )}
    </svg>
  )
}
