# GitHub Pages response headers (Expo Updates)

Bare **GitHub Pages does not apply custom HTTP response headers**. A `_headers`
file (Netlify / Cloudflare Pages) is inert on `*.github.io` and must not be
treated as live configuration.

SSA OTA already works with static JSON manifests on Pages (clients send
`expo-protocol-version`; missing response protocol headers are not a hard
blocker for this setup). Use the options below only if you want explicit Expo
protocol / cache headers on responses.

## Recommended: Cloudflare in front of GitHub Pages

Point a proxied hostname (or use Cloudflare Transform Rules on traffic that
reaches Pages) and add:

| Path match                              | Header                   | Value                                          |
| --------------------------------------- | ------------------------ | ---------------------------------------------- |
| `*/prod/mobile-app-ota/*/manifest.json` | `Expo-Protocol-Version`  | `1`                                            |
| `*/prod/mobile-app-ota/*/manifest.json` | `Expo-SFV-Version`       | `0`                                            |
| `*/prod/mobile-app-ota/*`               | `Cache-Control`          | `private, no-cache, no-store, must-revalidate` |
| `*/prod/mobile-app-ota/*`               | `X-Robots-Tag`           | `noindex, nofollow`                            |
| `*/prod/mobile-app-ota/*`               | `X-Content-Type-Options` | `nosniff`                                      |

No WAF client key and no app `requestHeaders` — assets remain public on Pages.

## Not used here

- `vercel.json` headers (Challenge App) — this host is GitHub Pages
- App-side OTA secrets / `EXPO_PUBLIC_*` client keys — intentionally absent
