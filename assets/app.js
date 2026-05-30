const data = window.GDP_DATA || { lexique: [], exemples: [], outils: [], mecaniques: [] };

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const state = {
  matrix: JSON.parse(localStorage.getItem("gdp-matrix") || "[]"),
  cards: JSON.parse(localStorage.getItem("gdp-cards") || "[]"),
  checks: JSON.parse(localStorage.getItem("gdp-checks") || "{}"),
  libraryFilter: "all",
};

const priorityTerms = [
  "Serious game pédagogique",
  "Serious game",
  "Serious gaming",
  "Dégamifier",
  "Constructionnisme, constructionniste",
  "Instructionnisme, instructionniste",
  "DICE (modèle)",
  "ADDIE (modèle)",
  "Objectif pédagogique",
  "Objectif ludique",
  "Cercle magique du jeu",
  "Flow",
  "Faiblesses ludiques et pédagogiques",
];

const presentationPriorityTerms = priorityTerms.filter((term) => !term.includes("DICE") && !term.includes("ADDIE"));

const definitionModules = [
  {
    id: "jeu-serieux",
    title: "Qu'est-ce qu'un jeu sérieux ?",
    tag: "Définition",
    summary: "Un jeu sérieux associe une finalité utilitaire et une forme ludique.",
    body: `
      <p>Un jeu sérieux est un objet ou une activité qui mélange deux dimensions : une dimension sérieuse, c'est-à-dire une finalité utile, et une dimension ludique, c'est-à-dire un système de jeu matérialisé par des règles, des défis, des supports, des interactions et des feedbacks.</p>
      <p>Dans un contexte pédagogique, la finalité sérieuse est l'apprentissage. Le jeu n'est donc pas seulement là pour rendre une activité plus sympathique : il doit faire agir les apprenants d'une manière qui les aide à comprendre, appliquer, analyser, décider, créer ou coopérer.</p>
      <h3>Un jeu sérieux pédagogique doit faire tenir ensemble</h3>
      <ul>
        <li>un objectif pédagogique explicite ;</li>
        <li>un objectif ludique compréhensible par les joueurs ;</li>
        <li>des règles qui provoquent des actions utiles pour apprendre ;</li>
        <li>des feedbacks qui permettent de corriger, renforcer ou transférer ;</li>
        <li>un débriefing ou une trace pour rendre l'apprentissage visible.</li>
      </ul>
      <p>La question de conception centrale est donc : que doit faire le joueur pour réussir, et en quoi cette action l'aide-t-elle à apprendre ?</p>
    `,
  },
  {
    id: "categories",
    title: "Quelques familles de serious games",
    tag: "Typologie",
    summary: "Les ressources distinguent plusieurs finalités : apprendre, informer, simuler, sensibiliser, entraîner.",
    body: `
      <p>Les serious games peuvent poursuivre des finalités variées. Les exemples du corpus citent notamment les jeux d'apprentissage, de formation, d'information, de simulation, de sensibilisation, d'exercice physique ou de communication.</p>
      <ul>
        <li><strong>Edugames</strong> : jeux conçus pour faire apprendre des connaissances ou compétences.</li>
        <li><strong>Training games</strong> : jeux d'entraînement à une procédure, un geste ou une décision.</li>
        <li><strong>Newsgames</strong> : jeux qui font comprendre une actualité ou un phénomène social.</li>
        <li><strong>Advergames</strong> : jeux à finalité de communication ou promotion.</li>
        <li><strong>Exergames</strong> : jeux mobilisant l'activité physique.</li>
        <li><strong>Wargames et simulations</strong> : jeux pour tester des stratégies et scénarios.</li>
      </ul>
      <p>Pour un usage pédagogique, la famille importe moins que l'alignement : le type de jeu choisi doit correspondre aux apprentissages visés.</p>
    `,
  },
  {
    id: "distinctions",
    title: "Serious game, serious gaming, ludification, dégamification",
    tag: "Repères",
    summary: "Ces notions décrivent des manières différentes d'utiliser le jeu pour apprendre.",
    body: `
      <p><strong>Serious game</strong> : créer ou adapter un jeu pour une finalité sérieuse, ici pédagogique.</p>
      <p><strong>Serious gaming</strong> : utiliser un jeu existant tel quel comme support d'apprentissage, puis l'animer et le débriefer.</p>
      <p><strong>Ludification ou gamification</strong> : ajouter des éléments issus du jeu à une activité non ludique : progression, badges, niveaux, narration, défis, coopération, feedbacks.</p>
      <p><strong>Dégamification</strong> : retirer ou transformer les éléments d'un jeu existant qui détournent l'attention des objectifs pédagogiques.</p>
      <p>L'exemple du Trivial Pursuit pédagogique montre qu'il ne suffit pas de reprendre un jeu connu : il faut analyser ses règles et les adapter aux objectifs.</p>
    `,
  },
  {
    id: "constructionnisme",
    title: "Constructionnisme et instructionnisme",
    tag: "Théories",
    summary: "On peut apprendre en jouant, mais aussi apprendre en construisant un jeu.",
    body: `
      <p><strong>Instructionnisme</strong> : le jeu sert principalement de support pour exposer ou transmettre des contenus. Les apprenants jouent pour rencontrer, mobiliser ou réviser ces contenus.</p>
      <p><strong>Constructionnisme</strong> : les apprenants apprennent en produisant un objet tangible, par exemple un jeu, un jeu de cartes ou un prototype. La conception oblige à sélectionner, organiser, formuler, tester et expliquer les connaissances.</p>
      <p>Dans l'exemple Trivial Pursuit pédagogique, la fabrication des cartes est aussi importante que la partie : écrire une bonne question, une réponse attendue et un feedback oblige à comprendre la notion.</p>
    `,
  },
  {
    id: "alignement",
    title: "Pourquoi l'alignement est décisif",
    tag: "Méthode",
    summary: "Les éléments ludiques doivent servir les apprentissages, sinon ils les parasitent.",
    body: `
      <p>Un jeu sérieux peut échouer de deux manières : par pauvreté ludique, lorsque le jeu ne produit pas d'engagement réel, ou par faiblesse pédagogique, lorsque les mécaniques détournent l'attention de ce qu'il faut apprendre.</p>
      <p>L'alignement consiste à relier chaque objectif pédagogique à une action de joueur, une mécanique, un feedback et une trace observable.</p>
      <p>Si une règle, une énigme, une récompense ou une narration ne soutient aucun objectif, il faut la simplifier, la déplacer, la transformer ou la supprimer.</p>
    `,
  },
  {
    id: "dice-addie",
    title: "ADDIE et D.I.C.E.",
    tag: "Processus",
    summary: "ADDIE cadre le design pédagogique ; D.I.C.E. cadre la création du jeu.",
    body: `
      <p><strong>ADDIE</strong> est un cadre général de design pédagogique : analyser, designer, développer, implémenter, évaluer. Il aide à partir du besoin, du public, des objectifs et des critères d'évaluation avant de produire des supports.</p>
      <p><strong>D.I.C.E.</strong> est documenté dans le corpus du kit comme modèle générique de conception d'un serious game pédagogique : définir, imaginer, créer, évaluer. On l'utilise ici comme méthode opérationnelle pour passer du cadrage à un prototype jouable.</p>
      <p>Les deux méthodes se complètent : ADDIE garde le cap pédagogique global ; D.I.C.E. aide à concevoir le jeu lui-même, ses règles, ses supports, ses feedbacks et ses tests.</p>
      <ul>
        <li><strong>Définir</strong> : besoin, public, contraintes, objectifs pédagogiques, contenus sérieux et critères de réussite.</li>
        <li><strong>Imaginer</strong> : objectif ludique, type de jeu, mécaniques, règles, scénario, feedbacks et traces.</li>
        <li><strong>Créer</strong> : prototype jouable, supports, consignes, matériel, conditions de victoire et règles d'animation.</li>
        <li><strong>Évaluer</strong> : tests, observation, apprentissages, jouabilité, débriefing et itérations.</li>
      </ul>
      <p><strong>Question pivot :</strong> pour réussir le jeu, que doit faire le joueur, et en quoi cette action l'aide-t-elle à apprendre ?</p>
    `,
  },
];

