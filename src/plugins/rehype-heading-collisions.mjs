import { visit } from 'unist-util-visit';

// A heading's automatic id ("## Entropy" -> #entropy) can equal the label of
// an environment or equation (:::definition{#entropy}). Two elements then
// share one id and a reference to the label lands on the heading, which
// comes first in the page. Astro keeps a heading id that is already set, so
// give colliding headings the id "<slug>-section" before Astro assigns ids;
// the table of contents picks the new id up automatically.

function slugOf(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s/g, '-')
    .replace(/-$/, '');
}

function textOf(node) {
  let out = '';
  visit(node, 'text', (t) => {
    out += t.value;
  });
  return out;
}

export function rehypeHeadingCollisions() {
  return (tree) => {
    const labels = new Set();
    visit(tree, 'element', (node) => {
      const props = node.properties || {};
      const classes = Array.isArray(props.className) ? props.className : [];
      if (typeof props.id === 'string' && (classes.includes('env') || classes.includes('equation'))) {
        labels.add(props.id);
      }
    });
    if (labels.size === 0) return;

    visit(tree, 'element', (node) => {
      if (!/^h[1-6]$/.test(node.tagName)) return;
      node.properties = node.properties || {};
      if (typeof node.properties.id === 'string') return;
      const slug = slugOf(textOf(node));
      if (labels.has(slug)) node.properties.id = `${slug}-section`;
    });
  };
}
