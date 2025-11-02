# Content Authoring Guide

Complete guide for adding and managing content in your Astro portfolio site.

## Overview

Your portfolio uses Astro's content collections to manage projects and writing. This means:

- **Projects** are stored as JSON files in `src/content/projects/`
- **Writing** is stored as Markdown files in `src/content/writing/`
- **No HTML editing** required - just create simple text files
- **Automatic updates** - new content appears immediately after deployment

## Adding a New Project

### Step 1: Create JSON File

Create a new file in `src/content/projects/` with this naming pattern:
```
XX-project-name.json
```

Where `XX` is a two-digit number for ordering (01, 02, 03, etc.)

**Example**: `05-new-installation.json`

### Step 2: Add Project Data

Copy this template and fill in your project details:

```json
{
  "title": "project name",
  "description": "short description of the project. keep it concise and impactful.",
  "status": "2025",
  "year": "2025",
  "category": "generative",
  "order": 5,
  "buttons": [
    {
      "text": "launch",
      "url": "https://example.com/project",
      "style": "primary"
    },
    {
      "text": "documentation",
      "url": "https://example.com/docs",
      "style": "secondary"
    }
  ]
}
```

### Field Descriptions

| Field | Type | Description | Examples |
|-------|------|-------------|----------|
| `title` | string | Project name (lowercase) | `"koi simulation"`, `"wooj lighting"` |
| `description` | string | One-sentence description | Keep under 200 characters |
| `status` | string | Display status | `"2025"`, `"2021–now"`, `"2025 — in progress"` |
| `year` | string | Primary year | `"2025"`, `"2021"` |
| `category` | string | Project type | `"product"`, `"generative"`, `"biometric"` |
| `order` | number | Position in grid (1-based) | `1`, `2`, `3`, etc. |
| `buttons` | array | Action buttons | See button format below |

### Button Format

Each button has three properties:

```json
{
  "text": "button label",
  "url": "https://destination-url.com",
  "style": "primary"
}
```

- `text`: Button label (e.g., "launch", "visit site", "view demo")
- `url`: Full URL including `https://`
- `style`: Either `"primary"` (filled) or `"secondary"` (outlined)

**You can have 1-3 buttons per project.**

### Step 3: Set Project Order

The `order` field determines where the project appears in the grid:
- `1` = First position (top-left)
- `2` = Second position
- `3` = Third position
- etc.

**Tip**: To insert a project between existing ones, update the order numbers of other projects.

### Step 4: Test Locally

```bash
# Start dev server
npm run dev

# Visit http://localhost:4321
# Verify your project appears correctly
```

### Step 5: Deploy

```bash
# Commit your changes
git add src/content/projects/05-new-installation.json
git commit -m "Add new project: Installation Name"

# Push to GitHub
git push origin main

# Vercel deploys automatically
# Check your live site in 1-2 minutes
```

## Adding a New Article

### Step 1: Create Markdown File

Create a new file in `src/content/writing/` with this naming pattern:
```
article-slug.md
```

The filename becomes the URL: `/writing/article-slug`

**Example**: `embodied-interaction.md` → `/writing/embodied-interaction`

### Step 2: Add Frontmatter

Start the file with YAML frontmatter (metadata between `---` markers):

```markdown
---
title: "article title here"
excerpt: "short one-sentence summary that appears on the writing index page."
date: 2025-11-02
tags: ["generative", "research", "hardware"]
status: "published"
---

# Article Title Here

Your article content starts here...
```

### Frontmatter Fields

| Field | Type | Description | Examples |
|-------|------|-------------|----------|
| `title` | string | Article title (lowercase) | `"measuring physiological synchrony"` |
| `excerpt` | string | One-sentence summary | Keep under 150 characters |
| `date` | date | Publication date | `2025-11-02` (YYYY-MM-DD format) |
| `tags` | array | Category tags | `["generative", "physics", "ux"]` |
| `status` | string | Publication status | `"published"`, `"draft"`, `"coming-soon"` |

### Status Values

- **`published`**: Article is live and appears on site + RSS feed
- **`draft`**: Article is hidden (good for work-in-progress)
- **`coming-soon`**: Shows on writing index but not clickable (placeholder)

### Step 3: Write Content in Markdown

After the frontmatter, write your article content using Markdown:

