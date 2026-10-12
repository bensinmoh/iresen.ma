# IRESEN — transmission à l’équipe IT

## Aperçu

Site institutionnel en français, anglais et arabe, avec 23 pages de référence.
Architecture : Next.js 16.4.0 / React 19.3.0, Payload 3.90.2, Node 24.19.0,
pnpm 11.19.0 et PostgreSQL. Livraison possible en serveur Node standalone ou
conteneur Linux non-root. Ce dossier ne constitue pas une mise en production.

Le site présente l’Institut, sa gouvernance, ses missions, programmes, priorités,
plateformes et réseau, ainsi que collaboration, valorisation, actualités,
publications, médiathèque, carrières et contact. Recherche multilingue avec
contrôles de publication. Les projets fictifs et leurs 72 PDF sont retirés ;
la page affiche une mise à jour prochaine. Aucun exemple fictif de recrutement.

Contact/candidature : préparation d’un email dans le navigateur, sans réception
ni stockage côté site. Google Maps nécessite le consentement aux services externes.
LinkedIn reste une sélection éditoriale, sans synchronisation. Les textes EN/AR
et les contenus éditoriaux nécessitent leur revue finale.

## Résultats et limites

163 tests unitaires, 31 tests d’intégration et les parcours navigateur ciblés
passent ; build Linux standalone et images non-root vérifiés. L’audit des
dépendances de production passe de 14 alertes à zéro vulnérabilité connue.
L’administration publique est fermée ; CSP et quota de recherche sont en place.

Trois mesures Lighthouse mobiles par page : scores médians finaux 76 à 87,
CLS ≤ 0,013. Le transfert de l’accueil baisse d’environ 77 %, mais son LCP local
ne s’améliore pas. Les six pages restent au-dessus de la cible LCP de 2,5 s ;
la validation en préproduction et les mesures terrain restent nécessaires.

## Répartition des responsabilités

| Responsable                | À confirmer et exécuter                                                                                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Hébergeur                  | Exécution Node/conteneurs, PostgreSQL/pg_trgm, stockage privé persistant, certificat HTTPS origine, sauvegardes, restauration et supervision |
| Prestataire domaine        | Propriété et accès de récupération, coordination DNS, bascule autorisée                                                                      |
| Administrateur Cloudflare  | TLS Full (strict), protection origine, WAF, limites et règles de cache                                                                       |
| IRESEN IT                  | Secrets, environnements séparés, migrations, indexation, recette et maintenance                                                              |
| IRESEN éditorial/juridique | Validation des contenus, traductions, notices et flux de données                                                                             |

## Points de recette avant ouverture

- Confirmer que l’offre d’hébergement accepte un serveur Node persistant ; un
  simple transfert de fichiers sur un hébergement PHP ne suffit pas.
- Ne publier que l’artefact construit. Ne jamais servir le dossier Git, les
  documents internes, `.env`, les sauvegardes ou les uploads privés.
- Utiliser `PUBLIC_RELEASE=true` et garder administration/revue CMS fermées.
  L’administration opérationnelle et MFA/SSO feront l’objet d’une phase distincte.
- Préparer et tester migrations, recherche, worker, stockage, sauvegarde et retour
  à la version précédente. Ne pas utiliser une base locale de développement en production.
- Bloquer l’accès direct à l’origine ; transmettre une adresse client fiable
  après nettoyage des en-têtes. Le quota partagé est de 60 recherches/minute/client.
- Exclure HTML à nonce, API et médias CMS protégés du cache Cloudflare. Tester le
  retrait d’un média et l’impossibilité de récupérer ses anciennes variantes.
- Vérifier FR/EN/AR, clavier/mobile, CSP, fichiers privés en 404, refus/retrait des
  cookies et absence de requête Google Maps avant consentement.
- Conserver l’indexation désactivée jusqu’à la validation finale et à l’autorisation
  de mise en ligne. Faire le contrôle final du glossaire et de la recherche multilingue.

## Revue demandée à l’IT et au juridique

Merci de revoir les sections techniques et publiques : gestion des cookies,
politique de confidentialité, mentions légales et conditions d’utilisation,
coordonnées de publication/hébergement, durées de conservation et gestion des droits.
Inclure les services/cookies ajoutés par Cloudflare ou l’hébergeur, les régions
et sous-traitants, transferts de données et obligations applicables CNDP/Loi 09-08.
Aucune information réglementaire manquante ne doit être inventée.

Les protections applicatives et contrôles locaux réduisent les risques ; ils ne
prouvent pas une conformité complète ni une invulnérabilité. Prévoir surveillance,
correctifs réguliers et tests de sécurité en préproduction. Le rapport détaillé
et les résultats se trouvent dans [la préparation](public-release-preparation.md) ;
les commandes, configurations et procédures dans [le guide de déploiement](deployment.md).
