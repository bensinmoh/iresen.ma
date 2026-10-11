import type { RoadmapDomain } from '@/lib/roadmap'

// Tabler Icons v3.35.0, original outline geometry. MIT: ./Tabler-LICENSE.txt
// Source: https://github.com/tabler/tabler-icons/tree/v3.35.0/icons/outline
const artwork = {
  'solar-panel': (
    <>
      <path d="M4.28 14h15.44a1 1 0 0 0 .97 -1.243l-1.5 -6a1 1 0 0 0 -.97 -.757h-12.44a1 1 0 0 0 -.97 .757l-1.5 6a1 1 0 0 0 .97 1.243z" />
      <path d="M4 10h16" />
      <path d="M10 6l-1 8" />
      <path d="M14 6l1 8" />
      <path d="M12 14v4" />
      <path d="M7 18h10" />
    </>
  ),
  'battery-charging': (
    <>
      <path d="M16 7h1a2 2 0 0 1 2 2v.5a.5 .5 0 0 0 .5 .5a.5 .5 0 0 1 .5 .5v3a.5 .5 0 0 1 -.5 .5a.5 .5 0 0 0 -.5 .5v.5a2 2 0 0 1 -2 2h-2" />
      <path d="M8 7h-2a2 2 0 0 0 -2 2v6a2 2 0 0 0 2 2h1" />
      <path d="M12 8l-2 4h3l-2 4" />
    </>
  ),
  network: (
    <>
      <path d="M6 9a6 6 0 1 0 12 0a6 6 0 0 0 -12 0" />
      <path d="M12 3c1.333 .333 2 2.333 2 6s-.667 5.667 -2 6" />
      <path d="M12 3c-1.333 .333 -2 2.333 -2 6s.667 5.667 2 6" />
      <path d="M6 9h12" />
      <path d="M3 20h7" />
      <path d="M14 20h7" />
      <path d="M10 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
      <path d="M12 15v3" />
    </>
  ),
  plug: (
    <>
      <path d="M9.785 6l8.215 8.215l-2.054 2.054a5.81 5.81 0 1 1 -8.215 -8.215l2.054 -2.054z" />
      <path d="M4 20l3.5 -3.5" />
      <path d="M15 4l-3.5 3.5" />
      <path d="M20 9l-3.5 3.5" />
    </>
  ),
  bolt: (
    <>
      <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" />
    </>
  ),
  droplet: (
    <>
      <path d="M7.502 19.423c2.602 2.105 6.395 2.105 8.996 0c2.602 -2.105 3.262 -5.708 1.566 -8.546l-4.89 -7.26c-.42 -.625 -1.287 -.803 -1.936 -.397a1.376 1.376 0 0 0 -.41 .397l-4.893 7.26c-1.695 2.838 -1.035 6.441 1.567 8.546z" />
    </>
  ),
  truck: (
    <>
      <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" />
    </>
  ),
  'building-factory-2': (
    <>
      <path d="M3 21h18" />
      <path d="M5 21v-12l5 4v-4l5 4h4" />
      <path d="M19 21v-8l-1.436 -9.574a.5 .5 0 0 0 -.495 -.426h-1.145a.5 .5 0 0 0 -.494 .418l-1.43 8.582" />
      <path d="M9 17h1" />
      <path d="M14 17h1" />
    </>
  ),
  temperature: (
    <>
      <path d="M10 13.5a4 4 0 1 0 4 0v-8.5a2 2 0 0 0 -4 0v8.5" />
      <path d="M10 9l4 0" />
    </>
  ),
  'circuit-switch-open': (
    <>
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M6 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M18 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M7.5 10.5l7.5 -5.5" />
    </>
  ),
  'atom-2': (
    <>
      <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      <path d="M12 21l0 .01" />
      <path d="M3 9l0 .01" />
      <path d="M21 9l0 .01" />
      <path d="M8 20.1a9 9 0 0 1 -5 -7.1" />
      <path d="M16 20.1a9 9 0 0 0 5 -7.1" />
      <path d="M6.2 5a9 9 0 0 1 11.4 0" />
    </>
  ),
  'chart-line': (
    <>
      <path d="M4 19l16 0" />
      <path d="M4 15l4 -6l4 2l4 -5l4 4" />
    </>
  ),
  plant: (
    <>
      <path d="M7 15h10v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2v-4z" />
      <path d="M12 9a6 6 0 0 0 -6 -6h-3v2a6 6 0 0 0 6 6h3" />
      <path d="M12 11a6 6 0 0 1 6 -6h3v1a6 6 0 0 1 -6 6h-3" />
      <path d="M12 15l0 -6" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 21c.5 -4.5 2.5 -8 7 -10" />
      <path d="M9 18c6.218 0 10.5 -3.288 11 -12v-2h-4.014c-9 0 -11.986 4 -12 9c0 1 0 3 2 5h3z" />
    </>
  ),
  'plant-2': (
    <>
      <path d="M2 9a10 10 0 1 0 20 0" />
      <path d="M12 19a10 10 0 0 1 10 -10" />
      <path d="M2 9a10 10 0 0 1 10 10" />
      <path d="M12 4a9.7 9.7 0 0 1 2.99 7.5" />
      <path d="M9.01 11.5a9.7 9.7 0 0 1 2.99 -7.5" />
    </>
  ),
  flame: (
    <>
      <path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.621 -2.333 5.588c0 3.704 3.134 6.706 7 6.706s7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235" />
    </>
  ),
  recycle: (
    <>
      <path d="M12 17l-2 2l2 2" />
      <path d="M10 19h9a2 2 0 0 0 1.75 -2.75l-.55 -1" />
      <path d="M8.536 11l-.732 -2.732l-2.732 .732" />
      <path d="M7.804 8.268l-4.5 7.794a2 2 0 0 0 1.506 2.89l1.141 .024" />
      <path d="M15.464 11l2.732 .732l.732 -2.732" />
      <path d="M18.196 11.732l-4.5 -7.794a2 2 0 0 0 -3.256 -.14l-.591 .976" />
    </>
  ),
  home: (
    <>
      <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
      <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
    </>
  ),
  'air-conditioning': (
    <>
      <path d="M8 16a3 3 0 0 1 -3 3" />
      <path d="M16 16a3 3 0 0 0 3 3" />
      <path d="M12 16v4" />
      <path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
      <path d="M7 13v-3a1 1 0 0 1 1 -1h8a1 1 0 0 1 1 1v3" />
    </>
  ),
  'building-community': (
    <>
      <path d="M8 9l5 5v7h-5v-4m0 4h-5v-7l5 -5m1 1v-6a1 1 0 0 1 1 -1h10a1 1 0 0 1 1 1v17h-8" />
      <path d="M13 7l0 .01" />
      <path d="M17 7l0 .01" />
      <path d="M17 11l0 .01" />
      <path d="M17 15l0 .01" />
    </>
  ),
  'sun-high': (
    <>
      <path d="M14.828 14.828a4 4 0 1 0 -5.656 -5.656a4 4 0 0 0 5.656 5.656z" />
      <path d="M6.343 17.657l-1.414 1.414" />
      <path d="M6.343 6.343l-1.414 -1.414" />
      <path d="M17.657 6.343l1.414 -1.414" />
      <path d="M17.657 17.657l1.414 1.414" />
      <path d="M4 12h-2" />
      <path d="M12 4v-2" />
      <path d="M20 12h2" />
      <path d="M12 20v2" />
    </>
  ),
  bus: (
    <>
      <path d="M6 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M18 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M4 17h-2v-11a1 1 0 0 1 1 -1h14a5 7 0 0 1 5 7v5h-2m-4 0h-8" />
      <path d="M16 5l1.5 7l4.5 0" />
      <path d="M2 10l15 0" />
      <path d="M7 5l0 5" />
      <path d="M12 5l0 5" />
    </>
  ),
  'charging-pile': (
    <>
      <path d="M18 7l-1 1" />
      <path d="M14 11h1a2 2 0 0 1 2 2v3a1.5 1.5 0 0 0 3 0v-7l-3 -3" />
      <path d="M4 20v-14a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v14" />
      <path d="M9 11.5l-1.5 2.5h3l-1.5 2.5" />
      <path d="M3 20l12 0" />
      <path d="M4 8l10 0" />
    </>
  ),
  battery: (
    <>
      <path d="M6 7h11a2 2 0 0 1 2 2v.5a.5 .5 0 0 0 .5 .5a.5 .5 0 0 1 .5 .5v3a.5 .5 0 0 1 -.5 .5a.5 .5 0 0 0 -.5 .5v.5a2 2 0 0 1 -2 2h-11a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2" />
    </>
  ),
  route: (
    <>
      <path d="M3 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
      <path d="M19 7a2 2 0 1 0 0 -4a2 2 0 0 0 0 4z" />
      <path d="M11 19h5.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h4.5" />
    </>
  ),
} as const

const axes: Record<RoadmapDomain, readonly (keyof typeof artwork)[]> = {
  renewables: ['solar-panel', 'battery-charging', 'network', 'plug'],
  hydrogen: ['bolt', 'droplet', 'truck', 'building-factory-2'],
  industry: ['temperature', 'circuit-switch-open', 'atom-2', 'chart-line'],
  water: ['droplet', 'plant', 'refresh', 'solar-panel'],
  circular: ['leaf', 'plant-2', 'flame', 'recycle'],
  buildings: ['home', 'air-conditioning', 'building-community', 'sun-high'],
  mobility: ['bus', 'charging-pile', 'battery', 'route'],
}

export function RoadmapAxisIcon({
  theme,
  axis,
  className,
}: {
  theme: RoadmapDomain
  axis: number
  className?: string
}) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {artwork[axes[theme][axis]]}
    </svg>
  )
}
