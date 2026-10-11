import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    date: z.string(),
    label: z.string(),
    headlines: z.array(z.string()),
  }),
});

const certifications = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/certifications' }),
  schema: z.object({
    date: z.string(),
    title: z.string(),
    issuer: z.string(),
    description: z.string(),
    url: z.string(),
    pdf: z.string().optional(),
  }),
});

export const collections = { news, certifications };