const libraryDocuments = [
  {
    id: "doc-jeu-serieux",
    type: "doc",
    title: "Définir un jeu sérieux pédagogique",
    summary: "Définition complète et critères de pertinence.",
    body: definitionModules[0].body + definitionModules[1].body + `
      <h3>Critères de pertinence</h3>
      <ul>
        <li>Qu'apprend-on grâce au jeu ?</li>
        <li>Pourquoi le jeu est-il plus adapté qu'une activité non ludique ?</li>
        <li>Quelle action du joueur mobilise l'apprentissage visé ?</li>
        <li>Quel feedback permet de progresser ?</li>
        <li>Quelles traces permettront d'analyser ce qui a été compris, réussi ou bloqué ?</li>
        <li>Quel débriefing transforme l'expérience de jeu en apprentissage explicite ?</li>
      </ul>
      <h3>Constructionnisme et instructionnisme</h3>
      <p>Une activité peut être constructionniste lorsque les apprenants apprennent en produisant eux-mêmes un objet : jeu, cartes, prototype, règles, énigmes ou scénario. La production oblige à sélectionner, organiser, formuler, tester et expliquer les connaissances.</p>
      <p>L'instructionnisme conserve aussi sa place : transmettre explicitement des connaissances, consignes ou procédures peut préparer une phase de conception, de jeu ou de débriefing.</p>
    `,
  },
  {
    id: "doc-distinctions",
    type: "doc",
    title: "Distinguer les notions",
    summary: "Serious game, serious gaming, ludification, gamification, dégamification.",
    body: definitionModules[2].body,
  },
  {
    id: "doc-etat-art",
    type: "doc",
    title: "État de l'art synthétique",
    summary: "Repères issus de la veille et de la littérature grise.",
    body: `
      <p>Le corpus converge vers une idée centrale : un jeu sérieux pédagogique ne vaut pas par son thème ludique, mais par l'articulation entre objectif d'apprentissage, mécanique de jeu, accompagnement, feedback, débriefing et évaluation.</p>
      <h3>Définir le périmètre</h3>
      <p>La définition minimale présente le serious game comme un jeu dont la finalité première dépasse le divertissement. En pédagogie, cette finalité doit devenir objectifs explicites, actions observables et traces d'apprentissage.</p>
      <p><strong>Sources :</strong> Michael & Chen cités par Canopé ; Djaouti ; Alvarez.</p>
      <h3>Articuler jeu et apprentissage</h3>
      <p>Les travaux d'Alvarez et Marne soulignent la nécessité d'intégrer le contenu sérieux dans les règles, les décisions et les feedbacks, plutôt que juxtaposer une couche de jeu et une couche de contenu.</p>
      <p><strong>Sources :</strong> Alvarez 2007/2019 ; Marne 2014.</p>
      <h3>Choisir une stratégie</h3>
      <p>Djaouti distingue trois approches : utiliser un jeu existant, créer un jeu sur mesure, ou faire créer un jeu par les apprenants. Cette dernière piste rejoint le constructionnisme.</p>
      <p><strong>Sources :</strong> Djaouti 2016 ; Alvarez, Djaouti & Rampnoux 2016.</p>
      <h3>Concevoir, accompagner, débriefer</h3>
      <p>D.I.C.E. aide à passer du cadrage au prototype, mais les sources rappellent aussi le rôle de la médiation humaine : introduire l'activité, observer, aider, débriefer et transformer l'expérience en apprentissage explicite.</p>
      <p><strong>Sources :</strong> Marne 2014 ; Heidmann 2015 ; Canopé 2016 ; Alvarez 2019.</p>
      <h3>Rester critique</h3>
      <p>Lavigne montre que les serious games peuvent être vécus comme de mauvais jeux ou de mauvais supports pédagogiques lorsque la continuité entre plaisir, liberté et objectifs évaluables est rompue. Le jeu doit donc être justifié, testé et évalué.</p>
      <p><strong>Source :</strong> Lavigne 2016.</p>
      <h3>Sources citées</h3>
      <ul>
        <li>Alvarez, J. (2007). <em>Du jeu vidéo au Serious Game</em>.</li>
        <li>Alvarez, J. (2019). <em>Design des dispositifs et expériences de jeu sérieux</em>.</li>
        <li>Alvarez, J., Djaouti, D. & Rampnoux, O. (2012). <em>Introduction au Serious Game</em>.</li>
        <li>Alvarez, J., Djaouti, D. & Rampnoux, O. (2016). <em>Apprendre avec les serious games ?</em> Réseau Canopé.</li>
        <li>Djaouti, D. (2016). <em>Serious Games pour l'éducation : utiliser, créer, faire créer ?</em> Tréma.</li>
        <li>Heidmann, O. (2015). <em>How to create a serious game?</em></li>
        <li>Lavigne, M. (2016). <em>Les faiblesses ludiques et pédagogiques des serious games</em>.</li>
        <li>Marne, B. (2014). <em>Modèles et outils pour la conception de jeux sérieux</em>.</li>
      </ul>
    `,
  },
  {
    id: "doc-addie-dice",
    type: "doc",
    title: "Méthode ADDIE + D.I.C.E.",
    summary: "Passer du besoin pédagogique au prototype testable.",
    body: definitionModules[5].body + `
      <h3>Objectifs de conception</h3>
      <ul>
        <li>formuler un besoin pédagogique et des objectifs observables ;</li>
        <li>distinguer objectif pédagogique et objectif ludique ;</li>
        <li>transformer un apprentissage visé en actions de joueur ;</li>
        <li>choisir ou adapter des mécaniques utiles ;</li>
        <li>produire un prototype jouable et testable ;</li>
        <li>évaluer la jouabilité et les apprentissages.</li>
      </ul>
      <figure class="media-frame rich-media">
        <img src="assets/addie-dice.jpg" alt="Schéma ADDIE DICE et livrables">
        <figcaption>Correspondance entre ADDIE, D.I.C.E. et les livrables de conception.</figcaption>
      </figure>
      <h3>Correspondance rapide</h3>
      <table><tr><th>ADDIE</th><th>D.I.C.E.</th><th>Livrable</th></tr><tr><td>Analyse</td><td>Définir</td><td>Fiche de cadrage : besoin, public, objectifs, contraintes.</td></tr><tr><td>Design</td><td>Définir / Imaginer</td><td>Matrice objectifs-mécaniques-feedbacks-traces.</td></tr><tr><td>Développement</td><td>Créer</td><td>Prototype : règles, cartes, plateau, scénario, consignes et matériel.</td></tr><tr><td>Implémentation</td><td>Créer / Évaluer</td><td>Animation testée : déroulé, médiation, aides et débriefing.</td></tr><tr><td>Évaluation</td><td>Évaluer</td><td>Observations, retours, critères d'apprentissage, itérations.</td></tr></table>
      <h3>Sources de travail</h3>
      <p>ADDIE vient du design pédagogique général. D.I.C.E. est repris ici depuis le lexique de la ludification pédagogique et l'atelier Trivial Pursuit comme modèle de travail pour créer un serious game pédagogique.</p>
    `,
  },
  {
    id: "atelier-narratif",
    type: "atelier",
    title: "Scénario serious game narratif",
    summary: "Créer un parcours à embranchements avec choix, feedbacks et conséquences.",
    body: `
      <p><strong>Intention :</strong> transformer une situation d'apprentissage en récit interactif.</p>
      <p><strong>Durée :</strong> 2 à 3 heures pour une initiation, une demi-journée pour un prototype testable.</p>
      <h3>Déroulé</h3>
      <ol><li>Cadrer public, besoin et objectifs.</li><li>Définir un rôle joueur et une situation initiale.</li><li>Écrire une micro-situation : perturbation, choix, feedback, conséquence.</li><li>Prototyper 3 à 5 scènes.</li><li>Tester en binôme ou groupe croisé.</li><li>Débriefer les apprentissages et les blocages.</li></ol>
      <p><strong>Vigilance :</strong> chaque choix doit produire une conséquence utile, pas seulement une branche décorative.</p>
    `,
  },
  {
    id: "exemple-trivial",
    type: "exemple",
    title: "Trivial Pursuit pédagogique",
    summary: "Exemple issu du cahier des charges d'un atelier pédagogique d'une demi-journée.",
    body: `
      <p>Cet exemple reprend le cahier des charges d'un atelier pédagogique d'une demi-journée intitulé <em>Jouer avec ses méthodes d'enseignement : dégamifier pour motiver</em>. Il sert ici de cas guidé autonome pour comprendre comment adapter un jeu connu à des objectifs d'apprentissage.</p>
      <figure class="media-frame rich-media">
        <img src="assets/trivial-pursuit-plateau-couleurs.png" alt="Plateau de Trivial Pursuit pédagogique">
        <figcaption>Plateau réutilisable pour une variante pédagogique.</figcaption>
      </figure>
      <h3>Contexte</h3>
      <ul>
        <li><strong>Contexte :</strong> le jeu à créer doit pouvoir être utilisable dans toute activité pédagogique visant à atteindre les objectifs cités dans le cahier des charges.</li>
        <li><strong>Public cible :</strong> toute personne ayant une mission d'enseignement, d'animation, de formation ou de conception pédagogique à Centrale Lille.</li>
        <li><strong>Besoin :</strong> favoriser l'engagement des étudiants par le recours au jeu d'apprentissage.</li>
      </ul>
      <h3>Objectifs pédagogiques</h3>
      <ol>
        <li>Définir ce qu'est un jeu d'apprentissage et l'ensemble des notions corrélées, niveau 1 : mémoriser.</li>
        <li>Associer des exemples d'utilisation de jeux d'apprentissage avec la typologie des jeux utilisés et les types d'objectifs pédagogiques visés, niveau 2 : comprendre.</li>
        <li>Décrire et appliquer les techniques de scénarisation, d'adaptation et de développement de jeux d'apprentissage dans un cadre d'enseignement, niveau 3 : appliquer.</li>
      </ol>
      <h3>Choix du jeu</h3>
      <p>La création du jeu se fait par articulation entre dégamification et serious gaming. Le jeu de base choisi est le Trivial Pursuit, car il permet d'utiliser les cases intermédiaires, les cases camembert et la progression finale pour poser des questions de mémorisation, de compréhension et d'application.</p>
      <p>Il est aussi relativement universel, bien connu, facile à modifier et simple à créer manuellement. Ses modalités de victoire restent des prétextes pour générer de l'apprentissage et favoriser l'engagement.</p>
      <h3>Contraintes de mise en œuvre</h3>
      <ul>
        <li>Partie de 30 minutes maximum.</li>
        <li>Au minimum 12 questions de niveau 1 et 3 questions de niveau 2.</li>
        <li>Questions d'application pour la progression finale.</li>
        <li>Règles simplifiées : retirer ce qui ralentit ou détourne des objectifs pédagogiques.</li>
        <li>Pas de thèmes décoratifs : une case correspond à une question tirée au hasard.</li>
        <li>Une carte contient une question, une réponse attendue et, si possible, un feedback.</li>
      </ul>
      <h3>Déroulé source</h3>
      <table><tr><th>Moment</th><th>Étape</th><th>Actions</th></tr><tr><td>14h20-14h45</td><td>Définir</td><td>Présenter le cahier des charges, les objectifs, les contraintes et les règles à analyser.</td></tr><tr><td>14h45-15h30</td><td>Imaginer</td><td>Trier, retirer, modifier ou créer les règles nécessaires.</td></tr><tr><td>15h30-16h30</td><td>Créer</td><td>Produire les cartes, le plateau, les pions, les camemberts, le dé et les règles.</td></tr><tr><td>16h30-17h00</td><td>Évaluer</td><td>Jouer, observer, noter les améliorations et vérifier les apprentissages.</td></tr></table>
    `,
  },
  {
    id: "atelier-escape",
    type: "atelier",
    title: "Scénario escape game pédagogique",
    summary: "Concevoir mission, énigmes, indices, rôle du maître du jeu et débriefing.",
    body: `
      <p>Un escape game pédagogique combine une mission, des énigmes alignées, des indices progressifs, une contrainte de temps et un débriefing.</p>
      <h3>Étapes</h3>
      <ol><li>Définir les objectifs pédagogiques.</li><li>Écrire la mission et le contexte.</li><li>Concevoir 2 à 4 énigmes alignées.</li><li>Prévoir les indices et remédiations.</li><li>Tester les blocages.</li><li>Débriefer les apprentissages.</li></ol>
      <p><strong>Vigilance :</strong> une énigme trop opaque bloque le jeu et l'apprentissage. Prévoir des aides graduées.</p>
    `,
  },
  {
    id: "atelier-ludification",
    type: "atelier",
    title: "Guide de ludification",
    summary: "Ajouter des leviers ludiques à une activité sans perdre le sens pédagogique.",
    body: `
      <p>La ludification part d'un diagnostic : quel problème veut-on résoudre ? Manque de feedback, faible engagement, progression invisible, difficulté à coopérer ?</p>
      <h3>Leviers fréquents</h3>
      <ul><li>progression visible ;</li><li>défis courts ;</li><li>feedbacks immédiats ;</li><li>coopération ;</li><li>choix et autonomie ;</li><li>narration légère ;</li><li>niveaux de difficulté.</li></ul>
      <p><strong>Vigilance :</strong> ne pas maquiller une activité mal cadrée. Le levier ludique doit résoudre un problème précis.</p>
    `,
  },
  {
    id: "gabarit-fiche",
    type: "gabarit",
    title: "Fiche de conception",
    summary: "Structure complète pour cadrer un jeu pédagogique.",
    template: `# Fiche de conception

## Cadrage
- Titre :
- Public cible :
- Durée :
- Modalité :
- Nombre de joueurs :

## Besoin pédagogique
- Problème identifié :
- Ce que le jeu doit améliorer :

## Objectifs pédagogiques
À l'issue de l'activité, les apprenants seront capables de :
1. 
2. 
3. 

## Objectifs ludiques
Les joueurs doivent :
1. 
2. 

## Alignement
| Objectif | Action joueur | Mécanique | Feedback | Trace |
| --- | --- | --- | --- | --- |
| | | | | |

## Règles et animation
- Mise en place :
- Tour de jeu :
- Aides :
- Fin :
- Débriefing :`,
  },
  {
    id: "gabarit-cartes",
    type: "gabarit",
    title: "Cartes questions",
    summary: "Modèle de carte avec réponse attendue et feedback.",
    template: `# Carte question

- Catégorie :
- Niveau : connaître / comprendre / appliquer
- Question :
- Réponse attendue :
- Feedback :
- Source ou ressource :
- Variante ou indice :`,
  },
  {
    id: "gabarit-enigme",
    type: "gabarit",
    title: "Énigme pédagogique",
    summary: "Concevoir une énigme alignée et testable.",
    template: `# Énigme pédagogique

- Nom :
- Objectif pédagogique :
- Durée estimée :
- Matériel :
- Réponse attendue :

## Mécanisme
1. 
2. 
3. 

## Indices progressifs
| Palier | Déclencheur | Indice |
| --- | --- | --- |
| 1 | blocage léger | |
| 2 | blocage long | |
| 3 | presque solution | |

## Feedback et débriefing
- Réussite :
- Erreur fréquente :
- Question de débriefing :`,
  },
  {
    id: "exemple-odyssee",
    type: "exemple",
    title: "L'Odyssée de l'enseignement",
    summary: "Livre-jeu pédagogique et ressource immersive.",
    body: `
      <p>L'Odyssée de l'enseignement illustre l'usage d'un récit à embranchements pour soutenir l'immersion narrative, l'essai-erreur, la prise de décision et la métacognition.</p>
      <p>Le cas sert de référence pour comprendre comment une histoire dont vous êtes le héros peut devenir une activité pédagogique, à condition que les choix, feedbacks et conséquences soient alignés sur les objectifs.</p>
    `,
  },
];

