import { state } from './state.mjs';

export function refSystem() {
  return {
    name: 'theorem-refs',
    hooks: {
      'astro:config:setup': ({ command }) => {
        state.strict = command === 'build';
      },
    },
  };
}
