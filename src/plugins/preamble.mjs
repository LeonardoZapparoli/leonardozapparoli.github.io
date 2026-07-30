import fs from 'node:fs';

// Parses \newcommand{\name}{body} and \newcommand{\name}[nargs]{body} from
// preamble.tex into a KaTeX macros object. KaTeX infers arity from #1..#9
// in the body, so parameterized macros work as-is.
export function loadPreambleMacros(fileUrl) {
  let src;
  try {
    src = fs.readFileSync(fileUrl, 'utf8');
  } catch {
    return {};
  }

  src = src
    .split('\n')
    .map((line) => {
      let out = '';
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '%' && line[i - 1] !== '\\') break;
        out += line[i];
      }
      return out;
    })
    .join('\n');

  const macros = {};
  const re = /\\(?:new|renew)command\{(\\[a-zA-Z]+)\}(?:\[\d+\])?\{/g;
  let m;
  while ((m = re.exec(src))) {
    let depth = 1;
    let i = re.lastIndex;
    while (i < src.length && depth > 0) {
      const c = src[i];
      if (c === '\\') i += 1;
      else if (c === '{') depth += 1;
      else if (c === '}') depth -= 1;
      i += 1;
    }
    macros[m[1]] = src.slice(re.lastIndex, i - 1);
    re.lastIndex = i;
  }
  return macros;
}