```markdown
# Main Heading

Your introduction paragraph here.

## Section Heading

Content with **bold** and *italic* text.

### Subsection

- Bullet point one
- Bullet point two
- Bullet point three

1. Numbered list
2. Second item
3. Third item

[Link text](https://example.com)

> Blockquote for emphasis

\`\`\`javascript
// Code block
function example() {
  return "syntax highlighting works!";
}
\`\`\`
```

### Markdown Syntax Reference

| Element | Syntax |
|---------|--------|
| Heading 1 | `# Heading` |
| Heading 2 | `## Heading` |
| Heading 3 | `### Heading` |
| Bold | `**bold text**` |
| Italic | `*italic text*` |
| Link | `[text](url)` |
| Code | `` `code` `` |
| Code block | ` ```language` (on new line) |
| Bullet list | `- item` |
| Numbered list | `1. item` |
| Blockquote | `> quote` |
| Horizontal rule | `---` |

### Step 4: Add Images (Optional)

Images can be added to articles:

**Option 1**: External images
```markdown
![Alt text](https://example.com/image.jpg)
```

**Option 2**: Local images
1. Add image to `public/images/` directory
2. Reference in Markdown:
```markdown
![Alt text](/images/filename.jpg)
```

### Step 5: Test Locally

```bash
# Start dev server
npm run dev

# Check writing index
open http://localhost:4321/writing

# Check individual article
open http://localhost:4321/writing/your-article-slug

# Verify RSS feed includes article
open http://localhost:4321/rss.xml
```

### Step 6: Deploy

```bash
# Commit your changes
git add src/content/writing/embodied-interaction.md
git commit -m "Add article: Embodied Interaction"

# Push to GitHub
git push origin main

# Article goes live automatically
# Also appears in RSS feed
```

## Managing Existing Content

### Update a Project

1. Open the project's JSON file: `src/content/projects/XX-name.json`
2. Edit the fields you want to change
3. Save the file
4. Test locally: `npm run dev`
5. Commit and push: `git add . && git commit -m "Update project" && git push`

### Update an Article

1. Open the article's Markdown file: `src/content/writing/article-name.md`
2. Edit the frontmatter or content
3. Save the file
4. Test locally: `npm run dev`
5. Commit and push: `git add . && git commit -m "Update article" && git push`

### Reorder Projects

Change the `order` field in multiple project JSON files:

```json
// Make this project appear first
{
  "order": 1,
  ...
}
```

Remember: Lower numbers appear first (1 = first, 2 = second, etc.)

### Delete Content

**Delete a project:**
1. Remove the JSON file: `rm src/content/projects/XX-name.json`
2. Commit: `git commit -m "Remove project"`
3. Push: `git push`

**Delete an article:**
1. Remove the Markdown file: `rm src/content/writing/article-name.md`
2. Commit: `git commit -m "Remove article"`
3. Push: `git push`

## Content Validation

Astro automatically validates your content using schemas defined in `src/content/config.ts`.

### Common Validation Errors

**Missing required field:**
```
Error: Missing required field "title" in project
```
Solution: Add the missing field to your JSON/Markdown frontmatter

**Wrong field type:**
```
Error: Expected string, received number
```
Solution: Wrap the value in quotes: `"2025"` not `2025`

**Invalid date format:**
```
Error: Invalid date format
```
Solution: Use YYYY-MM-DD format: `2025-11-02`

**Invalid status:**
```
Error: Invalid enum value
```
Solution: Use only `"published"`, `"draft"`, or `"coming-soon"`

### Check for Errors

Run type checking before deploying:

```bash
npm run astro check
```

This shows any validation errors in your content.

## RSS Feed

### Automatic RSS Updates

Published articles automatically appear in the RSS feed at `/rss.xml`.

**RSS feed includes:**
- Title
- Excerpt (as description)
- Publication date
- Direct link to article
- Tags (as categories)

**RSS feed excludes:**
- Articles with `status: "draft"`
- Articles with `status: "coming-soon"`

### Testing RSS Feed

```bash
# Local testing
npm run dev
open http://localhost:4321/rss.xml

# Production testing
open https://your-site.vercel.app/rss.xml
```

## Content Workflow

### Quick Reference

**Add project:**
1. Create `src/content/projects/XX-name.json`
2. Fill in project data
3. Set order number
4. `git add . && git commit -m "Add project" && git push`

**Add article:**
1. Create `src/content/writing/article-slug.md`
2. Add frontmatter with metadata
3. Write content in Markdown
4. `git add . && git commit -m "Add article" && git push`

**Test locally:**
```bash
npm run dev
# Visit http://localhost:4321
```

**Deploy:**
```bash
git push origin main
# Vercel deploys automatically
```

## Best Practices

### Writing Style

- Use lowercase for titles (matches site aesthetic)
- Keep descriptions concise (under 150-200 characters)
- Use descriptive but short tag names
- Write excerpt as a single compelling sentence

### File Naming

- Use lowercase letters
- Use hyphens for spaces: `my-article.md` not `my_article.md`
- Be descriptive but concise
- URL-friendly characters only

### Content Organization

- **Projects**: Order by importance/recency
- **Articles**: Newest first (automatic by date)
- **Tags**: Use consistent tag names across articles
- **Images**: Store in `public/images/` with descriptive names

### Git Commits

Good commit messages help track changes:

```bash
# Good
git commit -m "Add project: Biometric Installation"
git commit -m "Update article: Fix typo in introduction"
git commit -m "Remove old project: Deprecated Tool"

# Not ideal
git commit -m "update"
git commit -m "changes"
git commit -m "fix"
```

## Troubleshooting

### Content Not Appearing

**Check 1**: Verify file location
- Projects: `src/content/projects/`
- Writing: `src/content/writing/`

**Check 2**: Verify file extension
- Projects: `.json`
- Writing: `.md`

**Check 3**: Check for validation errors
```bash
npm run astro check
```

**Check 4**: Verify status field
- Articles need `status: "published"` to appear

### Build Fails After Adding Content

**Error**: JSON syntax error
- Validate JSON: https://jsonlint.com
- Check for missing commas or quotes

**Error**: Frontmatter syntax error
- Ensure `---` markers are on their own lines
- Check YAML syntax (proper indentation)
- Ensure date format is YYYY-MM-DD

**Error**: Type validation error
- Run `npm run astro check` to see specific error
- Fix the field that doesn't match the schema

### Article Not in RSS Feed

- Ensure `status: "published"` (not "draft" or "coming-soon")
- Check date is not in the future
- Verify frontmatter is valid
- Rebuild site: `npm run build`

## Examples

### Example Project: Interactive Installation

File: `src/content/projects/05-interactive-installation.json`

```json
{
  "title": "embodied interaction table",
  "description": "two-person biometric sensing table measuring physiological synchrony through capacitive touch electrodes. real-time visualization of interpersonal coherence.",
  "status": "2025 — in progress",
  "year": "2025",
  "category": "biometric",
  "order": 5,
  "buttons": [
    {
      "text": "watch demo",
      "url": "https://youtube.com/demo",
      "style": "primary"
    },
    {
      "text": "technical details",
      "url": "https://github.com/username/project",
      "style": "secondary"
    }
  ]
}
```

### Example Article: Technical Post

File: `src/content/writing/noise-field-optimization.md`

```markdown
---
title: "optimizing perlin noise for real-time generative art"
excerpt: "exploring gpu-accelerated noise generation and octave layering techniques for smooth 60fps animations in browser-based installations."
date: 2025-11-02
tags: ["generative", "performance", "webgl"]
status: "published"
---

# Optimizing Perlin Noise for Real-Time Generative Art

Perlin noise is fundamental to organic motion in generative systems, but computing multiple octaves in real-time can be challenging. This article explores GPU acceleration techniques that enable smooth 60fps animations in browser-based installations.

## The Performance Challenge

Traditional CPU-based Perlin noise computation becomes a bottleneck when:
- Rendering thousands of particles
- Computing multiple noise octaves
- Running at 60fps target
- Supporting mobile devices

## GPU Acceleration Approach

We can move noise computation to the GPU using WebGL shaders...

[Continue with detailed technical content...]
```

## Content Schema Reference

For complete field specifications, see:
- **Projects schema**: `src/content/config.ts` (lines for projects collection)
- **Writing schema**: `src/content/config.ts` (lines for writing collection)

---

## Quick Commands

```bash
# Local development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run preview                # Preview production build
npm run astro check            # Validate content

# Content workflow
git add .                      # Stage changes
git commit -m "message"        # Commit with message
git push origin main           # Deploy to production
git status                     # Check what's changed
```

---

**Questions?** Review the schemas in `src/content/config.ts` or check existing projects/articles for examples.
