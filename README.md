# Q-Guard website

Static version of [q-guard.app](https://q-guard.app), migrated off WordPress to GitHub Pages. HTML, CSS and vanilla JavaScript only.

- **Production:** https://q-guard.app (`main`). The domain still points at WordPress.com until the switch described in [docs/ovh-switch.md](docs/ovh-switch.md).
- **Preview:** https://q-leap.github.io/qguard-preview/ (`dev`, plus the `alternative` proposal under `/alternative/`, never indexed)
- **Branches:** work on `dev`, merge into `main` when a change is done. `main` is what GitHub Pages publishes.

## Run locally

```sh
python3 -m http.server 8765
# open http://localhost:8765/
```

## Docs

- [docs/architecture.md](docs/architecture.md): how the site is built, forms, SEO and staging, verification tools
- [docs/design-system.md](docs/design-system.md): colours, fonts, breakpoints, components
- [docs/roadmap.md](docs/roadmap.md): what's done and what's left
- [docs/ovh-switch.md](docs/ovh-switch.md): switching q-guard.app to GitHub Pages with DNS at OVH