const checklistItems = [
  "Besoin pédagogique formulé",
  "Objectifs observables",
  "Public et contraintes identifiés",
  "Mécanique reliée aux objectifs",
  "Feedbacks prévus",
  "Trace d'évaluation définie",
  "Règles testables en moins de 5 minutes",
  "Débriefing préparé",
  "Droits des ressources vérifiés",
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}

function stripHtml(value) {
  const div = document.createElement("div");
  div.innerHTML = value || "";
  return div.textContent || div.innerText || "";
}

function findTerm(term) {
  return data.lexique.find((item) => item.terme === term) || data.lexique.find((item) => item.terme.toLowerCase().includes(term.toLowerCase()));
}

function toast(message) {
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 1800);
}

async function copyText(text, label = "Copié") {
  try {
    await navigator.clipboard.writeText(text);
    toast(label);
  } catch {
    toast("Copie indisponible dans ce contexte");
  }
}

function downloadText(filename, text) {
  const type = filename.endsWith(".json") ? "application/json;charset=utf-8" : "text/markdown;charset=utf-8";
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function openHelp(title, body) {
  $("#help-title").textContent = title;
  $("#help-body").textContent = body;
  $("#help-modal").hidden = false;
}

function closeModals() {
  $$(".modal").forEach((modal) => {
    modal.hidden = true;
  });
}

function openResource(item) {
  $("#resource-type").textContent = item.type || item.kind || "Ressource";
  $("#resource-title").textContent = item.title || item.terme || item.nom;
  const body = item.html || `
    <p>${escapeHtml(item.body || item.definition || item.description || "")}</p>
    ${item.details ? `<h3>Notes et exemples</h3><p>${escapeHtml(item.details)}</p>` : ""}
    ${item.link ? `<p><strong>Lien :</strong> ${escapeHtml(item.link)}</p>` : ""}
  `;
  $("#resource-body").innerHTML = body;
  $("#resource-modal").hidden = false;
}

function canonicalTab(tabName) {
  if ((tabName || "").startsWith("studio-")) return "studio";
  return {
    accueil: "presentation",
    comprendre: "presentation",
    "etat-art": "presentation",
    exemples: "concevoir",
    matrice: "studio",
    cartes: "studio",
  }[tabName] || tabName;
}

function navTab(tabName) {
  return {
    bibliotheque: "ressources",
  }[tabName] || tabName;
}

function tabAnchor(tabName) {
  if ((tabName || "").startsWith("studio-")) return tabName;
  return {
    matrice: "studio-imaginer",
    cartes: "studio-creer",
  }[tabName] || "";
}

function showTab(tabName) {
  const target = canonicalTab(tabName);
  const navTarget = navTab(target);
  if (!$(`#${target}.view`)) return;
  $$(".tab").forEach((item) => item.classList.toggle("is-active", item.dataset.tab === navTarget));
  $$(".view").forEach((item) => item.classList.toggle("is-active", item.id === target));
  const anchor = tabAnchor(tabName);
  history.replaceState(null, "", `#${anchor || target}`);
  if (anchor) {
    const node = document.getElementById(anchor);
    if (node) {
      requestAnimationFrame(() => node.scrollIntoView({ block: "start" }));
      setTimeout(() => node.scrollIntoView({ block: "start" }), 50);
    }
  } else {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));
    setTimeout(() => window.scrollTo(0, 0), 0);
  }
}

