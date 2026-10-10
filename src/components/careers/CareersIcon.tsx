// Lightweight vector drawings; decorative icons share the same outline geometry.
const artwork = {
  impact: (
    <>
      <circle cx="11" cy="13" r="8" />
      <path d="M15 16a5 5 0 1 1-7-7M11 13l7-7M18 2v4h4l-4 4h-4V6z" />
    </>
  ),
  equipment: (
    <>
      <path d="M2 13h4l3-8 6 15 3-8h4" />
    </>
  ),
  ecosystem: (
    <>
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="14" r="2" />
      <circle cx="19" cy="14" r="2" />
      <path d="M11 7l-5 5M13 7l5 5M3 21h18" />
    </>
  ),
  internship: (
    <>
      <path d="M21 3L3 10l7 4 4 7 7-18zM10 14l6-6" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V3m-4 4 4-4 4 4M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
    </>
  ),
} as const
export function CareersIcon({ name }: { name: keyof typeof artwork }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {artwork[name]}
    </svg>
  )
}
