# Contribuer : le gitflow du projet

Le dépôt suit un gitflow classique, allégé pour une petite équipe.

## Branches permanentes

| Branche   | Rôle | Qui y écrit |
|-----------|------|-------------|
| `main`    | Ce qui est en production. Chaque commit est une version taguée (`vX.Y.Z`) et déclenche le déploiement GitHub Pages. | Uniquement par fusion d'une branche `release/*` ou `hotfix/*`. |
| `develop` | Branche d'intégration, base de tout nouveau travail. Toujours verte (typecheck et build passent). | Uniquement par pull request depuis `feature/*`, `release/*` ou `hotfix/*`. |

`develop` est la branche par défaut du dépôt : les pull requests la ciblent sauf mention contraire.

## Branches temporaires

| Préfixe     | Part de   | Fusionne dans        | Usage |
|-------------|-----------|----------------------|-------|
| `feature/`  | `develop` | `develop`            | Toute évolution ou correction hors urgence. |
| `release/`  | `develop` | `main` puis `develop`| Préparer une version : numéro, dernières retouches, pas de nouvelle fonctionnalité. |
| `hotfix/`   | `main`    | `main` puis `develop`| Corriger la production sans attendre la prochaine version. |

Nommage en kebab-case, court et descriptif : `feature/sauvegarde-fichier`, `release/0.3.0`, `hotfix/0.3.1-quiz-score`.

## Cycle d'une fonctionnalité

```bash
git switch develop && git pull
git switch -c feature/ma-fonctionnalite
# … commits …
git push -u origin feature/ma-fonctionnalite
gh pr create --base develop --fill
```

La pull request doit passer la CI (typecheck + build) et être relue avant fusion. Fusion en **squash** pour garder un historique lisible sur `develop`. La branche est supprimée après fusion.

## Cycle d'une version

```bash
git switch develop && git pull
git switch -c release/0.3.0
npm version 0.3.0 --no-git-tag-version      # met à jour package.json et package-lock.json
git commit -am "release: 0.3.0"
git push -u origin release/0.3.0
gh pr create --base main --title "Release 0.3.0" --fill
```

Après fusion dans `main` :

```bash
git switch main && git pull
git tag -a v0.3.0 -m "Version 0.3.0" && git push origin v0.3.0
gh pr create --base develop --head main --title "Back-merge 0.3.0" --fill
```

Le tag déclenche rien de plus que le déploiement déjà lancé par la fusion dans `main` ; il sert de repère pour les retours en arrière.

## Cycle d'un hotfix

```bash
git switch main && git pull
git switch -c hotfix/0.3.1-quiz-score
# … correction, npm version 0.3.1 --no-git-tag-version …
gh pr create --base main --fill
# après fusion : tag v0.3.1, puis PR de back-merge main → develop
```

## Commits

Format court, en français, à l'impératif, préfixé par le type :

- `feat:` nouvelle fonctionnalité
- `fix:` correction
- `docs:`, `style:`, `refactor:`, `test:`, `chore:` selon le cas
- `release:` / `hotfix:` pour les commits de version

Exemple : `feat: restaurer une progression depuis un fichier JSON`.

## Versions

[Semver](https://semver.org/lang/fr/) : `MAJEUR.MINEUR.CORRECTIF`. Tant que le produit est en construction (`0.x`), un changement de `MINEUR` peut casser la compatibilité du format de progression ; dans ce cas, `normalize()` dans `src/state/types.ts` doit savoir relire l'ancien format.

## Protection des branches

`main` et `develop` sont protégées sur GitHub : pas de push direct, une pull request avec la CI verte est nécessaire, et l'historique ne peut pas être réécrit.
