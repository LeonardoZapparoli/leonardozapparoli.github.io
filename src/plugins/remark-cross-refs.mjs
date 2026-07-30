import path from 'node:path';
import { visit } from 'unist-util-visit';
import { getRegistry } from './registry.mjs';
import { KIND_LABELS } from './numbering.mjs';
import { state } from './state.mjs';

const REF_RE = /\[\[([^[\]]+)\]\]/g;

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = cur;
  }
  return prev[n];
}

function closestKey(key, registry) {
  const lower = key.toLowerCase();
  let best = null;
  let bestDist = Infinity;
  for (const candidate of registry.labels.keys()) {
    const cand = candidate.toLowerCase();
    if (cand.startsWith(lower) || lower.startsWith(cand)) return candidate;
    const d = levenshtein(lower, cand);
    if (d < bestDist) {
      bestDist = d;
      best = candidate;
    }
  }
  return bestDist <= 3 ? best : null;
}

function displayText(info, sameEntry) {
  if (sameEntry) {
    return info.kind === 'equation'
      ? `(${info.number})`
      : `${KIND_LABELS[info.kind]} ${info.number}`;
  }
  return info.kind === 'equation'
    ? `[${info.code} (${info.number})]`
    : `[${info.code} ${info.number}]`;
}

function makeRef(refText, currentCode, registry, file) {
  let key = null;
  let label = null;

  if (refText.startsWith('#')) {
    label = refText.slice(1);
    key = currentCode ? `${currentCode}:${label}` : null;
  } else if (refText.includes(':')) {
    key = refText;
    label = refText.slice(refText.indexOf(':') + 1);
  }

  const info = key ? registry.labels.get(key) : undefined;

  if (!info) {
    const suggestion = key ? closestKey(key, registry) : null;
    const where = file && file.path ? path.basename(file.path) : 'unknown file';
    const hint = suggestion ? ` Did you mean [[${suggestion}]]?` : '';
    const message = `Unresolved reference [[${refText}]] in ${where}.${hint}`;
    if (state.strict) throw new Error(message);
    console.warn('[refs] ' + message);
    return {
      type: 'strong',
      data: {
        hName: 'span',
        hProperties: { className: ['xref', 'xref-broken'], title: message },
      },
      children: [{ type: 'text', value: `[?? ${refText}]` }],
    };
  }

  const sameEntry = info.code === currentCode;
  const props = {
    className: ['xref', sameEntry ? 'xref-local' : 'xref-external'],
  };
  if (!sameEntry) {
    props.target = '_blank';
    props.rel = 'noopener';
  }
  return {
    type: 'link',
    url: sameEntry ? `#${label}` : `${info.route}#${label}`,
    data: { hProperties: props },
    children: [{ type: 'text', value: displayText(info, sameEntry) }],
  };
}

// remark-directive parses the ":label" half of "[[Code:label]]" as an inline
// text directive, splitting the text node; stitch those fragments back into
// plain text before resolving references.
function mergeTextDirectiveRefs(tree) {
  visit(tree, (parent) => {
    if (!parent.children) return;
    const kids = parent.children;
    for (let i = 0; i + 2 < kids.length; i++) {
      const a = kids[i];
      const b = kids[i + 1];
      const c = kids[i + 2];
      if (
        a.type === 'text' &&
        /\[\[[^[\]]*$/.test(a.value) &&
        b.type === 'textDirective' &&
        (!b.children || b.children.length === 0) &&
        c.type === 'text' &&
        /^[^[\]]*\]\]/.test(c.value)
      ) {
        kids.splice(i, 3, { type: 'text', value: `${a.value}:${b.name}${c.value}` });
        i -= 1;
      }
    }
  });
}

export function remarkCrossRefs() {
  return (tree, file) => {
    const frontmatter =
      (file && file.data && file.data.astro && file.data.astro.frontmatter) || {};
    const currentCode = frontmatter.code || null;
    let registry = null;

    mergeTextDirectiveRefs(tree);

    visit(tree, 'text', (node, index, parent) => {
      if (!parent || parent.type === 'link' || typeof index !== 'number') return;
      REF_RE.lastIndex = 0;
      if (!REF_RE.test(node.value)) return;
      registry = registry || getRegistry();

      const parts = [];
      let last = 0;
      let match;
      REF_RE.lastIndex = 0;
      while ((match = REF_RE.exec(node.value))) {
        if (match.index > last) {
          parts.push({ type: 'text', value: node.value.slice(last, match.index) });
        }
        parts.push(makeRef(match[1].trim(), currentCode, registry, file));
        last = match.index + match[0].length;
      }
      if (last < node.value.length) {
        parts.push({ type: 'text', value: node.value.slice(last) });
      }

      parent.children.splice(index, 1, ...parts);
      return index + parts.length;
    });
  };
}
