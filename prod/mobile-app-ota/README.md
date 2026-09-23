# Mobile app OTA (`prod/mobile-app-ota`)

Self-hosted **Expo Updates** (JS bundle only) for the Sadhan Sangha Ashram
mobile app ([Ax108/ssa-app](https://github.com/Ax108/ssa-app)), served from this
repository ([astrarudra/ssa-static](https://github.com/astrarudra/ssa-static)) on
GitHub Pages:

`https://astrarudra.github.io/ssa-static/prod/mobile-app-ota/`

This is **separate** from content JSON (`prod/json/`) and does **not** use EAS
Update. Fonts / static-media OTA lanes are not part of this pipeline.

**Full-bundle only.** GitHub Pages is static and cannot negotiate BSDIFF
(HTTP 226), so each publish replaces the platform tree with one complete Hermes
bundle + assets.

## Local clone layout (required to publish)

JS OTA is staged by a script in [Ax108/ssa-app](https://github.com/Ax108/ssa-app)
into a **local** checkout of this repo. There is no remote-only publish path
from CI for OTA today.

1. Clone the app: `https://github.com/Ax108/ssa-app`
2. Clone this host as a **sibling** of that app clone (same parent directory),
   named `ssa-static` so the default export path works:
   `https://github.com/astrarudra/ssa-static`
3. From the app clone, run `bun run ota:export:android` / `ios` / `all`
   (writes into `../ssa-static/prod/mobile-app-ota/…`). Override with
   `--out <path>` if your folders are not siblings.
4. In **this** repo: commit `prod/mobile-app-ota`, push, and merge to **`release`**
   so GitHub Pages deploys.

## Why platform folders (and no version folders)?

Expo Updates clients send `expo-platform: android|ios`. GitHub Pages is static
and cannot branch on request headers, so we publish **one URL per platform**.

There are **no** `android/<appVersion>/` trees. Each publish overwrites the same
platform folder for the **current** `expo.version` (`runtimeVersion`). When you
ship a new store binary:

1. Manually bump `storeApp.latestVersion` in
   [`prod/json/config.json`](https://github.com/astrarudra/ssa-static/blob/main/prod/json/config.json)
   to match the new `app.json` `expo.version` in [ssa-app](https://github.com/Ax108/ssa-app)
   (this drives the in-app Play / App Store prompt — **not** the OTA folder).
2. Older binaries show the store update prompt.
3. From [ssa-app](https://github.com/Ax108/ssa-app), publish OTA for the new
   runtime into the same flat `android/` / `ios/` paths (sibling clone as above).

| Platform | Manifest URL (baked into the native binary)     |
| -------- | ----------------------------------------------- |
| Android  | `.../prod/mobile-app-ota/android/manifest.json` |
| iOS      | `.../prod/mobile-app-ota/ios/manifest.json`     |

## Layout

```
prod/mobile-app-ota/
  README.md
  docs/GITHUB_PAGES_HEADERS.md
  android/
    manifest.json
    bundles/*.hbc
    assets/
  ios/
    …same…
```

## Publish flow (from the app origin)

1. Confirm `expo.version` in [Ax108/ssa-app](https://github.com/Ax108/ssa-app) —
   JS-only OTAs keep it unchanged; store releases bump it.
2. Native binary must already include `expo-updates` + matching `runtimeVersion` +
   `updates.url` with `checkAutomatically: NEVER`.
3. With this repo cloned as a sibling of the app clone, from [ssa-app](https://github.com/Ax108/ssa-app):

| Script                       | What it stages here            |
| ---------------------------- | ------------------------------ |
| `bun run ota:export:android` | `prod/mobile-app-ota/android/` |
| `bun run ota:export:ios`     | `prod/mobile-app-ota/ios/`     |
| `bun run ota:export:all`     | both                           |

4. Commit + push **this** [ssa-static](https://github.com/astrarudra/ssa-static) repo and merge to **`release`** (Pages deploy branch).
5. Release binaries check/fetch in the background; activation is on the next
   true background→active opening (`reloadAsync`) or cold start.

Full app notes: [ssa-app/docs/ota-self-host.md](https://github.com/Ax108/ssa-app/blob/main/docs/ota-self-host.md).

## Headers

Bare GitHub Pages cannot set custom response headers. Optional Cloudflare-in-front
rules: [`docs/GITHUB_PAGES_HEADERS.md`](./docs/GITHUB_PAGES_HEADERS.md).

## Runtime compatibility

`runtimeVersion` in the manifest **must** match the binary (`appVersion` policy).
Native / SDK changes require a new store binary, not OTA alone.

Do **not** commit placeholder manifests that point at fake bundle URLs.