function projectValues() {
  return {
    title: $("#project-title").value.trim(),
    audience: $("#project-audience").value.trim(),
    duration: $("#project-duration").value,
    mode: $("#project-mode").value,
    need: $("#project-need").value.trim(),
    objective: $("#project-objective").value.trim(),
    level: $("#project-level").value,
    constraint: $("#project-constraint").value,
    content: $("#project-content").value.trim(),
    success: $("#project-success").value.trim(),
    strategy: $("#project-strategy").value,
    ludicObjective: $("#project-ludic-objective").value.trim(),
  };
}

const strategyLabels = {
  adaptation: "Adapter ou dégamifier un jeu existant",
  seriousGaming: "Utiliser un jeu existant tel quel",
  custom: "Créer un jeu simple sur mesure",
  constructionist: "Faire créer le jeu par les apprenants",
};

const strategyGuidance = {
  adaptation: {
    deliverables: ["jeu source à analyser", "règles à conserver, retirer ou transformer", "cartes ou situations alignées", "règle courte de test"],
    vigilance: "Identifier ce qui, dans le jeu source, soutient l'apprentissage et ce qui risque de le parasiter.",
    next: "Choisir une règle du jeu source et écrire l'action d'apprentissage qu'elle doit provoquer.",
    seedAction: "Répondre, justifier ou appliquer une notion dans une règle adaptée du jeu source",
    seedMechanic: "Règle transformée depuis un jeu existant",
  },
  seriousGaming: {
    deliverables: ["jeu support", "séquence d'animation", "questions de débriefing", "grille d'observation"],
    vigilance: "Le jeu peut rester inchangé, mais l'animation et le débriefing doivent expliciter les apprentissages.",
    next: "Écrire le moment où l'animateur fait le lien entre l'action de jeu et l'objectif pédagogique.",
    seedAction: "Jouer puis expliciter les décisions, erreurs ou stratégies observées",
    seedMechanic: "Jeu existant + débriefing guidé",
  },
  custom: {
    deliverables: ["boucle de jeu minimale", "règles testables", "supports rapides", "protocole de test"],
    vigilance: "Limiter le prototype à une boucle jouable avant d'ajouter narration, matériel ou variantes.",
    next: "Décrire la plus petite action de jeu capable de produire un feedback pédagogique.",
    seedAction: "Réaliser une action courte puis recevoir un feedback explicatif",
    seedMechanic: "Boucle action-feedback-progression",
  },
  constructionist: {
    deliverables: ["consigne de production", "critères de conception", "test croisé", "trace réflexive"],
    vigilance: "Évaluer la démarche de conception autant que l'objet produit par les apprenants.",
    next: "Définir ce que les apprenants doivent construire, tester, justifier et améliorer.",
    seedAction: "Produire un élément de jeu, le tester, puis justifier une amélioration",
    seedMechanic: "Production constructionniste + test croisé",
  },
};

