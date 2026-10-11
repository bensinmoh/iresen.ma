# Cahier des charges du CMS IRESEN

Version de travail du 11 octobre 2026, destinée au propriétaire du site et à Codex.

Développer un espace d’administration qui permette à l’équipe IRESEN de gérer les contenus, ressources et données du site existant sans intervention quotidienne d’un développeur. La facilité d’utilisation, l’accessibilité, la fiabilité des données et la maîtrise de la publication sont prioritaires.

Ce document propose le périmètre et les critères de développement. Sa rédaction ne lance pas l’implémentation, ne valide pas les textes institutionnels et n’autorise aucun déploiement. Les captures Genius Communication sont des références ergonomiques ; leurs données personnelles, fonctions commerciales, couleurs et marque ne doivent pas être reproduites.

## Objectif et limites

Le CMS doit couvrir trois usages : gérer les bases métier, modifier le contenu des pages existantes et suivre l’activité éditoriale et technique.

**Oui, la modification des contenus déjà présents fait partie d’un CMS.** Prévoir un module « Contenu des pages » avec des champs adaptés à chaque section : titre, introduction, texte, photographie, légende, lien et document associé. L’équipe conserve les modèles et la composition développés pour le site.

La création d’un enregistrement dans une collection, par exemple une actualité ou un appel à projets, reste possible. Elle utilise un modèle de présentation déjà développé. En revanche, exclure le constructeur de pages, les blocs libres, les nouvelles sections, la modification du code, des styles, des routes et de l’arborescence. Les évolutions de structure passent par un développement distinct.

Le CMS ne devient ni un CRM, ni un portail de candidatures, ni un outil de gestion financière ou juridique. Les formulaires de contact et de candidature gardent leur fonctionnement actuel par brouillon de courriel ; les appels conservent leur lien vers le formulaire externe fourni. Toute évolution de ces traitements doit être commissionnée séparément.

## Socle existant à préserver

Codex doit commencer par un audit du dépôt, des schémas, des permissions et des écrans existants. Il doit identifier ce qui fonctionne déjà, ce qui mérite une adaptation et ce qui reste à développer.

| Élément observé                                                                               | Conséquence pour le développement                                                                         |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Payload intégré à Next.js, PostgreSQL, utilisateurs avec rôles admin/editor/publisher         | Étendre ce socle ; ne pas installer un second CMS ou reconstruire l’authentification sans justification.  |
| Collections Pages, News, Media et Opportunities ; Calls dans l’incrément en cours             | Réutiliser les schémas et vérifier l’état livré de Calls avant toute migration.                           |
| Versions, brouillons, visibilité et validation par langue                                     | Renforcer les parcours et les tests ; ne pas contourner les barrières existantes.                         |
| 1 199 publications retenues, référence T4 2026, stockées en données structurées versionnées   | Préparer une migration contrôlée vers une gestion CMS, en préservant la sélection et la provenance.       |
| 59 références de brevets déposés dans le catalogue structuré                                  | Préserver les références et les champs retenus ; le nombre ne signifie pas 59 brevets actifs ou délivrés. |
| 24 projets de démonstration isolés                                                            | Les conserver hors des données institutionnelles, des chiffres et de la recherche générale.               |
| Réseau de 14 laboratoires ; médias et autres contenus répartis entre CMS et sources statiques | Inventorier les sources puis migrer par module, sans créer de doublons.                                   |
| Recherche FR/EN/AR et indexation PostgreSQL déjà développées                                  | Réutiliser leur cycle de mise à jour et leurs critères d’éligibilité.                                     |

Les anciens fichiers et les données migrées ne doivent pas devenir deux sources actives concurrentes. Après validation d’un module, les lecteurs publics utilisent sa source CMS via une projection explicite. Les traces d’origine restent disponibles pour l’audit et la restauration.

## Stack technique proposée

Choisir une application modulaire dans le dépôt existant, avec des frontières entre administration, contenus publics, logique métier et intégrations. Le choix moderne et performant consiste ici à consolider la stack déjà en place.

