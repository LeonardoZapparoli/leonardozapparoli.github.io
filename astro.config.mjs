import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import rehypeKatex from 'rehype-katex';
import { remarkTheoremEnvs } from './src/plugins/remark-theorem-envs.mjs';
import { remarkCrossRefs } from './src/plugins/remark-cross-refs.mjs';
import { refSystem } from './src/plugins/integration.mjs';
import { loadPreambleMacros } from './src/plugins/preamble.mjs';

// Global LaTeX macros: edit preamble.tex at the repo root, like a LaTeX preamble.
const macros = loadPreambleMacros(new URL('./preamble.tex', import.meta.url));

export default defineConfig({
  site: 'https://leonardozapparoli.github.io',
  redirects: {
    '/repository/': '/notes/',
    '/repository/[slug]': '/notes/[slug]',
  },
  integrations: [refSystem()],
  markdown: {
    remarkPlugins: [remarkMath, remarkDirective, remarkTheoremEnvs, remarkCrossRefs],
    rehypePlugins: [[rehypeKatex, { macros, strict: false }]],
  },
});
