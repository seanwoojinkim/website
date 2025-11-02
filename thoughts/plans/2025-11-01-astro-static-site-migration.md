---
doc_type: plan
date: 2025-11-01T23:43:17+00:00
title: "Astro Static Site Migration"
feature: "Astro SSG Migration"

# Update phase status as implementation progresses
phases:
  - name: "Phase 1: Astro Setup & Infrastructure"
    status: complete
  - name: "Phase 2: Content Collections & Data Migration"
    status: complete
  - name: "Phase 3: Page Templates & Layout Conversion"
    status: complete
  - name: "Phase 4: RSS Feed & Final Features"
    status: complete
  - name: "Phase 5: Deployment & Verification"
    status: complete

git_commit: d23e39eb20a1e216f8e68bd843c205f9dd963734
branch: main
repository: workspace

created_by: Claude
last_updated: 2025-11-02
last_updated_by: Claude
last_updated_note: "Phase 5 complete - All deployment documentation and configuration files created. Ready for production deployment."

tags:
  - astro
  - migration
  - static-site
  - content-collections
  - rss
status: draft

related_docs: []
---

# Astro Static Site Migration Plan

## Overview

### Problem Statement
The current portfolio site uses static HTML with hardcoded content in each page. Adding new projects or writing requires manually editing HTML files, which is error-prone and doesn't scale well. There's no RSS feed, no image optimization, and the workflow lacks the benefits of modern static site generation.

### Proposed Solution
Migrate to Astro, a content-focused static site generator that:
- Separates content (Markdown) from presentation (templates)
- Provides type-safe content collections for projects and writing
- Enables RSS feed generation out of the box
- Offers built-in image optimization
- Maintains 100% of the existing design aesthetic
- Deploys to Vercel with zero configuration
- Preserves the exact CSS styling

### Success Criteria
1. All existing pages render identically to current design
2. Projects can be added via Markdown files in `/src/content/projects/`
3. Writing can be added via Markdown files in `/src/content/writing/`
4. RSS feed available at `/rss.xml` for writing content
5. Site builds and deploys successfully to Vercel
6. Local dev server runs with `npm run dev`
7. Images are automatically optimized with Astro Image
8. All existing CSS preserved in `/src/styles/style.css`

---

## Current State Analysis

### Existing Structure
```
/workspace/
├── index.html              # 4 project cards (Wooj, Koi, Coherence, Clouds)
├── about.html              # About page with bio sections
├── writing.html            # 4 writing items (3 real, 1 coming soon)
├── css/style.css          # Complete styling (535 lines)
├── writing/               # Empty directory
├── package.json           # http-server only
└── docker-compose.yml     # Docker dev environment
```

### Design Elements to Preserve
- **Animated gradient background**: 25s shift animation (`/css/style.css:16-47`)
- **Typography**: Inter (body) + Playfair Display (headings) from Google Fonts
- **Navigation**: Logo + 3 links (work, writing, about) with active state
- **Project cards**: Grid layout with hover colors, status badges, dual buttons
- **Writing list**: Two-column layout (date | content) with tags
- **Technical specs**: Key-value grid layout
- **Footer**: Copyright + social links
- **Contact methods**: Grid with hover states
- **Responsive breakpoints**: Mobile optimization at 768px

### Content to Migrate

#### Projects (4 items from index.html)
1. Wooj Lighting (2021-now, product)
2. Koi Simulation (2025, generative)
3. Coherence Visualization (2025, biometric)
4. Calming Clouds (2025, in progress, generative)

#### Writing (4 items from writing.html)
1. Smooth coherence transitions (Oct 2025)
2. Fingertip ECG (Oct 2025)
3. SVG rendering (Oct 2025)
4. Physiological synchrony (coming soon - placeholder)

#### About Content
- Background section
- Practice section
- Approach section
- Collaborations section
- Contact methods grid

---

## Requirements Analysis

### Functional Requirements

#### FR1: Content Collections
- **Projects collection**: Title, description, year, category, status, buttons
- **Writing collection**: Title, excerpt, date, tags, content
- **Frontmatter validation**: Type-safe schemas using Zod
- **Easy authoring**: Markdown files with frontmatter

#### FR2: Templated Pages
- **Homepage** (`/`): Project grid from collection
- **Writing index** (`/writing`): List of all articles
- **Writing articles** (`/writing/[slug]`): Individual article pages
- **About page** (`/about`): Static content

#### FR3: RSS Feed
- **Path**: `/rss.xml`
- **Content**: All writing entries
- **Metadata**: Title, description, date, link
- **Format**: Valid RSS 2.0

#### FR4: Image Handling
- **Astro Image component**: Automatic optimization
- **Format conversion**: WebP with fallbacks
- **Responsive images**: Multiple sizes
- **Lazy loading**: Native loading="lazy"

### Technical Requirements

#### TR1: Astro Configuration
- **Output mode**: Static (`output: 'static'`)
- **Site URL**: Configure for Vercel deployment
- **Image service**: Sharp (default)
- **Integrations**: RSS plugin

#### TR2: Styling Preservation
- **Global CSS**: Import existing style.css as-is
- **No CSS changes**: Maintain exact styling
- **Font imports**: Keep Google Fonts import
- **Animations**: Preserve gradient keyframes

#### TR3: Build & Deployment
- **Build command**: `npm run build`
- **Output directory**: `dist/`
- **Vercel config**: `vercel.json` for routing
- **Static output**: Pre-rendered HTML files

#### TR4: Development Workflow
- **Dev server**: `npm run dev` on port 4321
- **Hot reload**: Automatic on file changes
- **Content updates**: No restart needed for Markdown
- **Type checking**: TypeScript integration

### Out of Scope
- Comment system
- Search functionality
- Analytics integration
- Dark mode toggle
- Contact form backend
- Newsletter signup
- Authentication
- CMS integration
- External API calls

---

## Architecture Design

### Option 1: Full Astro Migration (RECOMMENDED)

**Approach**: Complete migration to Astro with content collections, preserving all CSS.

