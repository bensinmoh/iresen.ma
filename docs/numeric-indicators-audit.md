# Audit des indicateurs numériques — 16 octobre 2026

Périmètre : compteurs transversaux du CMS, bandeau Publications, accueil, menus,
carrières, programmes, annuaire des laboratoires et recherche. Les dates, étapes,
numéros de normes et valeurs historiques sourcées ne sont pas des compteurs de
collections ; ils ne sont pas recalculés à partir d'une liste sans justification.

## Résultats de la base locale

| Indicateur                    | Valeur constatée | Source et règle                                                                                              |
| ----------------------------- | ---------------: | ------------------------------------------------------------------------------------------------------------ |
| Publications recensées        |            1 199 | Catalogue bibliographique public approuvé, hors filtres de recherche                                         |
| Dépôts du portefeuille PI     |               59 | Références validées du portefeuille ; total agrégé autorisé, incluant les fiches individuelles non publiques |
| Brevets accordés              |               30 | Versions publiques validées, statut accordé dans leur instantané approuvé                                    |
| Projets soutenus              |               70 | Collection native des projets, FR public/validé, titre et description présents                               |
| Fiches de projets dans le CMS |               71 | Total de gestion ; distinct du compteur public de projets soutenus                                           |
| Appels à projets              |               21 | Catalogue public d'archives et appels natifs, dédoublonné par référence                                      |
| Laboratoires du réseau        |               14 | Fiches publiques validées du référentiel ; l'annuaire respecte le retrait des fiches                         |
| Jeunes chercheurs soutenus    |            +1000 | Valeur éditoriale validée en base, non calculée à partir des comptes utilisateurs                            |
| Collaborateurs                |             +120 | Valeur éditoriale validée en base                                                                            |
| Norme ISO                     |    ISO 9001:2015 | Valeur éditoriale modifiable après validation ; ce n'est pas un dénombrement                                 |

Les 59 dépôts et les 30 brevets accordés ont des périmètres différents. Le total
agrégé ne publie ni les identités ni les documents des dépôts retenus privés.
L'accueil conserve volontairement son arrondi inférieur « +1100 » pour les
1 199 publications ; le bandeau Publications affiche le total exact.

## Défauts corrigés

- Le bandeau Publications contenait littéralement **69** et **18**. Il utilise
  maintenant `siteIndicatorTotals` : **70** et **21** dans la base locale.
- Le bandeau reprenait aussi des longueurs de fichiers pour publications/brevets.
  Les compteurs publics lisent maintenant leurs projections en base commune.
- Les valeurs brevets/laboratoires de l'accueil et des menus n'étaient pas
  surchargées par les données publiques courantes. Le même résolveur leur transmet
  désormais les totaux, ainsi que la valeur éditoriale des jeunes chercheurs.
- La description « chiffres clés » contenait encore des valeurs historiques
  figées. Les résumés rendus et indexés sont construits à partir des valeurs
  résolues ; les catalogues de secours ne contiennent plus ces anciens nombres.
- Le registre CMS applique les mêmes définitions publiques, tout en conservant
  séparément ses totaux de gestion dans la navigation. Le statut accordé vient
  de la version validée et non d'une modification en brouillon.
- Le catalogue des brevets prend en compte le statut accordé validé ; son nombre
  de thèmes couverts découle des références réellement affichées.
- Les nombres du bandeau ne peuvent plus se couper sur deux lignes. Les largeurs
  de bureau intermédiaires empilent nombre/libellé ; le rail mobile est conservé.

## Limites et vérification

Aucun contenu n'a été publié ou modifié en base pour cet audit. Les valeurs ont
été contrôlées par lecture SQL et par rendu réel. FR/EN/AR du bandeau Publications
montrent 1 199 / 59 / 70 / 21. À 390px en arabe, la largeur du document reste 390px
et les quatre nombres restent insécables. Les filtres de catalogue calculent leurs
résultats à partir des enregistrements chargés ; ils ne changent pas le recensement
institutionnel global. Un total indisponible affiche « — », jamais un zéro fictif.

Le fichier `src/lib/cms-workspace/indicator-totals.ts` centralise les valeurs ;
`src/lib/cms-preview/indicators.ts` documente les règles pures communes au CMS.
Le compteur natif de projets existant reste la référence pour ne pas compter une
fiche de brouillon ou une référence retirée comme un projet public soutenu.
Les anciennes valeurs des références privées et de l'historique restent des
sources archivées ; elles ne servent plus au rendu des compteurs.

ESLint ciblé, TypeScript, Prettier et vérification des espaces passent. Des tests
couvrent les changements de variables, les instantanés validés, les retraits,
les dépôts privés inclus dans l'agrégat autorisé, la distinction accordé/déposé et
les arrondis. Leur exécution, le build et la CI complète restent en attente de la
levée du gel partagé ; les preuves de développement ne valent pas une CI réussie.

La reconstruction locale de recherche s'est terminée avec succès (sortie 0). Une
lecture SQL de l'index confirme zéro ancien résumé figé « 69 projets collaboratifs
soutenus » / « 69 collaborative projects supported ». La commande d'indexation
arrête son worker implicite dans son seul processus CLI, ferme les connexions
Payload et recherche, puis termine comme les autres commandes ponctuelles Payload.
