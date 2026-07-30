import { execSync } from 'node:child_process';
import fs from 'node:fs';

const cache = new Map();

// Last-updated date for a content file: git last-commit date, so it advances
// automatically on publish; falls back to file mtime for uncommitted edits
// (dev preview) and to the frontmatter date when git is unavailable.
export function lastUpdated(filePath, fallback) {
  if (!filePath) return fallback;
  if (cache.has(filePath)) return cache.get(filePath);
  let date = null;
  try {
    const dirty = execSync(`git status --porcelain -- "${filePath}"`, {
      encoding: 'utf8',
    }).trim();
    if (dirty) {
      date = new Date(fs.statSync(filePath).mtimeMs);
    } else {
      const out = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
        encoding: 'utf8',
      }).trim();
      if (out) date = new Date(out);
    }
  } catch {
    date = null;
  }
  if (!date || Number.isNaN(date.valueOf())) date = fallback;
  cache.set(filePath, date);
  return date;
}

export function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
