# Production Deployment Verification Checklist

Complete checklist to verify the Astro portfolio site is working correctly in production after Vercel deployment.

## Pre-Deployment Checklist

Before deploying to production, verify these items locally:

### Local Build Test

- [ ] `npm run build` completes without errors
- [ ] Build generates 7 pages in `dist/` directory
- [ ] `npm run preview` shows working site at http://localhost:4321
- [ ] `npm run astro check` shows no TypeScript/content errors

### Content Validation

- [ ] All 4 projects display on homepage
- [ ] Projects appear in correct order (1-4)
- [ ] All 4 writing items appear on writing page
- [ ] 3 published articles are accessible
- [ ] 1 coming-soon article shows but isn't clickable
- [ ] RSS feed contains exactly 3 published articles

### Local Functionality

- [ ] Navigation works between all pages (work, writing, about)
- [ ] Active navigation state highlights correctly
- [ ] Project card hover states work
- [ ] External links open in new tabs
- [ ] Footer links work correctly
- [ ] RSS feed link appears on writing page
- [ ] 404 page displays for non-existent routes

### Design Verification

- [ ] Gradient background animation plays
- [ ] Typography matches original (Inter + Playfair Display)
- [ ] All spacing and layout matches original HTML
- [ ] Hover colors work on project cards
- [ ] Mobile responsive design works (test at 768px and below)
- [ ] No layout shifts or visual glitches

## Deployment Steps

Follow these steps for initial deployment:

### 1. Prepare Repository

- [ ] All changes committed to git
- [ ] `.gitignore` properly excludes `dist/` and `node_modules/`
- [ ] Repository pushed to GitHub
- [ ] `main` branch is up to date

### 2. Connect to Vercel

- [ ] Logged into Vercel account
- [ ] Repository connected via Vercel dashboard
- [ ] Astro framework detected automatically
- [ ] Build settings are correct (default values)

### 3. Initial Deployment

- [ ] Clicked "Deploy" in Vercel dashboard
- [ ] Build completed successfully (check logs)
- [ ] Received production URL (e.g., `https://project-name.vercel.app`)
- [ ] Site is accessible at production URL

### 4. Update Site URL

- [ ] Copied actual Vercel URL
- [ ] Updated `site` in `astro.config.mjs` with real URL
- [ ] Committed change: `git commit -m "Update production site URL"`
- [ ] Pushed to GitHub: `git push origin main`
- [ ] Vercel automatic redeployment completed

## Post-Deployment Verification

After deployment, test everything in production:

### Core Pages

Access each page and verify it works:

- [ ] **Homepage** (`/`): https://your-site.vercel.app/
  - [ ] Loads without errors
  - [ ] All 4 projects display
  - [ ] Project cards show correct data
  - [ ] Technical specs section displays
  - [ ] Navigation is visible

- [ ] **Writing Index** (`/writing`): https://your-site.vercel.app/writing
  - [ ] Loads without errors
  - [ ] All 4 writing items display
  - [ ] Published articles are clickable
  - [ ] Coming-soon article is not clickable
  - [ ] RSS feed link is visible
  - [ ] Dates format correctly

- [ ] **About Page** (`/about`): https://your-site.vercel.app/about
  - [ ] Loads without errors
  - [ ] All sections display (background, practice, approach, collaborations)
  - [ ] Contact methods grid displays
  - [ ] Links are clickable

- [ ] **Individual Articles**:
  - [ ] `/writing/smooth-coherence-transitions/` loads
  - [ ] `/writing/fingertip-ecg/` loads
  - [ ] `/writing/svg-rendering/` loads
  - [ ] Article title, date, tags display correctly
  - [ ] Markdown content renders properly
  - [ ] "Back to writing" link works

- [ ] **RSS Feed** (`/rss.xml`): https://your-site.vercel.app/rss.xml
  - [ ] Loads and shows valid XML
  - [ ] Contains 3 published articles
  - [ ] Article titles, descriptions, dates are correct
  - [ ] Links point to correct article URLs
  - [ ] Categories (tags) are included

- [ ] **404 Page**: https://your-site.vercel.app/nonexistent-page
  - [ ] Shows custom 404 page (not Vercel default)
  - [ ] Navigation still works
  - [ ] "Return home" link works
  - [ ] Footer displays

### Navigation & Links

- [ ] Logo in navigation returns to homepage
- [ ] "work" link goes to homepage
- [ ] "writing" link goes to writing index
- [ ] "about" link goes to about page
- [ ] Active navigation state highlights current page
- [ ] All navigation works from every page

### External Links

Test all external links open in new tabs:

- [ ] Wooj Lighting project button opens in new tab
- [ ] Koi Simulation "launch" and "editor" buttons work
- [ ] Coherence Visualization "launch" button works
- [ ] Calming Clouds "launch" and "test" buttons work
- [ ] Footer email link opens mail client
- [ ] Footer GitHub link opens in new tab
- [ ] Footer Twitter link opens in new tab
- [ ] About page contact links work
- [ ] About page Wooj link opens in new tab

### Design & Styling

- [ ] Gradient background animation plays smoothly
- [ ] Typography looks correct (Inter for body, Playfair for headings)
- [ ] All font weights load correctly (300, 400, 500)
- [ ] Colors match original design
- [ ] Spacing and layout match original
- [ ] Project card hover states work
- [ ] Link hover underlines appear
- [ ] No CSS loading flash or FOUC
- [ ] Smooth scrolling works

