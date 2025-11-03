# IndieWeb Testing Guide

This document provides a comprehensive testing checklist for all IndieWeb features implemented on seanwooj.in.

## Overview

Test all features in order, documenting results as you go. Each section includes specific validators and expected outcomes.

---

## 1. Microformats2 Validation

### 1.1 Homepage h-card

**Test URL:** `https://seanwooj.in/`

**Validators:**
- Primary: https://indiewebify.me/validate-h-card/
- Alternative: https://pin13.net/mf2/

**Expected Results:**
- Valid h-card found
- Properties present:
  - `p-name`: "Sean Kim"
  - `u-url`: "https://seanwooj.in/"
  - `u-uid`: "https://seanwooj.in/"
  - `u-photo`: Profile photo URL
  - `p-note`: Bio text
- Hidden elements (URL, UID) not visible in rendered page
- Avatar and name visible in hero section

**How to Test:**
1. Visit https://indiewebify.me/validate-h-card/
2. Enter: `https://seanwooj.in/`
3. Click "Validate h-card"
4. Verify all properties listed above appear
5. Check rendered page - hidden elements should not be visible

### 1.2 Writing Posts h-entry

**Test URL:** `https://seanwooj.in/writing/[any-post-slug]/`

**Validators:**
- Primary: https://indiewebify.me/validate-h-entry/
- Alternative: https://pin13.net/mf2/

**Expected Results:**
- Valid h-entry found
- Required properties:
  - `p-name`: Post title
  - `dt-published`: ISO 8601 datetime
  - `e-content`: Full post content (HTML)
  - `u-url`: Canonical post URL
  - `p-author h-card`: Nested author card with name, photo, URL
  - `p-summary`: Post excerpt/description
- Optional properties (if present):
  - `p-category`: Tags/categories
  - `u-syndication`: Social media syndication links

**How to Test:**
1. Visit https://indiewebify.me/validate-h-entry/
2. Enter a post URL from /writing/
3. Click "Validate h-entry"
4. Verify all required properties present
5. Check dt-published has valid ISO 8601 format
6. Verify e-content contains actual post HTML

### 1.3 Writing Index h-feed

**Test URL:** `https://seanwooj.in/writing/`

**Validators:**
- Primary: https://pin13.net/mf2/
- Check in browser DevTools

**Expected Results:**
- h-feed wrapper element found
- Properties:
  - `p-name`: "Writing" or feed title
  - Multiple h-entry children (one per post)
- Each h-entry has required properties

**How to Test:**
1. Visit https://pin13.net/mf2/?url=https://seanwooj.in/writing/
2. Verify "h-feed" appears in parsed output
3. Check "children" array contains multiple h-entry objects
4. Verify each child has p-name, dt-published, u-url

---

## 2. Webmention Endpoint Discovery

### 2.1 Link Tag Presence

**Test URL:** All pages on seanwooj.in

**How to Test:**
1. Visit any page on the site
2. View page source (Ctrl+U or Cmd+Option+U)
3. Search for "webmention"
4. Verify this link tag exists in `<head>`:
   ```html
   <link rel="webmention" href="https://webmention.io/seanwooj.in/webmention" />
   ```

**Expected Result:**
- Link tag present on every page
- Correct endpoint URL
- Proper rel attribute

### 2.2 Endpoint Functionality

**Test Tool:** https://webmention.rocks/

**How to Test:**
1. Visit https://webmention.rocks/receive/1
2. Enter: `https://seanwooj.in/writing/[any-post]/`
3. Send test webmention
4. Check Webmention.io dashboard: https://webmention.io/settings
5. Verify test mention appears in dashboard

**Expected Result:**
- Webmention received successfully
- Shows in Webmention.io dashboard within seconds
- Status: "new" or "approved"

---

## 3. Webmention Display

### 3.1 Component Rendering

**Prerequisites:** Have at least one test webmention in Webmention.io

**How to Test:**
1. Build site: `npm run build`
2. Preview: `npm run preview`
3. Navigate to post with webmentions
4. Verify Webmentions component appears below post content

**Expected Results:**
- Component section titled "Webmentions"
- Interactions grouped by type:
  - Likes (avatars only)
  - Reposts (avatars only)
  - Replies (full content)
  - Mentions (previews)

### 3.2 Interaction Types

**Likes:**
- Display as circular avatars
- Show author name on hover
- Link to source post
- Max 20 avatars shown (if more, show "+N more")

**Reposts:**
- Display as circular avatars
- Show author name on hover
- Link to repost URL
- Max 20 avatars shown

**Replies:**
- Show author avatar, name, date
- Display full comment content
- Link to source reply
- Preserve formatting

**Mentions:**
- Show author info
- Show preview/excerpt
- Link to mentioning page

**How to Test:**
1. Send different webmention types using https://telegraph.p3k.io/
2. Rebuild site
3. Check each type renders correctly
4. Verify links work
5. Test hover states