function strategyLabel(value) {
  return strategyLabels[value] || value || "Stratégie à préciser";
}

function designGuidance(project) {
  const base = strategyGuidance[project.strategy] || strategyGuidance.adaptation;
  const checkpoints = [
    `Niveau dominant : ${project.level}`,
    `Contrainte à surveiller : ${project.constraint}`,
  ];
  if (project.mode === "Autoformation") checkpoints.push("Prévoir des feedbacks autonomes et des remédiations explicites.");
  if (project.constraint === "Grand groupe") checkpoints.push("Rendre les consignes visibles et limiter les manipulations longues.");
  if (project.level === "Créer") checkpoints.push("Prévoir une trace de conception, pas seulement une performance de jeu.");
  return { ...base, checkpoints };
}

function trivialValues() {
  return {
    title: $("#tp-title").value.trim(),
    winCondition: $("#tp-win-condition").value.trim(),
    level1Cards: Number($("#tp-level1-count").value || 0),
    level2Cards: Number($("#tp-level2-count").value || 0),
    level3Cards: Number($("#tp-level3-count").value || 0),
    material: $("#tp-material").value.trim(),
    finalTask: $("#tp-final-task").value.trim(),
    debrief: $("#tp-debrief").value.trim(),
  };
}

function checklistReport() {
  return checklistItems.map((item, index) => ({
    item,
    checked: Boolean(state.checks[index]),
  }));
}

