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
      <p>ADDIE structure le design pédagogique : analyser, designer, développer, implémenter, évaluer.</p>
      <p>D.I.C.E. structure le game design pédagogique : définir le contenu sérieux, imaginer le principe de jeu, créer le prototype, évaluer l'efficacité et la jouabilité.</p>
      <p>Les deux méthodes se complètent : ADDIE évite de perdre le besoin pédagogique ; D.I.C.E. aide à passer de ce besoin à un prototype jouable, testable et améliorable.</p>
      <ul>
        <li><strong>Définir</strong> : besoins, contexte, ressources, objectifs et contenus sérieux.</li>
        <li><strong>Imaginer</strong> : concept de jeu, mécaniques, règles, scénario, énigmes ou cartes.</li>
        <li><strong>Créer</strong> : prototype, supports de jeu, consignes et documentation.</li>
        <li><strong>Évaluer</strong> : tests usagers, bilan, satisfaction, évaluation et itérations.</li>
      </ul>
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
      <figure class="media-frame rich-media">
        <img src="assets/addie-dice.jpg" alt="Schéma ADDIE DICE et livrables">
        <figcaption>Correspondance entre ADDIE, D.I.C.E. et les livrables de conception.</figcaption>
      </figure>
      <h3>Correspondance rapide</h3>
      <table><tr><th>ADDIE</th><th>D.I.C.E.</th><th>Livrable</th></tr><tr><td>Analyse</td><td>Définir</td><td>Fiche de cadrage</td></tr><tr><td>Design</td><td>Imaginer</td><td>Matrice objectifs-mécaniques</td></tr><tr><td>Développement</td><td>Créer</td><td>Prototype</td></tr><tr><td>Évaluation</td><td>Évaluer</td><td>Retours et itérations</td></tr></table>
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
    summary: "Exemple de dégamification avec cahier des charges remanié.",
    body: `
      <p>Le Trivial Pursuit pédagogique est un exemple de dégamification : un jeu connu sert de base, puis ses règles sont simplifiées et transformées pour servir des objectifs d'apprentissage.</p>
      <figure class="media-frame rich-media">
        <img src="assets/trivial-pursuit-plateau-couleurs.png" alt="Plateau de Trivial Pursuit pédagogique">
        <figcaption>Plateau réutilisable pour une variante pédagogique.</figcaption>
      </figure>
      <h3>Cahier des charges</h3>
      <ul>
        <li><strong>Objectif pédagogique :</strong> faire travailler les notions de serious game, serious gaming, dégamification, objectifs ludiques/pédagogiques, instructionnisme, constructionnisme et D.I.C.E.</li>
        <li><strong>Objectif ludique :</strong> répondre correctement, garder la main, collecter les jalons et atteindre le centre du plateau.</li>
        <li><strong>Questions :</strong> connaissance pour les cases standard, compréhension pour les jalons, application pour le sprint final.</li>
        <li><strong>Règles :</strong> supprimer les règles originales qui ralentissent la partie ou ne servent aucun apprentissage.</li>
        <li><strong>Matériel :</strong> plateau, cartes questions, dé, pions, jalons, fiche animateur et support de débriefing.</li>
        <li><strong>Test :</strong> partie de 30 minutes maximum, règles compréhensibles, feedbacks exploitables et débriefing possible.</li>
      </ul>
      <h3>Démarche</h3>
      <ol><li>Définir les objectifs et contenus.</li><li>Analyser les règles originales.</li><li>Retirer les règles parasites.</li><li>Créer les cartes, le plateau et les conditions de victoire.</li><li>Tester puis corriger.</li></ol>
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
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
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
  return {
    accueil: "presentation",
    comprendre: "presentation",
    "etat-art": "presentation",
    exemples: "concevoir",
  }[tabName] || tabName;
}

function navTab(tabName) {
  return {
    matrice: "studio",
    cartes: "studio",
    bibliotheque: "ressources",
  }[tabName] || tabName;
}

function showTab(tabName) {
  const target = canonicalTab(tabName);
  const navTarget = navTab(target);
  if (!$(`#${target}`)) return;
  $$(".tab").forEach((item) => item.classList.toggle("is-active", item.dataset.tab === navTarget));
  $$(".view").forEach((item) => item.classList.toggle("is-active", item.id === target));
  history.replaceState(null, "", `#${target}`);
  window.scrollTo(0, 0);
}

function projectValues() {
  return {
    title: $("#project-title").value.trim(),
    audience: $("#project-audience").value.trim(),
    duration: $("#project-duration").value,
    mode: $("#project-mode").value,
    objective: $("#project-objective").value.trim(),
    level: $("#project-level").value,
    constraint: $("#project-constraint").value,
  };
}

