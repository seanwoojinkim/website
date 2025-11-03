# IndieWeb Features Overview

This document provides a complete overview of all IndieWeb features implemented on seanwooj.in, how they work, and how to use them.

---

## Table of Contents

1. [What is IndieWeb?](#what-is-indieweb)
2. [Implemented Features](#implemented-features)
3. [Feature Details](#feature-details)
4. [User Capabilities](#user-capabilities)
5. [Technical Architecture](#technical-architecture)
6. [Maintenance Requirements](#maintenance-requirements)

---

## What is IndieWeb?

The IndieWeb is a movement to keep the web independent and user-controlled. Instead of relying entirely on social media platforms, you:

1. **Own your content** - Publish on your own domain first
2. **Control your identity** - Your domain is your identity
3. **Connect across sites** - Use open standards to interact

**Core Principles:**
- Publish on your own site first (POSSE)
- Own your URLs and content
- Scratch your own itch (solve problems you have)
- Use what you make
- Document your stuff

**Learn more:** https://indieweb.org/

---

## Implemented Features

### Phase 1-6 Summary

seanwooj.in implements a comprehensive IndieWeb stack:

| Feature | Status | Purpose |
|---------|--------|---------|
| Microformats2 (h-card) | ✅ Implemented | Machine-readable identity |
| Microformats2 (h-entry) | ✅ Implemented | Machine-readable blog posts |
| Microformats2 (h-feed) | ✅ Implemented | Machine-readable post listing |
| Webmention Receiving | ✅ Implemented | Accept cross-site interactions |
| Webmention Display | ✅ Implemented | Show likes, replies, reposts, mentions |
| Enhanced RSS Feed | ✅ Implemented | Full-content syndication |
| JSON Feed | ✅ Implemented | Modern feed format |
| POSSE Support | ✅ Implemented | Syndication link display |
| Backfeed via Bridgy | ✅ Implemented | Social interactions → webmentions |
| Dark Mode Integration | ✅ Implemented | Themed webmention display |
| Privacy Controls | ✅ Implemented | robots.txt, respectful crawling |

---

## Feature Details

### 1. Microformats2

**What it is:**
- HTML classes that add semantic meaning to content
- Makes your content machine-readable
- Enables services to understand your site structure

**Implementation:**

#### h-card (Identity)
- **Where:** Homepage, post author sections
- **Purpose:** Identifies you as a person
- **Properties:**
  - Name: Sean Kim
  - URL: https://seanwooj.in/
  - Photo: Profile avatar
  - Bio: Description text

**Example markup:**
```html
<div class="h-card">
  <img class="u-photo" src="/avatar.jpg" alt="Sean Kim">
  <h1 class="p-name">Sean Kim</h1>
  <a class="u-url u-uid" href="https://seanwooj.in/">seanwooj.in</a>
  <p class="p-note">Software engineer and writer</p>
</div>
```

**Validation:** https://indiewebify.me/validate-h-card/

#### h-entry (Blog Posts)
- **Where:** Individual blog post pages
- **Purpose:** Marks content as a blog post with metadata
- **Properties:**
  - Title (`p-name`)
  - Published date (`dt-published`)
  - Content (`e-content`)
  - Author (`p-author h-card`)
  - URL (`u-url`)
  - Summary (`p-summary`)
  - Categories (`p-category`)
  - Syndication links (`u-syndication`)

**Example markup:**
```html
<article class="h-entry">
  <h1 class="p-name">Post Title</h1>
  <time class="dt-published" datetime="2025-11-02T10:00:00-08:00">Nov 2, 2025</time>
  <div class="e-content">
    <p>Post content...</p>
  </div>
  <a class="u-url" href="https://seanwooj.in/writing/post-slug/">Permalink</a>
  <div class="p-author h-card">
    <span class="p-name">Sean Kim</span>
  </div>
</article>
```

**Validation:** https://indiewebify.me/validate-h-entry/

#### h-feed (Post Listing)
- **Where:** `/writing/` index page
- **Purpose:** Marks collection of posts as a feed
- **Properties:**
  - Feed name (`p-name`)
  - Multiple h-entry children

**How it works:**
- Feed readers can discover your posts
- Services can parse your entire writing archive
- Enables aggregation on IndieWeb sites

**Validation:** https://pin13.net/mf2/

---

### 2. Webmention Receiving

**What it is:**
- Open standard for cross-site interactions
- Like @mentions for the open web
- Enables notifications when someone links to you

**How it works:**

1. Someone publishes a post linking to seanwooj.in
2. Their site sends a webmention to your endpoint
3. Webmention.io receives and validates it
4. Next site build fetches and displays the mention

**Endpoint:** https://webmention.io/seanwooj.in/webmention

**Discovery:**
- Every page includes link tag in `<head>`:
  ```html
  <link rel="webmention" href="https://webmention.io/seanwooj.in/webmention" />
  ```
- Services automatically find this tag
- No manual configuration needed by linkers

**Service:** Webmention.io (free, open-source)
- Dashboard: https://webmention.io/settings
- API: Public, no auth required
- Handles validation, spam filtering, storage

**What you receive:**
- Likes (someone liked your post)
- Reposts (someone shared your post)
- Replies (someone commented)
- Mentions (someone linked to you)

---

### 3. Webmention Display

**What it is:**
- Component that shows received webmentions on posts
- Grouped by interaction type
- Styled for light/dark mode

**Interaction Types:**

#### Likes
- Display: Grid of circular avatars
- Shows: Author photo, name on hover
- Links to: Liker's source post
- Limit: First 20, then "+N more"

#### Reposts
- Display: Grid of circular avatars
- Shows: Reposter photo, name on hover
- Links to: Repost URL
- Limit: First 20, then "+N more"

#### Replies
- Display: Full comment cards
- Shows: Author info, date, full comment content
- Links to: Source reply URL
- Formatting: Preserves structure, sanitizes HTML

#### Mentions
- Display: Preview cards
- Shows: Author, excerpt, link
- Links to: Mentioning page
- Used for: General links without specific type

**Technical Details:**
- Fetched at build time from Webmention.io API
- Cached in static build
- No client-side JavaScript needed
- Updates on rebuild/redeploy

**Empty State:**
- If no webmentions: Component hidden entirely
- No placeholder text shown
- Graceful degradation

**Dark Mode:**
- Automatically styled via CSS custom properties
- Switches with site theme toggle
- Sufficient contrast in both modes

---

### 4. Enhanced RSS Feed

**What it is:**
- RSS 2.0 feed with full post content
- Includes all metadata and categories
- Absolute URLs throughout

**Location:** https://seanwooj.in/rss.xml

**Features:**
- Full HTML content (not just excerpts)
- Proper encoding (UTF-8)
- Valid XML structure
- Categories/tags preserved
- Absolute image URLs
- Canonical URLs

**Validation:** https://validator.w3.org/feed/

**Use cases:**
- Subscribe in feed readers (Feedly, NewsBlur, etc.)
- Syndicate to aggregators
- Backup/archive content
- Email notifications via services

**Discovery:**
- Auto-discoverable via link tag in `<head>`
- Most browsers show RSS icon
- Feed readers find it automatically

---

### 5. JSON Feed

**What it is:**
- Modern alternative to RSS/Atom
- JSON format (easier to parse)
- Full feature parity with RSS

**Location:** https://seanwooj.in/feed.json

**Format:**
```json
{
  "version": "https://jsonfeed.org/version/1.1",
  "title": "Sean Kim - Writing",
  "home_page_url": "https://seanwooj.in/",
  "feed_url": "https://seanwooj.in/feed.json",
  "items": [
    {
      "id": "https://seanwooj.in/writing/post-slug/",
      "url": "https://seanwooj.in/writing/post-slug/",
      "title": "Post Title",
      "content_html": "<p>Full HTML content...</p>",
      "date_published": "2025-11-02T10:00:00-08:00",
      "author": {...}
    }
  ]
}
```

**Validation:** https://validator.jsonfeed.org/

**Use cases:**
- Modern feed readers
- Easier programmatic access
- JSON-native applications
- API integrations

---

### 6. POSSE (Publish Own Site, Syndicate Elsewhere)

**What it is:**
- Workflow: Publish on your site first, then share elsewhere
- Your content's canonical home is seanwooj.in
- Social media posts are copies with link back

**How it works:**

1. **Publish:** Write post on seanwooj.in
2. **Syndicate:** Share to Twitter, Mastodon, etc. with link back
3. **Link:** Add syndication URLs to post frontmatter
4. **Display:** Syndication links shown on post

**Example frontmatter:**
```yaml
---
title: "My Post"
date: 2025-11-02
syndication:
  - https://twitter.com/username/status/123456789
  - https://mastodon.social/@username/456
---
```

**Display:**
- Syndication links appear on post page
- Each has `u-syndication` class (for Bridgy)
- Platform name auto-detected
- Opens in new tab

**Benefits:**
- You own the canonical version
- Content persists even if platforms shut down
- Full control over formatting, length, style
- Backup on your own domain

**See detailed workflow:** [POSSE_WORKFLOW.md](./POSSE_WORKFLOW.md)

---

### 7. Backfeed via Bridgy

**What it is:**
- Service that converts social media interactions to webmentions
- Likes, retweets, replies on Twitter → webmentions on your site
- Same for Mastodon, GitHub, others

**How it works:**

1. You publish post with syndication link
2. Bridgy polls social platforms for that post
3. Finds likes, replies, retweets
4. Sends webmentions back to your canonical post
5. Interactions appear on your site

**Service:** Bridgy (free, open-source)
- Dashboard: https://brid.gy/
- Supports: Twitter, Mastodon, GitHub, Flickr, Instagram (limited)
- Polls every ~30 minutes

**Setup:**
1. Sign in to Bridgy with social accounts
2. Authorize OAuth access
3. Enable polling
4. Add syndication links with `u-syndication` class
5. Bridgy automatically finds and backfeeds

**Result:**
- Twitter likes → webmention likes on your post
- Twitter replies → webmention replies
- Retweets → webmention reposts
- All shown in Webmentions component

**See detailed setup:** [BRIDGY_SETUP.md](./BRIDGY_SETUP.md)

---

### 8. Dark Mode Integration

**What it is:**
- All IndieWeb components styled for dark mode
- Seamless switching with site theme toggle
- WCAG AA contrast compliance

**Implementation:**
- CSS custom properties for colors
- `:global(.dark-mode)` selectors
- Automatic theme detection and persistence

**Styled components:**
- Webmention cards
- Avatar images and fallbacks
- Interaction type headers
- Reply content
- Links and hover states

**Contrast ratios:**
- Light mode: ≥ 4.5:1 (text)
- Dark mode: ≥ 4.5:1 (text)
- Both modes tested with WebAIM checker

---

### 9. Privacy & Security

**robots.txt:**
- Location: `/public/robots.txt`
- Allows all crawlers
- References sitemap
- IndieWeb-friendly

**Webmention Privacy:**
- All webmentions publicly displayed
- Content from source sites (not stored privately)
- Users can request removal via email
- Respects 410 Gone responses (deletion)

**External Link Security:**
- All webmention links have `rel="noopener noreferrer"`
- Prevents window.opener access
- No referrer leakage

**Content Sanitization:**
- HTML in webmentions sanitized
- No executable scripts allowed
- Safe rendering only

---

## User Capabilities

### As a Site Visitor

**You can:**
- Read posts with full content
- See who liked/replied/shared posts
- Click through to source interactions
- Subscribe via RSS or JSON Feed
- Send webmentions from your own site
- Interact via social media (backfeeds to site)

**You cannot:**
- Post comments directly on site (send webmention instead)
- Like posts on site (like via social, backfeeds)
- Edit webmentions (controlled by source)

### As the Site Owner

**You can:**
- Publish posts on your domain
- Syndicate to social platforms
- Receive webmentions from anyone
- Display interactions from social media
- Control syndication links
- Monitor via Webmention.io dashboard
- Remove unwanted webmentions
- Rebuild to refresh webmentions

**You cannot:**
- Edit received webmentions (controlled by sender)
- Force immediate webmention refresh (rebuild required)
- Moderate before display (trust model)

### As Someone Linking to This Site

**You can:**
- Send webmention from your own site
- Use Telegraph: https://telegraph.p3k.io/
- Reply via social media (backfeeds via Bridgy)
- Like/repost via social media
- See your interaction appear on next build

**Requirements:**
- Your site must support sending webmentions, OR
- Use webmention tools (Telegraph), OR
- Interact via supported social platforms

---

## Technical Architecture

### Build-Time Architecture

```
┌─────────────────┐
│   Astro Build   │
└────────┬────────┘
         │
         ├─> Fetch webmentions from Webmention.io API
         │   └─> Cache in static build
         │
         ├─> Generate RSS/JSON feeds
         │   └─> Include all posts with full content
         │
         └─> Render static HTML
             └─> Microformats2 markup
             └─> Webmention display
             └─> Syndication links
```

### Runtime Architecture (External Services)

```
┌─────────────────────┐
│   Someone links to  │
│    seanwooj.in      │
└──────────┬──────────┘
           │
           ├─> Their site sends webmention
           │   └─> Webmention.io receives
           │       └─> Validates source
           │       └─> Stores webmention
           │
           └─> Or: Social media interaction
               └─> Bridgy polls platform
                   └─> Finds interaction
                   └─> Sends webmention to Webmention.io

┌─────────────────────┐
│   Site Rebuild      │
└──────────┬──────────┘
           │
           └─> Fetch latest webmentions
               └─> Render in static HTML
               └─> Deploy to Vercel
```

### Data Flow

1. **Incoming webmentions:**
   - External site → Webmention.io → Storage
   - Social interaction → Bridgy → Webmention.io → Storage

2. **Display:**
   - Build time → API fetch → Static HTML → Vercel CDN

3. **Updates:**
   - Rebuild/redeploy to fetch latest webmentions
   - No real-time updates (static site)

### Dependencies

**External Services:**
- Webmention.io (receiving endpoint, storage)
- Bridgy (social media backfeed)
- Vercel (hosting, builds)

**Build Dependencies:**
- Astro (static site generator)
- TypeScript (type safety)
- Fetch API (webmention retrieval)

**No dependencies on:**
- Client-side JavaScript (all static)
- Databases (static files only)
- Authentication (all public)

---

## Maintenance Requirements

### Regular Tasks

**Weekly:**
- Check Bridgy dashboard for OAuth status
- Review new webmentions for spam/quality
- Verify polling still active

**Monthly:**
- Validate microformats still pass
- Test webmention receiving (Telegraph)
- Check RSS/JSON feeds validate
- Review build performance

**As Needed:**
- Re-authenticate Bridgy OAuth (if expired)
- Update npm dependencies
- Remove spam webmentions (rare)
- Adjust styling/layout

### Monitoring

**Webmention.io:**
- Dashboard: https://webmention.io/settings
- Check for new mentions
- Review for spam (very rare)
- Verify API responding

**Bridgy:**
- Dashboard: https://brid.gy/
- Check polling status (should say "polling")
- Verify "Last poll" timestamp reasonable (< 1 hour)
- Re-authenticate if needed

**Site Health:**
- Vercel builds succeeding
- No console errors
- Lighthouse scores maintained
- Build times reasonable

### Costs

**Current costs: $0/month**

All services are free:
- Webmention.io: Free
- Bridgy: Free
- Hosting: Vercel free tier (sufficient)

**Potential future costs:**
- Vercel Pro (if traffic exceeds free tier)
- Analytics services (if added)

---

## Future Enhancements

Potential additions to IndieWeb stack:

### Planned
- Privacy policy page (mentioned in plan)
- Analytics integration (privacy-respecting)

### Possible
- Micropub support (post from mobile apps)
- IndieAuth login (use your domain to sign in elsewhere)
- Microsub support (reader features)
- Private webmentions (auth required)
- Webmention moderation workflow
- Automatic POSSE (post to social from site)
- Reply context (show what you're replying to)
- Likes/bookmarks on site (send webmentions)

### Community
- Submit to IndieWeb directory
- Blog about implementation
- Share on IndieWeb chat
- Document learnings

---

## Learning Resources

### IndieWeb
- Homepage: https://indieweb.org/
- Getting started: https://indieweb.org/Getting_Started
- Building blocks: https://indieweb.org/building-blocks
- Chat: https://chat.indieweb.org/

### Standards
- Microformats2: https://microformats.org/wiki/microformats2
- Webmention: https://webmention.net/
- POSSE: https://indieweb.org/POSSE
- h-card: https://microformats.org/wiki/h-card
- h-entry: https://microformats.org/wiki/h-entry

### Services
- Webmention.io: https://webmention.io/
- Bridgy: https://brid.gy/
- Telegraph: https://telegraph.p3k.io/

### Community Examples
- IndieWeb examples: https://indieweb.org/IndieMark
- Site showcases: https://indieweb.org/sites

---

## FAQ

**Q: Do I need to rebuild the site to see new webmentions?**
A: Yes. Webmentions are fetched at build time and cached in static HTML. Trigger a rebuild/redeploy to fetch latest.

**Q: Can people comment directly on my site?**
A: Not yet. They can send webmentions from their own sites, or interact via social media (backfeeds via Bridgy).

**Q: What happens if Webmention.io or Bridgy go down?**
A: Site continues to work. Webmention fetching fails gracefully. Previous webmentions still display (cached in build).

**Q: How do I remove a webmention?**
A: Block it in Webmention.io dashboard, then rebuild site. Or contact the sender to delete their source post (sends 410 Gone).

**Q: Can I moderate webmentions before they appear?**
A: Not currently. All webmentions display automatically on next build. Webmention.io has spam filtering built in.

**Q: Does this work with static hosting?**
A: Yes! All IndieWeb features work perfectly with static sites. Webmentions fetched at build time, no server needed.

**Q: What if someone sends a spam webmention?**
A: Webmention.io filters most spam. If one gets through, block it in the dashboard and rebuild.

**Q: How often does Bridgy check for new interactions?**
A: Every ~30 minutes. You can trigger manual poll in Bridgy dashboard.

**Q: Can I use this with [other platform]?**
A: Bridgy supports Twitter, Mastodon, GitHub, Flickr. Instagram limited. Check https://brid.gy/ for current platforms.

**Q: Do I need a database?**
A: No! Everything is static. Webmention.io stores webmentions externally. Your site just fetches and displays at build time.

---

## Summary

seanwooj.in now supports:

- ✅ Full IndieWeb identity (h-card)
- ✅ Semantic blog posts (h-entry, h-feed)
- ✅ Webmention receiving and display
- ✅ POSSE workflow with syndication links
- ✅ Social media backfeed via Bridgy
- ✅ Enhanced RSS and JSON feeds
- ✅ Dark mode integration
- ✅ Privacy and security best practices

**Your content. Your domain. Your control.**

Welcome to the IndieWeb.

---

Last updated: November 2, 2025
