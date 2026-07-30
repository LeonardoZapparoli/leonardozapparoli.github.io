# leonardozapparoli.github.io

Personal website and technical repository. Built with Astro; math rendered
at build time with KaTeX; theorem environments and cross-references
implemented as custom remark plugins in `src/plugins/`.

**Writing and publishing: see [WRITING.md](WRITING.md).**

- `npm run write` — live preview while writing
- `npm run publish` — verify + push live
- `npm run new "Title" Code` — create an entry from the template

Deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to
`main`.