### 3.3 Empty State

**How to Test:**
1. Navigate to post with zero webmentions
2. Verify Webmentions component does NOT appear
3. Check console - no errors

**Expected Result:**
- Component hidden entirely
- No empty/placeholder text shown
- No layout shift

### 3.4 Accessibility

**How to Test:**
1. Use keyboard navigation (Tab key)
2. Verify all links focusable
3. Check focus indicators visible
4. Use screen reader (VoiceOver, NVDA, JAWS)
5. Verify ARIA labels read correctly

**Expected Results:**
- All interactive elements keyboard accessible
- Focus indicators meet WCAG 2.1 standards
- Screen reader announces:
  - Section heading
  - Interaction counts
  - Author names
  - Reply content

---

## 4. Dark Mode Integration

### 4.1 Webmention Styling

**How to Test:**
1. Navigate to post with webmentions
2. Toggle dark mode (sun/moon button)
3. Verify webmentions component switches theme

**Expected Results:**
- Light mode: Light background, dark text
- Dark mode: Dark background, light text
- Sufficient contrast in both modes (WCAG AA minimum)
- Avatar borders visible in both modes
- Hover states work in both modes

### 4.2 Contrast Verification

**Tool:** https://webaim.org/resources/contrastchecker/

**How to Test:**
1. Use browser DevTools to inspect webmention text
2. Note foreground and background colors
3. Check contrast ratio
4. Repeat for dark mode

**Expected Results:**
- Light mode contrast: ≥ 4.5:1 for normal text
- Dark mode contrast: ≥ 4.5:1 for normal text
- Large text: ≥ 3:1

---

## 5. RSS Feed Validation

### 5.1 RSS 2.0 Feed

**Test URL:** `https://seanwooj.in/rss.xml`

**Validator:** https://validator.w3.org/feed/

**How to Test:**
1. Visit https://validator.w3.org/feed/
2. Enter: `https://seanwooj.in/rss.xml`
3. Click "Check"

**Expected Results:**
- "This is a valid RSS feed"
- No errors
- All posts included
- Absolute URLs throughout
- Proper encoding (UTF-8)
- Categories preserved

### 5.2 JSON Feed

**Test URL:** `https://seanwooj.in/feed.json`

**Validator:** https://validator.jsonfeed.org/

**How to Test:**
1. Visit https://validator.jsonfeed.org/
2. Enter: `https://seanwooj.in/feed.json`
3. Click "Validate"

**Expected Results:**
- "Valid JSON Feed"
- version: "https://jsonfeed.org/version/1.1"
- All required fields present
- Items array contains all posts
- Absolute URLs in item.url and item.content_html

### 5.3 Feed Discovery

**How to Test:**
1. Visit https://seanwooj.in/ in Firefox
2. Look for RSS icon in address bar
3. Click to subscribe

**Expected Result:**
- RSS icon appears
- Feed recognized by browser
- Title: "Sean Kim - Writing"

---

## 6. POSSE & Syndication

### 6.1 Syndication Links Display

**Prerequisites:** Post with syndication links in frontmatter

**How to Test:**
1. Add syndication links to test post:
   ```yaml
   syndication:
     - https://twitter.com/username/status/123
     - https://mastodon.social/@username/456
   ```
2. Rebuild site
3. Navigate to post
4. Verify syndication links appear

**Expected Results:**
- Links display below post content or in metadata
- Each link has `u-syndication` class
- Platform names detected (Twitter, Mastodon, etc.)
- Links open in new tab (rel="noopener noreferrer")

### 6.2 Bridgy Discovery

**Test Tool:** https://brid.gy/

**How to Test:**
1. Ensure Bridgy connected to social accounts
2. Publish post with syndication links
3. Check Bridgy dashboard: https://brid.gy/
4. Verify Bridgy polls for responses

**Expected Results:**
- Bridgy finds syndication links
- Poll status: "polling" or "last poll: X minutes ago"
- No errors in Bridgy logs

### 6.3 Backfeed Functionality

**Full E2E Test:**
1. Publish post to seanwooj.in
2. Syndicate to Twitter/Mastodon with link back
3. Add syndication link to post frontmatter
4. Rebuild site (Bridgy discovers syndication)
5. Like/reply on social platform
6. Wait for Bridgy poll (every ~30 min)
7. Rebuild site again
8. Verify social interaction appears as webmention

**Expected Results:**
- Social likes become webmention likes
- Social replies become webmention replies
- Reposts become webmention reposts
- Author info preserved from social platform

---

## 7. Performance Testing

### 7.1 Build Time

**How to Test:**
```bash
time npm run build
```

**Expected Results:**
- Total build time < 5 minutes for full site
- Webmention fetching adds < 30 seconds
- No timeout errors

### 7.2 API Failure Handling

**How to Test:**
1. Disconnect from internet
2. Run build
3. Check build succeeds

**Expected Results:**
- Build completes successfully
- Warning logged for failed webmention fetch
- Posts render without webmentions
- No build failures

