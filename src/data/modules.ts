import type { Module } from "./types";

export const MODULES: Module[] = [
  {
    id: 1, slug: "module-1", title: "Agents, workflows et RAG", hours: "6 à 8 h",
    goal: "Comprendre quand un workflow suffit, quand un agent se justifie, et comment brancher un modèle sur vos propres données.",
    lessons: [
      { id: "l1-1", title: "Workflow ou agent : choisir le motif le plus simple",
        body: ["Un workflow suit un chemin défini à l’avance : déclencheur, traitements, action. Un agent confie au modèle le choix des étapes et des outils à appeler. Le second est plus souple, plus cher et plus difficile à évaluer.",
               "La règle que donne Anthropic dans son guide sur les agents : commencer par le motif le plus simple qui résout le problème (un appel bien formulé, puis une chaîne, puis un routage) et n’ajouter de l’autonomie que lorsque la mesure le justifie."],
        sources: [["Anthropic, Building effective agents","https://www.anthropic.com/engineering/building-effective-agents"],["Documentation n8n","https://docs.n8n.io/"]] },
      { id: "l1-2", title: "n8n en pratique : déclencheur, nœuds, agent",
        body: ["n8n est un outil d’automatisation open source que l’on peut héberger soi-même en Docker. Un workflow commence par un nœud déclencheur (webhook, formulaire, planning), enchaîne des nœuds de traitement et finit par une action (envoi, écriture en base, réponse HTTP).",
               "Le nœud AI Agent ajoute un modèle de langage qui peut appeler des outils (recherche, base de données, API). C’est la brique du jour 1 du programme Le Wagon."],
        sources: [["freeCodeCamp, cours n8n","https://www.freecodecamp.org/news/learn-n8n-to-design-develop-and-deploy-production-grade-ai-agents/"],["Documentation n8n","https://docs.n8n.io/"]] },
      { id: "l1-3", title: "RAG : embeddings, découpage, récupération",
        body: ["Un RAG (retrieval-augmented generation) répond à partir de vos documents : chaque extrait est transformé en vecteur (embedding), stocké dans une base vectorielle comme Postgres avec pgvector, puis les extraits les plus proches de la question sont injectés dans le prompt.",
               "La qualité dépend d’abord de la récupération : un mauvais découpage ou une mauvaise recherche produit une réponse fausse, même avec le meilleur modèle. On évalue donc la récupération séparément de la génération."],
        sources: [["DeepLearning.AI, Building Applications with Vector Databases","https://www.deeplearning.ai/short-courses/building-applications-vector-databases"],["Documentation Supabase","https://supabase.com/docs"]] },
      { id: "l1-4", title: "Évaluer avant de livrer",
        body: ["Les evals sont l’infrastructure de base d’un produit IA. Un eval de capacité mesure ce que le système sait faire ; un eval de régression vérifie qu’un changement ne casse pas ce qui marchait.",
               "Un premier jeu de 50 à 100 cas réalistes, notés par un humain puis par un modèle juge calibré sur ces notes, suffit à piloter les itérations. Sans eval, l’équipe découvre les régressions en production."],
        sources: [["Anthropic, Demystifying evals for AI agents","https://anthropic.com/engineering/demystifying-evals-for-ai-agents"],["Anthropic, Develop test cases","https://platform.claude.com/docs/en/test-and-evaluate/develop-tests"]] }
    ],
    quiz: [
      { q: "Quelle est la différence principale entre un workflow et un agent ?", a: ["Un workflow utilise un modèle de langage, pas l’agent","L’agent décide des étapes avec un modèle, le workflow suit un chemin prédéfini","L’agent est toujours plus fiable","Il n’y en a pas, ce sont des synonymes"], ok: 1, exp: "Dans un agent, le modèle choisit les étapes et les outils ; dans un workflow, le chemin est écrit à l’avance. C’est ce qui rend l’agent plus souple et plus difficile à évaluer." },
      { q: "Que recommande Anthropic pour démarrer un produit IA ?", a: ["Un agent multi-outils dès le départ","Le motif le plus simple qui résout le problème","Un fine-tuning du modèle","Une orchestration multi-agents"], ok: 1, exp: "Commencer simple, mesurer, puis ajouter de l’autonomie seulement si la mesure le justifie." },
      { q: "Dans un RAG, à quoi sert l’embedding ?", a: ["À compresser le texte","À transformer un texte en vecteur pour la recherche sémantique","À traduire le texte","À chiffrer les documents"], ok: 1, exp: "L’embedding représente le sens d’un extrait sous forme de vecteur ; la recherche compare les vecteurs entre eux." },
      { q: "pgvector, c’est :", a: ["Un modèle de langage","Une extension Postgres pour stocker et comparer des vecteurs","Un nœud n8n","Un format de fichier"], ok: 1, exp: "pgvector ajoute à Postgres un type vecteur et des index de similarité ; Supabase l’active en un clic." },
      { q: "La réponse de votre RAG est fausse. Que vérifier en premier ?", a: ["La température du modèle","Les extraits récupérés avant génération","Le style du prompt","La clé d’API"], ok: 1, exp: "Si la récupération ramène les mauvais extraits, aucun réglage du modèle ne corrigera la réponse." },
      { q: "Un eval de régression sert à :", a: ["Mesurer de nouvelles capacités","Vérifier qu’un changement ne dégrade pas ce qui fonctionnait","Entraîner le modèle","Estimer le coût par requête"], ok: 1, exp: "Il se joue à chaque modification de prompt, de modèle ou de données, comme une suite de tests." },
      { q: "Taille raisonnable d’un premier jeu de test :", a: ["3 cas","50 à 100 cas réalistes","10 000 cas","Aucun, on observe la production"], ok: 1, exp: "Assez pour couvrir les cas courants et les cas limites, assez petit pour être relu par un humain." },
      { q: "Dans n8n, un nœud déclencheur (trigger) :", a: ["Exécute le modèle","Démarre le workflow sur un événement","Stocke les données","Envoie un courriel"], ok: 1, exp: "Webhook, formulaire, planning ou événement d’une application : c’est toujours le point d’entrée du workflow." }
    ],
    exercises: [
      { id: "e1-1", title: "Installer n8n en Docker et livrer un premier workflow", tool: "n8n", time: "2 h",
        brief: "Lancez n8n en local, puis construisez : formulaire → appel à un modèle → réponse affichée ou envoyée.",
        criteria: ["n8n tourne en local (Docker) et le workflow est sauvegardé","Le workflow s’exécute de bout en bout sur une saisie réelle","Le prompt impose un format de réponse (JSON ou structure fixe)"], proof: "Lien vers le workflow exporté (JSON) ou capture de l’exécution" },
      { id: "e1-2", title: "Recherche sémantique sur vos propres documents", tool: "Supabase + pgvector", time: "2 h",
        brief: "Créez une table avec pgvector, insérez une vingtaine d’extraits (par exemple des critères RGAA) et retrouvez les trois plus proches d’une question.",
        criteria: ["Extension pgvector activée et table créée","20 extraits insérés avec leur embedding","Une requête de similarité retourne les 3 extraits attendus"], proof: "Lien vers le script SQL ou capture des résultats" },
      { id: "e1-3", title: "Votre premier jeu d’evals", tool: "Tableur ou fichier JSON", time: "1 h 30",
        brief: "Écrivez 20 cas (question, réponse attendue, critère de réussite) pour l’assistant de l’exercice 1 et notez son taux de réussite.",
        criteria: ["20 cas dont au moins 5 cas limites","Un critère de réussite observable par cas","Taux de réussite calculé et commenté en 3 lignes"], proof: "Lien vers le fichier des cas" }
    ]
  },
  {
    id: 2, slug: "module-2", title: "Backend et application utilisateur", hours: "5 à 7 h",
    goal: "Donner un backend à votre workflow et l’exposer à un utilisateur non technique, sans exposer vos clés.",
    lessons: [
      { id: "l2-1", title: "Supabase en quatre briques",
        body: ["Supabase fournit sur un projet Postgres : l’authentification, la base avec son API générée, le stockage de fichiers et les edge functions (code serveur proche de la base).",
               "La sécurité repose sur les politiques RLS (row level security) : chaque table dit qui peut lire et écrire quelles lignes. Sans RLS, la clé publique du front donne accès à tout."],
        sources: [["Documentation Supabase","https://supabase.com/docs"]] },
      { id: "l2-2", title: "Exposer un workflow à un utilisateur",
        body: ["Un workflow n8n s’expose par un webhook ; une interface (page vibecodée, bloc WordPress ou app builder comme Softr) appelle ce webhook et affiche la réponse.",
               "Le test d’un bon produit builder : une personne sans compétence technique peut utiliser l’assistant sans explication."],
        sources: [["Documentation n8n","https://docs.n8n.io/"],["Le Wagon, programme AI Product Builder","https://blog.lewagon.com/news/ai-product-builder/"]] },
      { id: "l2-3", title: "Clés, secrets et edge functions",
        body: ["La clé anonyme de Supabase peut vivre dans le front ; la clé service et toute clé d’API de modèle ne doivent jamais y être. Les appels à un modèle passent par une edge function qui garde la clé côté serveur.",
               "Même règle pour les coûts : la fonction serveur impose un plafond par utilisateur et journalise les appels."],
        sources: [["Documentation Supabase","https://supabase.com/docs"]] }
    ],
    quiz: [
      { q: "À quoi servent les politiques RLS dans Supabase ?", a: ["À accélérer les requêtes","À définir qui peut lire et écrire quelles lignes d’une table","À chiffrer la base","À générer l’API"], ok: 1, exp: "RLS est le mécanisme de sécurité des données ; sans politiques, la clé publique du front lit toute la table." },
      { q: "Quelle clé ne doit jamais apparaître dans le front ?", a: ["La clé anonyme (anon)","La clé service (service_role)","L’URL du projet","L’identifiant du projet"], ok: 1, exp: "La clé service contourne RLS ; elle reste côté serveur, comme les clés de modèle." },
      { q: "Une edge function Supabase, c’est :", a: ["Une page statique","Du code serveur exécuté près de la base, pour garder les secrets et la logique sensible","Un plugin navigateur","Une table spéciale"], ok: 1, exp: "C’est l’endroit où appeler un modèle de langage avec une clé privée et un plafond de coûts." },
      { q: "L’authentification par lien magique :", a: ["Exige un mot de passe fort","Envoie un lien de connexion par courriel, sans mot de passe","Ne fonctionne qu’en local","Est réservée aux administrateurs"], ok: 1, exp: "Simple à mettre en place et suffisante pour un prototype ; à compléter par d’autres méthodes en production." },
      { q: "Un app builder comme Softr sert à :", a: ["Entraîner un modèle","Construire une interface sur une base de données sans code","Héberger des conteneurs","Remplacer Postgres"], ok: 1, exp: "C’est l’outil du jour 2 du programme Le Wagon : une interface rapide sur Airtable ou Supabase." }
    ],
    exercises: [
      { id: "e2-1", title: "Projet Supabase sécurisé", tool: "Supabase", time: "2 h",
        brief: "Créez un projet, une table de progression et ses politiques RLS, puis une connexion par lien magique.",
        criteria: ["Table créée avec RLS activée et au moins deux politiques","Connexion par lien magique testée avec deux comptes","Un compte ne voit pas les lignes de l’autre"], proof: "Capture des politiques ou lien vers le script SQL" },
      { id: "e2-2", title: "Un assistant utilisable par quelqu’un d’autre", tool: "n8n + page web", time: "3 h",
        brief: "Branchez le workflow du module 1 derrière une interface simple, puis faites-le tester par un collègue sans explication.",
        criteria: ["Interface accessible au clavier avec états de chargement et d’erreur","Aucune clé d’API dans le code front","Un collègue a réussi une demande sans aide ; sa remarque principale est notée"], proof: "URL de l’interface et remarque du testeur" }
    ]
  },
  {
    id: 3, slug: "module-3", title: "Vibe coding structuré", hours: "5 à 6 h",
    goal: "Produire vite avec un agent de code sans perdre la maîtrise : cadrage, itération, outillage MCP, limites de la production.",
    lessons: [
      { id: "l3-1", title: "PRD court ou itération : quand choisir l’un ou l’autre",
        body: ["Un PRD court (objectif, utilisateurs, écrans, règles, hors périmètre) rentabilise un prototype multi-écrans : l’agent travaille sur un cadre stable. L’itération prompt par prompt convient à un écran unique ou à une exploration.",
               "Dans les deux cas, on décrit le résultat attendu et les contraintes (accessibilité, données, erreurs), pas la façon de coder."],
        sources: [["Elevation, atelier vibe coding avec Lovable","https://ai.elevationcapital.com/blogs/vibe-coding-lovable"]] },
      { id: "l3-2", title: "Lovable, Cursor, Claude Code : trois postures",
        body: ["Lovable part d’un prompt et livre une app React déployée avec backend Supabase : idéal pour une démo en heures. Cursor et Claude Code travaillent dans votre dépôt, avec vos règles et vos tests : idéal pour aller vers la production.",
               "Un prototype vibecodé n’est pas un produit : revue de code, tests sur les parcours critiques, sécurité des données et accessibilité restent à faire. C’est l’alerte que portent Roman Pichler et les équipes produit sérieuses."],
        sources: [["Documentation Cursor","https://cursor.com/docs"],["Documentation Claude Code","https://code.claude.com/docs"]] },
      { id: "l3-3", title: "MCP : donner des outils à l’agent",
        body: ["Le Model Context Protocol est un standard ouvert pour connecter des outils et des données à un agent. Les documentations Supabase, n8n ou Claude exposent des serveurs MCP : l’agent lit la version à jour au lieu de sa mémoire.",
               "Brancher un serveur MCP de documentation dans Cursor ou Claude Code réduit les erreurs d’API dès le premier prototype."],
        sources: [["Documentation Cursor","https://cursor.com/docs"],["Documentation Claude Code","https://code.claude.com/docs"]] }
    ],
    quiz: [
      { q: "Quand un PRD court est-il le plus utile ?", a: ["Pour un écran unique","Pour un prototype multi-écrans au périmètre clair","Jamais, l’itération suffit","Seulement en production"], ok: 1, exp: "Il stabilise le cadre pour l’agent : écrans, règles, hors périmètre." },
      { q: "MCP, c’est :", a: ["Un modèle d’OpenAI","Un protocole ouvert pour connecter outils et données à un agent","Un framework CSS","Un service d’hébergement"], ok: 1, exp: "Les éditeurs publient des serveurs MCP ; l’agent les appelle comme des outils." },
      { q: "Ce qui manque le plus souvent à un prototype vibecodé pour la production :", a: ["Une meilleure palette","Tests, sécurité des données et accessibilité","Plus de fonctionnalités","Un logo"], ok: 1, exp: "La vitesse du prototype se paie en dette si personne ne reprend ces points." },
      { q: "Lovable génère par défaut :", a: ["Du PHP et MySQL","Une app React avec Supabase en backend","Une app native iOS","Un site WordPress"], ok: 1, exp: "React, TypeScript, Tailwind et Supabase : une stack que vous pouvez relire et reprendre dans votre dépôt." },
      { q: "Quelle habitude limite la dette du vibe coding ?", a: ["Ne jamais relire le code","Une revue de code hebdomadaire et des tests sur les parcours critiques","Changer d’outil chaque semaine","Supprimer les tests"], ok: 1, exp: "La revue et les tests sont ce qui distingue un builder d’un simple opérateur de prompts." }
    ],
    exercises: [
      { id: "e3-1", title: "Même application, deux approches", tool: "Lovable et Claude Code", time: "3 h",
        brief: "Réalisez un petit tableau de suivi avec Lovable, puis la même chose avec Claude Code dans un dépôt. Notez ce que chaque approche fait gagner et perdre.",
        criteria: ["Les deux versions fonctionnent et sont déployées","Une note comparative d’une page : vitesse, qualité du code, accessibilité, reprise possible","Un choix argumenté pour la suite du projet"], proof: "Liens vers les deux versions et la note" },
      { id: "e3-2", title: "Brancher un serveur MCP", tool: "Cursor ou Claude Code", time: "1 h",
        brief: "Ajoutez le serveur MCP de documentation de Supabase ou de n8n à votre agent et faites-lui corriger un appel d’API à partir de la doc à jour.",
        criteria: ["Serveur MCP configuré et visible dans l’agent","Une question posée à l’agent a utilisé la documentation","Capture de la réponse avec la source citée"], proof: "Capture de la configuration et de l’échange" }
    ]
  },
  {
    id: 4, slug: "module-4", title: "Stratégie produit IA", hours: "6 à 8 h",
    goal: "Cadrer un produit IA comme un PM : problème, hypothèses, KPIs, architecture adaptée au POC, garde-fous et plan de tracking.",
    lessons: [
      { id: "l4-1", title: "Cadrer avant de construire",
        body: ["Un dossier produit tient en une page : le problème et pour qui, les hypothèses les plus risquées, ce que l’on construit et ce que l’on ne construit pas, comment on saura que ça marche.",
               "La discovery continue (Teresa Torres) relie un résultat visé à des opportunités observées chez les utilisateurs, puis à des solutions et à des tests. Les LLM aident à générer personas et jobs-to-be-done ; la décision reste au PM."],
        sources: [["Reforge, What does an AI PM do","https://www.reforge.com/blog/what-does-an-ai-pm-do"]] },
      { id: "l4-2", title: "KPIs et plan de tracking",
        body: ["Une North Star reflète la valeur livrée (ici : exercices validés avec preuve). Autour d’elle : adoption (sessions, rétention), qualité (score, taux de réussite), coût (appels par utilisateur).",
               "Le plan de tracking se rédige avant le code : nom de l’événement, déclencheur, propriétés, KPI servi. Mixpanel documente ce parcours plan, implémentation, lancement."],
        sources: [["Documentation Mixpanel, stratégie analytics","https://docs.mixpanel.com/guides/analytics-strategy"]] },
      { id: "l4-3", title: "Architecture de POC et garde-fous",
        body: ["Choisir l’architecture la plus simple compatible avec l’hypothèse : un appel bien formulé si la connaissance tient dans le prompt, un RAG si elle est dans vos documents, un agent seulement si des actions sont nécessaires.",
               "Les garde-fous se décident au cadrage : limites de périmètre, refus explicites, plafond de coût, journalisation, et un eval de régression dès le premier déploiement."],
        sources: [["Anthropic, Building effective agents","https://www.anthropic.com/engineering/building-effective-agents"],["Anthropic, Demystifying evals for AI agents","https://anthropic.com/engineering/demystifying-evals-for-ai-agents"]] }
    ],
    quiz: [
      { q: "Une North Star, c’est :", a: ["Le chiffre d’affaires","Une métrique qui reflète la valeur réellement livrée aux utilisateurs","Le nombre de fonctionnalités","Le score Lighthouse"], ok: 1, exp: "Elle guide les arbitrages ; les autres KPIs l’expliquent ou la protègent." },
      { q: "Quand écrire le plan de tracking ?", a: ["Après le lancement","Avant la première ligne de code","Seulement si un analyste le demande","Jamais pour un POC"], ok: 1, exp: "Sinon les événements manquent au moment de mesurer l’hypothèse." },
      { q: "La connaissance nécessaire tient dans le prompt. Quelle architecture ?", a: ["Un agent multi-outils","Un appel simple au modèle","Un RAG complet","Un fine-tuning"], ok: 1, exp: "Le motif le plus simple d’abord ; le RAG se justifie quand la connaissance est dans vos documents." },
      { q: "Un garde-fou, c’est par exemple :", a: ["Une couleur de bouton","Une limite de périmètre, un refus explicite ou un plafond de coût","Un slogan","Une police de caractères"], ok: 1, exp: "Les garde-fous se décident au cadrage et se vérifient par des evals." },
      { q: "L’opportunity solution tree relie :", a: ["Les équipes et leurs managers","Un résultat visé, des opportunités, des solutions et des tests","Les écrans d’une app","Les sprints d’un trimestre"], ok: 1, exp: "C’est l’outil central de la discovery continue de Teresa Torres." }
    ],
    exercises: [
      { id: "e4-1", title: "Dossier produit d’un cas d’usage réel", tool: "Notion ou doc", time: "4 h",
        brief: "Cadrez un cas d’usage IA de votre contexte professionnel : problème, utilisateurs, hypothèses, KPIs, architecture de POC, garde-fous, plan de tracking.",
        criteria: ["Une page, relue par un PM ou un pair","Trois hypothèses classées par risque","Un plan de tracking de 8 à 12 événements"], proof: "Lien vers le dossier" },
      { id: "e4-2", title: "Mesurer votre propre prototype", tool: "Mixpanel", time: "2 h",
        brief: "Posez Mixpanel sur le prototype du module 3 avec cinq événements et construisez un funnel et une courbe de rétention.",
        criteria: ["5 événements nommés selon le plan et visibles dans Mixpanel","Un funnel de 3 étapes construit","Une première lecture écrite en 3 lignes"], proof: "Capture du funnel" }
    ]
  },
  {
    id: 5, slug: "module-5", title: "Projet final", hours: "8 à 12 h",
    goal: "Livrer un produit IA déployé, mesuré et démontrable : c’est la pièce de portfolio.",
    lessons: [
      { id: "l5-1", title: "Définition de terminé",
        body: ["Terminé veut dire : déployé sur une URL accessible, mesuré par au moins un KPI réel, démontrable en trois minutes, documenté par une page.",
               "Le produit n’a pas besoin d’être grand ; il a besoin d’être complet sur son périmètre et honnête sur ses limites."],
        sources: [["Le Wagon, programme AI Product Builder","https://blog.lewagon.com/news/ai-product-builder/"]] },
      { id: "l5-2", title: "Le pitch en dix slides",
        body: ["Problème et pour qui, preuve du problème, solution et démo, architecture en une image, ce qui a été mesuré, ce que vous avez appris, limites et suite, ce que vous demandez.",
               "Une slide, une idée. La démo vaut plus que les slides."],
        sources: [] },
      { id: "l5-3", title: "La démo vidéo de trois minutes",
        body: ["Enregistrez un parcours réel, pas un diaporama : le problème en 20 secondes, le produit en action, le résultat mesuré, une limite assumée.",
               "Publiez la vidéo avec sous-titres : c’est aussi une preuve d’accessibilité."],
        sources: [] }
    ],
    quiz: [
      { q: "Quel ordre pour un pitch produit ?", a: ["Solution, équipe, prix","Problème, preuve, solution et démo, impact mesuré, suite","Architecture puis fonctionnalités","Historique du projet"], ok: 1, exp: "On part du problème et on termine par ce qui a été mesuré et ce qui vient ensuite." },
      { q: "Une bonne démo vidéo montre :", a: ["Des slides commentées","Un parcours réel dans le produit","Le code source","Le dépôt Git"], ok: 1, exp: "Le public doit voir le produit fonctionner sur un cas concret." },
      { q: "Un produit est « terminé » quand :", a: ["Le code compile","Il est déployé, mesuré, démontrable et documenté","Toutes les idées sont implémentées","Le design est validé"], ok: 1, exp: "Complet sur son périmètre, honnête sur ses limites." },
      { q: "La rétro de fin de sprint tient en :", a: ["Un rapport de dix pages","Cinq lignes : ce qui a marché, ce qui a coûté, ce qu’on change","Une réunion de deux heures","Rien, on passe au suivant"], ok: 1, exp: "Courte et écrite, c’est elle qui raconte la posture produit en entretien." }
    ],
    exercises: [
      { id: "e5-1", title: "Produit déployé", tool: "Votre stack", time: "6 h",
        brief: "Déployez le produit cadré au module 4 sur une URL accessible, avec tracking actif et un eval de régression.",
        criteria: ["URL publique fonctionnelle, accessible au clavier","Événements visibles dans l’outil analytics","Eval de régression de 20 cas qui passe"], proof: "URL du produit" },
      { id: "e5-2", title: "Pitch et vidéo", tool: "Slides et capture vidéo", time: "3 h",
        brief: "Produisez le pitch de dix slides et la démo vidéo de trois minutes, sous-titrée.",
        criteria: ["10 slides maximum, une idée par slide","Vidéo de 3 minutes au plus, sous-titrée","Les deux ont été présentés à au moins une personne"], proof: "Liens vers le pitch et la vidéo" },
      { id: "e5-3", title: "Page portfolio", tool: "Page web", time: "2 h",
        brief: "Une page qui raconte le projet : problème, démarche, produit, mesures, apprentissages, avec liens vers le produit, le pitch et la vidéo.",
        criteria: ["Page en ligne et accessible","Les trois liens fonctionnent","Les limites du projet sont écrites"], proof: "URL de la page" }
    ]
  }
];
