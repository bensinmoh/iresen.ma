import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores([
    '.next/**',
    '.cache/**',
    '.local/**',
    'node_modules/**',
    'src/payload-types.ts',
    'src/cms/migrations/**',
    'src/app/(payload)/admin/importMap.js',
    'next-env.d.ts',
    'playwright-report/**',
    'test-results/**',
    // Pinned third-party skill payloads are checked by source hashes, not application lint rules.
    '.agents/skills/design-taste-frontend/**',
    '.agents/skills/impeccable/**',
  ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  { ...reactHooks.configs.flat.recommended, files: ['src/**/*.{ts,tsx}'] },
])
