# Deployment Guide

Complete guide for deploying the Astro portfolio site to Vercel.

## Prerequisites

- Git repository pushed to GitHub
- Vercel account (free tier works perfectly)
- Node.js 18.x or higher installed locally for testing

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Connect Repository

1. Go to [https://vercel.com](https://vercel.com)
2. Log in with your GitHub account (or create a new Vercel account)
3. Click "Add New..." → "Project"
4. Import your Git repository:
   - Select your GitHub organization
   - Find your portfolio repository
   - Click "Import"

### Step 2: Configure Project

Vercel will automatically detect Astro and configure the project:

- **Framework Preset**: Astro (auto-detected)
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `dist` (auto-filled)
- **Install Command**: `npm install` (auto-filled)

**No configuration changes needed** - the defaults are correct!

### Step 3: Deploy

1. Click "Deploy"
2. Wait for build to complete (usually 30-60 seconds)
3. View your live site at the provided Vercel URL

### Step 4: Update Site URL

After deployment, you'll receive a URL like `https://your-repo-name.vercel.app`

1. Copy your production URL
2. Update `/workspace/astro.config.mjs`:
   ```javascript
   site: 'https://your-actual-domain.vercel.app',
   ```
3. Commit and push:
   ```bash
   git add astro.config.mjs
   git commit -m "Update production site URL"
   git push origin main
   ```
4. Vercel will automatically redeploy with the correct URL

## Option 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login

```bash
vercel login
```

Follow the prompts to authenticate with your Vercel account.

### Step 3: Deploy

From your project root:

```bash
# First deployment (creates new project)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No (first time)
# - Project name? (default is fine)
# - Directory? ./ (current directory)
# - Override settings? No (use detected settings)
```

### Step 4: Production Deployment

```bash
vercel --prod
```

This creates a production deployment at your project's permanent URL.

### Step 5: Update Site URL

Same as Option 1, Step 4 above.

## Custom Domain (Optional)

### Add Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `seankim.com`)
3. Follow Vercel's DNS configuration instructions
4. Update `astro.config.mjs` with your custom domain:
   ```javascript
   site: 'https://seankim.com',
   ```
5. Commit and push the change

### SSL Certificate

Vercel automatically provisions SSL certificates for all domains (Let's Encrypt).
HTTPS is enabled by default - no configuration needed.

## Environment Variables

This static site doesn't require environment variables. If you add API integrations later:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add variables for Production, Preview, and Development as needed
3. Redeploy for changes to take effect

## Deployment Workflow

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Push to `main`**: Production deployment
- **Push to other branches**: Preview deployment
- **Pull Requests**: Preview deployment with unique URL

### Manual Deployments

Trigger manual deployment from Vercel Dashboard:
1. Go to Deployments tab
2. Click "Redeploy" on any previous deployment
3. Or use Vercel CLI: `vercel --prod`

## Build Configuration

The site uses these build settings (configured in `vercel.json`):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro",
  "devCommand": "npm run dev"
}
```

### Build Process

1. Vercel installs dependencies: `npm install`
2. Runs build command: `npm run build`
3. Astro generates static HTML in `dist/` directory
4. Vercel deploys the `dist/` directory to edge network

### Build Output

The build generates these files:
- `/index.html` - Homepage
- `/about/index.html` - About page
- `/writing/index.html` - Writing index
- `/writing/[slug]/index.html` - Individual articles (3 pages)
- `/rss.xml` - RSS feed
- `/404.html` - Error page
- `/_astro/*` - Optimized CSS and assets

**Total**: 7 HTML pages + RSS feed + assets

## Verification Checklist

After deployment, verify these items:

### Core Pages
- [ ] Homepage displays correctly
- [ ] Projects grid shows all 4 projects
- [ ] Writing page lists articles
- [ ] Individual article pages work
- [ ] About page displays
- [ ] Navigation works between all pages

### Features
- [ ] RSS feed accessible at `/rss.xml`
- [ ] RSS feed contains 3 published articles
- [ ] 404 page shows for invalid URLs
- [ ] Mobile responsive design works

### Design
- [ ] Gradient background animation plays
- [ ] Hover states work on cards and links
- [ ] Typography looks correct
- [ ] Spacing and layout match local dev

### SEO
- [ ] Meta tags present in page source
- [ ] Open Graph tags for social sharing
- [ ] RSS feed link in `<head>`
- [ ] Canonical URLs set correctly

### Performance
- [ ] Page loads quickly (< 2 seconds)
- [ ] No JavaScript errors in console
- [ ] Images load properly (if any)
- [ ] External links open in new tabs

## Troubleshooting

### Build Fails

**Error**: `npm install` fails
- Check `package.json` is committed
- Verify Node.js version compatibility
- Check build logs in Vercel Dashboard

**Error**: `npm run build` fails
- Test build locally first: `npm run build`
- Check Astro version compatibility
- Review error message in build logs

### Pages Not Found (404)

- Verify files exist in `dist/` after build
- Check Vercel routing configuration
- Ensure URLs match Astro's file structure

### RSS Feed Not Working

- Verify `/rss.xml` exists in build output
- Check `site` URL in `astro.config.mjs`
- Test RSS feed locally with `npm run preview`

### Styles Not Applying

- Check CSS file is imported in `BaseLayout.astro`
- Verify Google Fonts link in `<head>`
- Clear browser cache and hard refresh

### Wrong URL in RSS Feed

- Update `site` in `astro.config.mjs`
- Commit and push changes
- Wait for automatic redeploy

## Performance Optimization

### Automatic Optimizations

Vercel automatically provides:
- Global CDN distribution
- HTTP/2 and HTTP/3 support
- Brotli compression
- Smart caching headers
- DDoS protection

### Expected Performance

- **Build time**: 30-60 seconds
- **Deploy time**: Additional 10-20 seconds
- **Page load**: < 2 seconds worldwide
- **Lighthouse score**: > 90 on all metrics

### Edge Network

Your site is deployed to Vercel's edge network with:
- 100+ global edge locations
- Automatic failover
- Zero-downtime deployments
- Instant cache invalidation

## Monitoring

### Vercel Analytics (Optional)

Enable free analytics:
1. Go to Vercel Dashboard → Your Project → Analytics
2. Enable Web Analytics
3. View traffic, performance, and vitals

### Build Logs

View build logs for each deployment:
1. Go to Deployments tab
2. Click on any deployment
3. View "Building" logs for details

### Real-time Logs (Optional)

For serverless functions (not needed for this static site):
```bash
vercel logs
```

## Rollback

### Via Dashboard

1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Via CLI

```bash
# List deployments
vercel ls

# Promote specific deployment
vercel promote <deployment-url>
```

## Security

### Automatic Security

Vercel provides:
- Automatic HTTPS/SSL
- DDoS protection
- Edge network security
- Header security defaults

### Additional Headers (Optional)

Add security headers in `vercel.json` if needed:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Astro Documentation**: https://docs.astro.build
- **Vercel Support**: https://vercel.com/support
- **Astro Discord**: https://astro.build/chat

## Next Steps After Deployment

1. **Add analytics** (optional)
2. **Set up custom domain** (optional)
3. **Test RSS feed** with a feed reader
4. **Share your site** on social media
5. **Add new content** using the content workflow

---

## Quick Reference

### Deploy Commands

```bash
# Initial setup
vercel login
vercel

# Production deployment
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs
```

### Important URLs

- Production: `https://your-project.vercel.app`
- Dashboard: `https://vercel.com/dashboard`
- Analytics: `https://vercel.com/dashboard/analytics`
- Settings: `https://vercel.com/dashboard/settings`

### Post-Deployment Updates

1. Make changes locally
2. Test with `npm run dev`
3. Build test: `npm run build && npm run preview`
4. Commit: `git add . && git commit -m "Description"`
5. Push: `git push origin main`
6. Vercel deploys automatically
7. Verify at production URL

---

**Deployment is fully automated after initial setup.**

Every push to `main` triggers a new production deployment. No manual steps required!