function diceProject() {
  const project = projectValues();
  return {
    metadata: {
      version: "2026-05-23.dice-1",
      signature: "JEDI-OpenLab · Pédagogie ouverte, conçue avec soin.",
      export: new Date().toISOString(),
    },
    method: "D.I.C.E.",
    define: {
      title: project.title,
      audience: project.audience,
      duration: project.duration,
      mode: project.mode,
      need: project.need,
      pedagogicalObjective: project.objective,
      dominantLevel: project.level,
      mainConstraint: project.constraint,
      contents: project.content,
      successCriteria: project.success,
    },
    imagine: {
      strategy: {
        id: project.strategy,
        label: strategyLabel(project.strategy),
      },
      ludicObjective: project.ludicObjective,
      alignmentMatrix: state.matrix,
    },
    create: {
      cards: state.cards,
      trivialPursuitModule: trivialValues(),
    },
    evaluate: {
      checklist: checklistReport(),
      testProtocol: [
        "Faire jouer une boucle courte du prototype.",
        "Observer compréhension des règles, engagement, feedbacks et traces.",
        "Débriefer ce qui a été appris, ce qui a bloqué et ce qui doit être simplifié.",
      ],
    },
  };
}

function diceJson() {
  return JSON.stringify(diceProject(), null, 2);
}

function trivialMarkdown() {
  const tp = trivialValues();
  return `## Module guidé : plateau progressif type Trivial Pursuit

- Nom du module : ${tp.title}
- Condition de victoire : ${tp.winCondition}
- Cartes niveau 1 : ${tp.level1Cards}
- Cartes niveau 2 : ${tp.level2Cards}
- Cartes niveau 3 : ${tp.level3Cards}
- Matériel : ${tp.material}

### Tâche finale

${tp.finalTask}

### Débriefing prévu

${tp.debrief}
`;
}

function checklistMarkdown() {
  return checklistReport().map((entry) => `- [${entry.checked ? "x" : " "}] ${entry.item}`).join("\n");
}

function matrixSeedFromProject(project) {
  const guidance = designGuidance(project);
  return {
    objective: project.objective,
    action: guidance.seedAction,
    mechanic: guidance.seedMechanic,
    feedback: "Feedback explicatif, conséquence de jeu ou correction commentée",
    trace: project.success || "Réponse, justification, production ou observation de groupe",
  };
}

function briefMarkdown() {
  const project = projectValues();
  const guidance = designGuidance(project);
  return `# ${project.title}

## D - Définir

- Public : ${project.audience}
- Durée : ${project.duration}
- Modalité : ${project.mode}
- Niveau dominant : ${project.level}
- Contrainte forte : ${project.constraint}

### Besoin pédagogique

${project.need}

### Objectif pédagogique

${project.objective}

### Contenus ou notions

${project.content}

### Critères de réussite

${project.success}

## I - Imaginer

- Stratégie : ${strategyLabel(project.strategy)}
- Objectif ludique : ${project.ludicObjective}
- Livrables prioritaires : ${guidance.deliverables.join(", ")}
- Vigilance : ${guidance.vigilance}

### Matrice d'alignement

${matrixMarkdown()}

## C - Créer

${trivialMarkdown()}

${cardsMarkdown()}

## E - Évaluer

${checklistMarkdown()}

`;
}

