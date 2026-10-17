import { createEntry, emptyVariant, type Workspace } from '@/lib/cms-preview/model'
export function fixtureWorkspace(): Workspace {
  const seeds = [
    ['news', 'Exemple — atelier de recherche', 'review'],
    ['news', 'Exemple — entretien scientifique', 'draft'],
    ['news', 'Exemple — retour d’expérience', 'draft'],
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
