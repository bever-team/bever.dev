# AGENTS.md

Guidance for coding agents working in this repository. Humans: see [CONTRIBUTING.md](CONTRIBUTING.md).

## What this is

The Bever website and user documentation, built with VitePress. The reference pages are the public contract of the language, semantic model, CLI, HTTP API, and SDK.

| Path | Contents |
| --- | --- |
| `docs/guide/` | Task-oriented guides |
| `docs/reference/language.md` | The complete language: source of truth for syntax |
| `docs/reference/semantic-model.md` | The model JSON contract |
| `docs/reference/http-api.md`, `cli.md`, `sdk.md` | Runtime, CLI, and SDK references |
| `docs/reference/diagnostics.md` | Every compiler diagnostic code |
| `docs/roadmap.md` | Planned features (the only place they are described) |
| `docs/.vitepress/` | Site config, theme, `.bev` grammar (copied from bever-vscode) |
| `BRAND.md` | Name, logo, colors, and voice |

## Read first

- [CONTRIBUTING.md](CONTRIBUTING.md) for the writing style.
- [BRAND.md](BRAND.md) for voice: precise, calm, candid. Enterprise tone, no puns, no hype, no emoji.
- Contributor internals that stay out of user docs live in [bever/docs](https://github.com/bever-team/bever/tree/main/docs).

## Commands

```sh
npm install
npm run dev
npm run build     # must pass
```

## Rules

- Document only what the current release implements. Planned features go on the roadmap, never in guides or references.
- Docs change with code: a behavior change in bever, bever-cli, or bever-js comes with the matching page change here.
- Every model and command in the docs must work: run models through `bever check`.
- Keep `diagnostics.md` in sync with the compiler's codes and messages.
- Address the reader as "you"; short sentences; sentence-case headings.
- Do not redesign the logo or brand assets.
