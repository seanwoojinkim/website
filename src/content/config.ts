import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.string(),
    year: z.string(),
    category: z.string(),
    order: z.number(),
    buttons: z.array(z.object({
      text: z.string(),
      url: z.string(),
      style: z.enum(['primary', 'secondary']),
    })),
  }),
});

const writing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    status: z.enum(['published', 'draft', 'coming-soon']).default('published'),
    // POSSE: Syndication URLs for cross-posting to other platforms
    syndication: z.array(z.object({
      platform: z.string(),
      url: z.string(),
    })).optional(),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
  }),
});

export const collections = { projects, writing, pages };
