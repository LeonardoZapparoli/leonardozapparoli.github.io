import { visit } from 'unist-util-visit';

// Replaces Astro's built-in smartypants. That one decides quote direction
// one text node at a time, so a quote directly before inline math
// ("$B$ occurred") sits at the end of its text node and is turned into a
// closing quote. Here the direction is decided from the character that
// precedes the quote across sibling nodes; math, code and links count as
// word characters.

const OPENS_AFTER = /[\s(\[{<\-–—\/]/;
const INLINE_CONTAINERS = new Set(['emphasis', 'strong', 'delete', 'link', 'linkReference']);
const BLOCKS = new Set(['paragraph', 'heading', 'tableCell']);

function convert(text, prev) {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const p = i === 0 ? prev : text[i - 1];
    const opens = p === '' || OPENS_AFTER.test(p);
    if (c === '"') out += opens ? '“' : '”';
    else if (c === "'") out += opens ? '‘' : '’';
    else out += c;
  }
  return out.replace(/---/g, '—').replace(/--/g, '–').replace(/\.\.\./g, '…');
}

function walk(children, prev) {
  for (const child of children) {
    if (child.type === 'text') {
      child.value = convert(child.value, prev);
      if (child.value.length > 0) prev = child.value[child.value.length - 1];
    } else if (INLINE_CONTAINERS.has(child.type) && child.children) {
      prev = walk(child.children, prev);
    } else if (child.type === 'break') {
      prev = ' ';
    } else {
      prev = 'x';
    }
  }
  return prev;
}

export function remarkSmartQuotes() {
  return (tree) => {
    visit(tree, (node) => {
      if (BLOCKS.has(node.type) && node.children) walk(node.children, '');
    });
  };
}
