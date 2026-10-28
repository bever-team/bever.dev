# bever.dev

The website and documentation of [Bever](https://bever.dev), built with [VitePress](https://vitepress.dev).

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # docs/.vitepress/dist
```

| Path | Contents |
| --- | --- |
| `docs/index.md` | Home page |
| `docs/guide/` | Guides, from getting started to deployment |
| `docs/reference/` | Language, CLI, HTTP API, SDK, semantic model, and diagnostics |
| `docs/public/brand/` | Logo files |
| `docs/public/screenshots/` | Screenshots of a generated app |
| `docs/.vitepress/bev.tmLanguage.json` | `.bev` highlighting, shared with [bever-vscode](https://github.com/bever-team/bever-vscode) |

Pushes to `main` build and deploy the site to GitHub Pages at `bever.dev` (`docs/public/CNAME`). The build fails on broken internal links.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the writing style and [BRAND.md](BRAND.md) for the logo and colors.

## License

Documentation text is licensed under [CC BY 4.0](LICENSE-docs). The site source and code samples are licensed under [MIT No Attribution](LICENSE), so you can copy samples without keeping a notice. "Bever" and the Bever logo are trademarks; see [TRADEMARKS.md](https://github.com/bever-team/bever/blob/main/TRADEMARKS.md).