function renderRecommendation() {
  const project = projectValues();
  const guidance = designGuidance(project);
  $("#recommendation").innerHTML = `
    <div class="reco-title">${escapeHtml(strategyLabel(project.strategy))}</div>
    <ul class="reco-list">
      <li><strong>Objectif ludique :</strong> ${escapeHtml(project.ludicObjective || "À formuler")}</li>
      <li><strong>Livrables :</strong> ${escapeHtml(guidance.deliverables.join(" · "))}</li>
      <li><strong>Prochaine action :</strong> ${escapeHtml(guidance.next)}</li>
      <li><strong>Vigilance :</strong> ${escapeHtml(guidance.vigilance)}</li>
      ${guidance.checkpoints.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function renderChecklist() {
  $("#checklist").innerHTML = checklistItems
    .map((item, index) => {
      const checked = state.checks[index] ? "checked" : "";
      return `<label class="check-item"><input type="checkbox" data-check="${index}" ${checked}><span>${item}</span></label>`;
    })
    .join("");
}

function saveMatrix() {
  localStorage.setItem("gdp-matrix", JSON.stringify(state.matrix));
}

function matrixMarkdown() {
  const rows = state.matrix.length ? state.matrix : [{ objective: "", action: "", mechanic: "", feedback: "", trace: "" }];
  return [
    "| Objectif pédagogique | Action du joueur | Mécanique | Feedback | Trace / évaluation |",
    "| --- | --- | --- | --- | --- |",
    ...rows.map((row) => `| ${row.objective || ""} | ${row.action || ""} | ${row.mechanic || ""} | ${row.feedback || ""} | ${row.trace || ""} |`),
  ].join("\n");
}

function renderMatrix() {
  const matrixLabels = {
    objective: "Objectif",
    action: "Action joueur",
    mechanic: "Mécanique",
    feedback: "Feedback",
    trace: "Trace",
  };
  if (!state.matrix.length) {
    state.matrix.push({
      objective: "Concevoir un prototype aligné",
      action: "Associer objectif, mécanique et feedback",
      mechanic: "Matrice de conception",
      feedback: "Contrôle d'alignement",
      trace: "Fiche complétée",
    });
    saveMatrix();
  }
  $("#matrix-body").innerHTML = state.matrix
    .map(
      (row, index) => `
      <tr>
        ${["objective", "action", "mechanic", "feedback", "trace"]
          .map((key) => `<td data-label="${matrixLabels[key]}"><input data-row="${index}" data-key="${key}" value="${escapeHtml(row[key] || "")}"></td>`)
          .join("")}
        <td data-label="Action"><button class="remove-row" type="button" data-remove="${index}" title="Supprimer">×</button></td>
      </tr>
    `
    )
    .join("");
}

function saveCards() {
  localStorage.setItem("gdp-cards", JSON.stringify(state.cards));
}

function cardsMarkdown() {
  if (!state.cards.length) return "# Cartes questions\n\nAucune carte.";
  return `# Cartes questions

${state.cards
  .map(
    (card, index) => `## Carte ${index + 1} - ${card.category}

- Niveau : ${card.level}
- Question : ${card.question}
- Réponse attendue : ${card.answer}
- Feedback : ${card.feedback}
`
  )
  .join("\n")}`;
}

function renderCards() {
  $("#card-count").textContent = state.cards.length;
  $("#cards-list").innerHTML = state.cards.length
    ? state.cards
        .map(
          (card, index) => `
        <article class="card-preview">
          <div class="card-meta">
            <span class="pill">${escapeHtml(card.category)}</span>
            <span class="pill">${escapeHtml(card.level)}</span>
          </div>
          <h3>${escapeHtml(card.question)}</h3>
          <p><strong>Réponse :</strong> ${escapeHtml(card.answer)}</p>
          <p><strong>Feedback :</strong> ${escapeHtml(card.feedback)}</p>
          <button class="secondary-action" type="button" data-remove-card="${index}">Retirer</button>
        </article>
      `
        )
        .join("")
    : `<p class="muted">Aucune carte.</p>`;
}

function resourceCollections() {
  return [
    ...data.lexique.map((item, index) => ({
      id: `lexique-${index}`,
      type: "Lexique",
      title: item.terme,
      body: item.definition,
      details: item.details,
      kind: "lexique",
    })),
    ...data.exemples.map((item, index) => ({
      id: `exemple-${index}`,
      type: "Exemple",
      title: item.nom,
      body: `${item.type_jeu || ""} ${item.support || ""} ${item.description || ""}`,
      details: item.description,
      kind: "exemples",
    })),
    ...data.outils.map((item, index) => ({
      id: `outil-${index}`,
      type: "Outil",
      title: item.nom,
      body: `${item.categorie || ""} ${item.description || ""}`,
      details: item.description,
      link: item.lien,
      kind: "outils",
    })),
  ];
}

function renderResources() {
  const query = $("#resource-search").value.trim().toLowerCase();
  const kind = $("#resource-kind").value;
  const results = resourceCollections()
    .filter((item) => kind === "all" || item.kind === kind)
    .filter((item) => !query || `${item.title} ${item.body} ${item.details || ""}`.toLowerCase().includes(query));
  $("#resource-results").innerHTML = results
    .map(
      (item) => `
      <button class="resource-card as-button" type="button" data-resource-id="${item.id}">
        <span class="type">${escapeHtml(item.type)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(stripHtml(item.body || "")).slice(0, 260)}</p>
        <span class="card-cta">Ouvrir la ressource</span>
      </button>
    `
    )
    .join("");
}

function renderHomeConcepts() {
  const terms = presentationPriorityTerms.map(findTerm).filter(Boolean).slice(0, 8);
  $("#home-concepts").innerHTML = terms
    .map(
      (item) => `
      <button class="concept-card" type="button" data-term="${escapeHtml(item.terme)}">
        <span class="type">Notion</span>
        <h3>${escapeHtml(item.terme)}</h3>
        <p>${escapeHtml(item.definition).slice(0, 190)}</p>
        <span class="card-cta">Ouvrir la définition</span>
      </button>
    `
    )
    .join("");
}

function renderDefinitionModules() {
  $("#definition-modules").innerHTML = definitionModules
    .filter((item) => item.id !== "dice-addie")
    .map(
      (item) => `
      <button class="module-card" type="button" data-module-id="${item.id}">
        <span class="type">${escapeHtml(item.tag)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
        <span class="card-cta">Lire la fiche</span>
      </button>
    `
    )
    .join("");
}

function renderPriorityLexicon() {
  const terms = presentationPriorityTerms.map(findTerm).filter(Boolean);
  $("#priority-lexicon").innerHTML = terms
    .map(
      (item) => `
      <button class="resource-card as-button" type="button" data-term="${escapeHtml(item.terme)}">
        <span class="type">Lexique</span>
        <h3>${escapeHtml(item.terme)}</h3>
        <p>${escapeHtml(item.definition).slice(0, 260)}</p>
        <span class="card-cta">Ouvrir la définition</span>
      </button>
    `
    )
    .join("");
}

function libraryTypeLabel(type) {
  return {
    doc: "Doc",
    atelier: "Scénario",
    gabarit: "Gabarit",
    exemple: "Exemple",
  }[type] || type;
}

function renderLibrary() {
  const docs = libraryDocuments.filter((doc) => state.libraryFilter === "all" || doc.type === state.libraryFilter);
  $("#library-list").innerHTML = docs
    .map(
      (doc) => `
      <button class="library-card" type="button" data-library-id="${doc.id}">
        <span class="type">${escapeHtml(libraryTypeLabel(doc.type))}</span>
        <h3>${escapeHtml(doc.title)}</h3>
        <p>${escapeHtml(doc.summary)}</p>
        <span class="card-cta">Lire dans la bibliothèque</span>
      </button>
    `
    )
    .join("");
  const currentId = $("#library-reader").dataset.current;
  const currentIsVisible = docs.some((doc) => doc.id === currentId);
  if (!currentIsVisible && docs.length) {
    renderLibraryReader(docs[0].id);
  } else if (!docs.length) {
    $("#library-reader").dataset.current = "";
    $("#library-reader").innerHTML = "";
  }
}

function renderLibraryReader(id) {
  const doc = libraryDocuments.find((item) => item.id === id);
  if (!doc) return;
  $("#library-reader").dataset.current = id;
  const template = doc.template ? `<pre><code>${escapeHtml(doc.template)}</code></pre>` : "";
  $("#library-reader").innerHTML = `
    <div class="row-heading">
      <div>
        <p class="eyebrow">${escapeHtml(libraryTypeLabel(doc.type))}</p>
        <h2>${escapeHtml(doc.title)}</h2>
      </div>
      ${doc.template ? `<button class="secondary-action" type="button" data-copy-template="${doc.id}">Copier</button>` : ""}
    </div>
    <div class="rich-text">${doc.body || ""}${template}</div>
  `;
}

function bindEvents() {
  $$(".tab[data-tab]").forEach((tab) => {
    tab.addEventListener("click", () => showTab(tab.dataset.tab));
  });

  document.addEventListener("click", (event) => {
    const help = event.target.closest(".help-button");
    if (help) {
      event.preventDefault();
      event.stopPropagation();
      openHelp(help.dataset.helpTitle, help.dataset.helpBody);
      return;
    }

    const jump = event.target.closest("[data-jump]");
    if (jump) showTab(jump.dataset.jump);

    const scrollTarget = event.target.closest("[data-scroll-target]");
    if (scrollTarget) {
      const target = document.getElementById(scrollTarget.dataset.scrollTarget);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const openTerm = event.target.closest("[data-open-term]");
    if (openTerm) {
      const item = findTerm(openTerm.dataset.openTerm);
      if (item) openResource({ type: "Lexique", title: item.terme, body: item.definition, details: item.details });
    }

    const openLibrary = event.target.closest("[data-open-library]");
    if (openLibrary) {
      showTab("bibliotheque");
      state.libraryFilter = "all";
      $$(".filter-chip").forEach((chip) => chip.classList.toggle("is-active", chip.dataset.libraryFilter === "all"));
      renderLibrary();
      renderLibraryReader(openLibrary.dataset.openLibrary);
    }

    if (event.target.matches("[data-close-modal]")) closeModals();

    const moduleButton = event.target.closest("[data-module-id]");
    if (moduleButton) {
      const item = definitionModules.find((module) => module.id === moduleButton.dataset.moduleId);
      openResource({ type: item.tag, title: item.title, html: item.body });
    }

    const termButton = event.target.closest("[data-term]");
    if (termButton) {
      const item = findTerm(termButton.dataset.term);
      openResource({ type: "Lexique", title: item.terme, body: item.definition, details: item.details });
    }

    const resourceButton = event.target.closest("[data-resource-id]");
    if (resourceButton) {
      const item = resourceCollections().find((resource) => resource.id === resourceButton.dataset.resourceId);
      openResource(item);
    }

    const libraryButton = event.target.closest("[data-library-id]");
    if (libraryButton) renderLibraryReader(libraryButton.dataset.libraryId);

    const filter = event.target.closest("[data-library-filter]");
    if (filter) {
      state.libraryFilter = filter.dataset.libraryFilter;
      $$(".filter-chip").forEach((chip) => chip.classList.toggle("is-active", chip === filter));
      $("#library-reader").dataset.current = "";
      renderLibrary();
    }

    const copyTemplate = event.target.closest("[data-copy-template]");
    if (copyTemplate) {
      const doc = libraryDocuments.find((item) => item.id === copyTemplate.dataset.copyTemplate);
      copyText(doc.template, "Gabarit copié");
    }
  });

  ["#project-form", "#imagine-form", "#trivial-module-form"].forEach((selector) => {
    $$("input, select, textarea", $(selector)).forEach((field) => {
      field.addEventListener("input", renderRecommendation);
      field.addEventListener("change", renderRecommendation);
    });
  });

  $("#copy-brief").addEventListener("click", () => copyText(briefMarkdown(), "Dossier copié"));
  $("#download-brief").addEventListener("click", () => downloadText("dossier-dice-game-design-pedagogique.md", briefMarkdown()));
  $("#copy-json").addEventListener("click", () => copyText(diceJson(), "JSON copié"));
  $("#download-json").addEventListener("click", () => downloadText("dossier-dice-game-design-pedagogique.json", diceJson()));
  $("#add-reco-to-matrix").addEventListener("click", () => {
    const project = projectValues();
    state.matrix.push(matrixSeedFromProject(project));
    saveMatrix();
    renderMatrix();
    toast("Ligne ajoutée à la matrice");
  });

  $("#checklist").addEventListener("change", (event) => {
    const index = event.target.dataset.check;
    if (index === undefined) return;
    state.checks[index] = event.target.checked;
    localStorage.setItem("gdp-checks", JSON.stringify(state.checks));
  });

  $("#add-row").addEventListener("click", () => {
    state.matrix.push({ objective: "", action: "", mechanic: "", feedback: "", trace: "" });
    saveMatrix();
    renderMatrix();
  });
  $("#copy-matrix").addEventListener("click", () => copyText(matrixMarkdown(), "Matrice copiée"));
  $("#clear-matrix").addEventListener("click", () => {
    state.matrix = [];
    saveMatrix();
    renderMatrix();
  });
  $("#matrix-body").addEventListener("input", (event) => {
    const row = Number(event.target.dataset.row);
    const key = event.target.dataset.key;
    if (!Number.isNaN(row) && key) {
      state.matrix[row][key] = event.target.value;
      saveMatrix();
    }
  });
  $("#matrix-body").addEventListener("click", (event) => {
    const index = event.target.dataset.remove;
    if (index === undefined) return;
    state.matrix.splice(Number(index), 1);
    saveMatrix();
    renderMatrix();
  });

  $("#add-card").addEventListener("click", () => {
    state.cards.push({
      category: $("#card-category").value.trim(),
      level: $("#card-level").value,
      question: $("#card-question").value.trim(),
      answer: $("#card-answer").value.trim(),
      feedback: $("#card-feedback").value.trim(),
    });
    saveCards();
    renderCards();
  });
  $("#copy-cards").addEventListener("click", () => copyText(cardsMarkdown(), "Cartes copiées"));
  $("#copy-trivial-spec").addEventListener("click", () => copyText(trivialMarkdown(), "Cahier des charges copié"));
  $("#cards-list").addEventListener("click", (event) => {
    const index = event.target.dataset.removeCard;
    if (index === undefined) return;
    state.cards.splice(Number(index), 1);
    saveCards();
    renderCards();
  });

  $("#resource-search").addEventListener("input", renderResources);
  $("#resource-kind").addEventListener("change", renderResources);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModals();
  });
}

renderHomeConcepts();
renderDefinitionModules();
renderPriorityLexicon();
renderRecommendation();
renderChecklist();
renderMatrix();
renderCards();
renderResources();
renderLibrary();
bindEvents();

if (location.hash) {
  const requested = location.hash.replace("#", "");
  const target = canonicalTab(requested);
  if ($(`#${target}.view`)) showTab(target);
}

window.addEventListener("hashchange", () => {
  const requested = location.hash.replace("#", "");
  const target = canonicalTab(requested);
  if ($(`#${target}.view`)) showTab(target);
});