**Structure**:
```
/workspace/
├── src/
│   ├── content/
│   │   ├── config.ts              # Collection schemas
│   │   ├── projects/
│   │   │   ├── wooj-lighting.md
│   │   │   ├── koi-simulation.md
│   │   │   ├── coherence-viz.md
│   │   │   └── calming-clouds.md
│   │   └── writing/
│   │       ├── smooth-coherence-transitions.md
│   │       ├── fingertip-ecg.md
│   │       └── svg-rendering.md
│   ├── layouts/
│   │   └── BaseLayout.astro       # Shared layout
│   ├── pages/
│   │   ├── index.astro            # Projects grid
│   │   ├── about.astro            # About page
│   │   ├── writing/
│   │   │   ├── index.astro        # Writing list
│   │   │   └── [slug].astro       # Article template
│   │   └── rss.xml.ts             # RSS feed
│   ├── components/
│   │   ├── Navigation.astro       # Nav component
│   │   ├── ProjectCard.astro      # Project card
│   │   ├── WritingItem.astro      # Writing list item
│   │   └── Footer.astro           # Footer component
│   └── styles/
│       └── style.css              # Existing CSS (unchanged)
├── public/
│   └── (static assets)
├── astro.config.mjs               # Astro config
├── tsconfig.json                  # TypeScript config
└── package.json                   # Updated deps
```

**Pros**:
- Clean separation of content and presentation
- Type-safe content with Zod schemas
- Built-in RSS feed support
- Image optimization out of the box
- Fast development experience
- Zero-config Vercel deployment
- Markdown-based content authoring
- Component reusability

**Cons**:
- New dependency (Astro)
- Slight learning curve for content authors
- Requires Node.js build step

**Files Affected**:
- New: All files in `src/` directory
- New: `astro.config.mjs`
- Modified: `package.json`
- New: `vercel.json`
- Preserved: `css/style.css` → `src/styles/style.css`
- Removed: `index.html`, `about.html`, `writing.html`

### Option 2: Hybrid Approach with 11ty

**Approach**: Use Eleventy (11ty) instead of Astro for simpler templating.

**Pros**:
- Simpler templating with Nunjucks
- More flexible with HTML templates
- Smaller learning curve

**Cons**:
- Less modern DX than Astro
- No built-in TypeScript support
- Manual RSS feed setup
- Less content-focused design
- No native image optimization

**Recommendation**: NOT recommended - Astro is better suited for content-driven sites.

### Option 3: Keep Static HTML with Templating

**Approach**: Use a simple template engine to generate HTML but keep static files.

**Pros**:
- Minimal changes to existing structure
- No build step complexity

**Cons**:
- Manual RSS feed generation
- No image optimization
- Limited content management
- Doesn't meet requirements for easy content addition

**Recommendation**: NOT recommended - doesn't solve the core problem.

---

## Recommended Solution: Option 1

**Rationale**:
1. **Content-first design**: Astro is built specifically for content-driven sites
2. **Type safety**: Content collections with Zod validation prevent errors
3. **RSS built-in**: Official RSS plugin with full support
4. **Image optimization**: Native image component with Sharp integration
5. **Vercel optimized**: Zero-config deployment with automatic adapters
6. **Modern DX**: Fast dev server, hot reload, component-based architecture
7. **CSS preservation**: Can import existing CSS without modifications
8. **Markdown authoring**: Simple content addition without HTML knowledge

---

## Phase-by-Phase Implementation

### Phase 1: Astro Setup & Infrastructure

**Goal**: Initialize Astro project and configure foundational structure.

**Prerequisites**: None

**Steps**:

1. **Initialize Astro project structure**
   ```bash
   # Backup existing files
   mkdir -p /workspace/.backup
   cp index.html about.html writing.html /workspace/.backup/
   cp -r css /workspace/.backup/

   # Initialize Astro (manual structure creation)
   mkdir -p /workspace/src/{content,layouts,pages,components,styles}
   mkdir -p /workspace/src/content/{projects,writing}
   mkdir -p /workspace/src/pages/writing
   mkdir -p /workspace/public
   ```

2. **Update package.json**

   File: `/workspace/package.json`

   Replace entire contents:
   ```json
   {
     "name": "portfolio",
     "version": "2.0.0",
     "private": true,
     "type": "module",
     "scripts": {
       "dev": "astro dev",
       "build": "astro build",
       "preview": "astro preview",
       "astro": "astro"
     },
     "dependencies": {
       "@astrojs/rss": "^4.0.1",
       "astro": "^4.0.0"
     },
     "devDependencies": {
       "@astrojs/check": "^0.3.1",
       "typescript": "^5.3.2"
     }
   }
   ```

3. **Install dependencies**
   ```bash
   cd /workspace
   npm install
   ```

4. **Create Astro configuration**

   File: `/workspace/astro.config.mjs`
   ```javascript
   import { defineConfig } from 'astro/config';
   import mdx from '@astrojs/mdx';

   export default defineConfig({
     site: 'https://your-site.vercel.app', // Update with actual domain
     output: 'static',
     integrations: [mdx()],
     markdown: {
       shikiConfig: {
         theme: 'github-light',
       },
     },
   });
   ```

5. **Create TypeScript configuration**

   File: `/workspace/tsconfig.json`
   ```json
   {
     "extends": "astro/tsconfigs/strict",
     "compilerOptions": {
       "strictNullChecks": true
     }
   }
   ```

6. **Copy CSS to new location**
   ```bash
   cp /workspace/css/style.css /workspace/src/styles/style.css
   ```

