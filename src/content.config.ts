import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string().default('RSMK Engineering Team'),
    category: z.string(),
    readTime: z.string().default('12 min read'),
    difficulty: z.string().default('Intermediate'),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
