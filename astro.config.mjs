import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // IMPORTANT: Update this with your production domain after Vercel deployment
  // Example: 'https://seankim.vercel.app' or 'https://yourdomain.com'
  // This URL is used for:
  // - RSS feed absolute URLs
  // - Sitemap generation
  // - Canonical URLs in meta tags
  site: 'https://your-site.vercel.app',

  // Static site generation - pre-renders all pages at build time
  output: 'static',

  // Markdown syntax highlighting configuration
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
