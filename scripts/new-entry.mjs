import fs from 'node:fs';
import path from 'node:path';

const [title, code] = process.argv.slice(2);

if (!title || !code || !/^[A-Za-z][A-Za-z0-9]*$/.test(code)) {
  console.error(
    'Usage: npm run new "Entry Title" Code\n' +
      'Example: npm run new "Measure-Theoretic Probability" MeasureProb\n' +
      '(The code must be letters/digits and start with a letter.)'
  );
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const dir = path.resolve('src/content/notes');
const target = path.join(dir, `${slug}.md`);

if (fs.existsSync(target)) {
  console.error(`✗ ${path.relative('.', target)} already exists.`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const body = `---
title: "${title}"
code: ${code}
description: "One-sentence abstract shown in the index and under the title."
date: ${today}
---

Introductory paragraph.

## First section

:::definition{#first-definition}
...
:::
`;

fs.writeFileSync(target, body);
console.log(
  `✓ Created ${path.relative('.', target)}\n` +
    `  Write there, preview with: npm run write\n` +
    `  Reference its results from other entries as [[${code}:label]].`
);
