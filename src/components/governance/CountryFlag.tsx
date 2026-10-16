/** Small decorative vector flags; the adjacent localized label carries the meaning. */
export function CountryFlag({ region }: { region: 'fr' | 'de' | 'eu' | 'ma' | 'br' }) {
  const star =
    '0,-1 0.2245,-0.309 0.9511,-0.309 0.3633,0.118 0.5878,0.809 0,0.382 -0.5878,0.809 -0.3633,0.118 -0.9511,-0.309 -0.2245,-0.309'
  return (
    <svg
      viewBox="0 0 30 20"
      width="30"
      height="20"
      aria-hidden="true"
      focusable="false"
      data-country-flag={region}
    >
      {region === 'fr' && (
        <>
          <path fill="#002654" d="M0 0h10v20H0z" />
          <path fill="#fff" d="M10 0h10v20H10z" />
          <path fill="#ed2939" d="M20 0h10v20H20z" />
        </>
      )}
      {region === 'de' && (
        <>
          <path fill="#000" d="M0 0h30v7H0z" />
          <path fill="#d00" d="M0 7h30v6H0z" />
          <path fill="#ffce00" d="M0 13h30v7H0z" />
        </>
      )}
      {region === 'eu' && (
        <>
          <path fill="#039" d="M0 0h30v20H0z" />
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * Math.PI) / 6
            return (
              <polygon
                key={i}
                points={star}
                fill="#fc0"
                transform={`translate(${15 + Math.sin(angle) * 6} ${10 - Math.cos(angle) * 6})`}
              />
            )
          })}
        </>
      )}
      {region === 'ma' && (
        <>
          <path fill="#c1272d" d="M0 0h30v20H0z" />
          <path
            d="M15 4.5l3.23 9.95-8.46-6.15h10.46l-8.46 6.15z"
            fill="none"
            stroke="#006233"
            strokeWidth="1.1"
            strokeLinejoin="miter"
          />
        </>
      )}
      {region === 'br' && (
        <>
          <path fill="#009739" d="M0 0h30v20H0z" />
          <path fill="#fedf00" d="M15 2L28 10 15 18 2 10z" />
          <circle fill="#002776" cx="15" cy="10" r="5.4" />
          <path d="M10 8.7Q15 8.3 20 12" fill="none" stroke="#fff" strokeWidth="0.8" />
          <g fill="#fff">
            {[
              [12, 11],
              [14, 13],
              [16, 12],
              [18, 13],
              [13, 8],
              [15, 14],
              [17, 9],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="0.23" />
            ))}
          </g>
        </>
      )}
    </svg>
  )
}
