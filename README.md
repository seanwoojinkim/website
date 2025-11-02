# Sean Kim Portfolio

Personal portfolio site showcasing interactive systems, generative art, and biometric experiments.

## Overview

Modern portfolio site built with Astro, featuring:
- **Work showcase**: Wooj Lighting, interactive visualizations, biometric installations
- **Writing**: Technical articles on generative systems, biometrics, and rendering
- **About**: Background, practice, and collaboration interests
- **RSS feed**: Subscribe to new writing at `/rss.xml`

## Stack

- **Astro 4.0** - Modern static site generator
- **Content Collections** - Type-safe Markdown/JSON content management
- **TypeScript** - Type safety and excellent developer experience
- **Vercel** - Zero-config deployment with automatic builds
- **RSS** - Built-in feed generation for writing

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Development (Optional)

```bash
# Start container with Astro dev server
docker-compose up -d

# View site
open http://localhost:8081

# Stop container
docker-compose down
```

## Project Structure

```
portfolio/
├── src/
│   ├── content/
│   │   ├── config.ts              # Content schemas (Zod validation)
│   │   ├── projects/              # Project data (JSON files)
│   │   │   ├── 01-wooj-lighting.json
│   │   │   ├── 02-koi-simulation.json
│   │   │   ├── 03-coherence-viz.json
│   │   │   └── 04-calming-clouds.json
│   │   └── writing/               # Writing content (Markdown files)
│   │       ├── smooth-coherence-transitions.md
│   │       ├── fingertip-ecg.md
│   │       ├── svg-rendering.md
│   │       └── physiological-synchrony.md
│   ├── layouts/
│   │   └── BaseLayout.astro       # Shared layout (nav, footer, meta tags)
│   ├── components/
│   │   ├── ProjectCard.astro      # Project card component
│   │   └── WritingItem.astro      # Writing list item component
│   ├── pages/
│   │   ├── index.astro            # Homepage (projects grid)
│   │   ├── about.astro            # About page
│   │   ├── 404.astro              # Custom 404 page
│   │   ├── rss.xml.ts             # RSS feed endpoint
│   │   └── writing/
│   │       ├── index.astro        # Writing index
│   │       └── [slug].astro       # Article template (dynamic routes)
│   └── styles/
│       └── style.css              # All CSS (preserved from original)
├── public/                        # Static assets (copied to dist/)
├── dist/                          # Build output (generated, not committed)
├── astro.config.mjs               # Astro configuration
├── tsconfig.json                  # TypeScript configuration
├── vercel.json                    # Vercel deployment configuration
├── package.json                   # Dependencies and scripts
├── DEPLOYMENT.md                  # Deployment guide
├── CONTENT_GUIDE.md               # Content authoring guide
└── README.md                      # This file
```

## Architecture

### Astro Features Used

- **Content Collections**: Type-safe content with Zod schemas
- **Static Site Generation (SSG)**: Pre-rendered HTML at build time
- **File-based Routing**: Pages in `src/pages/` become routes
- **Dynamic Routes**: `[slug].astro` generates pages from content
- **Component-based**: Reusable Astro components
- **RSS Integration**: Built-in feed generation via `@astrojs/rss`

### Content Management

**Projects** are stored as JSON files (`src/content/projects/`):
- Type-safe schema validation
- Simple key-value structure
- Easy to add/edit without touching HTML
- Automatically appear on homepage

**Writing** is stored as Markdown files (`src/content/writing/`):
- Frontmatter for metadata (title, date, tags, excerpt)
- Markdown body for article content
- Automatic RSS feed inclusion
- Dynamic route generation (`/writing/[slug]`)

**Status field** controls visibility:
- `published`: Live on site and in RSS feed
- `draft`: Hidden from site (work in progress)
- `coming-soon`: Shows in list but not clickable

## Adding Content

### Add a New Project

1. Create `src/content/projects/XX-project-name.json`
2. Copy this template:

```json
{
  "title": "project name",
  "description": "short description of the project.",
  "status": "2025",
  "year": "2025",
  "category": "generative",
  "order": 5,
  "buttons": [
    {
      "text": "launch",
      "url": "https://example.com",
      "style": "primary"
    }
  ]
}
```

3. Fill in your project details
4. Set `order` for grid position (1 = first)
5. Test: `npm run dev`
6. Deploy: `git add . && git commit -m "Add project" && git push`

**See [CONTENT_GUIDE.md](CONTENT_GUIDE.md) for complete documentation.**

### Add a New Article

1. Create `src/content/writing/article-slug.md`
2. Add frontmatter:

```markdown
---
title: "article title"
excerpt: "one-sentence summary for the index page."
date: 2025-11-02
tags: ["generative", "research", "hardware"]
status: "published"
---

# Article Title

Your article content in Markdown...
```

3. Write content using Markdown syntax
4. Test: `npm run dev`
5. Deploy: `git add . && git commit -m "Add article" && git push`

**See [CONTENT_GUIDE.md](CONTENT_GUIDE.md) for complete guide with examples.**

## Deployment

