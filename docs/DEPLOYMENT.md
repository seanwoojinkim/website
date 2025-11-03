# IndieWeb Deployment Guide

This guide covers the complete deployment workflow for the IndieWeb-enabled seanwooj.in site, including setup, verification, and troubleshooting.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Service Configuration](#service-configuration)
3. [Environment Setup](#environment-setup)
4. [Build & Deploy](#build--deploy)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying, ensure all prerequisites are met:

### Code Readiness
- [ ] All IndieWeb features implemented (Phases 1-5 complete)
- [ ] Local build succeeds: `npm run build`
- [ ] Local preview works: `npm run preview`
- [ ] All tests pass (see [TESTING_INDIEWEB.md](./TESTING_INDIEWEB.md))
- [ ] No console errors or warnings
- [ ] Git status clean or changes committed

### Configuration Verification
- [ ] `astro.config.mjs` has correct site URL: `https://seanwooj.in`
- [ ] Microformats markup validated locally
- [ ] RSS/JSON feeds validate locally
- [ ] Dark mode works with webmentions

### Documentation Review
- [ ] Read [WEBMENTIONS.md](./WEBMENTIONS.md)
- [ ] Read [POSSE_WORKFLOW.md](./POSSE_WORKFLOW.md)
- [ ] Read [BRIDGY_SETUP.md](./BRIDGY_SETUP.md)

---

## Service Configuration

### 1. Webmention.io Setup

Webmention.io provides the webmention receiving endpoint.

**Initial Setup (One-time):**

1. **Sign in to Webmention.io**
   - Visit: https://webmention.io/
   - Sign in with your domain (seanwooj.in)
   - Uses IndieAuth authentication

2. **Verify domain ownership**
   - Webmention.io checks for rel="me" links on your homepage
   - Ensure your h-card includes links to verified profiles
   - Common verification methods:
     - GitHub profile with link back to seanwooj.in
     - Email in h-card markup
     - Other social profiles with rel="me"

3. **Get your endpoint URL**
   - After verification, your endpoint is: `https://webmention.io/seanwooj.in/webmention`
   - Already configured in site templates (no action needed)

4. **Configure settings** (optional)
   - Dashboard: https://webmention.io/settings
   - Options:
     - Email notifications for new webmentions
     - Blocking/filtering (if spam occurs)
     - API token (not needed for public API)

**Verification:**
```bash
# Check endpoint responds
curl -I https://webmention.io/seanwooj.in/webmention

# Expected: HTTP 200 or 405 (Method Not Allowed for GET)
```

**No environment variables needed** - Webmention.io API is public.

---

### 2. Bridgy Setup

Bridgy enables POSSE backfeed from social media platforms.

**Initial Setup (One-time):**

1. **Visit Bridgy**
   - URL: https://brid.gy/

2. **Connect social accounts**
   - Click "Connect" for each platform you want to use:
     - Twitter/X
     - Mastodon
     - GitHub
     - Others as available
   - Follow OAuth flow for each platform

3. **Enable polling**
   - After connecting, ensure "polling" is enabled
   - Bridgy will check for responses every ~30 minutes
   - Configure poll frequency if available

4. **Verify status**
   - Dashboard shows "Last poll: X minutes ago"
   - Status should be "polling" (not "disabled")

**See detailed setup in:** [BRIDGY_SETUP.md](./BRIDGY_SETUP.md)

**Ongoing Maintenance:**
- Re-authenticate OAuth if expired (Bridgy will notify)
- Check dashboard weekly to ensure polling active
- Monitor for platform API changes

**No environment variables needed** - Bridgy runs independently.

---

## Environment Setup

### Vercel Configuration

This site uses Vercel for hosting. No special environment variables required for IndieWeb features.

**Build Settings:**
- Framework: Astro
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 18.x or higher

**Environment Variables:**
None required for current IndieWeb implementation.

**If adding private features later:**
- Webmention.io API token: `WEBMENTION_IO_TOKEN` (optional, for private endpoints)
- Analytics tokens (if implemented)

---

## Build & Deploy

### Local Build Test

Before deploying to production:

```bash
# Clean previous builds
rm -rf dist/

# Install dependencies (if not already)
npm install

# Build for production
npm run build

# Preview locally
npm run preview
```

**Verify:**
- Build completes without errors
- Preview at http://localhost:4321/
- Check post with webmentions
- Test dark mode toggle
- Verify RSS feed: http://localhost:4321/rss.xml
- Check JSON feed: http://localhost:4321/feed.json

### Git Workflow

```bash
# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "Add IndieWeb integration - Phase 6 complete"

# Push to main (triggers Vercel deploy)
git push origin main
```

### Vercel Deployment

**Automatic Deployment:**
- Push to `main` branch triggers automatic deploy
- Vercel builds and deploys automatically
- Typically takes 2-3 minutes

**Monitor Deployment:**
1. Visit Vercel dashboard: https://vercel.com/
2. Check deployment status
3. View build logs if errors occur
4. Wait for "Deployment ready" status

**Manual Deployment (if needed):**
```bash
# Install Vercel CLI (one-time)
npm install -g vercel

# Deploy
vercel --prod
```

---

## Post-Deployment Verification

After successful deployment, verify all features work in production.

### 1. Basic Site Health

**Check site loads:**
- Visit: https://seanwooj.in/
- Verify homepage renders
- No console errors (F12 DevTools)
- Check dark mode toggle works

**Verify builds:**
- Vercel dashboard shows "Ready"
- No errors in build logs
- Correct commit deployed

### 2. Microformats Validation

**h-card (Homepage):**
```bash
# Test with validator
open https://indiewebify.me/validate-h-card/
# Enter: https://seanwooj.in/
```

**Expected:** Valid h-card with all properties.

**h-entry (Blog Posts):**
```bash
# Test any post
open https://indiewebify.me/validate-h-entry/
# Enter: https://seanwooj.in/writing/[post-slug]/
```

**Expected:** Valid h-entry with author h-card.

### 3. Webmention Endpoint Discovery

**Check link tag:**
```bash
curl -s https://seanwooj.in/ | grep webmention
```

**Expected output:**
```html
<link rel="webmention" href="https://webmention.io/seanwooj.in/webmention" />
```

**Test with webmention.rocks:**
- Visit: https://webmention.rocks/receive/1
- Enter a post URL from seanwooj.in
- Send test webmention
- Check Webmention.io dashboard: https://webmention.io/settings

**Expected:** Test webmention appears in dashboard within seconds.

### 4. Webmention Display

**If test webmentions exist:**
- Navigate to post with webmentions
- Verify Webmentions component renders
- Check avatars load
- Test links work
- Verify dark mode styling

**If no webmentions yet:**
- Component should not appear
- No errors in console

### 5. RSS/JSON Feeds

**RSS Feed:**
```bash
# Validate
open https://validator.w3.org/feed/
# Enter: https://seanwooj.in/rss.xml
```

**Expected:** "This is a valid RSS feed"

**JSON Feed:**
```bash
# Validate
open https://validator.jsonfeed.org/
# Enter: https://seanwooj.in/feed.json
```

**Expected:** "Valid JSON Feed"

**Test in feed reader:**
- Add `https://seanwooj.in/rss.xml` to Feedly, NetNewsWire, etc.
- Verify posts appear
- Check content renders

### 6. Syndication & POSSE

**For posts with syndication links:**
- Check syndication links display
- Verify `u-syndication` class present
- Links open in new tab

**Bridgy verification:**
- Visit: https://brid.gy/
- Check connected accounts show "polling"
- For syndicated posts, verify Bridgy finds syndication links
- Test: https://brid.gy/twitter/[username] (replace with your platform)

### 7. Performance Check

**Lighthouse audit:**
1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Select "Performance"
4. Click "Analyze page load"

**Expected scores:**
- Performance: ≥ 90
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 90

**Check build time:**
- Vercel build logs show total time
- Should be < 5 minutes for full site

### 8. Cross-Browser Testing

**Desktop:**
- Chrome/Edge: https://seanwooj.in/
- Firefox: https://seanwooj.in/
- Safari: https://seanwooj.in/

**Mobile:**
- iOS Safari
- Android Chrome

**For each:**
- Page loads correctly
- Dark mode toggles
- Webmentions display (if present)
- No console errors

---

## Troubleshooting

### Build Failures

**Symptom:** Vercel build fails

**Check:**
1. Review Vercel build logs
2. Look for error messages
3. Common issues:
   - Node version mismatch
   - Missing dependencies
   - TypeScript errors
   - API fetch failures

**Solutions:**
```bash
# Test build locally first
npm run build

# Check Node version
node --version  # Should be 18+

# Clear cache and rebuild
rm -rf node_modules/ dist/
npm install
npm run build
```

**If Webmention.io API causes build failure:**
- Check if API is down: https://webmention.io/
- Verify error handling in `src/utils/webmentions.ts`
- API failures should return empty array, not crash build

### Webmentions Not Appearing

**Symptom:** Sent webmention doesn't show on site

**Diagnose:**

1. **Check Webmention.io received it:**
   ```bash
   curl "https://webmention.io/api/mentions.jf2?domain=seanwooj.in"
   ```
   - Look for your webmention in results
   - Note the `wm-id`

2. **Check API for specific post:**
   ```bash
   curl "https://webmention.io/api/mentions.jf2?target=https://seanwooj.in/writing/[post-slug]/"
   ```
   - Should return webmentions for that URL
   - Try both with and without trailing slash

3. **Rebuild site:**
   - Webmentions fetched at build time
   - Trigger new deploy to pull latest
   ```bash
   git commit --allow-empty -m "Refresh webmentions"
   git push
   ```

4. **Check fetch logic:**
   - Review `src/utils/webmentions.ts`
   - Verify URL matching logic
   - Check for trailing slash handling

### Microformats Not Validating

**Symptom:** Validator shows errors

**Common issues:**

1. **Missing properties:**
   - Check class names: `h-card`, `p-name`, `u-url`, etc.
   - Verify HTML structure in templates

2. **Invalid datetime:**
   - dt-published must be ISO 8601 format
   - Check: `<time datetime="2025-11-02T10:00:00-08:00">`

3. **Nested h-card issues:**
   - Author h-card must be inside h-entry
   - Check template structure

**Debug:**
```bash
# View parsed microformats
curl -s https://seanwooj.in/writing/[post]/ | grep -E "h-card|h-entry|p-name"
```

### Bridgy Not Backfeeding

**Symptom:** Social interactions don't appear as webmentions

**Check:**

1. **Bridgy polling status:**
   - Visit: https://brid.gy/
   - Ensure status is "polling" not "disabled"
   - Check "Last poll" timestamp (should be < 1 hour)

2. **Syndication link format:**
   - Must have `u-syndication` class
   - URL must be exact social post URL
   - Example: `https://twitter.com/username/status/123456789`

3. **Post accessibility:**
   - Bridgy must be able to fetch your post
   - Check post is public (not password protected)
   - Verify no robots.txt blocking

4. **Re-authenticate:**
   - OAuth tokens may expire
   - Visit Bridgy dashboard
   - Reconnect accounts if needed

**Manual trigger:**
- Visit: https://brid.gy/
- Click "Poll now" for specific platform
- Check logs for errors

### Performance Issues

**Symptom:** Slow page loads or poor Lighthouse scores

**Diagnose:**

1. **Check webmention fetch time:**
   - Review build logs
   - Webmention API should respond < 5 seconds
   - If slow, consider caching strategy

2. **Image optimization:**
   - Ensure avatars optimized
   - Check lazy loading enabled
   - Verify responsive images used

3. **JavaScript errors:**
   - Open DevTools console
   - Look for errors
   - Check network tab for failed requests

**Optimize:**
```bash
# Audit bundle size
npm run build
ls -lh dist/_astro/

# Check for large files
find dist/ -size +500k
```

### Dark Mode Issues

**Symptom:** Webmentions don't style correctly in dark mode

**Check:**

1. **CSS custom properties:**
   - Verify `--webmention-bg`, `--webmention-text`, etc. defined
   - Check `:global(.dark-mode)` selectors in component

2. **Theme toggle:**
   - Ensure dark mode class applied to root element
   - Check localStorage persistence

3. **Contrast:**
   - Use browser DevTools to inspect colors
   - Verify meets WCAG AA standards (4.5:1)

---

## Rollback Procedures

If critical issues occur post-deployment:

### Quick Rollback (Vercel)

**Via Dashboard:**
1. Visit Vercel dashboard
2. Go to Deployments tab
3. Find previous working deployment
4. Click "..." menu → "Promote to Production"

**Via CLI:**
```bash
vercel rollback
```

### Git Rollback

**Revert last commit:**
```bash
git revert HEAD
git push origin main
```

**Revert to specific commit:**
```bash
# Find commit hash
git log --oneline

# Revert to that commit
git reset --hard <commit-hash>
git push --force origin main
```

**WARNING:** Force push overwrites history. Use only if necessary.

### Temporary Disable Features

**Remove webmentions display:**
1. Comment out `<Webmentions>` component in post template
2. Commit and push
3. Fix issues in separate branch
4. Re-enable when fixed

**Remove from build:**
- Webmention fetching errors shouldn't break builds
- If they do, check error handling in `webmentions.ts`

---

## Ongoing Maintenance

### Weekly Tasks
- [ ] Check Bridgy dashboard (OAuth status)
- [ ] Review new webmentions in Webmention.io
- [ ] Verify site performance (Lighthouse)
- [ ] Check for console errors

### Monthly Tasks
- [ ] Validate microformats still pass
- [ ] Test webmention receiving (Telegraph)
- [ ] Verify RSS/JSON feeds validate
- [ ] Review Bridgy poll logs
- [ ] Check build times reasonable

### As Needed
- [ ] Re-authenticate Bridgy OAuth
- [ ] Update dependencies: `npm update`
- [ ] Review and remove spam webmentions
- [ ] Monitor platform API changes

---

## Support Resources

### Documentation
- [WEBMENTIONS.md](./WEBMENTIONS.md) - Technical implementation
- [POSSE_WORKFLOW.md](./POSSE_WORKFLOW.md) - Publishing workflow
- [BRIDGY_SETUP.md](./BRIDGY_SETUP.md) - Bridgy configuration
- [TESTING_INDIEWEB.md](./TESTING_INDIEWEB.md) - Testing procedures
- [INDIEWEB_FEATURES.md](./INDIEWEB_FEATURES.md) - Feature overview

### External Services
- Webmention.io: https://webmention.io/
- Bridgy: https://brid.gy/
- IndieWeb Wiki: https://indieweb.org/
- Microformats: https://microformats.org/

### Validators
- h-card: https://indiewebify.me/validate-h-card/
- h-entry: https://indiewebify.me/validate-h-entry/
- RSS: https://validator.w3.org/feed/
- JSON Feed: https://validator.jsonfeed.org/
- Webmention: https://webmention.rocks/

### Community
- IndieWeb chat: https://chat.indieweb.org/
- IndieWeb forum: https://indieweb.org/discuss
- Webmention.io support: contact via site

---

## Post-Deployment Next Steps

After successful deployment:

1. **Send first test webmention**
   - Use Telegraph: https://telegraph.p3k.io/
   - Verify appears on site after rebuild

2. **Publish first POSSE post**
   - Follow [POSSE_WORKFLOW.md](./POSSE_WORKFLOW.md)
   - Test full workflow end-to-end

3. **Monitor for 48 hours**
   - Watch for errors in Vercel logs
   - Check Webmention.io for incoming mentions
   - Verify Bridgy polling active

4. **Announce IndieWeb support** (optional)
   - Blog post about implementation
   - Share on social media
   - Submit to IndieWeb directory

5. **Plan future enhancements**
   - Privacy policy page
   - Analytics integration
   - Micropub support
   - IndieAuth login

---

Last updated: November 2, 2025
