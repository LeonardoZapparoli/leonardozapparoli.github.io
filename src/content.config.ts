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

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
  }),
});

// Prose for the fixed pages (home, repository intro, miscellaneous) —
// editable as plain Markdown without touching any layout code.
const pages = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string().optional(),
  }),
});

export const collections = { repository, blog, pages };
