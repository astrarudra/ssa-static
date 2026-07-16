# Mobile app OTA (`prod/mobile-app-ota`)

Self-hosted **Expo Updates** assets for the Sadhan Sangha Ashram mobile app ([Ax108/ssa-app](https://github.com/Ax108/ssa-app)), served from the same GitHub Pages CDN as site content:

`https://astrarudra.github.io/ssa-static/prod/mobile-app-ota/`

This is **separate** from content JSON (`prod/json/`) and does **not** use EAS Update.

## Why platform folders?

Expo Updates clients send `expo-platform: android|ios`. GitHub Pages is static and cannot branch on request headers, so we publish **one URL per platform**:

| Platform | Manifest URL (baked into the native binary)     |
| -------- | ----------------------------------------------- |
| Android  | `.../prod/mobile-app-ota/android/manifest.json` |
| iOS      | `.../prod/mobile-app-ota/ios/manifest.json`     |

Bundles and assets live under the same platform folder (`bundles/`, `assets/`).

## Layout

```
prod/mobile-app-ota/
  README.md                 ← this file
  android/
    manifest.json           ← Expo Updates protocol manifest (JSON)
    bundles/                ← JS / Hermes bundles
    assets/                 ← images/fonts referenced by the update
  ios/
    manifest.json
    bundles/
    assets/
```

## Publish flow (from the mobile app repo)

1. Bump / confirm `expo.version` only when natives change (JS-only OTAs keep the same version).
2. Native binary must already include `expo-updates` + matching `runtimeVersion` + `updates.url`.
3. From [Ax108/ssa-app](https://github.com/Ax108/ssa-app) (clone next to this `ssa-static` repo, or pass `--out`):

| Script                       | What it stages here            |
| ---------------------------- | ------------------------------ |
| `bun run ota:export:android` | `prod/mobile-app-ota/android/` |
| `bun run ota:export:ios`     | `prod/mobile-app-ota/ios/`     |
| `bun run ota:export:all`     | both (android then ios)        |

Both platform folders live in **this** repo on GitHub Pages; export is per-platform because bundles differ.

4. Commit + push **this** [astrarudra/ssa-static](https://github.com/astrarudra/ssa-static) repo so GitHub Pages updates (deploy branch is **`release`**).
5. Open the store/dev build — on next cold start it checks the manifest, downloads assets, and applies the update on the following relaunch (unless the app calls `reloadAsync`).

Full app-side notes: [ssa-app/docs/ota-self-host.md](https://github.com/Ax108/ssa-app/blob/main/docs/ota-self-host.md).

## Runtime compatibility

`runtimeVersion` in the manifest **must** match the value baked into the binary (`app.json` → `runtimeVersion.policy: "appVersion"` → same as `expo.version`, e.g. `1.0.0`).

Native module / Expo SDK changes require a **new store binary**, not OTA alone.

## Protocol notes

Manifests follow [Expo Updates protocol v1](https://docs.expo.dev/technical-specs/expo-updates-1/) JSON body (`application/json`). Code signing is optional and not required for this static setup.

Until the first real publish, there is **no** `manifest.json`. The app treats a missing/404 manifest as “no update” and runs the embedded binary bundle.

Do **not** commit placeholder manifests that point at fake bundle URLs — that can make clients attempt a broken download.
