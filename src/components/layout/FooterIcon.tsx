import { EnvelopeSimple } from '@phosphor-icons/react/dist/ssr/EnvelopeSimple'
import { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin'
import { Phone } from '@phosphor-icons/react/dist/ssr/Phone'
import { SiteIcon } from '@/components/ui/SiteIcon'
type FooterIconName = 'location' | 'phone' | 'email' | 'linkedin' | 'youtube'
const icons = { location: MapPin, phone: Phone, email: EnvelopeSimple }
export function FooterIcon({ name }: { name: FooterIconName }) {
  if (name !== 'linkedin' && name !== 'youtube')
    return <SiteIcon icon={icons[name]} className="footer-icon" />
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
      {name === 'linkedin' ? (
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
