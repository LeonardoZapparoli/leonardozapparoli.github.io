import fs from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import { annotateNumbers } from './numbering.mjs';
import { state } from './state.mjs';

const CONTENT_DIR = path.resolve(process.cwd(), 'src/content/repository');

// Same syntax plugins as the site pipeline, so tokenization is identical.
const parser = unified().use(remarkParse).use(remarkMath).use(remarkDirective);

// path -> { mtimeMs, code, slug, items }
const fileCache = new Map();

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function parseFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  let code = null;
  const fm = src.match(FRONTMATTER_RE);
  if (fm) {
    const codeLine = fm[1].match(/^code:\s*["']?([A-Za-z][A-Za-z0-9]*)["']?\s*$/m);
    if (codeLine) code = codeLine[1];
    src = src.slice(fm[0].length);
  }
  const tree = parser.parse(src);
  const items = annotateNumbers(tree);
  const slug = path.basename(filePath).replace(/\.md$/, '');
  return { code, slug, items };
}

export function getRegistry() {
  const files = fg
    .sync('**/[^_]*.md', { cwd: CONTENT_DIR, absolute: true })
    .sort();

  const problems = [];
  const entries = new Map(); // code -> { slug, route }
  const labels = new Map(); // "Code:label" -> { kind, number, route, code, slug }

  for (const filePath of files) {
    const mtimeMs = fs.statSync(filePath).mtimeMs;
    let rec = fileCache.get(filePath);
    if (!rec || rec.mtimeMs !== mtimeMs) {
      rec = { mtimeMs, ...parseFile(filePath) };
      fileCache.set(filePath, rec);
    }

    const name = path.basename(filePath);
    if (!rec.code) {
      problems.push(`${name}: missing "code:" in frontmatter`);
      continue;
    }
    if (entries.has(rec.code)) {
      problems.push(`${name}: duplicate entry code "${rec.code}"`);
      continue;
    }
    const route = `/repository/${rec.slug}/`;
    entries.set(rec.code, { slug: rec.slug, route });

    const seen = new Set();
    for (const item of rec.items) {
      if (!item.label) continue;
      if (seen.has(item.label)) {
        problems.push(`${name}: duplicate label "#${item.label}"`);
        continue;
      }
      seen.add(item.label);
      labels.set(`${rec.code}:${item.label}`, {
        kind: item.kind,
        number: item.number,
        route,
        code: rec.code,
        slug: rec.slug,
      });
    }
  }

  if (problems.length > 0) {
    const message =
      'Cross-reference registry problems:\n  - ' + problems.join('\n  - ');
    if (state.strict) throw new Error(message);
    console.warn('[refs] ' + message);
  }

  return { entries, labels };
}
