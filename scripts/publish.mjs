import { spawnSync } from 'node:child_process';

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  return result.status === 0;
}

const message =
  process.argv.slice(2).join(' ').trim() ||
  `Update site content (${new Date().toISOString().slice(0, 10)})`;

console.log('\n— Step 1/2: checking the site builds cleanly…\n');
if (!run('npx', ['astro', 'build'])) {
  console.error(
    '\n✗ The site did not build. Nothing was published.\n' +
      '  Read the error above — broken cross-references name the file and\n' +
      '  the reference, and suggest the closest matching label.\n'
  );
  process.exit(1);
}

console.log('\n— Step 2/2: publishing…\n');
run('git', ['add', '-A']);

const staged = spawnSync('git', ['diff', '--cached', '--quiet']);
if (staged.status === 0) {
  console.log('No new changes to commit; pushing any unpushed commits…');
} else if (!run('git', ['commit', '-m', message])) {
  console.error('\n✗ Commit failed. Nothing was published.');
  process.exit(1);
}

if (!run('git', ['push'])) {
  console.error(
    '\n✗ Push failed — usually a network or GitHub sign-in issue.\n' +
      '  Try again, or run: gh auth login\n'
  );
  process.exit(1);
}

console.log(
  '\n✓ Published. GitHub is rebuilding the site now — live in ~2 minutes at\n' +
    '  https://leonardozapparoli.github.io\n'
);
