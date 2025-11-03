import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Production domain for canonical URLs, RSS feeds, and metadata
  // Used for:
  // - RSS feed absolute URLs
  // - Sitemap generation
  // - Canonical URLs in meta tags
  // - IndieWeb microformats2 permalinks
  site: 'https://seanwooj.in',

  // Static site generation - pre-renders all pages at build time
  output: 'static',

  // Markdown syntax highlighting configuration
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
