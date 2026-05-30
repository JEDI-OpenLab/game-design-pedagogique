# Game Design Pédagogique

Ressource ouverte pour comprendre, concevoir, prototyper, animer et améliorer des jeux pédagogiques.

Le dépôt transforme un ensemble de ressources JEDI-OpenLab sur les serious games en base publiable : pages de cadrage, scénarios d'activité, gabarits, exemples, lexique, bibliographie commentée et webapp statique d'aide à la conception.

La webapp fonctionne entièrement dans le navigateur : pas de serveur applicatif, pas de compte, pas de base de données distante. Les données du lexique, des exemples et des outils sont embarquées dans `assets/data.js`, et les productions de l'utilisateur restent locales au navigateur via `localStorage`.

Les fichiers Markdown restent disponibles comme sources éditables du dépôt, mais l'expérience de lecture principale est intégrée dans `index.html`, notamment via la section Bibliothèque.

Ce travail est mené dans une logique collaborative avec le Dr. Claisse.

## Pour qui ?

- Enseignants et enseignants-chercheurs qui veulent créer une activité ludique sans perdre l'alignement pédagogique.
- Ingénieurs pédagogiques qui accompagnent des équipes de formation.
- Formateurs, responsables de formation et étudiants en design pédagogique.
- Toute personne qui veut passer d'une idée de jeu à un prototype testable.

## Ce que le projet aide à faire

- Distinguer serious game, serious gaming, ludification/gamification et dégamification.
- Choisir un type de jeu adapté aux objectifs pédagogiques.
- Aligner objectifs d'apprentissage, mécaniques de jeu, règles, feedbacks et évaluations.
- Construire un scénario, un jeu de cartes, des règles, des énigmes ou une fiche de conception.
- Animer une activité et récolter des retours d'expérience.
- Utiliser une webapp de conception guidée directement dans le navigateur.

## Structure

```text
game-design-pedagogique/
  index.html                  webapp statique et portail du projet
  assets/                     styles, scripts et données importées
  docs/                       sources Markdown des pages de cadrage et méthode
  ateliers/                   sources Markdown de formats d'activité réutilisables
  gabarits/                   sources Markdown des modèles prêts à copier/adapter
  exemples/                   cas documentés
  ressources/                 lexique, bibliographie, boîte à outils
  scripts/                    imports et maintenance des sources
  sources/exports/            exports CSV nettoyables par script
  PLAN_ACTION.md              feuille de route de travail
```

## Consulter localement

Le projet est statique. On peut ouvrir `index.html` directement dans un navigateur.

Pour tester avec un serveur local depuis ce dossier :

```bash
python3 -m http.server 48331 --bind 127.0.0.1
```

Puis ouvrir :

```text
http://127.0.0.1:48331/
```

## Sources

Les contenus originaux proviennent principalement des dossiers de travail JEDI-OpenLab et PAPN :

- `01_Projets/Jeux_serieux`
- `sources/exports/lexique-ludification-pedagogique-75-records-20260522-1445.csv`
- `JEDI-OpenLab/livre-jeu-odyssee-enseignement-main`
- `JEDI-OpenLab/knowledge/04_Jeux_serieux`

Les documents tiers ne sont pas recopiés dans le dépôt public tant que leurs droits ne sont pas clarifiés. Ils sont décrits sous forme de notices dans la bibliographie commentée.

## Licence

Ce projet est une ressource éducative libre (REL) au sens de la Recommandation UNESCO de 2019.

Sauf mention contraire, les contenus originaux sont placés sous licence Creative Commons Attribution 4.0 International (CC BY 4.0).

Voir [LICENSE.md](LICENSE.md).

Les contenus tiers conservent leurs droits et licences propres. Voir le site principal de JEDI-OpenLab pour plus d'informations.