| Couche          | Choix recommandé                                                                                             | Rôle                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Application     | Next.js App Router, React, TypeScript strict                                                                 | Site public et administration dans une architecture cohérente.            |
| CMS             | Payload CMS 3 et son administration personnalisable                                                          | Collections, formulaires, droits, versions et API.                        |
| Base principale | PostgreSQL via l’adaptateur Payload                                                                          | Données, relations, migrations, transactions et index.                    |
| Interface       | Composants Payload, extensions React et CSS natif avec tokens IRESEN                                         | Personnalisation accessible, sans fork complet de l’administration.       |
| Texte enrichi   | Lexical, avec une barre d’outils limitée                                                                     | Paragraphes, listes, liens et formats autorisés ; pas de HTML arbitraire. |
| Langues         | Localisation Payload ; next-intl côté site                                                                   | Contenus FR/EN/AR et interface publique cohérente.                        |
| Validation      | Contraintes de base, validation serveur et Zod pour les contrats adaptés                                     | Refuser les données invalides même lorsqu’elles arrivent par API.         |
| Recherche       | Moteur PostgreSQL existant, dont pg_trgm, derrière son adaptateur                                            | Conserver le classement et la gestion multilingue.                        |
| Tâches de fond  | File durable PostgreSQL existante pour la recherche ; jobs Payload pour les autres traitements si appropriés | Imports, synchronisations, classification et opérations planifiées.       |
| Médias          | Stockage local en développement ; stockage objet compatible S3 en production                                 | Distinguer objets privés, originaux et dérivés servis.                    |
| Analytics       | Adaptateur de rapports Matomo                                                                                | Afficher les données agrégées dans le dashboard, avec un accès serveur.   |
| IA              | Adaptateur serveur vers un fournisseur sélectionné selon confidentialité, qualité FR/EN/AR et coût           | Classification assistée avec résultat structuré et validation humaine.    |
| Qualité         | Vitest, Playwright, axe-core, ESLint et Prettier                                                             | Vérifier les droits, parcours, langues et régressions.                    |
| Exploitation    | Application Node portable, processus de jobs supervisé, sauvegardes et logs structurés                       | Éviter une dépendance obligatoire à un hébergeur particulier.             |

À l’audit, le dépôt fixe Node 24.19.0, pnpm 11.19.0, Next.js 16.4.0, React 19.3.0, TypeScript 6.0.3, Payload 3.90.2 et PostgreSQL 17.9. Ces versions décrivent le projet, pas une recommandation de « dernière version ». Préserver les pins et le lockfile ; toute mise à niveau exige une vérification de compatibilité et des tests. Ne pas ajouter par défaut un second ORM, Redis, des microservices ou un autre moteur de recherche.

