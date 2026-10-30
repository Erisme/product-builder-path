import type { Tool } from "./types";

export const TOOLS: Tool[] = [
  { slug: "n8n", name: "n8n", cat: "Automatisation", step: 1, doc: "https://docs.n8n.io/",
    what: "Relier des applications et des modèles d’IA par des blocs (nœuds) pour automatiser une tâche, sans écrire une application complète. Open source, il s’héberge en Docker sur votre machine ou un serveur.",
    examples: [
      { t: "Synthèse automatique des comptes rendus d’atelier", flow: ["Fichier déposé dans un dossier", "Extraction du texte", "Claude résume en décisions et actions", "Message Slack au chef de projet"],
        d: "Après chaque atelier client, plus personne ne retape les décisions : le résumé arrive dans le canal du projet avec les actions et leurs responsables." },
      { t: "Pré-qualification d’un appel d’offres", flow: ["PDF du cahier des charges", "Le modèle extrait budget, délais, livrables", "Ligne ajoutée au tableau de suivi"],
        d: "L’équipe commerciale voit en un coup d’œil si l’AO vaut une réponse, avant de lire 80 pages." },
      { t: "Veille hebdomadaire sur vos outils", flow: ["Chaque lundi 8 h", "Lecture des changelogs (Claude Code, Lovable, Supabase)", "Résumé en 5 points", "Courriel"],
        d: "La veille demandée dans l’offre devient une habitude qui tourne seule ; vous n’avez plus qu’à lire." }
    ],
    try: "Lancez n8n en local : docker run -it --rm -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n, ouvrez http://localhost:5678, puis créez un workflow « Schedule Trigger → HTTP Request → Set » qui récupère une page et en garde le titre.",
    use: "Tâches répétitives qui traversent plusieurs outils ; prototyper un agent avant de le coder ; garder les données chez soi.",
    avoid: "Interface utilisateur riche ; logique métier complexe à maintenir des années ; équipe qui ne peut pas héberger de serveur." },

  { slug: "make-zapier", name: "Make et Zapier", cat: "Automatisation", step: 1, doc: "https://zapier.com/apps",
    what: "Les équivalents de n8n en service hébergé : rien à installer, des milliers de connecteurs prêts à l’emploi, facturés à l’usage.",
    examples: [
      { t: "Lead entrant vers l’équipe", flow: ["Formulaire du site", "Fiche créée dans le CRM", "Notification Slack"], d: "Le cas d’école : quelques minutes de configuration, aucune infrastructure." },
      { t: "Tri des demandes de support", flow: ["Nouveau courriel", "Le modèle classe la demande", "Ticket créé dans la bonne file"], d: "Une étape d’IA s’insère comme n’importe quel autre bloc." }
    ],
    try: "Créez un compte gratuit sur l’un des deux et reproduisez le premier exemple de n8n : comparez le temps passé et ce que vous contrôlez.",
    use: "Le client utilise déjà l’un d’eux ; besoin rapide sans serveur ; utilisateurs non techniques qui maintiendront le flux.",
    avoid: "Données sensibles qui ne doivent pas sortir ; gros volumes où la facturation à l’opération explose." },

  { slug: "supabase", name: "Supabase", cat: "Backend", step: 2, doc: "https://supabase.com/docs",
    what: "Une base Postgres hébergée avec, autour, tout ce qu’un prototype attend d’un backend : comptes utilisateurs, stockage de fichiers, API générée automatiquement et fonctions serveur.",
    examples: [
      { t: "Le backend d’un prototype Lovable", flow: ["Tables et comptes créés", "Règles RLS par utilisateur", "Interface Lovable branchée"], d: "C’est le backend par défaut de Lovable : vous reprenez la main sur les données et la sécurité." },
      { t: "Une base de connaissances pour un RAG", flow: ["Critères RGAA découpés", "Embeddings stockés avec pgvector", "Recherche des passages proches d’une question"], d: "Un assistant qui répond à partir de votre référentiel, pas de la mémoire du modèle." },
      { t: "Appeler Claude sans exposer la clé", flow: ["Front de l’app", "Edge function avec la clé et un plafond", "API Claude"], d: "La clé reste côté serveur et chaque utilisateur a une limite d’appels par jour." }
    ],
    try: "Créez un projet gratuit, une table « notes » avec RLS activée et une politique « chacun lit ses lignes », puis vérifiez avec deux comptes qu’aucun ne voit les notes de l’autre.",
    use: "Prototype qui a besoin de comptes et de données réelles ; RAG sur vos documents ; backend d’un outil interne.",
    avoid: "Site vitrine sans données utilisateur (un WordPress suffit) ; équipe qui ne veut pas écrire de règles de sécurité." },

  { slug: "lovable", name: "Lovable", cat: "Prototypage", step: 3, doc: "https://docs.lovable.dev/",
    what: "Décrire une application en français ou en anglais et obtenir en quelques minutes une app React déployée, avec backend Supabase, que l’on fait évoluer par conversation.",
    examples: [
      { t: "Un parcours testable avant de chiffrer", flow: ["Description du parcours de demande de subvention", "App déployée", "Test avec 5 utilisateurs"], d: "Vous validez l’ordre des étapes et les champs demandés avec de vrais utilisateurs avant d’engager un développement." },
      { t: "Un outil interne jetable", flow: ["Liste des recommandations d’audit", "Tableau avec statuts et responsables", "Partagé à l’équipe"], d: "Un besoin de trois mois ne mérite pas un projet : il mérite une après-midi." },
      { t: "Mesurer l’intérêt pour une idée", flow: ["Page de présentation", "Formulaire d’inscription", "Comptage des inscrits"], d: "Une hypothèse de valeur testée en un jour, avec un chiffre à la clé." }
    ],
    try: "Demandez « un tableau de suivi des recommandations d’audit accessibilité, avec critère RGAA, priorité, statut et responsable », puis passez l’app générée au clavier et au lecteur d’écran : notez ce qui manque.",
    use: "Démo client, test utilisateur, validation d’hypothèse, outil interne de courte durée.",
    avoid: "Produit qui part en production sans relecture : le code se synchronise sur GitHub, mais tests, sécurité et accessibilité restent à faire." },

  { slug: "claude-code", name: "Claude Code", cat: "Agent de code", step: 3, doc: "https://code.claude.com/docs",
    what: "Un agent qui travaille dans votre dépôt : il lit le code, modifie les fichiers, lance les commandes et les tests, depuis le terminal, l’éditeur, l’app de bureau ou le web.",
    examples: [
      { t: "Reprendre un prototype pour la production", flow: ["Dépôt GitLab du prototype", "Ajout des tests et corrections d’accessibilité", "Pipeline CI"], d: "Le passage du prototype vibecodé au produit, que les sources sérieuses citent comme le vrai travail du builder." },
      { t: "Un audit outillé sur un thème WordPress", flow: ["« Liste les images sans alternative et les titres mal hiérarchisés »", "Rapport et diff proposé", "Relecture et fusion"], d: "Votre expertise RGAA reste la règle ; l’agent fait la recherche fastidieuse." },
      { t: "Un script ponctuel", flow: ["Export CSV d’un ancien site", "Conversion en blocs Gutenberg", "Import vérifié"], d: "Ce qui prenait une journée de script devient une heure de vérification." }
    ],
    try: "Dans un dépôt existant, créez un fichier CLAUDE.md avec trois règles du projet (accessibilité, conventions, tests), puis demandez une petite évolution et relisez le diff avant de l’accepter.",
    use: "Tâches longues ou multi-fichiers, scripts, reprise de code existant, travail sans quitter le terminal.",
    avoid: "Accepter un diff sans le lire ; donner accès à des secrets de production." },

  { slug: "cursor", name: "Cursor", cat: "Agent de code", step: 3, doc: "https://cursor.com/docs",
    what: "Un éditeur de code dérivé de VS Code avec un agent intégré, des règles par projet et la connexion à des serveurs MCP.",
    examples: [
      { t: "Faire évoluer un composant du design system", flow: ["Règles du projet chargées", "L’agent modifie le composant et ses variantes", "Diff visuel dans l’éditeur"], d: "Vous gardez la vue fichier par fichier, utile quand chaque ligne de CSS compte." },
      { t: "Comprendre une base de code inconnue", flow: ["Question sur le dépôt", "L’agent trace le parcours d’une requête", "Points d’entrée identifiés"], d: "Le premier jour sur un projet client devient productif." },
      { t: "Imposer l’accessibilité par défaut", flow: ["Règle « tout bouton a un nom accessible »", "Appliquée à chaque génération"], d: "Les règles de projet transforment votre expertise en garde-fou permanent." }
    ],
    try: "Ajoutez une règle de projet sur l’accessibilité, demandez un composant de modale, puis vérifiez focus, échappement et rôle ARIA.",
    use: "Travail fin dans l’éditeur, revue visuelle des modifications, équipe déjà sur VS Code.",
    avoid: "Le choisir contre Claude Code par principe : les deux se complètent selon la tâche." },

  { slug: "mcp", name: "MCP", cat: "Protocole", step: 3, doc: "https://modelcontextprotocol.io/",
    what: "Le Model Context Protocol est un standard ouvert pour brancher des outils et des données sur un agent : documentation, base de données, maquettes, tickets.",
    examples: [
      { t: "L’agent lit votre vrai schéma de base", flow: ["Serveur MCP Supabase", "L’agent consulte les tables", "Requêtes et migrations justes du premier coup"], d: "Fini les colonnes inventées par le modèle." },
      { t: "Une documentation toujours à jour", flow: ["Serveur MCP de la doc n8n", "Question de l’agent", "Réponse avec la version actuelle"], d: "La mémoire du modèle date ; la doc du serveur non." },
      { t: "Intégrer depuis la maquette", flow: ["Serveur MCP Figma", "L’agent lit les composants et variables", "Code aligné sur le design system"], d: "Le lien direct maquette vers code, votre terrain d’intégrateur." }
    ],
    try: "Ajoutez un serveur MCP de documentation à Claude Code ou Cursor et posez une question dont la réponse a changé récemment.",
    use: "Dès qu’un agent doit agir sur des données ou outils réels plutôt que deviner.",
    avoid: "Brancher un serveur dont vous ne connaissez pas l’éditeur : il agit avec vos droits." },

  { slug: "claude-api", name: "API Claude", cat: "Modèles d’IA", step: 1, doc: "https://platform.claude.com/docs/en/test-and-evaluate/develop-tests",
    what: "Appeler un modèle depuis un workflow, une fonction serveur ou une app, avec un format de réponse imposé pour que le reste du produit puisse l’exploiter.",
    examples: [
      { t: "Classer des retours utilisateurs", flow: ["200 verbatims", "Le modèle renvoie thème et sévérité en JSON", "Tableau trié"], d: "La synthèse d’une vague d’entretiens passe de deux jours à deux heures, relecture comprise." },
      { t: "Préparer une discovery", flow: ["Notes d’entretiens", "Personas et jobs-to-be-done proposés", "Critique et décision par le PM"], d: "Le geste « LLM pour la discovery » de l’offre : le modèle propose, vous tranchez." },
      { t: "Un juge pour vos evals", flow: ["Réponses de l’assistant", "Notation selon une grille écrite", "Comparaison avec vos propres notes"], d: "Vous mesurez la qualité à chaque changement de prompt au lieu de l’estimer." }
    ],
    try: "Envoyez un même verbatim avec et sans consigne de format JSON, et comparez ce que votre code peut en faire.",
    use: "Toute étape qui demande de comprendre ou produire du texte dans un produit ou un workflow.",
    avoid: "Données personnelles sensibles sans cadre ; décision finale sans eval ni relecture humaine." },

  { slug: "mixpanel", name: "Mixpanel", cat: "Analytics produit", step: 4, doc: "https://docs.mixpanel.com/guides/analytics-strategy",
    what: "Mesurer ce que font les utilisateurs, action par action (événements), pour savoir si une fonctionnalité crée de la valeur.",
    examples: [
      { t: "Où les utilisateurs décrochent", flow: ["Inscription", "Première action utile", "Retour la semaine suivante"], d: "Un funnel montre l’étape à corriger en priorité, chiffres à l’appui." },
      { t: "Rétention par cohorte", flow: ["Cohorte par semaine d’inscription", "Part revenue en semaine 2, 3, 4"], d: "La courbe dit si le produit retient ou s’il plaît seulement le premier jour." },
      { t: "Avant et après une nouveauté", flow: ["Cohorte avant la sortie", "Cohorte après", "Écart de conversion"], d: "Ce qui transforme une intuition en argument pour la roadmap." }
    ],
    try: "Posez trois événements sur un prototype (session démarrée, action clé, objectif atteint), puis construisez un funnel de trois étapes.",
    use: "Produit avec des utilisateurs réels et une hypothèse de valeur à vérifier.",
    avoid: "Tout tracker sans plan ; oublier le consentement (RGPD) sur un site public." },

  { slug: "notion-jira", name: "Notion et Jira", cat: "Pilotage produit", step: 4, doc: "https://www.notion.com/help",
    what: "Notion pour écrire et organiser la réflexion produit ; Jira pour piloter le backlog et les sprints avec l’équipe technique.",
    examples: [
      { t: "Le dossier produit d’une page", flow: ["Problème et utilisateurs", "Hypothèses classées par risque", "KPIs et plan de tracking"], d: "Le document qui aligne client et équipe avant le premier sprint." },
      { t: "Une base des hypothèses", flow: ["Hypothèse", "Test prévu", "Résultat et décision"], d: "La trace de la discovery continue, réutilisable en soutenance." },
      { t: "Du dossier au backlog", flow: ["Epics issues du dossier", "User stories avec critères d’acceptation", "Sprint planifié dans Jira"], d: "La posture PO demandée dans l’offre, rendue visible." }
    ],
    try: "Transformez un de vos carnets d’étape en dossier produit d’une page, puis en trois user stories avec critères d’acceptation.",
    use: "Toute mission produit : Notion pour penser, Jira pour livrer avec l’équipe.",
    avoid: "Des dizaines de pages que personne ne relit ; un backlog sans priorité." }
];

// Outils associés aux exercices et aux fiches (slugs de TOOLS).
export const EX_TOOLS: Record<string, string[]> = { "e1-1": ["n8n"], "e1-2": ["supabase"], "e1-3": ["claude-api"], "e2-1": ["supabase"], "e2-2": ["n8n", "supabase"], "e3-1": ["lovable", "claude-code"], "e3-2": ["mcp", "cursor", "claude-code"], "e4-1": ["notion-jira"], "e4-2": ["mixpanel"], "e5-1": ["claude-code", "supabase", "mixpanel"] };
export const LESSON_TOOLS: Record<string, string[]> = { "l1-1": ["n8n", "claude-api"], "l1-2": ["n8n", "make-zapier"], "l1-3": ["supabase"], "l1-4": ["claude-api"], "l2-1": ["supabase"], "l2-2": ["n8n", "lovable"], "l2-3": ["supabase", "claude-api"], "l3-1": ["lovable"], "l3-2": ["lovable", "cursor", "claude-code"], "l3-3": ["mcp"], "l4-1": ["notion-jira", "claude-api"], "l4-2": ["mixpanel"], "l4-3": ["claude-api"] };

export const tool = (slug: string): Tool | undefined => TOOLS.find((t) => t.slug === slug);
