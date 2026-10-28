# Contributing to bever.dev

Corrections and new pages are welcome. Every page has an *Edit this page on GitHub* link.

## Writing style

- **Precise.** Use the exact terms: entity, field, action, model, semantic model. Show the `.bev` source or the command, then explain it.
- **Calm.** No exclamation marks, hype words, or emoji.
- **Candid.** Document what works today. Planned features belong on the [roadmap](docs/roadmap.md), not in guides.
- **Tested.** Every model and command in the docs must work with the current release. Run models through `bever check` before committing.
- Address the reader as "you", keep sentences short, and use sentence case for headings.

## Keeping the docs true

The reference pages describe the code in [bever](https://github.com/bever-team/bever), [bever-cli](https://github.com/bever-team/bever-cli), and [bever-js](https://github.com/bever-team/bever-js). A change there that affects behavior needs a matching pull request here. `docs/reference/diagnostics.md` lists every compiler diagnostic; update it when codes or messages change.

By participating you agree to follow the [code of conduct](https://github.com/bever-team/.github/blob/main/CODE_OF_CONDUCT.md).
