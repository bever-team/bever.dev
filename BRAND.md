# Bever Brand

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/public/brand/bever-logo-on-dark.svg">
  <img alt="Bever" src="docs/public/brand/bever-logo.svg" width="240">
</picture>

Bever is an open-source language and framework for business applications. The
identity is built for teams that run their business on it: precise, calm, and
durable.

## Name

| Write | For |
| --- | --- |
| Bever | The project, language, and framework. Capital B in prose. |
| `bever` | The CLI command and lowercase contexts: package names, URLs. |
| `.bev` files | Source files. The `bev/` folder holds them. |
| Bever app | An application built with Bever. |
| `@bever/sdk`, `Bever.*` | JavaScript and .NET packages. |

Avoid "BEVER" in running text and "Bever.dev" as a product name. bever.dev is
the website.

Bever is Dutch for beaver, an engineer that builds lasting structures from
simple parts. The symbol shows one, built from a few flat shapes.

Pronunciation: BEV-er, rhymes with "clever" (proposed).

## Message

- Tagline: **Business logic as code.**
- Descriptor: An open-source language and framework for business applications.
- One-liner: Bever compiles compact `.bev` definitions of entities, actions,
  permissions, and rules into a validated, authorized API and a client your
  team owns.

## Voice

- **Precise.** Use exact terms: entity, action, permission, semantic model. No hype words.
- **Evidence first.** Show the `.bev` source, the contract, or the test, then make the claim.
- **Calm.** No exclamation marks, puns, slang, or emoji in product, docs, errors, or CLI output.
- **Candid.** Bever is pre-1.0. State what is supported and what is not.

## Logo

| Asset | Use |
| --- | --- |
| [`brand/bever-logo.svg`](docs/public/brand/bever-logo.svg) | Symbol in Copper and Petrol, wordmark in Ink, for light backgrounds. The primary logo. |
| [`brand/bever-logo-on-dark.svg`](docs/public/brand/bever-logo-on-dark.svg) | Symbol in white with a Copper belly, wordmark in white, for dark backgrounds. |
| [`brand/bever-mark.svg`](docs/public/brand/bever-mark.svg) | The symbol alone, when the name is already on screen. |
| [`brand/bever-mark-outline.svg`](docs/public/brand/bever-mark-outline.svg) | The symbol as Ink outlines, for large decorative use on light backgrounds, such as the website hero. |
| [`brand/bever-mark-outline-on-dark.svg`](docs/public/brand/bever-mark-outline-on-dark.svg) | The same outlines in white, for dark backgrounds. |
| [`brand/bever-icon.svg`](docs/public/brand/bever-icon.svg) | The dark symbol on an Ink tile: favicons, app and file icons, avatars. |

The symbol is a seated beaver that also reads as a lowercase b. The head and
stem form the b's ascender, the Petrol belly is its bowl, and the flat paddle
tail sweeps out behind. On light backgrounds the head and tail are Copper and
the belly is Petrol. On dark backgrounds the head and tail are white and the
belly is Copper. The three shapes are separated by an even
gap, the belly is a true half-disc, and the symbol sits on a flat base. It
always faces right, into the wordmark, and is centered on the wordmark's cap
height at 1.55 times that height.

Packaged copies of the icon must change with it: `images/bever.svg` and `images/icon.png` in
[bever-vscode](https://github.com/bever-team/bever-vscode), `eng/icon.png` in
[bever](https://github.com/bever-team/bever) and [bever-cli](https://github.com/bever-team/bever-cli),
and `client/public/favicon.svg` in [bever-templates](https://github.com/bever-team/bever-templates).
Regenerate the PNG with:

```sh
rsvg-convert -w 256 -h 256 docs/public/brand/bever-icon.svg -o icon.png
```

- Keep clear space of at least the wordmark's x-height on every side.
- Minimum size: 20 px tall for the logo and 16 px for the icon.
- The wordmark is drawn, not typeset. Do not retype it in a font.
- Use only the color sets in the files above. Do not recolor the shapes, add
  effects, outlines, or gradients, or stretch or rotate the logo.
- Do not add expressions, poses, props, or animation, and do not draw other
  beavers. The symbol is the only one.

## Color

| Name | Hex | Use |
| --- | --- | --- |
| Petrol | `#12424F` | Primary: the symbol's belly, primary buttons, links on light backgrounds |
| Ink | `#0F1E24` | The wordmark, text, and dark surfaces |
| Slate | `#52636B` | Secondary text |
| Mist | `#F2F5F6` | Subtle surfaces |
| Line | `#D9E1E4` | Dividers and borders |
| Tide | `#7CC3CD` | Petrol's counterpart on dark surfaces: links, focus, highlights |
| Copper | `#B85A20` | The symbol's head and tail (its belly on dark), and the single warm accent in UI, used sparingly |

WCAG contrast on white: Ink 17.1:1, Petrol 11.0:1, Slate 6.3:1, Copper 4.6:1.
Copper is text-safe only on white; on Mist it drops to 4.2:1.
White text on Petrol buttons is 11.0:1, and Tide on Ink is 8.6:1. Line is
decorative only (1.3:1), so interactive borders need a darker neutral.

Generated apps keep a neutral theme. They borrow the icon only as a placeholder
favicon.

## Type

- Wordmark: "Bever" in custom geometric letters with flat terminals, stored as paths in the SVGs.
- Text and UI: Geist. Code: Geist Mono. Both are open source (OFL); the website
  and the project template use them.
