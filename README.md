# Builder Path

Application d'auto-formation au métier de product builder IA : cinq étapes (agents et RAG, backend, vibe coding, stratégie produit IA, projet final), des fiches sourcées, des quiz, des exercices validés par une preuve, un carnet de rétro par étape et une boîte à outils (n8n, Supabase, Lovable, Claude Code, Cursor, MCP, Mixpanel…).

## Lancer en local

Application React + TypeScript construite avec Vite.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck puis build de production dans dist/
npm run preview    # sert le build
```

La version historique en un seul fichier HTML reste disponible dans `legacy/index.html` (à ouvrir directement ou via `python3 -m http.server`).

## Données

La progression est enregistrée automatiquement dans le `localStorage` du navigateur (clé `builder-path-v1`).

Pour la reprendre plus tard ou sur un autre appareil, la section « Sauvegarde » du tableau de bord permet de télécharger un fichier `builder-path-progression-AAAA-MM-JJ.json` (ou de copier le JSON), puis de le restaurer depuis un fichier ou un collage. La restauration vérifie le format et demande confirmation avant de remplacer une progression existante.

## Publier avec GitHub Pages

Chaque fusion dans `main` déclenche le workflow `.github/workflows/deploy.yml`, qui construit `dist/` et le publie sur GitHub Pages. À activer une fois dans Settings → Pages → Source : « GitHub Actions ». Le build utilise des chemins relatifs (`base: "./"`), donc il fonctionne à la racine d'un domaine comme sous `https://<utilisateur>.github.io/<dépôt>/`.

## Contribuer

Le dépôt suit un gitflow : `main` en production, `develop` pour l'intégration, branches `feature/*`, `release/*` et `hotfix/*`. Les règles, le nommage et les commandes sont dans [CONTRIBUTING.md](CONTRIBUTING.md). La CI (typecheck et build) tourne sur chaque pull request.

## Structure

- `index.html` : coquille HTML, charge `src/main.tsx`
- `src/data/` : contenu pédagogique typé (`MODULES`, `TOOLS`, tables `EX_TOOLS` et `LESSON_TOOLS`)
- `src/state/` : type `Progress`, persistance locale et distante, store React (`useStore`)
- `src/lib/` : sélecteurs de progression (`progress.ts`) et routage par fragment (`router.ts`)
- `src/components/` : en-tête avec chrono, sentier latéral, toast, briques outils
- `src/views/` : tableau de bord, aperçu d'étape, fiches, quiz, exercices, carnet, boîte à outils
- `src/styles.css` : feuille de style, identique à la version HTML
- `legacy/index.html` : version mono-fichier d'origine

## Suite prévue

- Plan de tracking Mixpanel
- Tuteur IA pour les exercices ouverts (appel serveur, jamais de clé dans le front)
- Backend Supabase pour la progression
