import { APIError, type CollectionConfig } from 'payload'
import { constrainContentOperation, publishedContentOnly } from '../access/public-content'
import { administratorsOnly, canPublish, isStaff, staffOnly } from '../access/roles'
import { publicationFields } from './fields'
import { hasText, isContentLocale } from '@/lib/content/publication'
import { callDateErrors, callLocalizedFields, isCallReference, isSubmissionUrl } from '@/lib/calls'

export const Calls: CollectionConfig = {
  slug: 'calls',
  labels: { singular: 'Appel à projets', plural: 'Appels à projets' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'acronym', 'launchYear', 'deadlineAt', 'publicationStatus'],
  },
  access: {
    create: staffOnly,
    read: publishedContentOnly,
    update: staffOnly,
    delete: administratorsOnly,
    readVersions: staffOnly,
  },
  versions: { drafts: true, maxPerDoc: 30 },
  hooks: {
    beforeOperation: [constrainContentOperation],
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        if (!isStaff(req.user)) throw new APIError('Authentication is required.', 403)
        if (!isContentLocale(req.locale)) throw new APIError('Select a supported locale.', 400)
        if (originalDoc?.reference && data.reference && data.reference !== originalDoc.reference)
          throw new APIError('The stable URL reference cannot be changed.', 400)
        const current = { ...originalDoc, ...data }
        if (!canPublish(req.user)) {
          if (data._status === 'published' || data.publicationStatus === 'published')
            throw new APIError('Only publishers can publish.', 403)
          data._status = 'draft'
          if (current.publicationStatus === 'published') data.publicationStatus = 'draft'
        }
        const errors = callDateErrors(current)
        if (errors.length) throw new APIError(errors[0]!, 400)
        if (
          canPublish(req.user) &&
          current.publicationStatus === 'published' &&
          current.visibility === 'public' &&
          current._status === 'published'
        ) {
          if (
            callLocalizedFields.some((key) => !hasText(current[key])) ||
            !hasText(current.acronym) ||
            !current.launchYear ||
            current.budgetAmount === null ||
            current.budgetAmount === undefined ||
            !current.openingAt ||
            !current.deadlineAt ||
            !current.evaluationStartsAt ||
            !current.resultsAt ||
            !current.conditionsDocument ||
            !isSubmissionUrl(current.submissionUrl)
          )
            throw new APIError(
              'Complete all call information in the current translation before publication.',
              400,
            )
          const documentId =
            typeof current.conditionsDocument === 'object'
              ? current.conditionsDocument.id
              : current.conditionsDocument
          const result = await req.payload.find({
            collection: 'media',
            locale: req.locale,
            fallbackLocale: false,
            overrideAccess: false,
            draft: false,
            depth: 0,
            limit: 1,
            where: { id: { equals: documentId } },
          })
          if (result.docs[0]?.mimeType !== 'application/pdf')
            throw new APIError('Publish an approved PDF of the terms in this language first.', 400)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'reference',
      label: 'Référence stable de l’URL',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      validate: (value: unknown) =>
        isCallReference(value) || 'Use lowercase letters and digits separated by single hyphens.',
    },
    { name: 'title', label: 'Titre de l’appel', type: 'text', localized: true },
    { name: 'acronym', label: 'Acronyme', type: 'text' },
    { name: 'description', label: 'Description complète', type: 'textarea', localized: true },
    {
      name: 'launchYear',
      label: 'Année de lancement',
      type: 'number',
      required: true,
      min: 1900,
      max: 2100,
      validate: (value: unknown) =>
        (typeof value === 'number' && Number.isInteger(value) && value >= 1900 && value <= 2100) ||
        'Use a four-digit year.',
    },
    ...[
      ['openingAt', 'Ouverture des candidatures'],
      ['deadlineAt', 'Deadline de soumission'],
      ['evaluationStartsAt', 'Début de l’évaluation'],
      ['evaluationEndsAt', 'Fin de l’évaluation (facultative)'],
      ['resultsAt', 'Annonce des projets retenus'],
    ].map(([name, label]) => ({
      name: name!,
      label,
      type: 'date' as const,
      admin: {
        date: { pickerAppearance: 'dayAndTime' as const },
        description: 'Date et heure avec fuseau ; le site affiche Africa/Casablanca.',
      },
    })),
    {
      name: 'calendarNote',
      label: 'Précisions sur le calendrier',
      type: 'textarea',
      localized: true,
    },
    { name: 'budgetAmount', label: 'Enveloppe budgétaire — montant', type: 'number', min: 0 },
    {
      name: 'budgetCurrency',
      label: 'Devise',
      type: 'select',
      required: true,
      defaultValue: 'MAD',
      options: ['MAD', 'EUR', 'USD'],
    },
    {
      name: 'budgetNote',
      label: 'Précisions sur le financement',
      type: 'textarea',
      localized: true,
    },
    ...[
      ['recipients', 'Destinataires / critères d’éligibilité'],
      ['themes', 'Thématiques de l’appel'],
      ['fundingPartners', 'Partenaires de financement'],
    ].map(([name, label]) => ({
      name: name!,
      label,
      type: 'textarea' as const,
      localized: true,
      admin: { description: 'Un élément par ligne.' },
    })),
    {
      name: 'conditionsDocument',
      label: 'Conditions / termes de référence (PDF)',
      type: 'upload',
      relationTo: 'media',
      localized: true,
      filterOptions: { mimeType: { equals: 'application/pdf' } },
      admin: {
        description:
          'Publier le PDF et approuver ses métadonnées dans la langue sélectionnée avant de publier l’appel.',
      },
    },
    {
      name: 'submissionUrl',
      label: 'URL du formulaire de soumission',
      type: 'text',
      localized: true,
      validate: (value: unknown) =>
        !value || isSubmissionUrl(value) || 'Provide an HTTPS URL without credentials.',
    },
    {
      name: 'cancelled',
      label: 'Appel annulé',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Désactive la soumission. Ouvert/à venir/clôturé sont calculés depuis les dates.',
      },
    },
    ...publicationFields,
  ],
}
