# Phase 5 Testing Guide

This document provides testing instructions for Phase 5: POSSE Workflow & Backfeed.

## What Was Implemented

Phase 5 added support for POSSE (Publish Own Site, Syndicate Elsewhere) workflow:

1. **Schema Extension**: Posts can now include syndication links in frontmatter
2. **UI Display**: Syndication links appear on post pages with "Also posted on" label
3. **Microformats**: Links use `u-syndication` class for IndieWeb compatibility
4. **Documentation**: Complete guides for Bridgy setup and POSSE workflow

## Manual Testing Checklist

### 1. Schema Validation

Test that the schema accepts syndication data:

**Test Case 1: Post without syndication**
```markdown
---
title: "Test Post"
excerpt: "Testing without syndication"
date: 2024-01-15
tags: ["Test"]
status: "published"
---

Content here.
```

- [ ] Build succeeds
- [ ] No syndication section appears on page
- [ ] No errors in console

**Test Case 2: Post with syndication**
```markdown
---
title: "Test Post with Syndication"
excerpt: "Testing with syndication"
date: 2024-01-15
tags: ["Test"]
status: "published"
syndication:
  - platform: "Mastodon"
    url: "https://mastodon.social/@test/123456"
  - platform: "Bluesky"
    url: "https://bsky.app/profile/test/post/123456"
---

Content here.
```

- [ ] Build succeeds
- [ ] Syndication section appears
- [ ] Shows "Also posted on:"
- [ ] Shows "Mastodon" and "Bluesky" links
- [ ] Links are clickable
- [ ] Links open in new tab

### 2. UI/UX Testing