### 7.3 Page Load Performance

**Tool:** Chrome DevTools Lighthouse

**How to Test:**
1. Open DevTools
2. Go to Lighthouse tab
3. Run performance audit
4. Check scores

**Expected Results:**
- Performance score: ≥ 90
- No JavaScript errors
- Images lazy-load
- Webmention avatars optimized

---

## 8. Browser Compatibility

### 8.1 Desktop Browsers

**Test Matrix:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**For each browser:**
1. Navigate to post with webmentions
2. Verify layout correct
3. Test dark mode toggle
4. Check hover states
5. Test keyboard navigation

**Expected Results:**
- Consistent rendering across browsers
- All features functional
- No console errors

### 8.2 Mobile Browsers

**Test Matrix:**
- Mobile Safari (iOS)
- Mobile Chrome (Android)

**For each:**
1. Navigate to post with webmentions
2. Verify responsive layout
3. Test touch interactions
4. Check avatar sizing

**Expected Results:**
- Avatars don't overflow on small screens
- Reply content readable
- Tap targets ≥ 44x44px
- Dark mode toggle works

---

## 9. Responsive Design

### 9.1 Breakpoints

**Test at these widths:**
- Mobile: 375px, 414px
- Tablet: 768px, 834px
- Desktop: 1024px, 1440px, 1920px

**How to Test:**
1. Open DevTools responsive mode
2. Set viewport to each width
3. Navigate to post with webmentions
4. Verify layout

**Expected Results:**
- Mobile: Single column, stacked avatars
- Tablet: 2-column grid for avatars
- Desktop: Multi-column grid, appropriate spacing
- No horizontal scroll at any width

---

## 10. Security & Privacy

### 10.1 External Links

**How to Test:**
1. Inspect webmention links
2. Verify attributes

**Expected Results:**
- All external links have `rel="noopener noreferrer"`
- No inline JavaScript
- No eval() or innerHTML

### 10.2 Content Sanitization

**How to Test:**
1. Send test webmention with HTML/script in content
2. Rebuild site
3. Check rendered output

**Expected Results:**
- HTML tags stripped or escaped
- No executable JavaScript
- Safe rendering only

---

## 11. Edge Cases

### 11.1 Very Long Content

**Test Scenarios:**
- Author name > 100 characters
- Reply content > 1000 words
- Very long URLs

**Expected Results:**
- Text truncates gracefully
- No layout breaks
- Ellipsis or "Read more" where appropriate

### 11.2 Missing Data

**Test Scenarios:**
- Webmention without author photo
- Webmention without author name
- Webmention without published date

**Expected Results:**
- Fallback avatar (initials)
- Default name ("Anonymous")
- Date shown as "unknown" or hidden

### 11.3 Malformed Data

**Test Scenarios:**
- Invalid datetime format
- Broken image URLs
- Invalid webmention URL

**Expected Results:**
- Graceful degradation
- No JavaScript errors
- Component renders without failed items

---

## 12. Final Checklist

Before considering testing complete, verify:

- [ ] All microformats validate (h-card, h-entry, h-feed)
- [ ] Webmention endpoint discoverable on all pages
- [ ] Test webmention received successfully
- [ ] Webmentions display correctly by type
- [ ] Dark mode works for webmentions
- [ ] RSS and JSON feeds validate
- [ ] Syndication links display with correct classes
- [ ] Bridgy discovers syndication links
- [ ] Build succeeds with API failures
- [ ] No JavaScript console errors
- [ ] All browsers render correctly
- [ ] Responsive layouts work at all breakpoints
- [ ] Accessibility standards met (WCAG AA)
- [ ] External links have security attributes
- [ ] Performance score ≥ 90

---

## Testing Tools Reference

### Validators
- Microformats: https://indiewebify.me/
- h-card: https://indiewebify.me/validate-h-card/
- h-entry: https://indiewebify.me/validate-h-entry/
- Microformats parser: https://pin13.net/mf2/
- RSS: https://validator.w3.org/feed/
- JSON Feed: https://validator.jsonfeed.org/
- Webmention: https://webmention.rocks/

### Testing Services
- Send webmentions: https://telegraph.p3k.io/
- Webmention.io dashboard: https://webmention.io/settings
- Bridgy dashboard: https://brid.gy/

### Performance & Accessibility
- Lighthouse (Chrome DevTools)
- Contrast checker: https://webaim.org/resources/contrastchecker/
- WAVE: https://wave.webaim.org/

### Browser Testing
- BrowserStack (cross-browser)
- Real devices (recommended for mobile)

---

## Troubleshooting

If tests fail, see:
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) (if it exists)
- [WEBMENTIONS.md](./WEBMENTIONS.md) for technical details
- Check build logs for errors
- Verify Webmention.io API: `curl "https://webmention.io/api/mentions.jf2?domain=seanwooj.in"`

---

Last updated: November 2, 2025