Payload permet de personnaliser son administration par des composants React. Utiliser cette extension pour obtenir l’ergonomie souhaitée tout en conservant les mécanismes du CMS. [Documentation officielle Payload](https://payloadcms.com/docs/custom-components/overview).

Matomo fournit une API de rapports adaptée à cette intégration. Utiliser une instance approuvée, hébergée ou administrée séparément ; une instance auto-hébergée a ses propres besoins PHP et MySQL/MariaDB et ne s’installe pas dans la base PostgreSQL IRESEN. Le choix d’hébergement et les coûts restent à arrêter. [API Matomo](https://developer.matomo.org/guides/reporting-api), [prérequis d’exploitation](https://matomo.org/faq/on-premise/what-are-the-important-pre-deployment-checks-during-matomo-setup/).

## Organisation de l’administration

Proposer une navigation compacte avec des intitulés métier :

| Groupe                  | Modules                                                                       |
| ----------------------- | ----------------------------------------------------------------------------- |
| Tableau de bord         | Vue éditoriale, audience et alertes utiles.                                   |
| Communication           | Actualités, événements, médiathèque.                                          |
| Recherche et innovation | Publications, brevets, projets, appels à projets.                             |
| Institut et réseau      | Laboratoires, plateformes, organismes et personnes déjà présents sur le site. |
| Contenu du site         | Pages existantes, chiffres et coordonnées partagées.                          |
| Référentiels            | Thématiques, programmes, glossaire, acronymes et synonymes.                   |
| Administration          | Utilisateurs, intégrations, imports, journaux et état des sauvegardes.        |

N’afficher que les modules accessibles à l’utilisateur. Les badges doivent signaler des éléments à traiter, plutôt que multiplier les compteurs décoratifs. Une recherche interne permet de retrouver un enregistrement, une page ou un média selon les droits ; elle est distincte du moteur public.

## Dashboard éditorial et audience

L’écran d’accueil donne accès aux tâches du jour : contenus en attente de validation, traductions manquantes, échéances proches, imports à revoir et erreurs d’intégration. Chaque alerte mène à une action ou à une liste filtrée.

La partie audience affiche visites, pages vues, principales pages et sources de trafic, langues et appareils, avec période personnalisable et comparaison à la période précédente. Chaque mesure précise sa définition, sa source et sa dernière actualisation. Afficher « indisponible » ou « données anciennes » en cas d’incident, jamais un faux zéro.

Les interactions utiles peuvent être mesurées : téléchargement effectivement servi, clic vers un appel, lancement d’un courriel, consultation d’une ressource. Un clic sur mailto n’est pas une candidature ou un message envoyé. Le dashboard ne prétend pas observer la réception de ces messages.

Exclure le trafic de l’administration et les tests. Limiter les données collectées, éviter les textes de recherche identifiants et permettre le paramétrage de la conservation et du consentement selon les règles retenues par IRESEN. Les graphiques disposent d’un équivalent tabulaire et d’un export autorisé.

## Actualités et intégration LinkedIn

Prévoir deux espaces : « À traiter depuis LinkedIn » et « Actualités du site ».

Le connecteur lit la page officielle autorisée via OAuth et l’API officielle. L’accès aux publications d’organisation dépend des permissions, du rôle sur la page et de l’approbation de l’application. Vérifier aussi la version d’API utilisée, ses limites et les droits de réutilisation des médias. [Posts API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api), [accès Community Management](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/community-management-api-migration-guide).

Le parcours attendu est : récupération → détection des doublons → proposition de classement par IA → correction éditoriale → adaptation des langues → validation → publication sur le site.

Conserver l’identifiant et le lien source, la date disponible, la date de récupération et la provenance des médias. Séparer le texte récupéré du texte éditorial. La synchronisation ne doit pas écraser les corrections, recréer une actualité rejetée ou publier automatiquement. Une évolution ou disparition de la source déclenche une revue, sans détruire silencieusement le contenu local.

L’IA propose une catégorie, des thèmes et, si utile, une synthèse à revoir. Elle peut s’abstenir lorsque le classement est incertain ; sa sortie est validée contre un schéma fermé. Le contenu externe est traité comme donnée, jamais comme instruction pour l’agent. L’IA ne modifie ni les droits, ni les statuts de publication, ni les chiffres institutionnels. Les traductions proposées restent des brouillons.

Afficher l’état de connexion, la dernière synchronisation, les erreurs compréhensibles et la possibilité de relancer un traitement autorisé. Prévoir dès le premier lot un formulaire manuel avec lien source : le module Actualités doit fonctionner sans accès LinkedIn ou sans fournisseur IA. Aucune publication en retour sur LinkedIn n’est comprise dans le périmètre.

## Gestion des chiffres

Créer un registre de tous les indicateurs affichés, recensés par page et section. Chaque indicateur possède un identifiant stable, un libellé localisé, une unité, ses emplacements d’usage, une source, une période de référence et un responsable.

| Nature                                               | Traitement                                                                                            |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Chiffre éditorial fourni et sourcé                   | Valeur modifiable par les rôles autorisés, avec justification, date et validation.                    |
| Chiffre calculé depuis une base                      | Lecture seule ; afficher la règle de calcul, le périmètre, les exclusions et la date de calcul.       |
| Mesure externe ou photographie datée d’un indicateur | Conserver la date et la provenance ; actualiser par un processus d’import ou de correction documenté. |

Un total de publications ou de brevets ne dispose d’aucun champ de remplacement manuel. L’interdiction doit exister côté serveur et API, pas seulement dans le formulaire. Les règles de calcul sont versionnées dans le code ; un bouton autorisé peut demander un recalcul, sans changer la formule.

La définition de chaque total doit préciser ce qu’il compte : références, familles, enregistrements publics, corpus retenu à une date ou projets vérifiés. Un nombre de lignes n’établit pas à lui seul un résultat institutionnel. Les projets de démonstration sont toujours exclus.

Conserver séparément le corpus T4 2026, les mesures datées et les éventuels indicateurs courants. Une valeur inconnue reste inconnue, et ne devient pas zéro. Afficher avant validation les pages concernées et l’impact attendu d’une modification de donnée source.

## Gestion des bases métier

Toutes les listes partagent recherche, filtres, tri, pagination serveur, colonnes pertinentes et actions explicites. Les formulaires distinguent champs requis, données manquantes et informations privées. La duplication, les imports et les opérations de masse respectent les permissions et créent des brouillons par défaut.

| Module                        | Informations et comportements attendus                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Publications                  | Identifiant stable, DOI lorsqu’il existe, titre bibliographique original, auteurs complets et ordonnés, année sourcée, type, thèmes, métriques et provenance. Conserver la sélection de 1 199 références et T4 2026 pendant la migration. Distinguer quartile SJR 2025, classement historique, qualification provisoire et citations Scopus datées. Préserver les valeurs absentes et les exclusions. Toute évolution du corpus passe par une revue tracée. |
| Brevets                       | Référence de dépôt, titre original, résumé localisé, déposants, thèmes, année ou date vérifiée, lien de registre et provenance. Préserver les 59 références retenues et les exclusions. Ne pas introduire un statut actif, délivré ou commercialisé sans preuve ; tout champ supplémentaire exige une définition et une source.                                                                                                                             |
| Projets                       | Identifiant, titre/acronyme, présentation, thème, programme, calendrier, statut, budget sourcé, plateforme d’accueil, contact, consortium, objectifs et médias/documents. Prévoir un espace séparé pour les vrais projets. Les 24 démonstrations, leurs noms provisoires et leurs notes restent isolés ; aucune conversion automatique en projet institutionnel.                                                                                            |
| Laboratoires                  | Identifiant et ancre conservés, nom, institution, ville, thématiques, spécialités et contacts fournis. Les relations ville/laboratoire alimentent la carte et la liste. Les positions approximatives sont identifiées ; la carte ne se miroirise pas en arabe. Ne pas inventer une capacité disponible ou un contact.                                                                                                                                       |
| Appels à projets              | Réutiliser Calls : référence stable, description, lancement, budget/devise, éligibilité, thèmes, financeurs, calendrier, PDF des conditions et URL externe de candidature. Contrôler l’ordre des dates et la disponibilité du document ; distinguer prochain, ouvert, clos et annulé. Conserver les pages de détail et leurs destinations.                                                                                                                  |
| Carrières                     | Type d’opportunité, intitulé, missions, critères, lieu, échéance, contact/document et conditions de publication. Une offre close n’est plus proposée comme ouverte. Conserver l’état vide lorsque rien n’est éligible ; ne pas réintroduire les offres fictives supprimées. Aucun dossier candidat ou dépôt de CV dans ce périmètre.                                                                                                                        |
| Événements                    | Titre, description, début/fin, fuseau, lieu ou modalité en ligne, organisateurs fournis, visuel, statut et lien d’inscription réel s’il existe. Distinguer préparation, confirmation, report et annulation. Ne pas inventer les éléments des cartes encore en attente.                                                                                                                                                                                      |
| Autres données déjà utilisées | Plateformes et infrastructures, programmes, organismes du conseil, personnes/biographies, partenaires, jalons historiques, coordonnées et liens utiles : inventaire exhaustif avant création de schémas. Migrer seulement les informations présentes ou explicitement fournies.                                                                                                                                                                             |

L’équipe peut gérer les enregistrements des collections prévues. L’expression « autres bases » ne donne pas accès à une console SQL, à toutes les tables techniques ou à une création de collections depuis l’interface.

## Médiathèque et documents

Centraliser les médias existants et futurs dans un catalogue avec type, titre, légende, texte alternatif, langue, crédits, source, droits, statut, visibilité, taille et usages. Préserver les SVG originaux et distinguer photographies réelles, illustrations générées et transformations assistées par IA.

Permettre recherche, filtres, prévisualisation, remplacement versionné et sélection dans les formulaires. Afficher « utilisé dans » avant un retrait. Les variantes responsives partagent le même original et le même résultat de recherche ; elles ne créent pas des ressources en doublon.

Séparer physiquement ou par règles de stockage vérifiables les fichiers publics et privés. Un PDF en brouillon ou retiré ne doit pas rester téléchargeable via une URL directe non protégée. Les documents externes restent des références externes lorsque leur import n’est pas autorisé. Les originaux privés, les fichiers de travail et les pièces de démonstration ne sont pas promus en téléchargements publics.

Valider type réel, extension, taille et dimensions ; contrôler les fichiers actifs, notamment SVG et documents, avant service. Prévoir une quarantaine et un contrôle antimalware pour les uploads en production. Les vidéos utilisent des dérivés adaptés ou une destination approuvée ; aucun flux lourd ne bloque la publication du formulaire.

## Contenu des pages existantes

Créer un registre fermé des pages et sections éditables, lié aux identifiants de `src/lib/site.ts`. Chaque modèle expose uniquement ses champs utiles. Les noms de routes, les ancres historiques, la structure, les icônes de marque et les règles de calcul restent contrôlés par le développement.

Un écran commence par la sélection d’une page, puis d’une section. Afficher la langue, les champs, leur emplacement et une prévisualisation authentifiée de la version de travail. Prévoir un aperçu desktop/mobile et une vérification arabe lorsque le contenu la concerne.

L’éditeur enrichi limite les formats pour préserver la cohérence et l’accessibilité. Les liens internes se choisissent par destination stable ; les images et documents se choisissent dans la médiathèque. Ne pas imposer à l’éditeur de saisir du HTML, du JSON, une classe CSS ou une ancre technique.

Les contenus déjà servis restent intacts pendant la migration. Les adaptations EN/AR ne sont pas déclarées approuvées du seul fait de leur import. Les actions du rapport Institut conservent le `#` demandé tant que le véritable PDF n’est pas fourni.

## Glossaire et recherche

Prévoir des référentiels reliés plutôt qu’une liste de mots-clés sans contexte : terme préféré, définition, langue, équivalents validés, acronymes développés, variantes orthographiques, alias de découverte et concepts proches explicitement qualifiés.

Distinguer équivalence, synonyme et simple relation thématique. Un terme proche ne doit pas élargir artificiellement toutes les requêtes. Préserver les titres originaux ; les alias servent à la découverte sans réécrire leur affichage.

Permettre une prévisualisation des résultats avant activation d’un changement, ainsi qu’un historique. Respecter l’ordre existant : exact, linguistique, fautes puis concepts proches ; conserver la requête tapée et rendre toute correction explicite.

Le glossaire éditorial interne peut contenir des termes en préparation. Leur présence n’autorise ni une page de glossaire publique, ni leur entrée dans les suggestions publiques. Le vocabulaire de correction reste issu des seules ressources actuellement publiques et éligibles.

Chaque ajout ou modification publique synchronise ses références de recherche dans les langues autorisées : identifiant, URL/ancre atteignable, type, titre et description réelle. Le retrait supprime l’éligibilité des résultats et de la correction orthographique. Le CMS affiche l’état d’indexation et les erreurs, avec reconstruction réservée aux personnes habilitées. Garder le contrôle final FR/EN/AR prévu lorsque tout le contenu du site sera en place.

Les métadonnées SEO se gèrent sur les ressources existantes : titre, description, aperçu social et données structurées pertinentes. Canonical, hreflang et sitemap découlent des routes et des langues publiées. Le gestionnaire de synonymes soutient la recherche ; il ne promet pas un classement dans les moteurs externes.

## Workflow et utilisateurs

Le parcours commun est : brouillon → en revue → validé dans la langue concernée → publié, avec retrait ou archivage explicites. Distinguer validation éditoriale, publication de la révision et visibilité publique ; le backend conserve les contrôles actuels et rend leurs effets lisibles.

Une modification d’un contenu publié crée une révision de travail et conserve la version publique. Une restauration crée elle aussi un brouillon à revoir. Afficher les différences et avertir des modifications concurrentes afin d’éviter l’écrasement du travail d’un collègue.

Le français, l’anglais et l’arabe ont leur propre complétude et validation. Toute modification d’un champ partagé doit préciser son impact sur les variantes publiées. Ne jamais rendre publiquement une traduction manquante par fallback automatique. Payload propose versions et brouillons ; les possibilités de publication par langue doivent être vérifiées sur la version installée et adaptées au workflow existant. [Versions](https://payloadcms.com/docs/versions/overview), [localisation](https://payloadcms.com/docs/configuration/localization).

| Profil cible                | Droits attendus                                                               |
| --------------------------- | ----------------------------------------------------------------------------- |
| Administrateur              | Utilisateurs, droits, configuration et opérations sensibles.                  |
| Éditeur                     | Création et modification de brouillons dans ses modules ; soumission à revue. |
| Responsable de publication  | Validation, publication, retrait et archivage dans son périmètre.             |
| Traducteur                  | Édition des langues attribuées, sans élargissement des droits de publication. |
| Lecteur interne ou analyste | Consultation des écrans autorisés et exports explicitement permis.            |

Les deux derniers profils et les restrictions par module/langue sont des extensions proposées aux rôles existants. Définir une matrice d’accès testable, sans donner automatiquement toutes les permissions aux nouveaux profils. Les comptes techniques ont leurs propres droits minimaux. Un administrateur de plateforme n’est pas automatiquement validateur de tous les faits institutionnels.

Prévoir affectation d’un responsable, motif de retour en correction, commentaires internes et notifications ciblées. La publication planifiée est réservée à une révision précise et déjà validée ; elle revérifie les droits et l’éligibilité au moment d’exécution. Les dates sont stockées de façon non ambiguë et présentées dans Africa/Casablanca.

## Ergonomie et accessibilité

Reprendre des captures Genius la navigation latérale repliable, la barre supérieure simple, les listes lisibles, les filtres et les actions contextuelles. Adapter la densité à l’usage : tableaux pour les données, formulaires pour l’édition, cartes seulement lorsqu’elles aident à comprendre. Utiliser l’identité IRESEN : bleu `#296BB4`, navy `#12345A`, surfaces claires, typographie lisible et icônes SVG.

Le français est la langue de travail initiale de l’administration. Le choix de langue de l’interface doit être distinct de la langue du contenu édité. Prévoir une architecture traduisible et un véritable RTL pour toute interface arabe livrée ; les champs arabe/latin conservent leur direction propre.

Les utilisateurs doivent pouvoir accomplir une tâche sans connaître le modèle de données : libellés métier, aide courte à proximité du champ, exemples neutres, champs avancés progressivement révélés, actions « Enregistrer le brouillon », « Prévisualiser » et « Soumettre à validation » distinctes. Afficher l’enregistrement en cours et réussi, conserver le travail en cas d’erreur, prévenir avant de quitter des modifications non enregistrées et restituer les filtres après retour d’un formulaire.

La liste conserve une recherche et des filtres compréhensibles, un compteur de résultats, un état vide utile et une pagination. Une action de masse annonce précisément les éléments sélectionnés, sa portée et les conséquences. Réserver les confirmations aux suppressions, publications et opérations sensibles ; éviter les fenêtres répétitives pour les modifications ordinaires.

Viser WCAG 2.2 niveau AA sur les parcours livrés : navigation clavier complète, focus visible et non masqué, formulaires étiquetés, erreurs associées et résumées, contrastes suffisants, états exprimés autrement que par la couleur, reflow et texte agrandi, dialogues avec gestion du focus, authentification accessible. Prévoir des cibles confortables de 44 pixels quand possible, au-delà du minimum AA de 24 pixels ou des exceptions prévues. [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [taille des cibles](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum).

Prévoir des annonces adaptées pour les résultats et sauvegardes, des tableaux avec en-têtes explicites et aucun glisser-déposer obligatoire. Respecter la réduction des animations. Les messages de succès ou d’erreur restent lisibles sans dépendre d’un toast fugace. L’accessibilité exige des vérifications manuelles en complément des outils automatisés.

## Journaux et supervision

Le « GUI Log » devient un module « Journaux » consultable dans l’interface, avec deux vues complémentaires.

Le **journal d’audit** répond à « qui a fait quoi, sur quelle donnée et quand ? » : connexion, changement de rôle, modification, validation, publication, retrait, import, export et restauration. Il indique l’acteur, la ressource, la langue, le résultat et les différences utiles. Les éditeurs ne peuvent pas modifier ou effacer ces traces. Prévoir une conservation définie, une protection en écriture et, pour les opérations critiques, une copie dans un stockage d’audit distinct.

Le **journal technique** montre les erreurs, synchronisations, jobs et indexations : sévérité, heure, origine, identifiant de corrélation, état et tentative. Les personnes habilitées peuvent consulter un détail expurgé et relancer certains traitements idempotents. Ce module n’est ni un terminal serveur, ni un accès libre aux fichiers de logs.

Ne jamais journaliser mots de passe, jetons, cookies ou données privées inutiles. Les différences de champs sensibles sont masquées. Les exports et leur consultation sont soumis aux droits et tracés ; l’interface affiche les incidents utiles plutôt qu’un flux technique permanent.

## Imports et qualité des données

Prévoir l’import CSV/XLSX uniquement pour les modules adaptés, avec modèle téléchargeable et limites de taille. Traiter les cellules comme des valeurs : ne jamais exécuter macros, formules ou instructions intégrées. Les exports neutralisent les cellules susceptibles de devenir des formules dans un tableur.

Le parcours doit inclure sélection du fichier, correspondance des colonnes, validation, rapport des anomalies, aperçu des créations/mises à jour puis confirmation. L’aperçu annonce les lignes ignorées, doublons, champs écrasés et conséquences sur les indicateurs. Aucun import ne publie automatiquement.

Utiliser les identifiants métier pour rendre la réimportation idempotente. Ne pas fusionner deux publications sur leur seul titre ; contrôler DOI et références sans effacer les cas légitimes distincts. Pour chaque module, définir si l’import validé est atomique ou exécuté en lots reprenables ; fournir un bilan exact et un mécanisme de correction ciblé. Une annulation ne doit pas effacer les modifications ultérieures d’autres utilisateurs.

Conserver les champs d’origine utiles et un manifeste d’import avec hash, date, mapping et opérateur. Les fichiers privés et les champs administratifs exclus des sources actuelles ne doivent pas être réintroduits. Les jeux de test restent dans des environnements séparés et ne remplissent pas la base de l’équipe.

## Sécurité et exploitation

Contrôler les droits côté serveur pour chaque opération, champ, API et téléchargement. Les vues personnalisées ne doivent pas contourner les permissions Payload. Les requêtes publiques Local API imposent notamment `overrideAccess: false`, `draft: false` et `fallbackLocale: false`, avec une projection limitée aux champs publics. Ne pas utiliser un jeton administrateur pour alimenter le navigateur public. [Local API Payload](https://payloadcms.com/docs/local-api/overview).

Prévoir authentification institutionnelle et MFA pour les comptes privilégiés avant mise en production. Évaluer leur intégration compatible avec Payload ; ne pas présenter cette fonction comme déjà livrée. Pas d’inscription publique, comptes nominatifs, révocation, limitation des tentatives, sessions sécurisées, récupération de compte réelle via un service approuvé et protection contre l’élévation de droits.

Les secrets d’API et OAuth restent côté serveur dans un stockage sécurisé. Limiter les URL externes et protéger les traitements de récupération contre les accès internes non autorisés. Valider et assainir texte enrichi, liens et fichiers. Les pages admin, brouillons et prévisualisations exigent un contrôle d’accès et ne sont pas placés dans des caches publics ; `noindex` ne remplace pas l’authentification.

Les tâches durables ont identifiant, déduplication, délai, limite de tentatives et état d’échec consultable. En production, un runner supervisé ou planifié doit réellement traiter la file ; enregistrer un job ne garantit pas son exécution. Coordonner les files sans doubler le travail de l’indexeur existant.

Sauvegarder données et médias, chiffrer les sauvegardes, définir conservation et accès, puis tester la restauration dans un environnement isolé. Cibles initiales proposées : perte maximale de données de 24 heures et restauration sous 4 heures, à confirmer selon l’hébergement ; aucun SLA acquis n’est annoncé. Afficher le dernier résultat connu de sauvegarde, jamais un bouton fictif.

Séparer développement, recette et production, avec secrets distincts. Éviter la copie de données privées de production vers les tests. Documenter installation, migrations, exploitation, renouvellement des accès, restauration et retour arrière. Le déploiement, le DNS et la visibilité restent soumis à leur autorisation distincte.

## Performance et bonnes pratiques de développement

Réutiliser les composants et dépendances du projet. Conserver la logique métier hors des composants d’interface, typer les contrats, versionner les migrations et relire les types/import maps générés. Utiliser transactions et contraintes de base pour les invariants, notamment références uniques, dates et liens entre ressources.

Les listes utilisent pagination, filtres et tri côté serveur, avec index sur les champs réellement interrogés. Charger seulement les colonnes nécessaires, éviter les requêtes répétées par ligne et les relations profondes inutiles. Déporter extraction de documents, IA et imports volumineux vers les jobs ; aucun ne doit immobiliser une requête de formulaire.

Préserver le cache public adapté, mais invalider les contenus et indicateurs concernés après publication. Le retrait empêche immédiatement le service d’une ressource inéligible ; les changements ordinaires convergent dans l’index par la file durable. Un échec d’indexation est visible et réessayable, sans republier le contenu.

Cibles de recette proposées sur un environnement documenté et un corpus représentatif : recherche/listing de 25 lignes sous 1 seconde au 95e percentile côté serveur ; enregistrement simple sous 1 seconde hors upload ; premier écran utile sous 2,5 secondes sur une connexion et un poste de référence convenus. Mesurer les valeurs, le contexte et les écarts ; ne pas promettre ces délais sur tout appareil. Vérifier aussi une volumétrie supérieure à l’actuelle pour éviter les chargements intégraux.

Les tests couvrent surtout les invariants, les accès, la publication par langue, les uploads, les imports et le cycle de recherche. Exécuter les contrôles du dépôt adaptés au lot : lint, types, tests unitaires, intégration, build et parcours navigateur sur une base jetable. Ajouter des vérifications clavier, lecteur d’écran, reflow et RTL. Relire la documentation Next.js installée avant de modifier les APIs du framework.

## Livraison par lots

| Lot | Résultat attendu                                                                                                                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0   | Audit, inventaire de toutes les données/indicateurs, matrice de droits, schémas, architecture et maquettes des parcours clés.                           |
| 1   | Administration accessible, utilisateurs, workflows, traductions, prévisualisation, audit et gestion des médias.                                         |
| 2   | Actualités manuelles, événements, carrières et appels ; gestion du contenu existant et des chiffres éditoriaux.                                         |
| 3   | Migration des publications/brevets, projets réels séparés, laboratoires et autres référentiels existants ; vérification des calculs et de la recherche. |
| 4   | Imports métier, glossaire/synonymes et supervision de l’indexation.                                                                                     |
| 5   | Dashboard audience, connecteur LinkedIn et classification IA ; états de repli si les accès restent indisponibles.                                       |
| 6   | Recette complète, tests de restauration, documentation d’exploitation et guide court pour l’équipe.                                                     |

Pour chaque lot, livrer une fonction complète et testée avec ses migrations, permissions, projections publiques, indexation, documentation et limites. Conserver une application utilisable entre les lots. Les intégrations externes ne doivent pas retarder les formulaires et workflows indépendants.

## Critères de recette

1. Un éditeur crée et soumet une actualité sans pouvoir la publier ou changer son rôle, y compris par une requête API directe.
2. Un responsable publie une traduction complète ; les autres langues non validées ne deviennent pas publiques.
3. Modifier ou restaurer un contenu publié conserve la version publique jusqu’à publication autorisée de la nouvelle révision.
4. Une modification concurrente est détectée ; l’utilisateur ne perd pas silencieusement ses changements.
5. Un texte de section existante est modifiable et prévisualisable, sans accès à la création de section, au code ou aux routes.
6. Un indicateur calculé est non modifiable dans l’interface, les imports et les API ; sa formule et ses sources sont consultables.
7. Les migrations initiales retrouvent les 1 199 publications retenues, 59 références de brevets et 14 laboratoires, avec identifiants, exclusions et métadonnées de provenance préservés.
8. Les démonstrations de projets restent exclues des chiffres, des vrais projets et du moteur institutionnel ; aucune offre fictive n’est réintroduite.
9. Réimporter le même fichier ne crée pas de doublons et ne publie rien ; le rapport rend explicites les rejets et modifications.
10. Une ressource retirée n’est plus proposée dans la recherche, les corrections ou un téléchargement direct ; ses variantes de langue respectent les règles prévues.
11. Un appel clos ne permet plus de candidature ; une offre inéligible laisse apparaître l’état vide prévu. Les dates limites suivent Africa/Casablanca.
12. Une synchronisation LinkedIn répétée ne duplique pas les actualités et ne remplace pas les corrections locales ; une panne laisse la gestion manuelle disponible.
13. Une proposition IA ne peut publier, modifier des droits ou appliquer une instruction contenue dans un post externe.
14. Les parcours liste → édition → brouillon → revue → publication sont réalisables au clavier et vérifiés avec un lecteur d’écran ; texte agrandi, petits écrans et arabe ne masquent pas les actions essentielles.
15. Les chiffres analytics indisponibles sont signalés ; les clics sur courriel ne sont pas comptés comme messages reçus.
16. Les journaux permettent de retrouver une modification sans révéler de secret, et une restauration réelle des données et médias est démontrée en recette.

La livraison comporte un bilan des critères réussis, des écarts et des dépendances externes, avec preuves de tests. Une maquette, un connecteur simulé ou un simple tableau sans droits et workflow ne constitue pas la livraison du module.

## Décisions avant les lots concernés

Préciser les personnes qui publient, leurs périmètres et les validateurs FR/EN/AR ; retenir les contenus de page éditables après inventaire ; confirmer les définitions des indicateurs et le processus d’évolution du corpus ; choisir les services d’identité, stockage, mail, analytics et IA ; obtenir l’accès à la page LinkedIn et l’approbation de l’application ; fixer la conservation et les objectifs de restauration avec l’hébergement.

Ces choix complètent le cahier des charges. Les exigences ci-dessus constituent une proposition à relire, distincte de l’ordre futur de développer le CMS.

## Références du projet

- [Brief de développement](../instruction.md), [stack et installation](../README.md), [architecture](architecture.md), [règles de design](design-system.md#current-coherence-rules).
- [Publications](publications.md), [brevets](valorisation-patents.md), [projets](projects.md), [réseau](laboratories-experts-network.md), [carrières](careers.md). Le schéma Calls appartient à l’incrément en cours et doit être vérifié dans son état livré.
- [Médiathèque](media-library.md), [actualités et événements](news-events.md), [recherche et ajout de contenu public](search.md#adding-public-content).

## Journal de rédaction

11 octobre 2026 : proposition rédigée à la demande du propriétaire à partir des fonctions souhaitées, des quatre captures Genius Communication et de l’état du dépôt. Les captures restent des références locales ; aucune copie de leurs données personnelles n’est ajoutée. Travail documentaire uniquement, sans changement runtime, schéma, donnée publique ou intégration.
