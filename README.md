# Pivot

One codebase, two platforms: a Next.js App Router site and an Expo/React Native app that share screens, routing and a design system.

The point of this repo is not the demo content. It is the wiring: one shared TypeScript package rendered by both `react-native-web` on Next.js and React Native on iOS/Android, with Solito bridging the two routers.

## Stack

| Layer             | Version   | Notes                                                                |
| ----------------- | --------- | -------------------------------------------------------------------- |
| Next.js           | `16.4.5`  | App Router, Turbopack                                                |
| React / React DOM | `19.1.0`  | Single copy, enforced with root `overrides`                          |
| Expo SDK          | `54.0.38` | React Native `0.81.5`                                                |
| Expo Router       | `6.0.24`  | File-based native routes                                             |
| Solito            | `5.0.0`   | Cross-platform `Link` and `useRouter`                                |
| NativeWind        | `4.2.7`   | Tailwind CSS `3.4.19` (NativeWind 4 does **not** support Tailwind 4) |
| react-native-web  | `0.21.4`  | Web renderer for the shared components                               |
| Turborepo         | `2.x`     | Task runner                                                          |

Expo SDK 54 is the last version covered by Solito's tested compatibility matrix. That is a deliberate choice, not an accident. See [Upgrades](#upgrades).

## Layout

```
pivot/
├─ apps/
│  ├─ next/                  Next.js App Router entry point
│  │  ├─ app/page.tsx        thin client route -> shared HomeScreen
│  │  ├─ app/users/[id]/     thin client route -> shared UserDetailScreen
│  │  └─ next.config.js      RNW aliases + transpiled workspace packages
│  └─ expo/                  Expo entry point
│     ├─ app/_layout.tsx     providers + <Stack>
│     ├─ app/index.tsx       thin route -> shared HomeScreen
│     ├─ app/users/[id].tsx  thin route -> shared UserDetailScreen
│     └─ metro.config.js     monorepo watch folders + NativeWind
├─ packages/
│  └─ app/                   @pivot/app, the actual application
│     ├─ components/         Screen, Card, Button, text primitives
│     ├─ data/               demo users
│     ├─ features/           shared screens
│     ├─ provider/           safe area + theme context
│     └─ index.ts            public surface
├─ tailwind.config.js        one config for web and native
├─ turbo.json
└─ tsconfig.base.json
```

## Get started

```sh
npm install
npm run web       # http://localhost:3000
npm run native    # Expo dev server
```

`npm run native` works with Expo Go on SDK 54. To build a native client instead:

```sh
npm run android   # needs Android SDK / emulator or a device
npm run ios       # macOS only, or use EAS
```

Other commands:

```sh
npm run typecheck        # tsc in all three workspaces
npm run build            # production Next.js build
npm run format           # Prettier + Tailwind class sorting
```

## How the shared code works

- `packages/app` is the only place product UI should live. Both apps import from `@pivot/app`.
- Route files in `apps/next/app` and `apps/expo/app` are deliberately thin adapters. They read the `id` param from their platform router and pass it to the shared screen. This keeps Solito responsible for navigation, not for param plumbing.
- `solito/link` and `solito/navigation` are used inside shared screens. On web they delegate to `next/link` and `next/navigation`; on native they delegate to Expo Router / React Navigation.
- Styling is NativeWind `className` everywhere. Theme colors are static class strings in `packages/app/provider/theme.tsx` (light/dark), not dynamically generated names, so Tailwind can see them.
- `SafeAreaProvider` receives zeroed initial metrics on web. Without metrics it renders nothing during SSR, which would produce an empty first paint.

### NativeWind and the Next.js App Router

NativeWind does not support React Server Components. Every Next.js route that renders shared components starts with `'use client'`. The root `layout.tsx` is a server component and uses the documented escape hatch:

```tsx
/** @jsxImportSource react */
```

Do not remove that pragma. Without it the layout tries to use NativeWind's JSX runtime on the server.

## Dependency rules

| Kind of dependency             | Install in                              |
| ------------------------------ | --------------------------------------- |
| Pure JS used by shared screens | `packages/app`                          |
| Native modules / Expo packages | `apps/expo` (prefer `npx expo install`) |
| Web-only packages              | `apps/next`                             |
| Tooling used by the whole repo | root `devDependencies`                  |

Also:

- **Never add `react` to `apps/expo`.** React lives in `apps/next`; Expo must consume the hoisted copy. `npm ls react` should show exactly one version.
- Install native packages with matching versions in any other workspace that imports them. Version drift is the classic monorepo failure mode.
- `semver` is listed directly in `apps/expo` because Metro's monorepo resolver (`disableHierarchicalLookup`) cannot reach the nested copy under `react-native-reanimated`. It is a build-time requirement, not a UI dependency.

## Upgrades

The real upgrade unit is the **Expo SDK**, because it pins React, React Native and react-native-web together.

- Next.js can move within `16.x` independently. The `next/link` and `next/navigation` APIs Solito uses are stable.
- Do not bump React on its own. Move it with an Expo SDK upgrade.
- NativeWind v4 is pinned to Tailwind 3. Do not install Tailwind 4 until you migrate NativeWind v5.
- After an Expo upgrade, re-test Solito's native `Link`/`useRouter` path. That is where React Navigation changes can surface.

If Solito ever blocks a Next upgrade, the escape hatch is a platform-specific navigation module (`.web.ts` using `next/link` / `next/navigation`, `.native.ts` using Expo Router). The shared screens only need a router interface.

## Verified in this repo

- `npm run typecheck` across all workspaces
- `npm run build` (Next.js production build)
- Web rendered in headless Chrome: SSR content, Solito links, dynamic route, `router.push`, light/dark toggle, no console errors
- `expo export --platform android` produces a Hermes bundle

Not included yet: authentication, database, API layer, E2E tests, CI, EAS project configuration.
