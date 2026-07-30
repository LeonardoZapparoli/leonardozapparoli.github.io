import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const repository = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/repository' }),
  schema: z.object({
    title: z.string(),
    code: z
      .string()
      .regex(/^[A-Za-z][A-Za-z0-9]*$/, 'code must be letters/digits, starting with a letter (e.g. LinAlg)'),
    description: z.string(),
    date: z.coerce.date(),
  }),
});

export const collections = { repository };
