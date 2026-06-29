# app-carmen.onoko.dev

Frontend de Carmen, une surcouche Deezer avec intégration freqblog.

## Stack

- **Framework** : React 19 + Vite + TypeScript
- **UI** : Mantine v7
- **Routing** : React Router v7
- **State global** : Zustand (player audio, UI globale)
- **Data fetching** : Apollo Client (GraphQL)
- **Tests** : Vitest

## Commandes

```bash
npm run dev      # démarre le dev server (port 5173)
npm run build    # build de production
npm run preview  # prévisualise le build
npm run test     # lance les tests Vitest
```

## Structure

```text
src/
├── components/       # composants réutilisables
│   ├── player/       # player audio et contrôles
│   ├── playlist/     # composants liés aux playlists
│   └── ui/           # composants génériques (boutons, modals...)
├── pages/            # vues associées aux routes
├── store/            # stores Zustand
│   └── player.ts     # état du player (track en cours, queue, volume...)
├── hooks/            # hooks custom
├── graphql/          # queries et mutations Apollo
│   ├── queries/
│   └── mutations/
├── types/            # types TypeScript partagés
├── utils/
└── main.tsx
```

## Architecture

- Les **pages** gèrent le layout et orchestrent les composants
- Les **composants** sont découplés des pages, ils reçoivent leurs données en props ou via Apollo
- La **logique métier** va dans les hooks custom, pas dans les composants
- Le **state global** (Zustand) est réservé au player et à l'UI globale — tout le reste passe par Apollo

## Apollo Client

- Le client est configuré dans `src/main.tsx`, URI : `http://localhost:4000/graphql`
- Les queries et mutations sont définies dans `src/graphql/`
- Utiliser `useQuery` et `useMutation` directement dans les composants ou hooks

## Zustand

- Les stores sont dans `src/store/`
- Un fichier par domaine (`player.ts`, etc.)
- Ne pas mettre de logique Apollo dans les stores

## Mantine

- Utiliser les composants Mantine en priorité avant d'en créer des custom
- Le thème global se configure dans `MantineProvider` dans `main.tsx`
- Notifications via `@mantine/notifications`, modals via `@mantine/modals`

## Tests

- Framework : Vitest
- Les fichiers de test sont colocalisés avec le code source
- Tester les hooks et utils en priorité