### Responsive Design

Test at different viewport sizes:

- [ ] **Desktop (1920px)**: Layout looks good
- [ ] **Laptop (1366px)**: Layout looks good
- [ ] **Tablet (768px)**: Breakpoint transitions smoothly
- [ ] **Mobile (375px)**:
  - [ ] Navigation stacks vertically
  - [ ] Project cards stack vertically
  - [ ] Writing items stack properly
  - [ ] Text is readable
  - [ ] No horizontal scroll

### SEO & Meta Tags

View page source and verify meta tags:

- [ ] `<title>` tag is correct on each page
- [ ] Meta description present
- [ ] Canonical URL set correctly
- [ ] Open Graph tags present (og:title, og:description, og:type, og:url)
- [ ] Twitter Card tags present
- [ ] RSS feed link in `<head>` (`<link rel="alternate" type="application/rss+xml">`)
- [ ] Viewport meta tag present
- [ ] Google Fonts loaded correctly

### Performance

Open browser DevTools and check:

- [ ] No JavaScript errors in console
- [ ] No CSS errors in console
- [ ] No 404 errors for resources
- [ ] Fonts load successfully
- [ ] No mixed content warnings (HTTP vs HTTPS)
- [ ] Page loads quickly (< 2 seconds)

### RSS Feed Validation

Test RSS feed with external tools:

- [ ] **W3C Feed Validator**: https://validator.w3.org/feed/
  - [ ] Paste RSS URL
  - [ ] Validates as valid RSS 2.0
  - [ ] No errors or warnings

- [ ] **RSS Reader Test**:
  - [ ] Add feed to RSS reader (Feedly, NewsBlur, etc.)
  - [ ] Articles appear correctly
  - [ ] Links work from reader
  - [ ] Dates display correctly

### Browser Compatibility

Test in multiple browsers:

- [ ] **Chrome** (latest): Everything works
- [ ] **Firefox** (latest): Everything works
- [ ] **Safari** (latest): Everything works
- [ ] **Edge** (latest): Everything works
- [ ] **Mobile Safari** (iOS): Everything works
- [ ] **Chrome Mobile** (Android): Everything works

### Lighthouse Audit

Run Lighthouse audit in Chrome DevTools:

- [ ] **Performance**: Score > 90
- [ ] **Accessibility**: Score > 90
- [ ] **Best Practices**: Score > 90
- [ ] **SEO**: Score > 90
- [ ] No critical issues reported

### Content Workflow Test

Test adding new content and deploying:

- [ ] Add a new test project locally
- [ ] Verify it appears in dev server
- [ ] Commit and push to GitHub
- [ ] Vercel redeploys automatically
- [ ] New project appears on production site
- [ ] Remove test project (optional)

## Common Issues & Solutions

### Issue: 404 on all pages except homepage

**Cause**: Routing configuration issue

**Solution**:
- Verify `vercel.json` is committed
- Check Vercel build logs for errors
- Ensure Astro framework was detected

### Issue: RSS feed returns 404

**Cause**: File not generated during build

**Solution**:
- Check build logs for errors in `rss.xml.ts`
- Verify `@astrojs/rss` is installed
- Test RSS locally: `npm run build && npm run preview`

### Issue: Styles not applying

**Cause**: CSS file not imported or fonts not loading

**Solution**:
- Check Network tab for failed resources
- Verify Google Fonts link in BaseLayout
- Hard refresh browser: Cmd/Ctrl + Shift + R

### Issue: Navigation active state doesn't work

**Cause**: `activePage` prop not passed correctly

**Solution**:
- Check BaseLayout receives correct `activePage` prop on each page
- Verify class conditional logic in navigation

### Issue: Wrong URLs in RSS feed

**Cause**: `site` URL not updated in `astro.config.mjs`

**Solution**:
- Update `site` with actual Vercel URL
- Commit and push changes
- Wait for redeployment

### Issue: Images not loading

**Cause**: Images not in `public/` directory or wrong path

**Solution**:
- Verify images are in `public/images/`
- Check image paths start with `/images/` (not `./images/`)
- Check browser Network tab for 404s

## Post-Verification Actions

After all checks pass:

- [ ] **Document actual URL**: Update any documentation with real URL
- [ ] **Share site**: Test social sharing (Twitter, etc.)
- [ ] **Subscribe to RSS**: Add to your own RSS reader
- [ ] **Monitor analytics** (if enabled): Check Vercel analytics
- [ ] **Set up custom domain** (optional): Follow Vercel domain setup
- [ ] **Enable Vercel Web Analytics** (optional): Free in dashboard

## Rollback Procedure

If critical issues are found:

1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"
4. Or: Revert git commit and push

## Success Criteria

Deployment is successful when:

- [x] All 7 pages load without errors
- [x] All navigation works correctly
- [x] Design matches original exactly
- [x] RSS feed validates and works
- [x] No console errors
- [x] Lighthouse scores > 90
- [x] Mobile responsive design works
- [x] Content workflow tested and works

---

## Sign-Off

**Deployment Date**: _________________

**Production URL**: _________________

**Verified By**: _________________

**Notes**: _________________

---

## Next Steps After Verification

1. Update any external links pointing to old site
2. Submit RSS feed to aggregators (optional)
3. Share site on social media
4. Set up custom domain (optional)
5. Enable analytics (optional)
6. Create first new article or project
7. Monitor for any user-reported issues

**Deployment Complete!** 🎉
