import { moduleContracts } from './contracts'
// Pure authoring contracts shared by the authenticated UI/server; no database client or public corpus imports.
export const languages = ['fr', 'en', 'ar'] as const
export type Language = (typeof languages)[number]
export type Status = 'draft' | 'review' | 'published'
export type Role = 'admin' | 'editor'
export const statusLabels: Record<Status, string> = {
  draft: 'Brouillon',
  review: 'En revue',
  published: 'Validé / publié',
}
export const roleLabels: Record<Role, string> = {
  admin: 'Administrateur',
  editor: 'Éditeur',
}
export type Field = {
  key: string
  label: string
  type?:
    | 'text'
    | 'textarea'
    | 'date'
    | 'url'
    | 'email'
    | 'number'
    | 'relation'
    | 'select'
    | 'boolean'
    | 'json'
  help?: string
  required?: boolean
  readOnly?: boolean
  localized?: boolean
  relationTo?: string
  imageUpload?: boolean
  many?: boolean
  options?: readonly string[]
  optionLabels?: Record<string, string>
  min?: number
  max?: number
  showFor?: readonly string[]
  relationKinds?: readonly string[]
}
export type Module = {
  id: string
  label: string
  group: string
  icon: 'document' | 'calendar' | 'media' | 'research' | 'network' | 'users' | 'settings'
  description: string
  fields: Field[]
  fixed?: boolean
  columns?: string[]
  storage?: string
}
const f = (key: string, label: string, type: Field['type'] = 'text', help?: string): Field => ({
  key,
  label,
  type,
  help,
})
const baseModules: Module[] = [
  {
    id: 'news',
    label: 'Actualités',
    group: 'Communication',
    icon: 'document',
    description: 'Rédiger, adapter les langues et préparer la publication.',
    fields: [
      f('source', 'Lien de la source', 'url'),
      f('theme', 'Thématique'),
      f('date', 'Date de référence', 'date'),
    ],
  },
  {
    id: 'events',
    label: 'Événements',
    group: 'Communication',
    icon: 'calendar',
    description: 'Préparer les événements et leurs informations pratiques.',
    fields: [
      f('start', 'Début', 'date'),
      f('end', 'Fin', 'date'),
      f('place', 'Lieu ou modalité'),
      f('eventStatus', 'État de préparation'),
      f('registration', 'Lien d’inscription', 'url'),
    ],
  },
  {
    id: 'media',
    label: 'Médiathèque',
    group: 'Communication',
    icon: 'media',
    description: 'Retrouver les fichiers, leurs droits et leurs usages.',
    fields: [
      f('alt', 'Texte alternatif'),
      f('credit', 'Crédit et source'),
      f('rights', 'Droits d’utilisation'),
      f('usage', 'Utilisé dans'),
      f('fileName', 'Nom du fichier'),
      f(
        'visibility',
        'Visibilité prévue',
        'text',
        'Un fichier local ne devient jamais un média du site.',
      ),
    ],
  },
  {
    id: 'publications',
    label: 'Publications',
    group: 'Recherche et innovation',
    icon: 'document',
    description: 'Préparer la gestion du corpus, sans importer les 1 199 références.',
    fields: [
      f('doi', 'DOI'),
      f('authors', 'Auteurs, dans l’ordre original', 'textarea'),
      f('year', 'Année sourcée', 'number'),
      f('theme', 'Thématique'),
      f('quartile', 'Quartile SJR 2025'),
      f('provenance', 'Provenance et réserves', 'textarea'),
    ],
  },
  {
    id: 'patents',
    label: 'Brevets',
    group: 'Recherche et innovation',
    icon: 'research',
    description: 'Organiser les références de dépôt et les résumés.',
    fields: [
      f('reference', 'Référence de dépôt'),
      f('applicants', 'Déposants'),
      f('year', 'Année sourcée', 'number'),
      f('theme', 'Thématique'),
      f('registry', 'Lien du registre', 'url'),
      f('provenance', 'Provenance', 'textarea'),
    ],
  },
  {
    id: 'projects',
    label: 'Projets',
    group: 'Recherche et innovation',
    icon: 'research',
    description: 'Concevoir la gestion de projets vérifiés ; les démonstrations restent isolées.',
    fields: [
      f('reference', 'Acronyme / référence'),
      f('theme', 'Thématique'),
      f('programme', 'Programme'),
      f('start', 'Début', 'date'),
      f('end', 'Fin', 'date'),
      f('platform', 'Plateforme d’accueil'),
      f('contact', 'Contact', 'email'),
      f('consortium', 'Consortium', 'textarea'),
      f('objectives', 'Objectifs scientifiques', 'textarea'),
    ],
  },
  {
    id: 'calls',
    label: 'Appels à projets',
    group: 'Recherche et innovation',
    icon: 'document',
    description: 'Préparer les conditions, échéances et destinations de candidature.',
    fields: [
      f('reference', 'Référence'),
      f('start', 'Ouverture', 'date'),
      f('end', 'Clôture', 'date'),
      f('eligibility', 'Éligibilité', 'textarea'),
      f('funders', 'Financeurs'),
      f('application', 'Formulaire externe', 'url'),
      f('conditions', 'Document des conditions'),
    ],
  },
  {
    id: 'careers',
    label: 'Carrières',
    group: 'Communication',
    icon: 'users',
    description:
      'Gérer les offres, dossiers de candidature, stages, candidatures spontanées, shortlists et entretiens dans cet atelier local.',
    fields: [
      f('type', 'Type d’opportunité'),
      f('place', 'Lieu'),
      f('end', 'Échéance', 'date'),
      f('criteria', 'Critères', 'textarea'),
      f('contact', 'Contact', 'email'),
    ],
  },
  {
    id: 'laboratories',
    label: 'Laboratoires',
    group: 'Institut et réseau',
    icon: 'network',
    description: 'Préparer les fiches et les relations ville / laboratoire.',
    fields: [
      f('institution', 'Institution'),
      f('city', 'Ville'),
      f('theme', 'Thématiques'),
      f('specialties', 'Spécialités', 'textarea'),
      f('contact', 'Contact scientifique fourni'),
    ],
  },
  {
    id: 'platforms',
    label: 'Plateformes',
    group: 'Institut et réseau',
    icon: 'research',
    description: 'Décrire les plateformes, infrastructures et leur maturité.',
    fields: [
      f('maturity', 'Maturité / disponibilité'),
      f('infrastructure', 'Infrastructures', 'textarea'),
      f('destination', 'Destination officielle', 'url'),
    ],
  },
  {
    id: 'organigram',
    label: 'Organigramme',
    group: 'Institut et réseau',
    icon: 'users',
    description:
      'Gérer les pôles, directions, fonctions, personnes, portraits et biographies dans une hiérarchie commune.',
    fields: [],
  },
  {
    id: 'board',
    label: 'Conseil d’administration',
    group: 'Institut et réseau',
    icon: 'network',
    description:
      'Gérer les sièges, institutions représentées, représentants et mandats du conseil d’administration.',
    fields: [],
  },
  {
    id: 'scientific-council',
    label: 'Conseil scientifique',
    group: 'Institut et réseau',
    icon: 'research',
    description:
      'Gérer les membres, affiliations, expertises, biographies et mandats du conseil scientifique.',
    fields: [],
  },
  {
    id: 'pages',
    label: 'Contenu des pages',
    group: 'Contenu du site',
    icon: 'document',
    description: 'Choisir une page existante, puis une section. La structure reste fixe.',
    fields: [
      f('mediaId', 'Illustration (médiathèque locale)'),
      f('caption', 'Légende'),
      f('destinationId', 'Destination interne existante'),
      f('documentId', 'Document associé (médiathèque locale)'),
    ],
    fixed: true,
  },
  {
    id: 'figures',
    label: 'Chiffres clés',
    group: 'Contenu du site',
    icon: 'settings',
    description: 'Distinguer chiffres éditoriaux, calculs et mesures datées.',
    fields: [
      f('value', 'Valeur éditoriale'),
      f('unit', 'Unité'),
      f('source', 'Source'),
      f('period', 'Période de référence'),
      f('owner', 'Responsable'),
      f('justification', 'Justification', 'textarea'),
      f('usage', 'Emplacements concernés'),
    ],
    fixed: true,
  },
  {
    id: 'coordinates',
    label: 'Coordonnées',
    group: 'Contenu du site',
    icon: 'settings',
    description: 'Préparer les coordonnées partagées et leurs emplacements.',
    fields: [
      f('email', 'Courriel', 'email'),
      f('phone', 'Téléphone'),
      f('address', 'Adresse', 'textarea'),
      f('usage', 'Emplacements'),
    ],
  },
  {
    id: 'themes',
    label: 'Thématiques',
    group: 'Référentiels',
    icon: 'research',
    description: 'Définir les thèmes et leurs descriptions localisées.',
    fields: [f('scope', 'Périmètre'), f('related', 'Concepts associés')],
  },
  {
    id: 'glossary',
    label: 'Glossaire et recherche',
    group: 'Référentiels',
    icon: 'document',
    description: 'Tester termes, acronymes et relations avant leur activation.',
    fields: [
      f('acronym', 'Acronyme développé'),
      f('synonyms', 'Équivalents / synonymes'),
      f(
        'related',
        'Concepts proches',
        'text',
        'Une relation thématique n’est pas une équivalence.',
      ),
      f('source', 'Source terminologique'),
    ],
  },
  {
    id: 'faq',
    label: 'FAQ',
    group: 'Contenu du site',
    icon: 'document',
    description:
      'Gérer les questions, réponses, catégories et emplacements de la FAQ en FR, EN et AR.',
    fields: [],
  },
  {
    id: 'users',
    label: 'Utilisateurs et droits',
    group: 'Administration',
    icon: 'users',
    description: 'Examiner les profils et leurs périmètres ; aucun compte réel n’est créé.',
    fields: [
      f('role', 'Profil prévu'),
      f('scope', 'Modules attribués'),
      f('languages', 'Langues attribuées'),
    ],
  },
]
export const modules: Module[] = baseModules.map((module) => ({
  ...module,
  ...moduleContracts[module.id],
  storage:
    module.id === 'users'
      ? 'users (comptes Payload authentifiés)'
      : `cms_authoring_entries · module=${module.id} · shared / variants JSONB ; adaptateur natif quand disponible`,
  fields: [
    ...(moduleContracts[module.id]?.fields ?? module.fields),
    {
      key: 'sourceRecord',
      label: 'Données originales de la source',
      type: 'json' as const,
      readOnly: true,
    },
  ],
}))
export const utilityModules = [
  { id: 'trash', label: 'Corbeille', icon: 'document' },
  { id: 'analytics', label: 'Analytics', icon: 'dashboard' },
  { id: 'data-model', label: 'Structure des données', icon: 'research' },
  { id: 'integrations', label: 'Intégrations', icon: 'link' },
  { id: 'imports', label: 'Imports', icon: 'upload' },
  { id: 'logs', label: 'Journaux', icon: 'clock' },
  { id: 'backups', label: 'Sauvegardes', icon: 'shield' },
] as const
export type Variant = {
  title: string
  body: string
  status: Status
  seoTitle: string
  seoDescription: string
  fields: Record<string, string>
}
export type Revision = {
  id: string
  at: string
  language: Language
  variant: Variant
  note: string
  shared?: Record<string, string>
}
export type Entry = {
  source?: {
    collection: 'news' | 'projects' | 'calls' | 'opportunities' | 'pages' | 'media'
    id: number
    revision: string
  }
  id: string
  module: string
  reference: string
  shared: Record<string, string>
  variants: Record<Language, Variant>
  updatedAt: string
  history: Revision[]
  comment: string
  publicVariants: Partial<Record<Language, Variant>>
}
export type Log = {
  id: string
  at: string
  action: string
  resource: string
  language?: Language
  actor: Role
  kind: 'audit' | 'technical'
}
export type Workspace = { version: 1; entries: Entry[]; logs: Log[] }
export type PageRegistry = {
  id: string
  title: string
  href: string
  sections: { id: string; title: string }[]
}
export const emptyVariant = (): Variant => ({
  title: '',
  body: '',
  status: 'draft',
  seoTitle: '',
  seoDescription: '',
  fields: {},
})
export function createEntry(module: string, id: string, at: string): Entry {
  return {
    id,
    module,
    reference: id,
    shared: module === 'organigram' ? { recordType: 'person' } : {},
    variants: { fr: emptyVariant(), en: emptyVariant(), ar: emptyVariant() },
    updatedAt: at,
    history: [],
    comment: '',
    publicVariants: {},
  }
}
export function initialWorkspace(): Workspace {
  return { version: 1, entries: [], logs: [] }
}
export function canEdit(role: Role, module: string): boolean {
  if (!['admin', 'editor'].includes(role)) return false
  if (module === 'users') return role === 'admin'
  return true
}
export function canTransition(role: Role, from: Status, to: Status): boolean {
  if (!['admin', 'editor'].includes(role)) return false
  if (to === 'draft') return from !== 'review' || role === 'admin'
  if (to === 'review') return from === 'draft' || (role === 'admin' && from === 'published')
  return role === 'admin' && from === 'review' && to === 'published'
}
export function fieldApplies(entry: Entry, field: Field): boolean {
  if (
    entry.module === 'media' &&
    entry.shared.resourceKind === 'links' &&
    !['resourceKind', 'sourceUrl', 'usage', 'visibility', 'sourceRecord'].includes(field.key)
  )
    return false
  return !field.showFor || field.showFor.includes(entry.shared.recordType ?? 'person')
}
export function relationCandidate(entry: Entry, field: Field, candidate: Entry): boolean {
  return (
    candidate.id !== entry.id &&
    candidate.module === field.relationTo &&
    (!field.relationKinds || field.relationKinds.includes(candidate.shared.recordType ?? 'person'))
  )
}
export function hierarchyErrors(entry: Entry, entries: Entry[]): string[] {
  if (entry.module !== 'organigram') return []
  const seen = new Set([entry.id])
  let parent: string | undefined = entry.shared.parentId
  while (parent) {
    if (seen.has(parent)) return ['Le rattachement crée une boucle dans l’organigramme.']
    seen.add(parent)
    parent = entries.find((candidate) => candidate.id === parent)?.shared.parentId
  }
  return []
}
export function migrateGovernance(workspace: Workspace): Workspace {
  const previousOrganisations = workspace.entries.filter(
    (entry) => entry.module === 'organisations',
  )
  for (const entry of workspace.entries) {
    if (entry.module === 'people') {
      entry.module = 'organigram'
      entry.shared.recordType = 'person'
    }
    for (const key of ['affiliation', 'institution', 'organisers', 'funders']) {
      const raw = entry.shared[key]
      if (raw)
        entry.shared[key] = raw
          .split('\n')
          .map(
            (id) => previousOrganisations.find((item) => item.id === id)?.variants.fr.title || id,
          )
          .join('\n')
    }
  }
  // Withdrawn module entries remain only in full-session exports; never relabel them as councils/calls.
  return workspace
}
export function fieldValue(entry: Entry, field: Field, language: Language): string {
  return (
    (field.localized ? entry.variants[language].fields?.[field.key] : entry.shared[field.key]) ?? ''
  )
}
export function editorialBodyRequired(module: string): boolean {
  return ![
    'publications',
    'board',
    'scientific-council',
    'laboratories',
    'themes',
    'coordinates',
  ].includes(module)
}
export function editorialTextComplete(entry: Entry, language: Language): boolean {
  return Boolean(
    entry.variants[language].title.trim() &&
    (!editorialBodyRequired(entry.module) || entry.variants[language].body.trim()),
  )
}
export function validateEntry(entry: Entry, language: Language, strict = false): string[] {
  const variant = entry.variants[language]
  const errors: string[] = []
  if (!variant.title.trim()) errors.push('Le titre est requis.')
  if (
    strict &&
    entry.module === 'media' &&
    entry.shared.resourceKind === 'links' &&
    !entry.shared.sourceUrl?.trim()
  )
    errors.push('Adresse du lien : champ requis avant revue.')
  if (strict && !variant.body.trim() && editorialBodyRequired(entry.module))
    errors.push('Le texte est requis pour soumettre cette langue.')
  for (const field of modules.find((m) => m.id === entry.module)?.fields ?? []) {
    if (!fieldApplies(entry, field)) continue
    const value = fieldValue(entry, field, language).trim()
    if (!value) {
      if (
        strict &&
        field.required &&
        !(field.key === 'publishedAt' && entry.shared.publicationMonth) &&
        !(['start', 'end'].includes(field.key) && entry.shared.archivePeriod)
      )
        errors.push(`${field.label} : champ requis avant revue.`)
      continue
    }
    if (field.type === 'select' && !field.options?.includes(value))
      errors.push(`${field.label} : choisir une valeur proposée.`)
    if (field.type === 'boolean' && !['true', 'false'].includes(value))
      errors.push(`${field.label} : choisir oui ou non.`)
    if (field.type === 'json') {
      try {
        JSON.parse(value)
      } catch {
        errors.push(`${field.label} : JSON invalide.`)
      }
    }
    if (
      field.type === 'date' &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        Number.isNaN(Date.parse(value)) ||
        new Date(value).toISOString().slice(0, 10) !== value)
    )
      errors.push(`${field.label} : date invalide.`)
    if (
      field.type === 'number' &&
      ((field.min !== undefined && Number(value) < field.min) ||
        (field.max !== undefined && Number(value) > field.max))
    )
      errors.push(`${field.label} : valeur hors limites.`)
    if (field.type === 'url') {
      try {
        if (!['https:', 'http:'].includes(new URL(value).protocol)) throw new Error()
      } catch {
        errors.push(`${field.label} : saisir une URL http ou https complète.`)
      }
    }
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      errors.push(`${field.label} : vérifier l’adresse.`)
    if (field.type === 'number' && !Number.isFinite(Number(value)))
      errors.push(`${field.label} : saisir un nombre.`)
  }
  if (
    entry.shared.mandateStart &&
    entry.shared.mandateEnd &&
    entry.shared.mandateEnd < entry.shared.mandateStart
  )
    errors.push('La fin du mandat doit suivre son début.')
  if (entry.shared.start && entry.shared.end && entry.shared.end < entry.shared.start)
    errors.push('La date de fin doit suivre la date de début.')
  return errors
}
export function saveEntry(
  workspace: Workspace,
  entry: Entry,
  language: Language,
  role: Role,
  at: string,
  nextStatus?: Status,
): Workspace {
  if (!modules.some((module) => module.id === entry.module)) throw new Error('Module inconnu.')
  if (
    workspace.entries.some(
      (candidate) =>
        candidate.id !== entry.id &&
        candidate.module === entry.module &&
        candidate.reference === entry.reference,
    )
  )
    throw new Error('Cette référence existe déjà dans ce module.')
  if (!canEdit(role, entry.module)) throw new Error('Ce profil ne peut pas modifier ce module.')
  const existing = workspace.entries.find((e) => e.id === entry.id)
  const from = existing?.variants[language].status ?? 'draft'
  if (from === 'review' && !nextStatus)
    throw new Error('Valider ou décliner cette révision avant de modifier le contenu.')
  if (from === 'review' && role === 'editor')
    throw new Error(
      'Cette révision est en revue : l’administrateur doit la valider ou la renvoyer.',
    )
  if (nextStatus === 'draft' && from === 'review' && !entry.comment.trim())
    throw new Error('Indiquer le motif du retour en brouillon dans la note interne.')
  if (nextStatus && !canTransition(role, from, nextStatus))
    throw new Error('Cette étape n’est pas accessible pour ce profil.')
  for (const field of modules.find((module) => module.id === entry.module)?.fields ?? []) {
    if (
      fieldApplies(entry, field) &&
      field.type === 'relation' &&
      entry.shared[field.key]
        ?.split('\n')
        .filter(Boolean)
        .some(
          (id) =>
            !workspace.entries.some(
              (candidate) => candidate.id === id && relationCandidate(entry, field, candidate),
            ),
        )
    )
      throw new Error(`${field.label} : référence locale introuvable.`)
  }
  if (
    entry.module === 'organigram' &&
    workspace.entries.some(
      (candidate) =>
        candidate.id !== entry.id &&
        candidate.module === 'organigram' &&
        ((candidate.shared.parentId === entry.id && entry.shared.recordType === 'person') ||
          (fieldApplies(candidate, { key: 'headId', label: '', showFor: ['pole', 'department'] }) &&
            candidate.shared.headId === entry.id &&
            entry.shared.recordType !== 'person')),
    )
  )
    throw new Error(
      'Cette fiche est utilisée comme unité ou responsable : corriger les rattachements avant de changer son type.',
    )
  const hierarchy = hierarchyErrors(entry, workspace.entries)
  if (hierarchy.length) throw new Error(hierarchy.join(' '))
  const errors = validateEntry(entry, language, Boolean(nextStatus && nextStatus !== 'draft'))
  if (errors.length) throw new Error(errors.join(' '))
  const changed =
    existing &&
    JSON.stringify(existing.variants[language]) !== JSON.stringify(entry.variants[language])
  const sharedChanged = existing && JSON.stringify(existing.shared) !== JSON.stringify(entry.shared)
  const saved: Entry = structuredClone(entry)
  // Content edits invalidate editorial approval. Published snapshots stay separate.
  if (sharedChanged) for (const lang of languages) saved.variants[lang].status = 'draft'
  const effectiveFrom = changed || sharedChanged ? 'draft' : from
  if (nextStatus && !canTransition(role, effectiveFrom, nextStatus))
    throw new Error('Enregistrer les modifications puis soumettre à nouveau cette révision.')
  saved.variants[language].status = nextStatus ?? 'draft'
  saved.updatedAt = at
  saved.history = [
    {
      id: `${at}-${language}`,
      at,
      language,
      variant: { ...saved.variants[language] },
      note: saved.comment,
      shared: structuredClone(saved.shared),
    },
    ...(existing?.history ?? []),
  ].slice(0, 30)
  saved.publicVariants = structuredClone(existing?.publicVariants ?? {})
  if (nextStatus === 'published') saved.publicVariants[language] = { ...saved.variants[language] }
  const log: Log = {
    id: `${entry.id}-${at}`,
    at,
    action: nextStatus ? statusLabels[nextStatus] : 'Brouillon enregistré',
    resource: saved.variants[language].title,
    language,
    actor: role,
    kind: 'audit',
  }
  return {
    ...workspace,
    entries: [...workspace.entries.filter((e) => e.id !== entry.id), saved],
    logs: [log, ...workspace.logs].slice(0, 200),
  }
}
// A small CSV parser for the local import rehearsal; quoted delimiters/newlines are values.
export function parseCsv(text: string): string[][] {
  const delimiter = text.split(/\r?\n/, 1)[0].includes(';') ? ';' : ','
  const rows: string[][] = []
  let row: string[] = []
  let value = ''
  let quoted = false
  const source = text.replace(/^\uFEFF/, '')
  for (let i = 0; i < source.length; i++) {
    const char = source[i]
    if (char === '"') {
      if (quoted && source[i + 1] === '"') {
        value += '"'
        i++
      } else quoted = !quoted
    } else if (char === delimiter && !quoted) {
      row.push(value)
      value = ''
    } else if (char === '\n' && !quoted) {
      row.push(value.replace(/\r$/, ''))
      if (row.some(Boolean)) rows.push(row)
      row = []
      value = ''
    } else value += char
  }
  if (quoted) throw new Error('Guillemets non fermés dans le fichier CSV.')
  row.push(value.replace(/\r$/, ''))
  if (row.some(Boolean)) rows.push(row)
  return rows
}
export function safeCsvCell(value: string): string {
  return `"${(/^[\s]*[=+@-]/.test(value) ? `'${value}` : value).replaceAll('"', '""')}"`
}
