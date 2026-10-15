/** Native, reversible color correction: source photographs and scene content stay intact. */
export function PhotoToneDefinitions() {
  const grades = {
    neutral: { gains: [1.01, 1, 1.015], saturation: 0.92, gamma: 0.97 },
    warm: { gains: [0.99, 1.01, 1.045], saturation: 0.9, gamma: 0.94 },
    aerial: { gains: [1.035, 0.99, 1.015], saturation: 0.82, gamma: 0.92 },
    blue: { gains: [1.1, 1.015, 0.86], saturation: 0.82, gamma: 0.97 },
    visualization: { gains: [1.04, 1, 0.97], saturation: 0.87, gamma: 1 },
  }
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <defs>
        {Object.entries(grades).map(
          ([
            id,
            {
              gains: [r, g, b],
              saturation,
              gamma,
            },
          ]) => (
            <filter key={id} id={`platform-tone-${id}`} colorInterpolationFilters="sRGB">
              <feColorMatrix
                type="matrix"
                values={`${r} 0 0 0 0  0 ${g} 0 0 0  0 0 ${b} 0 0  0 0 0 1 0`}
              />
              <feColorMatrix type="saturate" values={String(saturation)} />
              <feComponentTransfer>
                <feFuncR type="gamma" amplitude="1" exponent={gamma} offset="0" />
                <feFuncG type="gamma" amplitude="1" exponent={gamma} offset="0" />
                <feFuncB type="gamma" amplitude="1" exponent={gamma} offset="0" />
              </feComponentTransfer>
            </filter>
          ),
        )}
      </defs>
    </svg>
  )
}
