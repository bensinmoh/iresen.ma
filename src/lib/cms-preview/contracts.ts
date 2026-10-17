import type { Field, Module } from './model'

// Typed business fields persisted by the authenticated common-database workspace.
const text = (key: string, label: string, localized = false, required = false): Field => ({
  key,
  label,
  type: 'text',
  localized,
  required,
})
const area = (key: string, label: string, localized = true, required = false): Field => ({
  key,
  label,
  type: 'textarea',
  localized,
  required,
})
const date = (key: string, label: string, required = false): Field => ({
  key,
  label,
  type: 'date',
  required,
})
const url = (key: string, label: string): Field => ({ key, label, type: 'url' })
const number = (key: string, label: string, min = 0, max?: number): Field => ({
  key,
  label,
  type: 'number',
  min,
  max,
})
const relation = (
  key: string,
  label: string,
  relationTo: string,
  many = false,
  required = false,
): Field => ({
  key,
  label,
  type: 'relation',
  relationTo,
  many,
  required,
  help: 'Sélectionner une fiche disponible dans la rubrique liée.',
})
const select = (key: string, label: string, options: string[], required = false): Field => ({
  key,
  label,
  type: 'select',
  options,
  required,
})
const media = (key = 'heroImage', label = 'Photo / miniature'): Field => ({
  ...relation(key, label, 'media'),
  imageUpload: !['documentId', 'conditions'].includes(key),
  help: ['documentId', 'conditions'].includes(key)
    ? 'Sélectionner un document de la médiathèque.'
    : 'Téléverser une image depuis votre appareil. Enregistrer ensuite le brouillon pour l’associer à cette fiche.',
})
const source = (): Field => url('sourceUrl', 'Lien de la source')
const email = (key = 'contact', label = 'Courriel de contact'): Field => ({
  key,
  label,
  type: 'email',
})
type Contract = Pick<Module, 'fields' | 'columns'> & { storage: string }
export const moduleContracts: Record<string, Contract> = {
  news: {
    storage: 'news (Payload existant ; adaptation du contrat à prévoir)',
    columns: ['heroImage', 'publishedAt', 'type', 'sourceUrl'],
    fields: [
      {
        key: 'highlight',
        label: 'À la une',
        type: 'boolean',
        readOnly: true,
        help: 'Un seul article à la une. Utiliser l’action étoile pour remplacer la sélection actuelle (administrateur).',
      },
      text('slug', 'Segment d’URL', true),
      area('summary', 'Résumé', true),
      media(),
      date('publishedAt', 'Date exacte de publication', true),
      text('publicationMonth', 'Mois de publication sourcé (AAAA-MM)'),
      select('type', 'Type d’actualité', ['news', 'press-release'], true),
      text('sourceAttribution', 'Attribution de la source', true),
      source(),
      relation('theme', 'Thématiques', 'themes', true),
    ],
  },
  events: {
    storage: 'events (collection à raccorder)',
    columns: ['heroImage', 'start', 'place', 'eventStatus'],
    fields: [
      media(),
      date('start', 'Début', true),
      date('end', 'Fin'),
      text('place', 'Lieu ou modalité', true, true),
      select(
        'eventStatus',
        'État de préparation',
        ['preparation', 'confirmed', 'completed', 'cancelled'],
        true,
      ),
      url('registration', 'Lien officiel / inscription'),
      text('dateLabel', 'Période annoncée (sans date exacte inventée)', true),
      text('role', 'Rôle d’IRESEN'),
      area('organisers', 'Organisateurs', false),
      source(),
    ],
  },
  media: {
    storage: 'media (Payload existant ; stockage des fichiers à raccorder)',
    columns: ['fileName', 'mimeType', 'credit', 'visibility'],
    fields: [
      {
        ...select('resourceKind', 'Type de ressource', [
          'photos',
          'videos',
          'reports',
          'links',
          'resources',
        ]),
        optionLabels: {
          photos: 'Photos',
          videos: 'Vidéos',
          reports: 'Rapports & stratégies',
          links: 'Liens utiles',
          resources: 'Autres ressources du site',
        },
      },
      text('fileName', 'Nom du fichier', false, true),
      url('sourceUrl', 'Adresse externe'),
      text('assetPath', 'Chemin du média dans le site'),
      text('category', 'Catégorie'),
      number('width', 'Largeur'),
      number('height', 'Hauteur'),
      select('mimeType', 'Type MIME', [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/svg+xml',
        'application/pdf',
        'video/mp4',
      ]),
      text('alt', 'Texte alternatif', true),
      text('caption', 'Légende', true),
      text('credit', 'Crédit et source', false, true),
      text('rights', 'Droits d’utilisation', false, true),
      number('sizeBytes', 'Taille en octets'),
      text('usage', 'Utilisé dans'),
      select('visibility', 'Visibilité prévue', ['private', 'public']),
    ],
  },
  publications: {
    storage: 'scientific-publications (projection à adapter)',
    columns: ['year', 'authors', 'doi', 'quartile'],
    fields: [
      text('doi', 'DOI'),
      {
        ...area('authors', 'Auteurs, dans l’ordre original', false),
        help: 'Conserver les auteurs attestés par la source. Laisser vide quand la source ne les fournit pas.',
      },
      number('year', 'Année sourcée', 1900, 2100),
      text('journal', 'Revue / conférence'),
      text('publicationType', 'Type bibliographique'),
      text('bibliographicTheme', 'Domaine bibliographique original'),
      relation('theme', 'Thématiques', 'themes', true),
      select('quartile', 'Quartile SJR 2025', ['Q1', 'Q2', 'Q3', 'Q4', 'unknown']),
      text('quartileStatus', 'Statut du quartile'),
      number('quartileYear', 'Année du classement SJR'),
      text('quartileEvidence', 'Réserve / preuve du quartile'),
      url('quartileSourceUrl', 'Source du classement SJR'),
      text('historicalQuartile', 'Quartile historique'),
      number('historicalQuartileYear', 'Année historique du classement'),
      url('historicalQuartileSourceUrl', 'Source du classement historique'),
      text('historicalQuartileEvidence', 'Preuve du classement historique'),
      number('citations', 'Citations datées'),
      date('citationsAsOf', 'Date du relevé des citations'),
      area('provenance', 'Provenance et réserves', false),
    ],
  },
  patents: {
    storage: 'patents (projection à adapter)',
    columns: ['reference', 'year', 'applicants', 'registry'],
    fields: [
      text('reference', 'Référence de dépôt', false, true),
      area('applicants', 'Déposants', false, true),
      area('inventors', 'Inventeurs', false),
      number('year', 'Année sourcée', 1900, 2100),
      date('filingDate', 'Date du dépôt'),
      { key: 'granted', label: 'Accepté / délivré dans la source', type: 'boolean' },
      relation('theme', 'Thématiques', 'themes', true),
      url('registry', 'Lien du registre'),
      area('provenance', 'Provenance', false),
    ],
  },
  projects: {
    storage: 'projects (Payload existant ; correspondances à adapter)',
    columns: ['imageId', 'callId', 'location', 'consortium'],
    fields: [
      text('acronym', 'Acronyme', false, true),
      media('imageId', 'Photo du projet'),
      area('summary', 'Description courte / aperçu', true, true),
      area('consortium', 'Consortium', true, true),
      text('location', 'Lieu', true),
      relation('callId', 'Appel à projets de rattachement', 'calls'),
      text('selectionCallReference', 'Référence de l’appel de sélection'),
      number('launchYear', 'Année de lancement', 1900, 2100),
      date('start', 'Début'),
      date('end', 'Fin'),
      number('durationMonths', 'Durée en mois'),
      number('budgetMAD', 'Budget sourcé (MAD)'),
      select('projectStatus', 'État du projet', ['active', 'completed', 'planned']),
      select('domain', 'Domaine', [
        'thermal',
        'grids',
        'efficiency',
        'photovoltaic',
        'wind',
        'hydrogen',
        'storage',
        'biomass',
        'materials',
        'water',
        'other',
      ]),
      text('hostingPlatform', 'Plateforme d’accueil', true),
      text('coordinatorName', 'Nom du coordinateur', true),
      text('coordinatorAffiliation', 'Affiliation du coordinateur', true),
      email('coordinatorEmail', 'Courriel du coordinateur'),
      text('coordinatorPhone', 'Téléphone du coordinateur'),
      area('objectives', 'Objectifs scientifiques', true, true),
      media('documentId', 'Note PDF locale'),
      source(),
    ],
  },
  calls: {
    storage: 'calls (Payload existant ; adaptation à prévoir)',
    columns: ['reference', 'start', 'end', 'funders'],
    fields: [
      text('reference', 'Référence', false, true),
      text('acronym', 'Acronyme'),
      text('archivePeriod', 'Période de l’édition sourcée (AAAA ou AAAA-MM)'),
      text('archiveState', 'État historique de l’appel'),
      text('kind', 'Catégorie de l’appel'),
      area('archiveThemes', 'Thématiques historiques', true),
      area('calendarNote', 'Précisions / réserves sur le calendrier', true),
      text('periodLabel', 'Période affichée', true),
      { key: 'sources', label: 'Références documentaires', type: 'json' },
      number('launchYear', 'Année de lancement', 1900, 2100),
      number('budgetAmount', 'Enveloppe budgétaire'),
      select('budgetCurrency', 'Devise', ['MAD', 'EUR', 'USD']),
      date('evaluationStartsAt', 'Début de l’évaluation'),
      date('resultsAt', 'Annonce des résultats'),
      date('start', 'Ouverture', true),
      date('end', 'Clôture', true),
      area('eligibility', 'Éligibilité', true, true),
      area('funders', 'Financeurs', false),
      url('application', 'Formulaire externe'),
      media('conditions', 'Document des conditions'),
    ],
  },
  careers: {
    storage: 'opportunities (Payload existant ; adaptation à prévoir)',
    columns: ['type', 'place', 'end', 'vacancyStatus'],
    fields: [
      {
        ...select('type', 'Type d’opportunité', ['job', 'internship', 'thesis'], true),
        optionLabels: { job: 'Emploi', internship: 'Stage', thesis: 'Thèse' },
      },
      {
        ...select('vacancyStatus', 'Ouverture des candidatures', ['open', 'closed'], true),
        optionLabels: { open: 'Ouverte', closed: 'Clôturée' },
      },
      text('department', 'Pôle / direction de recrutement', true),
      number('positions', 'Nombre de postes'),
      number('experienceMin', 'Expérience minimale souhaitée (années)'),
      date('start', 'Ouverture de l’offre'),
      text('place', 'Lieu', true, true),
      {
        ...select('contract', 'Contrat', ['CDI', 'CDD', 'internship', 'apprenticeship'], true),
        optionLabels: { CDI: 'CDI', CDD: 'CDD', internship: 'Stage', apprenticeship: 'Alternance' },
      },
      text('experience', 'Expérience attendue', true),
      text('availability', 'Disponibilité souhaitée', true),
      date('end', 'Échéance', true),
      area('criteria', 'Critères', true, true),
      area('missions', 'Missions', true, true),
      area('qualifications', 'Formation et qualifications', true),
      text('skills', 'Compétences attendues', true),
      text('recruiter', 'Responsable du recrutement'),
      url('applicationUrl', 'Destination de candidature externe éventuelle'),
      email(),
      media('documentId', 'Fiche de poste'),
    ],
  },
  laboratories: {
    storage: 'laboratories (collection à raccorder)',
    columns: ['institution', 'city', 'subject', 'contact'],
    fields: [
      text('institution', 'Institution', true, true),
      text('city', 'Ville', true),
      text('subject', 'Thématique fournie'),
      relation('theme', 'Thématiques', 'themes', true),
      area('specialties', 'Spécialités', true),
      text('contact', 'Contact scientifique fourni'),
      number('latitude', 'Latitude', -90, 90),
      number('longitude', 'Longitude', -180, 180),
      media(),
      source(),
    ],
  },
  platforms: {
    storage: 'platforms (collection à raccorder)',
    columns: ['logoId', 'maturity', 'location', 'destination'],
    fields: [
      media(),
      media('logoId', 'Logo original'),
      select('maturity', 'Maturité / disponibilité', ['in-development', 'operational'], true),
      text('location', 'Lieu', true),
      area('infrastructure', 'Infrastructures', true, true),
      area('services', 'Capacités', true),
      url('destination', 'Destination officielle'),
      email(),
    ],
  },
  organigram: {
    storage: 'organigram (unités et personnes ; collection à raccorder)',
    columns: ['recordType', 'parentId', 'headId', 'function', 'sortOrder'],
    fields: [
      {
        ...select('recordType', 'Type de fiche', ['pole', 'department', 'person'], true),
        optionLabels: { pole: 'Pôle', department: 'Direction', person: 'Personne' },
      },
      {
        ...relation('parentId', 'Pôle / direction de rattachement', 'organigram'),
        relationKinds: ['pole', 'department'],
      },
      number('sortOrder', 'Ordre d’affichage'),
      {
        ...relation('headId', 'Responsable de l’unité', 'organigram'),
        relationKinds: ['person'],
        showFor: ['pole', 'department'],
      },
      { ...text('function', 'Fonction confirmée', true, true), showFor: ['person'] },
      { ...text('firstName', 'Prénom', true), showFor: ['person'] },
      { ...text('lastName', 'Nom', true), showFor: ['person'] },
      { ...media('portraitId', 'Portrait'), showFor: ['person'] },
      { ...area('shortBiography', 'Biographie courte'), showFor: ['person'] },
      { ...area('expertise', 'Expertises et compétences'), showFor: ['person'] },
      { ...text('affiliation', 'Affiliation professionnelle', true), showFor: ['person'] },
      { ...email(), showFor: ['person'] },
      { ...text('phone', 'Téléphone professionnel'), showFor: ['person'] },
      { ...url('profile', 'Profil professionnel'), showFor: ['person'] },
      { ...date('appointmentDate', 'Date de prise de fonction'), showFor: ['person'] },
      { ...area('provenance', 'Source de la biographie', false), showFor: ['person'] },
    ],
  },
  board: {
    storage: 'board (sièges du conseil d’administration ; collection à raccorder)',
    columns: ['logoId', 'institution', 'representative', 'website'],
    fields: [
      text('institution', 'Institution représentée', true, true),
      media('logoId', 'Logo de l’institution'),
      text('representative', 'Nom du représentant', true),
      text('function', 'Fonction au conseil', true),
      text('professionalRole', 'Fonction dans l’institution', true),
      media('portraitId', 'Portrait du représentant'),
      url('website', 'Site de l’institution'),
      url('profile', 'Profil professionnel du représentant'),
      date('mandateStart', 'Début du mandat'),
      date('mandateEnd', 'Fin du mandat'),
      number('sortOrder', 'Ordre d’affichage'),
      source(),
    ],
  },
  'scientific-council': {
    storage: 'scientific-council (membres du conseil scientifique ; collection à raccorder)',
    columns: ['portraitId', 'professionalRole', 'country', 'profile'],
    fields: [
      text('affiliation', 'Institution / affiliation', true),
      text('function', 'Fonction au conseil', true),
      text('professionalRole', 'Fonction professionnelle sourcée', true),
      text('country', 'Pays / région indiqué', true),
      area('expertise', 'Domaines d’expertise', true),
      media('portraitId', 'Portrait'),
      area('shortBiography', 'Biographie courte'),
      url('profile', 'Profil professionnel'),
      date('mandateStart', 'Début du mandat'),
      date('mandateEnd', 'Fin du mandat'),
      number('sortOrder', 'Ordre d’affichage'),
      area('provenance', 'Source de la biographie', false),
    ],
  },
  pages: {
    storage: 'pages / sections (modèle fixe ; adaptateur par section requis)',
    columns: ['pageId', 'sectionId', 'mediaId', 'destinationId'],
    fields: [
      text('pageId', 'Identifiant de page', false, true),
      text('sectionId', 'Ancre de section', false, true),
      {
        key: 'structuredContent',
        label: 'Contenu structuré du site (JSON)',
        type: 'json',
        localized: true,
      },
      media('mediaId', 'Illustration'),
      text('caption', 'Légende', true),
      text('destinationId', 'Destination interne existante'),
      media('documentId', 'Document associé'),
    ],
  },
  figures: {
    storage: 'cms_authoring_entries · figures (valeurs éditoriales ; calculs exclus)',
    columns: ['value', 'unit', 'period', 'source'],
    fields: [
      {
        ...text('value', 'Valeur affichée', false, true),
        help: 'Valeur éditoriale, avec sa notation : +120 ou ISO 9001:2015. La version ISO reste modifiable.',
      },
      text('unit', 'Unité', true),
      text('source', 'Source', false, true),
      text('period', 'Période de référence', false, true),
      text('owner', 'Responsable'),
      area('justification', 'Justification', false),
      text('usage', 'Emplacements concernés'),
    ],
  },
  coordinates: {
    storage: 'coordinates (configuration à raccorder)',
    columns: ['email', 'phone', 'address', 'usage'],
    fields: [
      email('email', 'Courriel'),
      text('phone', 'Téléphone'),
      area('address', 'Adresse'),
      text('usage', 'Emplacements'),
    ],
  },
  themes: {
    storage: 'themes (référentiel à raccorder)',
    columns: ['scope', 'related'],
    fields: [
      area('scope', 'Périmètre', true, true),
      relation('related', 'Concepts associés', 'themes', true),
    ],
  },
  glossary: {
    storage: 'glossary (référentiel à raccorder)',
    columns: ['relatedTerms', 'source'],
    fields: [
      text('acronym', 'Acronyme développé', true),
      area('synonyms', 'Équivalents / synonymes'),
      area('relatedTerms', 'Termes de recherche associés (ne signifie pas synonymes)'),
      relation('related', 'Concepts proches', 'glossary', true),
      text('source', 'Source terminologique', false, true),
    ],
  },
  faq: {
    storage: 'faq (questions / réponses localisées ; collection à raccorder)',
    columns: ['category', 'placement', 'sortOrder'],
    fields: [
      {
        ...select(
          'category',
          'Catégorie de la question',
          [
            'general',
            'institute',
            'research',
            'projects',
            'calls',
            'careers',
            'collaboration',
            'media',
            'contact',
          ],
          true,
        ),
        optionLabels: {
          general: 'Général',
          institute: 'Institut',
          research: 'Recherche et innovation',
          projects: 'Projets',
          calls: 'Appels à projets',
          careers: 'Carrières et recrutement',
          collaboration: 'Collaboration',
          media: 'Médiathèque',
          contact: 'Contact',
        },
      },
      {
        ...select('placement', 'Emplacement prévu', [
          'general',
          'careers',
          'calls',
          'projects',
          'contact',
        ]),
        optionLabels: {
          general: 'FAQ générale',
          careers: 'Carrières',
          calls: 'Appels à projets',
          projects: 'Projets',
          contact: 'Contact',
        },
      },
      number('sortOrder', 'Ordre d’affichage'),
      text('keywords', 'Mots clés de recherche', true),
      source(),
    ],
  },
  users: {
    storage: 'users (Payload existant ; politique à migrer ultérieurement)',
    columns: ['role', 'scope', 'languages'],
    fields: [
      select('role', 'Profil prévu', ['admin', 'editor'], true),
      text('scope', 'Modules attribués'),
      select('languages', 'Langue principale', ['fr', 'en', 'ar']),
    ],
  },
}

export type ConnectionRecord = {
  id: string
  collection: string
  reference: string
  updatedAt: string
  shared: Record<string, string | number | boolean | string[] | object | null>
  locales: Record<
    string,
    {
      title: string
      body: string
      status: string
      seoTitle: string
      seoDescription: string
      fields: Record<string, unknown>
    }
  >
}
