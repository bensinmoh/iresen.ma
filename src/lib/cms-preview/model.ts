// Browser-only review model. Never import CMS clients, domain databases or public projections here.
export const languages = ['fr', 'en', 'ar'] as const
export type Language = (typeof languages)[number]
export type Status = 'draft' | 'review' | 'validated' | 'published' | 'archived'
export type Role = 'admin' | 'editor' | 'publisher' | 'translator' | 'reader'
export const statusLabels: Record<Status, string> = {
  draft: 'Brouillon',
  review: 'En revue',
  validated: 'Validé',
  published: 'Publié localement',
  archived: 'Archivé',
}
export const roleLabels: Record<Role, string> = {
  admin: 'Administrateur',
  editor: 'Éditeur',
  publisher: 'Responsable de publication',
  translator: 'Traducteur',
  reader: 'Lecteur interne',
}
export type Field = {
  key: string
  label: string
  type?: 'text' | 'textarea' | 'date' | 'url' | 'email' | 'number'
  help?: string
  required?: boolean
}
export type Module = {
  id: string
  label: string
  group: string
  icon: 'document' | 'calendar' | 'media' | 'research' | 'network' | 'users' | 'settings'
  description: string
  fields: Field[]
  fixed?: boolean
}
const f = (key: string, label: string, type: Field['type'] = 'text', help?: string): Field => ({
  key,
  label,
  type,
  help,
})
export const modules: Module[] = [
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
    description: 'Aucune offre fictive n’est préchargée. Tester un brouillon local si nécessaire.',
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
    id: 'organisations',
    label: 'Organismes',
    group: 'Institut et réseau',
    icon: 'network',
    description: 'Gérer les organismes présents et leurs relations.',
    fields: [
      f('type', 'Type d’organisme'),
      f('website', 'Site officiel', 'url'),
      f('relationship', 'Relation avec IRESEN'),
      f('provenance', 'Source'),
    ],
  },
  {
    id: 'people',
    label: 'Personnes',
    group: 'Institut et réseau',
    icon: 'users',
    description: 'Préparer les fonctions, biographies et profils sourcés.',
    fields: [
      f('function', 'Fonction confirmée'),
      f('affiliation', 'Affiliation'),
      f('profile', 'Profil professionnel', 'url'),
      f('provenance', 'Source de la biographie'),
    ],
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
    id: 'programmes',
    label: 'Programmes',
    group: 'Référentiels',
    icon: 'document',
    description: 'Préparer les programmes et références communes.',
    fields: [
      f('reference', 'Identifiant métier'),
      f('scope', 'Périmètre'),
      f('source', 'Source', 'url'),
    ],
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
export const utilityModules = [
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
}
export type Revision = {
  id: string
  at: string
  language: Language
  variant: Variant
  note: string
}
export type Entry = {
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
})
export function createEntry(module: string, id: string, at: string): Entry {
  return {
    id,
    module,
    reference: id,
    shared: {},
    variants: { fr: emptyVariant(), en: emptyVariant(), ar: emptyVariant() },
    updatedAt: at,
    history: [],
    comment: '',
    publicVariants: {},
  }
}
export function initialWorkspace(): Workspace {
  const seeds = [
    ['news', 'Exemple — atelier de recherche', 'review'],
    ['news', 'Exemple — entretien scientifique', 'draft'],
    ['news', 'Exemple — retour d’expérience', 'validated'],
    ['news', 'Exemple — ressource à traduire', 'draft'],
    ['events', 'Exemple — rencontre technique', 'review'],
    ['events', 'Exemple — séminaire', 'draft'],
    ['publications', 'Example bibliographic title — review fixture', 'draft'],
    ['patents', 'Exemple — référence de dépôt', 'draft'],
    ['media', 'Exemple — photographie à documenter', 'review'],
    ['laboratories', 'Exemple — fiche laboratoire', 'draft'],
    ['platforms', 'Exemple — fiche infrastructure', 'draft'],
    ['glossary', 'Exemple — terme à définir', 'draft'],
    ['users', 'Profil de démonstration — équipe éditoriale', 'draft'],
  ] as const
  return {
    version: 1,
    entries: seeds.map(([module, title, status], index) => {
      const entry = createEntry(module, `demo-${index + 1}`, '2026-10-11T09:00:00Z')
      entry.variants.fr = {
        ...emptyVariant(),
        title,
        body: 'Texte de démonstration pour tester la rédaction et la validation. À remplacer dans votre navigateur.',
        status,
      }
      return entry
    }),
    logs: [],
  }
}
export function canEdit(role: Role, module: string): boolean {
  if (role === 'reader') return false
  if (module === 'users') return role === 'admin'
  return true
}
export function canTransition(role: Role, from: Status, to: Status): boolean {
  if (role === 'reader') return false
  if (to === 'draft') return true
  if (to === 'review') return from === 'draft'
  if (role !== 'admin' && role !== 'publisher') return false
  return (
    (to === 'validated' && from === 'review') ||
    (to === 'published' && from === 'validated') ||
    to === 'archived'
  )
}
export function validateEntry(entry: Entry, language: Language, strict = false): string[] {
  const variant = entry.variants[language]
  const errors: string[] = []
  if (!variant.title.trim()) errors.push('Le titre est requis.')
  if (strict && !variant.body.trim())
    errors.push('Le texte est requis pour soumettre cette langue.')
  for (const field of modules.find((m) => m.id === entry.module)?.fields ?? []) {
    const value = entry.shared[field.key]?.trim()
    if (!value) continue
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
  if (!canEdit(role, entry.module)) throw new Error('Ce profil ne peut pas modifier ce module.')
  const existing = workspace.entries.find((e) => e.id === entry.id)
  const from = existing?.variants[language].status ?? 'draft'
  if (nextStatus && !canTransition(role, from, nextStatus))
    throw new Error('Cette étape n’est pas accessible pour ce profil.')
  const errors = validateEntry(
    entry,
    language,
    Boolean(nextStatus && nextStatus !== 'draft' && nextStatus !== 'archived'),
  )
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
  saved.variants[language].status = nextStatus ?? (changed || sharedChanged ? 'draft' : from)
  saved.updatedAt = at
  saved.history = [
    {
      id: `${at}-${language}`,
      at,
      language,
      variant: { ...saved.variants[language] },
      note: saved.comment,
    },
    ...(existing?.history ?? []),
  ].slice(0, 30)
  saved.publicVariants = structuredClone(existing?.publicVariants ?? {})
  if (nextStatus === 'published') saved.publicVariants[language] = { ...saved.variants[language] }
  if (nextStatus === 'archived') delete saved.publicVariants[language]
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
