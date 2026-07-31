# Writing guide

Everything you need to write and publish entries. No web knowledge required.

## The two commands

Open Terminal in this folder (in VS Code: Terminal → New Terminal), then:

| Command | What it does |
| --- | --- |
| `npm run write` | Starts a live preview at `http://localhost:4321` and opens it in your browser. Every time you save a file, the page refreshes. Stop it with `Ctrl+C`. |
| `npm run publish` | Checks the site for errors (broken references stop the publish), then pushes everything live. The site updates in ~2 minutes. Optionally: `npm run publish "added measure theory entry"`. |

## Adding a new entry

```
npm run new "Measure-Theoretic Probability" MeasureProb
```

This creates `src/content/notes/measure-theoretic-probability.md` from
the template, with the title, code, and today's date filled in. Or copy
`_template.md` by hand. Every entry needs frontmatter:

```markdown
---
title: "Measure-Theoretic Probability"
code: MeasureProb          # short unique code used in cross-references
description: "One-line abstract."
date: 2026-07-29
---
```

## Math

- Inline: `$\E[X]$` → works anywhere, including inside theorems.
- Display: `$$ ... $$` on their own lines.
- Global macros (`\R`, `\E`, `\norm{x}`, …) live in `preamble.tex` at the
  repository root — edit it like a LaTeX preamble. Site-wide, all entries.
- Literal dollar signs in prose: write `\$`.

## Theorem-like environments

```markdown
:::theorem{#spectral title="Spectral Theorem"}
Let $A$ be real symmetric. Then ...
:::
```

- Available: `theorem`, `lemma`, `proposition`, `corollary`, `definition`,
  `remark`, `example` — all share one counter, numbered `section.n`
  (sections are the `##` headings). Plus `proof`, which is unnumbered and
  gets a QED box.
- `#spectral` is the label (needed only if you want to reference it).
- `title="..."` is optional; keep titles plain text (no math).
- To nest (e.g. a proof inside a theorem), the **outer** environment uses
  four colons:

```markdown
::::theorem{#foo}
Statement.
:::proof
Proof.
:::
::::
```

## Numbered equations

Put a label line immediately after the closing `$$`:

```markdown
$$
\norm{x+y} \le \norm{x} + \norm{y} .
$$
{#triangle}
```

Only labeled equations get numbers — scratch displays stay unnumbered.

## Cross-references

| You write | Renders as | Behavior |
| --- | --- | --- |
| `[[#spectral]]` | Theorem 3.2 | jumps within the page |
| `[[#triangle]]` | (1.2) | jumps within the page |
| `[[LinAlg:spectral]]` | [LinAlg 3.2] | opens that entry in a new tab |
| `[[LinAlg:triangle]]` | [LinAlg (1.2)] | opens that entry in a new tab |

Never type numbers like "Theorem 3.2" by hand — always use `[[...]]`, so
numbers stay correct when you insert material. If a reference is broken, the
preview shows a red `[?? ...]` marker, and `npm run publish` refuses to
publish until it's fixed (it will suggest the closest matching label).

## Importing existing .tex files

Drop `.tex` files into the `import/` folder and ask Claude to convert them
into entries. Preamble macros they rely on get merged into `preamble.tex`.

## Where things live (everything you edit is Markdown)

| Page / content | File to edit |
| --- | --- |
| Notes entries | `src/content/notes/*.md` (one file per entry) |
| Blog posts | `src/content/blog/*.md` (copy `_template.md` to start one) |
| Home page text | `src/content/pages/home.md` |
| Notes intro text | `src/content/pages/notes-intro.md` |
| Miscellaneous page | `src/content/pages/miscellaneous.md` |
| Section names, your name, email/GitHub links | `site.config.mjs` |
| Global math macros | `preamble.tex` |

Notes:

- The "Last updated" date on each entry is automatic — it comes from the git
  history, so it advances whenever you publish changes to that file.
- The navigation dropdowns (Blog, Technical Repository) build themselves from
  whatever files exist — adding an entry adds it to the menu.
- Everything else is machinery — no need to touch it.