The site deploys automatically to Vercel when you push to GitHub.

### Initial Setup

1. Push code to GitHub
2. Connect repository at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Astro (no configuration needed)
4. Click "Deploy"
5. Update `site` URL in `astro.config.mjs` with your Vercel domain
6. Push the update - Vercel redeploys automatically

**See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.**

### Automatic Deployments

Every push to `main` triggers automatic deployment:
- Build runs: `npm run build`
- Generates static HTML in `dist/`
- Deploys to Vercel edge network
- Live in 1-2 minutes

### Build Output

7 pages generated:
- `/` - Homepage with projects
- `/about/` - About page
- `/writing/` - Writing index
- `/writing/smooth-coherence-transitions/` - Article 1
- `/writing/fingertip-ecg/` - Article 2
- `/writing/svg-rendering/` - Article 3
- `/rss.xml` - RSS feed
- `/404.html` - Error page

## Development Commands

```bash
# Local development
npm install              # Install dependencies
npm run dev              # Start dev server (port 4321)
npm run build            # Build for production
npm run preview          # Preview production build
npm run astro check      # Type check and validate content

# Git workflow
git status               # Check what changed
git add .                # Stage all changes
git commit -m "message"  # Commit with message
git push origin main     # Deploy to production

# Astro commands
npm run astro -- --help  # See all Astro commands
```

## Customization

### Update Contact Information

Edit `src/layouts/BaseLayout.astro` and `src/pages/about.astro`:
- Email address in footer
- Social media links (GitHub, Twitter)
- Contact methods on about page

### Update Site Metadata

Edit `src/layouts/BaseLayout.astro`:
- Default meta description
- Open Graph tags
- Twitter Card tags

### Update Project Links

Edit JSON files in `src/content/projects/`:
- Update button URLs when demos go live
- Change placeholder example.com URLs

### Add Images to Articles

1. Add images to `public/images/`
2. Reference in Markdown: `![Alt text](/images/filename.jpg)`
3. Images are automatically copied to `dist/images/` during build

## RSS Feed

The site includes an RSS feed at `/rss.xml` for writing content.

**Feed includes:**
- All published articles (excludes drafts and coming-soon)
- Title, excerpt, publication date, permalink
- Tags as categories
- Sorted by date (newest first)

**Subscribe**: `https://your-site.vercel.app/rss.xml`

**Test locally**: `http://localhost:4321/rss.xml`

## SEO Features

Built-in SEO optimization:
- Meta description tags on all pages
- Canonical URLs
- Open Graph tags for social sharing
- Twitter Card support
- RSS feed autodiscovery
- Semantic HTML structure
- 404 page with proper status code

## Design Philosophy

**Swiss minimalism with precision:**
- Inter for body text (300, 400, 500 weights)
- Playfair Display for headings
- Animated gradient background (25s loop)
- Carefully tuned typography and spacing
- Responsive design (mobile breakpoint at 768px)
- No JavaScript required (pure CSS animations)

All original CSS preserved in `src/styles/style.css` - **no changes to design**.

## Performance

**Expected metrics:**
- Build time: < 1 minute
- Page load: < 2 seconds
- Lighthouse score: > 90 on all metrics
- Bundle size: < 50KB per page
- No client-side JavaScript

**Optimizations:**
- Static pre-rendering (SSG)
- Minimal CSS (15KB)
- No framework overhead
- Vercel edge CDN
- Brotli compression
- HTTP/2 support

## Validation

Content is validated at build time using Zod schemas in `src/content/config.ts`.

**Check for errors:**
```bash
npm run astro check
```

**Common validation errors:**
- Missing required fields
- Wrong field types
- Invalid date format (must be YYYY-MM-DD)
- Invalid status value (must be published/draft/coming-soon)

## Troubleshooting

**Build fails:**
- Run `npm run build` locally to see error
- Check `npm run astro check` for content validation
- Verify JSON syntax in project files
- Verify frontmatter YAML syntax in articles

**Content not appearing:**
- Check file is in correct directory (`src/content/projects/` or `src/content/writing/`)
- Verify file extension (`.json` for projects, `.md` for writing)
- Ensure article has `status: "published"`
- Run `npm run astro check`

**RSS feed not updating:**
- Check article status is "published"
- Verify date is not in future
- Rebuild site: `npm run build`

## Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide for Vercel
- **[CONTENT_GUIDE.md](CONTENT_GUIDE.md)** - How to add/edit projects and articles
- **Astro Docs**: https://docs.astro.build
- **Vercel Docs**: https://vercel.com/docs

## Tech Stack Details

- **Framework**: Astro 4.0 (static site generator)
- **Content**: Markdown (writing) + JSON (projects)
- **Validation**: Zod schemas for type safety
- **Styling**: Custom CSS (535 lines, preserved from original)
- **Typography**: Google Fonts (Inter + Playfair Display)
- **Deployment**: Vercel (zero-config, automatic)
- **RSS**: @astrojs/rss integration
- **TypeScript**: Full type safety throughout

## License

Personal portfolio site - All rights reserved.
