import { visit } from 'unist-util-visit';

export const ENV_KINDS = [
  'theorem',
  'lemma',
  'proposition',
  'corollary',
  'definition',
  'remark',
  'example',
];

export const KIND_LABELS = {
  theorem: 'Theorem',
  lemma: 'Lemma',
  proposition: 'Proposition',
  corollary: 'Corollary',
  definition: 'Definition',
  remark: 'Remark',
  example: 'Example',
  equation: 'Equation',
};

const EQ_LABEL_RE = /^\{#([A-Za-z0-9][A-Za-z0-9_-]*)\}$/;

// Single source of truth for numbering, used both by the global registry scan
// and by the render-time transform so the two can never disagree.
// Scheme: H2 headings define sections; theorem-like environments share one
// counter per section (LaTeX \newcommand{lemma}[theorem] style); labeled
// display equations get their own per-section counter. Files without H2s
// fall back to flat counters.
export function annotateNumbers(tree) {
  let section = 0;
  let env = 0;
  let eq = 0;
  const items = [];

  visit(tree, (node, index, parent) => {
    if (node.type === 'heading' && node.depth === 2) {
      section += 1;
      env = 0;
      eq = 0;
      return;
    }

    if (node.type === 'containerDirective' && ENV_KINDS.includes(node.name)) {
      env += 1;
      const number = section > 0 ? `${section}.${env}` : String(env);
      node.data = node.data || {};
      node.data.envNumber = number;
      const label = (node.attributes && node.attributes.id) || null;
      items.push({ label, kind: node.name, number });
      return;
    }

    if (node.type === 'math' && parent && typeof index === 'number') {
      const next = parent.children[index + 1];
      let labelText = null;
      if (
        next &&
        next.type === 'paragraph' &&
        next.children.length === 1 &&
        next.children[0].type === 'text'
      ) {
        labelText = next.children[0].value.trim();
      }
      const m = labelText && labelText.match(EQ_LABEL_RE);
      if (m) {
        eq += 1;
        const number = section > 0 ? `${section}.${eq}` : String(eq);
        node.data = node.data || {};
        node.data.eqNumber = number;
        node.data.eqLabel = m[1];
        items.push({ label: m[1], kind: 'equation', number });
      }
    }
  });

  return items;
}
