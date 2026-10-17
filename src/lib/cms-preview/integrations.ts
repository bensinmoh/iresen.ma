export const audienceService = {
  name: 'Google Analytics',
  text: 'Visites, pages vues, langues et sources de trafic.',
  needs: 'Accès autorisé aux rapports Google Analytics du site et configuration du connecteur.',
}

export const externalConnections = [
  {
    name: 'LinkedIn',
    text: 'Posts de la page officielle, doublons et revue éditoriale.',
    needs: 'Application approuvée, droits sur la page et OAuth côté serveur.',
  },
  audienceService,
]