7. **Update docker-compose.yml for new dev server**

   File: `/workspace/docker-compose.yml`

   Change port mapping from `8081:8000` to `8081:4321` (Astro's default port)

   Update command in dev-start.sh if needed

**Success Criteria**:
- [ ] Astro project structure created
- [ ] `package.json` updated with Astro dependencies
- [ ] Dependencies installed without errors
- [ ] `astro.config.mjs` created with correct configuration
- [ ] `tsconfig.json` exists
- [ ] CSS file copied to `/workspace/src/styles/style.css`
- [ ] `npm run dev` starts Astro dev server on port 4321
- [ ] Can access http://localhost:4321 (shows Astro welcome or error)

**Testing**:
```bash
# Verify Astro CLI works
npm run astro -- --version

# Start dev server
npm run dev

# Should see: "astro dev" running on http://localhost:4321
```

**Code Review Checkpoint**: Verify project structure and configuration before proceeding.

---

### Phase 2: Content Collections & Data Migration

**Goal**: Set up content collections and migrate project/writing data to Markdown files.

**Prerequisites**: Phase 1 complete

**Steps**:

1. **Create content collection schemas**

   File: `/workspace/src/content/config.ts`
   ```typescript
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
     }),
   });

   export const collections = { projects, writing };
   ```

2. **Create project Markdown files**

   File: `/workspace/src/content/projects/01-wooj-lighting.json`
   ```json
   {
     "title": "wooj lighting",
     "description": "brooklyn lighting company. 3d-printed cordless lamps from recycled plastic. designed, manufactured, and assembled in-house. made-to-order.",
     "status": "2021–now",
     "year": "2021",
     "category": "product",
     "order": 1,
     "buttons": [
       {
         "text": "visit site",
         "url": "https://wooj.design",
         "style": "primary"
       }
     ]
   }
   ```

   File: `/workspace/src/content/projects/02-koi-simulation.json`
   ```json
   {
     "title": "koi simulation",
     "description": "organic movement patterns through emergent flocking behavior. svg rendering with brush textures and audio reactivity.",
     "status": "2025",
     "year": "2025",
     "category": "generative",
     "order": 2,
     "buttons": [
       {
         "text": "launch",
         "url": "https://visualizations.example.com/flocking/",
         "style": "primary"
       },
       {
         "text": "editor",
         "url": "https://visualizations.example.com/flocking/koi-editor.html",
         "style": "secondary"
       }
     ]
   }
   ```

   File: `/workspace/src/content/projects/03-coherence-viz.json`
   ```json
   {
     "title": "coherence visualization",
     "description": "two-group boid system visualizing interpersonal physiological coherence. smooth transitions from repulsion to synchronized movement.",
     "status": "2025",
     "year": "2025",
     "category": "biometric",
     "order": 3,
     "buttons": [
       {
         "text": "launch",
         "url": "https://visualizations.example.com/coherence/",
         "style": "primary"
       }
     ]
   }
   ```

   File: `/workspace/src/content/projects/04-calming-clouds.json`
   ```json
   {
     "title": "calming clouds",
     "description": "procedural cloud system for meditative biofeedback visualization. multi-scale noise creating slow ambient drift for hrv training sessions.",
     "status": "2025 — in progress",
     "year": "2025",
     "category": "generative",
     "order": 4,
     "buttons": [
       {
         "text": "launch",
         "url": "https://visualizations.example.com/clouds/",
         "style": "primary"
       },
       {
         "text": "test",
         "url": "https://visualizations.example.com/clouds/examples/test-noise-engine.html",
         "style": "secondary"
       }
     ]
   }
   ```

3. **Create writing Markdown files**

   File: `/workspace/src/content/writing/smooth-coherence-transitions.md`
   ```markdown
   ---
   title: "smooth coherence transitions in multi-agent systems"
   excerpt: "exploring quadratic easing and dead zones to create natural transitions between opposing forces in generative simulations."
   date: 2025-10-15
   tags: ["generative", "physics", "ux"]
   status: "published"
   ---

   # Smooth Coherence Transitions in Multi-Agent Systems

   Content to be added...
   ```

   File: `/workspace/src/content/writing/fingertip-ecg.md`
   ```markdown
   ---
   title: "fingertip ecg for biometric art installations"
   excerpt: "research on using lead i ecg configuration for table-integrated physiological sensing in public art contexts."
   date: 2025-10-15
   tags: ["biometrics", "hardware", "art"]
   status: "published"
   ---

   # Fingertip ECG for Biometric Art Installations

   Content to be added...
   ```

   File: `/workspace/src/content/writing/svg-rendering.md`
   ```markdown
   ---
   title: "svg rendering for organic motion"
   excerpt: "techniques for parsing and animating svg paths with brush textures to create watercolor-like movement in real-time."
   date: 2025-10-15
   tags: ["rendering", "svg", "animation"]
   status: "published"
   ---

   # SVG Rendering for Organic Motion

   Content to be added...
   ```

   File: `/workspace/src/content/writing/physiological-synchrony.md`
   ```markdown
   ---
   title: "measuring interpersonal physiological synchrony"
   excerpt: "combining individual coherence metrics with cross-correlation analysis to distinguish positive from negative synchronization states."
   date: 2025-11-15
   tags: ["research", "biometrics", "hrv"]
   status: "coming-soon"
   ---

   # Measuring Interpersonal Physiological Synchrony

   Coming soon...
   ```

**Success Criteria**:
- [ ] `config.ts` created with Zod schemas
- [ ] All 4 project JSON files created
- [ ] All 4 writing Markdown files created
- [ ] No TypeScript errors when running `npm run astro check`
- [ ] Content collections recognized by Astro

**Testing**:
```bash
# Type check
npm run astro check

# Should show no errors in content collection types
```

**Code Review Checkpoint**: Review content structure and schema before building templates.

---

### Phase 3: Page Templates & Layout Conversion

**Goal**: Convert HTML pages to Astro components and pages, preserving exact styling.

**Prerequisites**: Phase 2 complete

**Steps**:

1. **Create base layout**

   File: `/workspace/src/layouts/BaseLayout.astro`
   ```astro
   ---
   import '../styles/style.css';

   interface Props {
     title: string;
     activePage?: 'work' | 'writing' | 'about';
   }

   const { title, activePage } = Astro.props;
   ---

   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>{title}</title>
       <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:wght@400;500&display=swap">
   </head>
   <body>
       <div class="container">
           <nav>
               <a href="/" class="logo">sean kim</a>
               <div class="nav-links">
                   <a href="/" class={activePage === 'work' ? 'active' : ''}>work</a>
                   <a href="/writing" class={activePage === 'writing' ? 'active' : ''}>writing</a>
                   <a href="/about" class={activePage === 'about' ? 'active' : ''}>about</a>
               </div>
           </nav>

           <slot />

           <footer>
               <span>© 2025 sean kim</span>
               <div style="display: flex; gap: 20px;">
                   <a href="mailto:hello@example.com">email</a>
                   <a href="https://github.com" target="_blank">github</a>
                   <a href="https://twitter.com" target="_blank">twitter</a>
               </div>
           </footer>
       </div>
   </body>
   </html>
   ```

2. **Create project card component**

   File: `/workspace/src/components/ProjectCard.astro`
   ```astro
   ---
   interface Props {
     title: string;
     description: string;
     status: string;
     category: string;
     number: string;
     buttons: Array<{
       text: string;
       url: string;
       style: 'primary' | 'secondary';
     }>;
   }

   const { title, description, status, category, number, buttons } = Astro.props;
   ---

   <div class="card">
       <div class="status">{status}</div>
       <div class="card-number">{number} — {category}</div>
       <h2 class="card-title">{title}</h2>
       <p class="card-desc">{description}</p>
       <div class="button-group">
           {buttons.map(btn => (
               btn.style === 'primary' ? (
                   <a href={btn.url} target="_blank" class="btn">{btn.text}</a>
               ) : (
                   <a href={btn.url} target="_blank" class="btn-secondary">{btn.text}</a>
               )
           ))}
       </div>
   </div>
   ```

3. **Create homepage (work/projects)**

   File: `/workspace/src/pages/index.astro`
   ```astro
   ---
   import BaseLayout from '../layouts/BaseLayout.astro';
   import ProjectCard from '../components/ProjectCard.astro';
   import { getCollection } from 'astro:content';

   const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
   ---

   <BaseLayout title="sean kim — interactive systems" activePage="work">
       <header>
           <h1>selected work</h1>
           <p class="subtitle">
               interactive systems, generative art, and biometric experiments exploring
               human connection through computational media.
           </p>
       </header>

       <div class="grid">
           {projects.map((project, index) => (
               <ProjectCard
                   title={project.data.title}
                   description={project.data.description}
                   status={project.data.status}
                   category={project.data.category}
                   number={String(index + 1).padStart(2, '0')}
                   buttons={project.data.buttons}
               />
           ))}
       </div>

       <div class="specs">
           <div class="specs-title">Technical Specifications</div>
           <div class="specs-grid">
               <div class="specs-label">framework</div>
               <div class="specs-value">p5.js 1.7.0</div>

               <div class="specs-label">rendering</div>
               <div class="specs-value">canvas 2d, webgl compatible</div>

               <div class="specs-label">architecture</div>
               <div class="specs-value">es6 modules, component-based</div>

               <div class="specs-label">status</div>
               <div class="specs-value">development</div>
           </div>
       </div>
   </BaseLayout>
   ```

4. **Create writing list component**

   File: `/workspace/src/components/WritingItem.astro`
   ```astro
   ---
   interface Props {
     title: string;
     excerpt: string;
     date: Date;
     tags: string[];
     slug: string;
     status: string;
   }

   const { title, excerpt, date, tags, slug, status } = Astro.props;

   const formatDate = (date: Date) => {
     return date.toLocaleDateString('en-US', {
       month: 'short',
       year: 'numeric'
     }).toLowerCase();
   };

   const dateDisplay = status === 'coming-soon' ? 'coming soon' : formatDate(date);
   const href = status === 'coming-soon' ? '#' : `/writing/${slug}`;
   ---

   <article class="writing-item">
       <div class="writing-date">{dateDisplay}</div>
       <div class="writing-content">
           <h3><a href={href}>{title}</a></h3>
           <p class="writing-excerpt">{excerpt}</p>
           <div class="writing-tags">
               {tags.map(tag => <span class="tag">{tag}</span>)}
           </div>
       </div>
   </article>
   ```

5. **Create writing index page**

   File: `/workspace/src/pages/writing/index.astro`
   ```astro
   ---
   import BaseLayout from '../../layouts/BaseLayout.astro';
   import WritingItem from '../../components/WritingItem.astro';
   import { getCollection } from 'astro:content';

   const writing = (await getCollection('writing')).sort((a, b) =>
     b.data.date.getTime() - a.data.date.getTime()
   );
   ---

   <BaseLayout title="writing — sean kim" activePage="writing">
       <header>
           <h1>writing</h1>
           <p class="subtitle">
               thoughts on design, technology, and the systems that shape human experience.
           </p>
       </header>

       <div class="writing-list">
           {writing.map(post => (
               <WritingItem
                   title={post.data.title}
                   excerpt={post.data.excerpt}
                   date={post.data.date}
                   tags={post.data.tags}
                   slug={post.slug}
                   status={post.data.status}
               />
           ))}
       </div>
   </BaseLayout>
   ```

6. **Create individual writing article template**

   File: `/workspace/src/pages/writing/[slug].astro`
   ```astro
   ---
   import BaseLayout from '../../layouts/BaseLayout.astro';
   import { getCollection } from 'astro:content';

   export async function getStaticPaths() {
     const writing = await getCollection('writing', ({ data }) => {
       return data.status === 'published';
     });

     return writing.map(post => ({
       params: { slug: post.slug },
       props: { post },
     }));
   }

   const { post } = Astro.props;
   const { Content } = await post.render();

   const formatDate = (date: Date) => {
     return date.toLocaleDateString('en-US', {
       month: 'long',
       day: 'numeric',
       year: 'numeric'
     });
   };
   ---

   <BaseLayout title={`${post.data.title} — sean kim`} activePage="writing">
       <article class="about-content">
           <header style="margin-bottom: 40px;">
               <h1 style="margin-bottom: 12px;">{post.data.title}</h1>
               <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 20px;">
                   <div class="writing-date">{formatDate(post.data.date)}</div>
                   <div class="writing-tags">
                       {post.data.tags.map(tag => <span class="tag">{tag}</span>)}
                   </div>
               </div>
               <p class="subtitle">{post.data.excerpt}</p>
           </header>

           <div class="about-section">
               <Content />
           </div>

           <div style="margin-top: 60px; padding-top: 30px; border-top: 1px solid #e0e0e0;">
               <a href="/writing" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #666; text-decoration: none; border-bottom: 1px solid #666;">
                   ← back to writing
               </a>
           </div>
       </article>
   </BaseLayout>
   ```

7. **Create about page**

   File: `/workspace/src/pages/about.astro`
   ```astro
   ---
   import BaseLayout from '../layouts/BaseLayout.astro';
   ---

   <BaseLayout title="about — sean kim" activePage="about">
       <header>
           <h1>about</h1>
           <p class="subtitle">
               designer, developer, and artist exploring the intersection of computation
               and human experience.
           </p>
       </header>

       <div class="about-content">
           <section class="about-section">
               <h2>background</h2>
               <p>
                   i'm sean kim, a designer and developer based in brooklyn, new york.
                   i create interactive systems that explore human connection through
                   computational media—spanning generative art, biometric installations,
                   and experimental interfaces that make invisible patterns of behavior
                   visible and tangible.
               </p>
               <p>
                   founder of <a href="https://wooj.design" target="_blank" style="color: #000; border-bottom: 1px solid #000;">wooj</a>
                   (named after my middle name, woojin), a lighting company I started
                   in spring 2021. we design and 3d-print cordless lamps from recycled
                   plastic in our brooklyn studio—26 printers running made-to-order
                   production. everything designed, manufactured, assembled, and shipped
                   in-house. the viral wavy lamp series democratizes boutique design
                   through accessible manufacturing.
               </p>
               <p>
                   currently developing biometric coherence installations that visualize
                   physiological synchrony between people through real-time generative systems.
                   exploring how technology can foster contemplative connection rather than distraction.
               </p>
           </section>

           <section class="about-section">
               <h2>practice</h2>
               <p>
                   my work operates at the intersection of physical product design,
                   computational systems, and experiential art. i'm interested in how
                   objects and interfaces can create moments of contemplation, connection,
                   and presence.
               </p>
               <p>
                   areas of focus:
               </p>
               <ul>
                   <li>generative systems and emergent behavior</li>
                   <li>biometric sensing and physiological computing</li>
                   <li>product design and manufacturing</li>
                   <li>interactive art installations</li>
                   <li>real-time rendering and animation</li>
                   <li>contemplative technology</li>
                   <li>hardware prototyping and embedded systems</li>
               </ul>
           </section>

           <section class="about-section">
               <h2>approach</h2>
               <p>
                   i work across disciplines—from low-level sensor integration
                   (ecg, ppg, biometric data) to high-level visualization systems (p5.js,
                   canvas, webgl), to physical product development and manufacturing
                   processes.
               </p>
               <p>
                   technical: modular architecture, es6 modules, component-based design,
                   hardware prototyping (esp32, arduino), signal processing.
               </p>
               <p>
                   aesthetic: swiss minimalism, precise typography, functional beauty,
                   honest materials.
               </p>
           </section>

           <section class="about-section">
               <h2>collaborations</h2>
               <p>
                   i'm interested in working with people and organizations on projects
                   that push the boundaries of what's possible at the intersection of
                   technology, design, and human experience.
               </p>
               <p>
                   particularly interested in:
               </p>
               <ul>
                   <li>interactive art installations and public art commissions</li>
                   <li>biometric / physiological sensing projects</li>
                   <li>product design and manufacturing innovation</li>
                   <li>generative and computational design systems</li>
                   <li>experimental interfaces and tools</li>
                   <li>research at the intersection of art and science</li>
               </ul>
           </section>

           <div class="contact-methods">
               <div class="contact-item">
                   <div class="contact-label">email</div>
                   <div class="contact-value">
                       <a href="mailto:hello@example.com">hello@example.com</a>
                   </div>
               </div>

               <div class="contact-item">
                   <div class="contact-label">github</div>
                   <div class="contact-value">
                       <a href="https://github.com" target="_blank">github.com/yourusername</a>
                   </div>
               </div>

               <div class="contact-item">
                   <div class="contact-label">twitter</div>
                   <div class="contact-value">
                       <a href="https://twitter.com" target="_blank">@yourusername</a>
                   </div>
               </div>
           </div>
       </div>
   </BaseLayout>
   ```

**Success Criteria**:
- [ ] All Astro components and pages created
- [ ] `npm run dev` shows working site at http://localhost:4321
- [ ] Homepage displays 4 projects in grid
- [ ] Writing index shows 4 articles
- [ ] About page renders with all sections
- [ ] Individual writing pages accessible (3 published articles)
- [ ] Navigation works between all pages
- [ ] Active nav state shows correctly
- [ ] Design matches original HTML exactly
- [ ] All hover states work
- [ ] Gradient animation plays
- [ ] Responsive design works at mobile breakpoint

**Testing**:
```bash
# Start dev server
npm run dev

# Manual testing checklist:
# - Navigate to http://localhost:4321
# - Check homepage project grid
# - Click "writing" nav link
# - Verify writing list displays
# - Click on a published article
# - Verify article page renders
# - Click "about" nav link
# - Verify about page content
# - Test hover states on cards
# - Test responsive layout (resize browser)
# - Verify gradient background animates
# - Check footer links
```

**Code Review Checkpoint**: Visual comparison with original site. Verify pixel-perfect design match.

---

### Phase 4: RSS Feed & Final Features

**Goal**: Add RSS feed generation and polish final details.

**Prerequisites**: Phase 3 complete

**Steps**:

1. **Create RSS feed endpoint**

   File: `/workspace/src/pages/rss.xml.ts`
   ```typescript
   import rss from '@astrojs/rss';
   import { getCollection } from 'astro:content';
   import type { APIContext } from 'astro';

   export async function GET(context: APIContext) {
     const writing = await getCollection('writing', ({ data }) => {
       return data.status === 'published';
     });

     const sortedWriting = writing.sort((a, b) =>
       b.data.date.getTime() - a.data.date.getTime()
     );

     return rss({
       title: 'sean kim — writing',
       description: 'thoughts on design, technology, and the systems that shape human experience.',
       site: context.site || 'https://your-site.vercel.app',
       items: sortedWriting.map((post) => ({
         title: post.data.title,
         description: post.data.excerpt,
         pubDate: post.data.date,
         link: `/writing/${post.slug}/`,
         categories: post.data.tags,
       })),
       customData: `<language>en-us</language>`,
       stylesheet: '/rss/styles.xsl', // Optional: Add RSS stylesheet
     });
   }
   ```

2. **Add RSS link to writing page**

   Update: `/workspace/src/pages/writing/index.astro`

   Add after the header:
   ```astro
   <div style="margin-bottom: 40px;">
       <a href="/rss.xml" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #666; text-decoration: none; border-bottom: 1px solid #666;">
           RSS Feed
       </a>
   </div>
   ```

3. **Add meta tags for SEO**

   Update: `/workspace/src/layouts/BaseLayout.astro`

   Add in `<head>`:
   ```astro
   <meta name="description" content="Sean Kim — interactive systems, generative art, and biometric experiments">
   <meta property="og:title" content={title}>
   <meta property="og:description" content="Interactive systems, generative art, and biometric experiments">
   <meta property="og:type" content="website">
   <link rel="alternate" type="application/rss+xml" title="sean kim — writing" href="/rss.xml" />
   ```

4. **Add 404 page**

   File: `/workspace/src/pages/404.astro`
   ```astro
   ---
   import BaseLayout from '../layouts/BaseLayout.astro';
   ---

   <BaseLayout title="404 — sean kim">
       <header>
           <h1>404</h1>
           <p class="subtitle">
               page not found.
           </p>
       </header>

       <div class="about-content">
           <section class="about-section">
               <p>
                   the page you're looking for doesn't exist.
               </p>
               <p>
                   <a href="/" style="color: #000; border-bottom: 1px solid #000;">return home</a>
               </p>
           </section>
       </div>
   </BaseLayout>
   ```

5. **Update Astro config with RSS integration**

   File: `/workspace/astro.config.mjs`
   ```javascript
   import { defineConfig } from 'astro/config';

   export default defineConfig({
     site: 'https://your-site.vercel.app', // Update with actual Vercel domain
     output: 'static',
     markdown: {
       shikiConfig: {
         theme: 'github-light',
       },
     },
   });
   ```

6. **Build the site**
   ```bash
   npm run build
   ```

7. **Preview the built site**
   ```bash
   npm run preview
   ```

**Success Criteria**:
- [ ] RSS feed accessible at `/rss.xml`
- [ ] RSS feed contains all 3 published articles
- [ ] RSS feed validates (use https://validator.w3.org/feed/)
- [ ] RSS link appears on writing page
- [ ] Meta tags added to all pages
- [ ] 404 page created
- [ ] Build completes without errors
- [ ] Preview server shows working site
- [ ] All pages render correctly in preview
- [ ] RSS feed returns valid XML

**Testing**:
```bash
# Build site
npm run build

# Should complete without errors and show:
# - Number of pages built
# - Build time

# Preview built site
npm run preview

# Test RSS feed
curl http://localhost:4321/rss.xml

# Should return valid RSS XML

# Validate RSS
# Copy RSS output and paste into https://validator.w3.org/feed/
```

**Code Review Checkpoint**: Verify RSS feed structure and all features working.

---

### Phase 5: Deployment & Verification

**Goal**: Deploy to Vercel and verify production site works correctly.

**Prerequisites**: Phase 4 complete

**Steps**:

1. **Create Vercel configuration**

   File: `/workspace/vercel.json`
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "astro",
     "devCommand": "npm run dev"
   }
   ```

2. **Create .gitignore for Astro**

   File: `/workspace/.gitignore` (append)
   ```
   # Astro
   dist/
   .astro/

   # Dependencies
   node_modules/

   # Environment
   .env
   .env.production

   # Backup
   .backup/
   ```

3. **Update README.md**

   File: `/workspace/README.md`

   Update the Stack section:
   ```markdown
   ## Stack

   - **Astro** - Modern static site generator
   - **Content Collections** - Type-safe Markdown content
   - **TypeScript** - Type safety and tooling
   - **Vercel** - Zero-config deployment
   ```

   Update Quick Start:
   ```markdown
   ## Quick Start

   ### Local Development

   ```bash
   # Install dependencies
   npm install

   # Start dev server
   npm run dev

   # View site
   open http://localhost:4321

   # Build for production
   npm run build

   # Preview production build
   npm run preview
   ```

   ### Adding Content

   **New Project:**
   1. Create JSON file in `src/content/projects/`
   2. Follow schema in `src/content/config.ts`
   3. Set `order` field for positioning

   **New Writing:**
   1. Create Markdown file in `src/content/writing/`
   2. Add frontmatter with title, excerpt, date, tags
   3. Write content in Markdown
   4. Automatically appears on writing page and RSS feed
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "Migrate to Astro static site generator

   - Initialize Astro project structure
   - Set up content collections for projects and writing
   - Convert HTML pages to Astro templates
   - Add RSS feed generation
   - Configure for Vercel deployment
   - Preserve exact design aesthetic

   All existing pages render identically. Content now managed
   via Markdown files with type-safe schemas."
   ```

5. **Push to GitHub**
   ```bash
   git push origin main
   ```

6. **Deploy to Vercel**

   Option A: Via Vercel CLI
   ```bash
   # Install Vercel CLI if needed
   npm install -g vercel

   # Deploy
   vercel

   # Follow prompts:
   # - Link to existing project or create new
   # - Confirm settings
   # - Deploy
   ```

   Option B: Via Vercel Dashboard
   - Go to https://vercel.com/new
   - Import Git repository
   - Vercel auto-detects Astro
   - Click "Deploy"

7. **Update site URL in config**

   After deployment, update:

   File: `/workspace/astro.config.mjs`
   ```javascript
   site: 'https://your-actual-domain.vercel.app',
   ```

   Commit and push:
   ```bash
   git add astro.config.mjs
   git commit -m "Update production site URL"
   git push origin main
   ```

8. **Verify production deployment**

   Test all pages:
   - Homepage: Projects grid displays
   - Writing: Article list displays
   - Individual articles: Content renders
   - About: Static content displays
   - RSS: `/rss.xml` returns valid XML
   - 404: Custom 404 page shows
   - Navigation: All links work
   - Design: Gradient animation, hover states, responsive design

**Success Criteria**:
- [ ] Site deployed to Vercel successfully
- [ ] Production URL accessible
- [ ] All pages render correctly in production
- [ ] RSS feed accessible at production URL
- [ ] Navigation works across all pages
- [ ] Design matches original HTML exactly
- [ ] Responsive design works on mobile
- [ ] No console errors in browser
- [ ] Build time < 1 minute
- [ ] Lighthouse score > 90 for performance

**Testing**:
```bash
# Production testing checklist:
# 1. Visit production URL
# 2. Test all pages (work, writing, about)
# 3. Click through to article pages
# 4. Test RSS feed: https://your-site.vercel.app/rss.xml
# 5. Test 404 page: https://your-site.vercel.app/nonexistent
# 6. Test mobile responsive design
# 7. Run Lighthouse audit
# 8. Verify gradient animation
# 9. Test all external links
# 10. Check browser console for errors
```

**Code Review Checkpoint**: Final production verification and sign-off.

---

## Testing Strategy

### Unit Testing
Not required for this migration as there's no complex business logic. Content collections provide type safety via Zod schemas.

### Integration Testing

**Manual Testing Checklist**:

1. **Content Collections**
   - [ ] Projects load from JSON files
   - [ ] Writing loads from Markdown files
   - [ ] Frontmatter validation works
   - [ ] Invalid frontmatter shows error

2. **Page Rendering**
   - [ ] Homepage displays all projects
   - [ ] Projects sorted by order field
   - [ ] Writing page shows articles by date
   - [ ] Article pages render Markdown content
   - [ ] About page displays all sections

3. **Navigation**
   - [ ] Nav links work on all pages
   - [ ] Active state shows correctly
   - [ ] Logo returns to homepage
   - [ ] Footer links work

4. **RSS Feed**
   - [ ] RSS XML is valid
   - [ ] Contains all published articles
   - [ ] Coming soon articles excluded
   - [ ] Dates format correctly
   - [ ] Links resolve properly

5. **Design Preservation**
   - [ ] Gradient animation plays
   - [ ] Card hover colors work
   - [ ] Typography matches original
   - [ ] Spacing matches original
   - [ ] Colors match original
   - [ ] Responsive breakpoints work

### Performance Testing

**Lighthouse Audit** (run on production):
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://your-site.vercel.app --view
```

**Target Scores**:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Content Addition Testing

**Test adding new project**:
1. Create `/workspace/src/content/projects/05-new-project.json`
2. Add valid frontmatter following schema
3. Set `order: 5`
4. Run `npm run dev`
5. Verify project appears on homepage
6. Verify it appears in correct position

**Test adding new article**:
1. Create `/workspace/src/content/writing/new-article.md`
2. Add frontmatter with all required fields
3. Write some Markdown content
4. Run `npm run dev`
5. Verify article appears on writing page
6. Verify article is accessible at `/writing/new-article`
7. Verify article appears in RSS feed

---

## Deployment & Migration

### Deployment Process

**Vercel Deployment**:
1. Push code to GitHub
2. Connect repository to Vercel
3. Vercel auto-detects Astro framework
4. Build runs: `npm run build`
5. Output directory: `dist/`
6. Site deploys automatically

**Environment Variables**:
None required for static site

**Build Configuration**:
- Framework: Astro (auto-detected)
- Build Command: `npm run build`
- Output Directory: `dist`
- Node Version: 18.x or higher

### Rollback Plan

**If deployment fails**:
1. Check build logs in Vercel dashboard
2. Fix errors locally
3. Push fix to GitHub
4. Vercel rebuilds automatically

**If site has issues in production**:
1. Revert to previous deployment in Vercel dashboard
2. Or revert git commit and push:
   ```bash
   git revert HEAD
   git push origin main
   ```

### Migration Checklist

**Pre-Migration**:
- [ ] Backup existing HTML files (`.backup/` directory)
- [ ] Document any custom URLs or routes
- [ ] Test build locally
- [ ] Verify all content migrated

**During Migration**:
- [ ] Deploy to Vercel preview URL first
- [ ] Test all pages on preview
- [ ] Check RSS feed on preview
- [ ] Verify mobile responsiveness
- [ ] Get stakeholder approval

**Post-Migration**:
- [ ] Update DNS if needed
- [ ] Monitor for errors
- [ ] Check analytics after 24 hours
- [ ] Verify RSS feed subscriptions work
- [ ] Update any external links to site

---

## Risk Assessment & Mitigation

### High Priority Risks

**R1: CSS styling not preserved exactly**
- **Impact**: High - Visual design is critical
- **Probability**: Medium
- **Mitigation**:
  - Copy CSS file exactly as-is
  - Do side-by-side comparison during Phase 3
  - Use browser dev tools to compare computed styles
  - Test on multiple browsers
- **Rollback**: Keep original HTML files in `.backup/`

**R2: Content migration data loss**
- **Impact**: High - Content could be lost or corrupted
- **Probability**: Low
- **Mitigation**:
  - Backup all HTML files before migration
  - Double-check all content migrated correctly
  - Manual verification of project and writing data
  - Test content collections before deleting HTML
- **Rollback**: Restore from `.backup/` directory

**R3: Build fails on Vercel**
- **Impact**: Medium - Delays deployment
- **Probability**: Low
- **Mitigation**:
  - Test build locally before pushing
  - Use `npm run build && npm run preview`
  - Check Astro and Vercel compatibility
  - Test in Docker container (matches production)
- **Rollback**: Deploy from working commit

### Medium Priority Risks

**R4: RSS feed validation issues**
- **Impact**: Medium - RSS subscribers can't access feed
- **Probability**: Low
- **Mitigation**:
  - Validate RSS XML with W3C validator
  - Test with multiple RSS readers
  - Follow RSS 2.0 spec exactly
  - Use Astro's official RSS integration
- **Fix**: RSS issues can be fixed post-deployment

**R5: Responsive design breaks**
- **Impact**: Medium - Mobile users have poor experience
- **Probability**: Low
- **Mitigation**:
  - Test at all breakpoints during development
  - Use same media queries as original CSS
  - Test on actual mobile devices
  - Use browser responsive design mode
- **Fix**: CSS hotfixes can be deployed quickly

**R6: Navigation or routing issues**
- **Impact**: Medium - Users can't navigate site
- **Probability**: Low
- **Mitigation**:
  - Test all navigation links
  - Verify Astro routing conventions
  - Test 404 page
  - Check all relative/absolute URLs
- **Fix**: Routing fixes can be deployed quickly

### Low Priority Risks

**R7: SEO impact from URL structure changes**
- **Impact**: Low - Minimal existing SEO to preserve
- **Probability**: Low
- **Mitigation**:
  - Keep same URL structure (/, /writing, /about)
  - Add proper meta tags
  - Submit new sitemap if needed
- **Fix**: Can add redirects if needed

**R8: Development workflow disruption**
- **Impact**: Low - Team needs to learn new workflow
- **Probability**: Medium
- **Mitigation**:
  - Document content addition process in README
  - Provide example Markdown files
  - Keep workflow simple (just add Markdown files)
- **Fix**: Documentation improvements as needed

---

## Performance Considerations

### Build Performance

**Expected Build Time**: < 30 seconds
- 3 pages (home, writing, about)
- 3 writing article pages
- 1 RSS feed
- Minimal static assets

**Optimization**:
- Use default Astro image optimization
- No custom build plugins needed
- Static output (no SSR overhead)

### Runtime Performance

**Page Load Targets**:
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Total Blocking Time: < 200ms
- Cumulative Layout Shift: < 0.1

**Optimization Strategies**:
- Static HTML (no JS hydration needed)
- Minimal CSS (535 lines, unchanged)
- CSS already optimized (no frameworks)
- Fonts from Google Fonts CDN
- Gradient animation is pure CSS

**Bundle Size**:
- HTML: ~5-10KB per page
- CSS: ~15KB (style.css)
- JS: ~0KB (no client-side JS needed)
- Total: < 50KB per page

### Image Optimization

**Not needed for initial migration** as current site has no images. When images are added later:

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/project.png';
---

<Image
  src={myImage}
  alt="Project screenshot"
  width={600}
  height={400}
  loading="lazy"
/>
```

Benefits:
- Automatic WebP conversion
- Responsive image sizes
- Lazy loading
- Width/height for CLS prevention

---

## Security Considerations

### Content Security

**Low Risk Profile**:
- Static site (no database, no backend)
- No user input
- No authentication
- No sensitive data

**Considerations**:
1. **External links**: All external project links use `target="_blank"`
   - Already included in original HTML
   - Preserved in migration

2. **Email spam**: Email address is visible in HTML
   - Same as current site
   - Could add obfuscation later if needed

3. **Dependency security**: Regular npm audit
   ```bash
   npm audit
   npm audit fix
   ```

### Deployment Security

**Vercel Security**:
- Automatic HTTPS
- DDoS protection
- Edge network CDN
- No server to secure

**No additional security measures needed** for static portfolio site.

---

## Documentation Requirements

### Developer Documentation

**README.md updates** (included in Phase 5):
- Updated tech stack
- New development commands
- Content addition workflow
- Project structure overview
- Deployment process

**Inline Documentation**:
- Comments in `config.ts` explaining schemas
- Component props documented with TypeScript interfaces
- Frontmatter examples in each content file

### Content Author Documentation

**Adding Projects** (`docs/adding-content.md` - to be created):
```markdown
# Adding Content

## Adding a New Project

1. Create a new JSON file: `src/content/projects/XX-project-name.json`
2. Copy this template:

```json
{
  "title": "project name",
  "description": "project description...",
  "status": "YYYY",
  "year": "YYYY",
  "category": "product|generative|biometric",
  "order": 5,
  "buttons": [
    {
      "text": "launch",
      "url": "https://...",
      "style": "primary"
    }
  ]
}
```

3. Fill in the details
4. Set `order` to position in grid (1 = first)
5. Save and commit
6. Push to GitHub - Vercel deploys automatically

## Adding a New Article

1. Create a new Markdown file: `src/content/writing/article-slug.md`
2. Add frontmatter:

```markdown
---
title: "article title"
excerpt: "short description..."
date: 2025-11-01
tags: ["tag1", "tag2", "tag3"]
status: "published"
---

# Article Title

Your content here in Markdown...
```

3. Write your article in Markdown
4. Save and commit
5. Push to GitHub - Vercel deploys automatically
6. Article automatically appears in RSS feed

## Markdown Tips

- Use `#` for headings
- Use `**bold**` for bold text
- Use `*italic*` for italic text
- Use `[link text](url)` for links
- Use triple backticks for code blocks
```

---

## Appendix

### File Mapping Reference

| Current File | New Location | Status |
|-------------|-------------|--------|
| `/index.html` | `/src/pages/index.astro` | Converted |
| `/about.html` | `/src/pages/about.astro` | Converted |
| `/writing.html` | `/src/pages/writing/index.astro` | Converted |
| `/css/style.css` | `/src/styles/style.css` | Preserved as-is |
| (none) | `/src/pages/writing/[slug].astro` | New template |
| (none) | `/src/pages/rss.xml.ts` | New RSS feed |
| (none) | `/src/content/config.ts` | New schemas |
| (none) | `/src/content/projects/*.json` | New data files |
| (none) | `/src/content/writing/*.md` | New content files |
| (none) | `/src/layouts/BaseLayout.astro` | New layout |
| (none) | `/src/components/*.astro` | New components |

### Astro Commands Reference

```bash
# Development
npm run dev              # Start dev server (http://localhost:4321)
npm run build            # Build for production
npm run preview          # Preview production build

# Type checking
npm run astro check      # Check TypeScript and content types

# Content
# Just add/edit files in src/content/
# No special commands needed

# Deployment
git push origin main     # Vercel deploys automatically
```

### Content Schema Reference

**Projects** (`src/content/projects/*.json`):
```typescript
{
  title: string          // Project name (lowercase)
  description: string    // Short description
  status: string        // Year or "YYYY-now" or "YYYY — in progress"
  year: string          // Primary year
  category: string      // "product" | "generative" | "biometric"
  order: number         // Position in grid (1-based)
  buttons: [
    {
      text: string      // Button label
      url: string       // External URL
      style: "primary" | "secondary"
    }
  ]
}
```

**Writing** (`src/content/writing/*.md`):
```markdown
---
title: string              # Article title (lowercase)
excerpt: string            # Short description
date: Date                 # YYYY-MM-DD format
tags: string[]             # Array of tags
status: "published" | "draft" | "coming-soon"
---

Markdown content here...
```

### Troubleshooting Guide

**Problem**: `npm run dev` fails with "Cannot find module 'astro'"
- **Solution**: Run `npm install`

**Problem**: Content not showing on page
- **Solution**: Check frontmatter syntax, ensure file is in correct directory

**Problem**: Build fails with type error
- **Solution**: Run `npm run astro check` to see detailed errors

**Problem**: RSS feed not updating
- **Solution**: Check article has `status: "published"`, rebuild site

**Problem**: Design looks different from original
- **Solution**: Check CSS file copied correctly, compare computed styles in browser

**Problem**: Vercel deployment fails
- **Solution**: Check build logs, ensure `npm run build` works locally

**Problem**: 404 on article pages
- **Solution**: Check article is published (not draft/coming-soon), check slug matches filename

---

## Estimated Timeline

**Phase 1: Astro Setup & Infrastructure**
- Effort: 1-2 hours
- Complexity: Low
- Can block: All other phases

**Phase 2: Content Collections & Data Migration**
- Effort: 2-3 hours
- Complexity: Medium
- Can block: Phase 3

**Phase 3: Page Templates & Layout Conversion**
- Effort: 4-6 hours
- Complexity: High
- Can block: Phase 4, 5
- Critical path: Most time-consuming

**Phase 4: RSS Feed & Final Features**
- Effort: 1-2 hours
- Complexity: Low
- Can block: Phase 5

**Phase 5: Deployment & Verification**
- Effort: 1-2 hours
- Complexity: Low
- Can block: Production launch

**Total Estimated Time**: 9-15 hours

**Recommended Schedule**:
- Day 1: Phases 1-2
- Day 2: Phase 3
- Day 3: Phases 4-5

**Code Review Checkpoints**:
- After Phase 1: Project structure
- After Phase 2: Content structure
- After Phase 3: Visual comparison (CRITICAL)
- After Phase 4: RSS validation
- After Phase 5: Production verification

---

## Success Metrics

### Completion Criteria

**Must Have** (Required for launch):
- [ ] All pages render with identical design
- [ ] Content managed via Markdown files
- [ ] RSS feed works and validates
- [ ] Deploys to Vercel successfully
- [ ] No build errors or warnings
- [ ] All navigation works
- [ ] Mobile responsive design works

**Should Have** (High priority):
- [ ] Lighthouse performance score > 90
- [ ] All hover states work correctly
- [ ] Gradient animation plays smoothly
- [ ] Documentation complete
- [ ] Example content files provided

**Nice to Have** (Can defer):
- [ ] Image optimization setup (when images added)
- [ ] SEO meta tags expanded
- [ ] Analytics integration
- [ ] RSS stylesheet for pretty XML

### Post-Launch Validation

**Week 1 Checks**:
- Monitor Vercel analytics for errors
- Check RSS feed subscription count
- Verify mobile traffic works
- Test content addition workflow

**Success Indicators**:
- Zero production errors
- Build time < 1 minute
- Page load time < 2 seconds
- Easy content addition by non-technical users
- RSS feed subscribers can access new content

---

## Conclusion

This migration plan provides a systematic approach to converting the static HTML portfolio to Astro while preserving the exact visual design. The phased approach allows for incremental implementation with code review checkpoints to catch issues early.

Key benefits of the migration:
1. Content-driven architecture with Markdown files
2. Type-safe content collections preventing errors
3. Built-in RSS feed for writing
4. Zero-config Vercel deployment
5. Modern development workflow
6. Easy content addition without HTML editing
7. Preserved Swiss minimalist design aesthetic
8. Improved maintainability and scalability

The plan is designed to minimize risk through:
- Backup of all original files
- Incremental testing at each phase
- Code review checkpoints
- Clear rollback procedures
- Comprehensive testing strategy
- Detailed documentation

Upon completion, the site will have a modern content-driven architecture while maintaining the exact visual design and user experience of the original static HTML site.