function recommend(project) {
  const { level, constraint, mode } = project;
  if (mode === "Autoformation") {
    return {
      type: "Livre-jeu ou parcours à embranchements",
      mechanics: ["Choix à conséquences", "Boucle essai-feedback-remédiation", "Progression sauvegardée"],
      vigilance: "Prévoir des feedbacks explicatifs et des chemins de remédiation, pas seulement des fins différentes.",
    };
  }
  if (constraint === "Temps court" || level === "Connaître") {
    return {
      type: "Jeu de cartes questions progressives",
      mechanics: ["Questions de niveau 1 à 3", "Feedback immédiat", "Défi court"],
      vigilance: "Écrire les feedbacks avant de produire beaucoup de cartes.",
    };
  }
  if (level === "Analyser" || level === "Évaluer") {
    return {
      type: "Simulation, enquête ou jeu de rôle court",
      mechanics: ["Dilemme", "Justification", "Débriefing critérié"],
      vigilance: "Conserver les décisions des joueurs pour pouvoir débriefer les critères.",
    };
  }
  if (level === "Créer") {
    return {
      type: "Production constructionniste de prototype",
      mechanics: ["Production de jeu", "Test croisé", "Itération"],
      vigilance: "Évaluer la démarche de conception autant que l'objet produit.",
    };
  }
  if (constraint === "Grand groupe") {
    return {
      type: "Défi coopératif par équipes",
      mechanics: ["Rôles distribués", "Objectif commun", "Synthèse collective"],
      vigilance: "Limiter le matériel et rendre les consignes visibles pour toutes les équipes.",
    };
  }
  return {
    type: "Escape game léger ou parcours de décisions",
    mechanics: ["Énigmes alignées", "Indices progressifs", "Débriefing"],
    vigilance: "Chaque énigme doit faire manipuler le contenu visé.",
  };
}

function briefMarkdown() {
  const project = projectValues();
  const reco = recommend(project);
  return `# ${project.title}

## Cadrage

- Public : ${project.audience}
- Durée : ${project.duration}
- Modalité : ${project.mode}
- Niveau dominant : ${project.level}
- Contrainte forte : ${project.constraint}

## Objectif pédagogique

${project.objective}

## Type de jeu recommandé

${reco.type}

## Mécaniques proposées

${reco.mechanics.map((item) => `- ${item}`).join("\n")}

## Point de vigilance

${reco.vigilance}
`;
}

function renderRecommendation() {
  const reco = recommend(projectValues());
  $("#recommendation").innerHTML = `
    <div class="reco-title">${escapeHtml(reco.type)}</div>
    <ul class="reco-list">
      ${reco.mechanics.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      <li><strong>Vigilance :</strong> ${escapeHtml(reco.vigilance)}</li>
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
          .map((key) => `<td><input data-row="${index}" data-key="${key}" value="${escapeHtml(row[key] || "")}"></td>`)
          .join("")}
        <td><button class="remove-row" type="button" data-remove="${index}" title="Supprimer">×</button></td>
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
  $$(".tab").forEach((tab) => {
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

    const openTerm = event.target.closest("[data-open-term]");
    if (openTerm) {
      const item = findTerm(openTerm.dataset.openTerm);
      if (item) openResource({ type: "Lexique", title: item.terme, body: item.definition, details: item.details });
    }

    const openLibrary = event.target.closest("[data-open-library]");
    if (openLibrary) {
      showTab("bibliotheque");
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

  $$("#project-form input, #project-form select, #project-form textarea").forEach((field) => {
    field.addEventListener("input", renderRecommendation);
  });

  $("#copy-brief").addEventListener("click", () => copyText(briefMarkdown(), "Fiche copiée"));
  $("#download-brief").addEventListener("click", () => downloadText("fiche-game-design-pedagogique.md", briefMarkdown()));
  $("#add-reco-to-matrix").addEventListener("click", () => {
    const project = projectValues();
    const reco = recommend(project);
    state.matrix.push({
      objective: project.objective,
      action: "À préciser pendant le prototype",
      mechanic: reco.mechanics[0],
      feedback: reco.vigilance,
      trace: "Observation + débriefing",
    });
    saveMatrix();
    renderMatrix();
    toast("Ajouté à la matrice");
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
  const target = canonicalTab(location.hash.replace("#", ""));
  if ($(`#${target}`)) showTab(target);
}

window.addEventListener("hashchange", () => {
  const target = canonicalTab(location.hash.replace("#", ""));
  if ($(`#${target}`)) showTab(target);
});