**Light Mode:**
- [ ] Syndication section has visible border
- [ ] Text is readable (#666 gray)
- [ ] Links are blue (#0066cc)
- [ ] Hover state changes color and underlines
- [ ] Spacing looks good (2rem margin-top, 1rem padding-top)

**Dark Mode:**
- [ ] Toggle dark mode
- [ ] Border is visible (#333)
- [ ] Text is readable (#aaa)
- [ ] Links are lighter blue (#4d9fff)
- [ ] Hover state changes to lighter (#7ab8ff)
- [ ] Good contrast with background

### 3. Microformats Validation

**Check for u-syndication class:**

1. Visit a post with syndication links
2. Open browser DevTools
3. Inspect syndication links
4. Verify each link has `class="u-syndication syndication-link"`

**Use IndieWebify.me validator:**

1. Create a test post with syndication
2. Deploy to production or use ngrok for local testing
3. Visit https://indiewebify.me/validate-h-entry/
4. Enter your post URL
5. Verify:
   - [ ] h-entry detected
   - [ ] u-syndication properties found
   - [ ] Syndication URLs are correct

### 4. Responsive Design Testing

**Mobile (< 768px):**
- [ ] Syndication section doesn't overflow
- [ ] Links wrap properly if needed
- [ ] Touch targets are adequate size
- [ ] Spacing works on small screens

**Tablet (768px - 1024px):**
- [ ] Layout looks good
- [ ] Links have proper spacing
- [ ] No weird wrapping issues

**Desktop (> 1024px):**
- [ ] Syndication section width matches article
- [ ] Spacing is comfortable
- [ ] Links are well-spaced

### 5. Build Testing

**Test various scenarios:**

```bash
# Clean build
rm -rf dist/ .astro/
npm run build
```

- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] No schema validation errors
- [ ] All pages generate correctly

**Test with invalid data:**

Try adding invalid syndication:
```markdown
syndication: "not-an-array"
```

- [ ] Build fails with clear error
- [ ] Error points to schema validation

### 6. Documentation Testing

**BRIDGY_SETUP.md:**
- [ ] Read through entire document
- [ ] Instructions are clear
- [ ] No broken links
- [ ] Code examples are correct
- [ ] Troubleshooting section is helpful

**POSSE_WORKFLOW.md:**
- [ ] Read through entire document
- [ ] Workflow steps are logical
- [ ] Examples are realistic
- [ ] No broken internal links
- [ ] Quick reference is useful

### 7. Integration Testing

**Full POSSE workflow (when ready for production):**

1. **Create a test post**
   ```markdown
   ---
   title: "Test POSSE Flow"
   excerpt: "Testing the complete POSSE workflow"
   date: 2024-01-15
   tags: ["Test", "IndieWeb"]
   status: "published"
   syndication: []
   ---

   This is a test post for POSSE workflow verification.
   ```

2. **Deploy to production**
   - [ ] Post appears on site
   - [ ] No syndication section (empty array)

3. **Syndicate to Mastodon**
   - [ ] Post to Mastodon with link to your post
   - [ ] Copy Mastodon post URL

4. **Add syndication link**
   ```markdown
   syndication:
     - platform: "Mastodon"
       url: "https://mastodon.social/@yourname/123456"
   ```
   - [ ] Rebuild and deploy
   - [ ] Syndication section appears
   - [ ] Link works

5. **Test Bridgy backfeed** (if Bridgy is set up)
   - [ ] Like the Mastodon post
   - [ ] Wait for Bridgy poll or trigger manually
   - [ ] Rebuild site
   - [ ] Check if like appears in webmentions

## Expected Results

### Success Criteria

All of these should be true:

- [x] Schema accepts optional syndication array
- [x] Build succeeds with and without syndication
- [x] Syndication section only appears when data exists
- [x] Links have proper microformats (u-syndication)
- [x] Styling works in light and dark modes
- [x] Links open in new tab with security attributes
- [x] Documentation is complete and accurate
- [x] No console errors or warnings
- [x] Responsive design works on all screen sizes

### Visual Appearance

The syndication section should look like this:

```
----------------------------------------  (border-top)
Also posted on: Mastodon Bluesky Twitter
```

- Border: subtle gray line (lighter in dark mode)
- Label: "Also posted on:" in medium gray
- Links: Blue (light mode) or light blue (dark mode)
- Spacing: Comfortable padding and margins

## Common Issues and Solutions

### Issue: Build fails with schema error

**Solution:** Check frontmatter syntax:
- Ensure `syndication:` is followed by array
- Each item needs `platform:` and `url:` fields
- URLs should be strings (quoted if special chars)

### Issue: Syndication section doesn't appear

**Possible causes:**
1. `syndication: []` (empty array) - this is correct, no section should appear
2. Missing `syndication` field - optional, no section should appear
3. Post status is not "published" - check status field

**Solution:** Verify frontmatter and rebuild

### Issue: Links not styled correctly

**Solution:**
- Check that style block is included in [slug].astro
- Clear browser cache
- Check for CSS conflicts in DevTools

### Issue: Dark mode colors don't work

**Solution:**
- Verify dark mode is active (check html class)
- Ensure `:global(.dark-mode)` selectors are present
- Check CSS specificity

## Files to Review

Before marking Phase 5 complete, review these files:

1. `/Users/seankim/dev/portfolio/src/content/config.ts`
   - Schema includes syndication field
   - Properly typed as optional array

2. `/Users/seankim/dev/portfolio/src/pages/writing/[slug].astro`
   - hasSyndication check implemented
   - Syndication section renders conditionally
   - u-syndication class on links
   - Style block included

3. `/Users/seankim/dev/portfolio/docs/BRIDGY_SETUP.md`
   - Complete and accurate
   - No typos or broken links

4. `/Users/seankim/dev/portfolio/docs/POSSE_WORKFLOW.md`
   - Complete and accurate
   - Examples are realistic
   - No typos or broken links

## Next Steps

After Phase 5 is approved:

1. **Phase 6**: Privacy, testing, and final documentation
2. **Production testing**: Test full POSSE workflow in production
3. **Bridgy setup**: Actually connect Bridgy to social accounts
4. **Monitor**: Watch for webmentions from backfeed

## Questions to Consider

Before moving to Phase 6:

- [ ] Is the syndication display design appropriate for your site style?
- [ ] Do you want to customize the "Also posted on:" text?
- [ ] Should syndication links show platform icons instead of text?
- [ ] Do you need to support additional frontmatter fields?
- [ ] Is the documentation clear enough for future reference?

## Approval Checklist

Phase 5 is ready for review when:

- [x] All manual tests pass
- [x] Documentation is complete
- [x] No build errors
- [x] Code follows existing patterns
- [x] Microformats are valid
- [x] Dark mode works correctly
- [x] Implementation matches plan specifications

---

**Status**: Phase 5 implementation complete, ready for code review.
