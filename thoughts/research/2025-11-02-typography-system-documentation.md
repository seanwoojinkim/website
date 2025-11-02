---
doc_type: research
date: 2025-11-02T03:47:40+00:00
title: "Typography System Documentation"
research_question: "What is the current typography system implementation in the portfolio site, including font families, type scales, hierarchy, spacing, and weaknesses?"
researcher: seanwoojinkim

git_commit: f601dbb0b0318e056cec5da5357a67d4f2868a69
branch: main
repository: workspace

created_by: seanwoojinkim
last_updated: 2025-11-02
last_updated_by: seanwoojinkim

tags:
  - typography
  - design-system
  - css
  - documentation
status: draft

related_docs: []
---

# Research: Typography System Documentation

**Date**: November 2, 2025 03:47 UTC
**Researcher**: seanwoojinkim
**Git Commit**: f601dbb0b0318e056cec5da5357a67d4f2868a69
**Branch**: main
**Repository**: workspace

## Research Question

What is the current typography system implementation in the portfolio site, including font families, type scales, hierarchy, spacing, and weaknesses?

## Summary

The portfolio site uses **Apercu** as its primary typeface across all weights (Light 300, Regular 400, Medium 500, Bold 700) with a minimalist, upscale aesthetic. The typography system has **13 distinct font sizes** ranging from 9px to 28px, **4 letter-spacing values**, and **3 line-height ratios**. However, the system shows inconsistencies: there's a **conflict between declared fonts** (Apercu in CSS vs. Inter/Playfair Display in HTML), font sizes don't follow a systematic scale, and spacing values appear arbitrary rather than grid-based.

## Detailed Findings

### 1. Font Family Usage

**Primary Typeface: Apercu (Geometric Grotesque)**

The site declares Apercu with four weights via `@font-face` rules:

- **Light (300)** - [style.css:7-13](file:///workspace/src/styles/style.css#L7-L13) - Used for body text, subtitles, descriptions
- **Regular (400)** - [style.css:15-21](file:///workspace/src/styles/style.css#L15-L21) - Default weight for body, navigation, buttons
- **Medium (500)** - [style.css:23-29](file:///workspace/src/styles/style.css#L23-L29) - Used for h1 headings
- **Bold (700)** - [style.css:31-37](file:///workspace/src/styles/style.css#L31-L37) - Available but not actively used in current CSS

**Font Stack Declaration:**

```css
font-family: 'Apercu', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
```
([style.css:62](file:///workspace/src/styles/style.css#L62))

**Critical Inconsistency Found:**

The BaseLayout component includes a conflicting Google Fonts declaration:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:wght@400;500&display=swap">
```
([BaseLayout.astro:40](file:///workspace/src/layouts/BaseLayout.astro#L40))

This loads **Inter** and **Playfair Display** fonts that are never referenced in the CSS, creating unnecessary HTTP requests and page weight.

### 2. Type Scale & Hierarchy

**Complete Font Size Inventory (13 sizes):**

| Size | Usage | Location |
|------|-------|----------|
| **28px** | h1 headings | [style.css:154](file:///workspace/src/styles/style.css#L154) |
| **20px** | h2 headings, card titles, writing titles | [style.css:218](file:///workspace/src/styles/style.css#L218), [style.css:315](file:///workspace/src/styles/style.css#L315), [style.css:363](file:///workspace/src/styles/style.css#L363) |
| **18px** | Logo/brand name | [style.css:104](file:///workspace/src/styles/style.css#L104) |
| **17px** | Article excerpt (italic) | [style.css:172](file:///workspace/src/styles/style.css#L172) |
| **15px** | Subtitle text, about page paragraphs | [style.css:162](file:///workspace/src/styles/style.css#L162), [style.css:375](file:///workspace/src/styles/style.css#L375) |
| **14px** | Base body text, writing excerpts, about lists | [style.css:79](file:///workspace/src/styles/style.css#L79), [style.css:333](file:///workspace/src/styles/style.css#L333), [style.css:395](file:///workspace/src/styles/style.css#L395) |
| **13px** | Card descriptions, contact values | [style.css:226](file:///workspace/src/styles/style.css#L226), [style.css:447](file:///workspace/src/styles/style.css#L447) |
| **12px** | Specs grid content | [style.css:478](file:///workspace/src/styles/style.css#L478) |
| **11px** | Navigation links, writing dates, inline links | [style.css:122](file:///workspace/src/styles/style.css#L122), [style.css:306](file:///workspace/src/styles/style.css#L306) |
| **10px** | Buttons, tags, card numbers, status, specs titles, footer | [style.css:208](file:///workspace/src/styles/style.css#L208), [style.css:246](file:///workspace/src/styles/style.css#L246), [style.css:280](file:///workspace/src/styles/style.css#L280), [style.css:347](file:///workspace/src/styles/style.css#L347), [style.css:466](file:///workspace/src/styles/style.css#L466), [style.css:496](file:///workspace/src/styles/style.css#L496) |
| **9px** | Contact labels | [style.css:439](file:///workspace/src/styles/style.css#L439) |

**Font Weight Distribution:**

- **300 (Light)** - Used for: subtitle (.subtitle), card descriptions (.card-desc), writing excerpts (.writing-excerpt), about page body text, list items ([style.css:163](file:///workspace/src/styles/style.css#L163), [style.css:227](file:///workspace/src/styles/style.css#L227), [style.css:334](file:///workspace/src/styles/style.css#L334), [style.css:376](file:///workspace/src/styles/style.css#L376), [style.css:396](file:///workspace/src/styles/style.css#L396), [style.css:487](file:///workspace/src/styles/style.css#L487))

- **400 (Regular)** - Used for: base body, logo, navigation, buttons, card titles, writing titles, h2 headings, card numbers, tags, dates, footer ([style.css:63](file:///workspace/src/styles/style.css#L63), [style.css:105](file:///workspace/src/styles/style.css#L105), [style.css:123](file:///workspace/src/styles/style.css#L123), [style.css:209](file:///workspace/src/styles/style.css#L209), [style.css:219](file:///workspace/src/styles/style.css#L219), [style.css:247](file:///workspace/src/styles/style.css#L247), [style.css:281](file:///workspace/src/styles/style.css#L281), [style.css:307](file:///workspace/src/styles/style.css#L307), [style.css:316](file:///workspace/src/styles/style.css#L316), [style.css:348](file:///workspace/src/styles/style.css#L348), [style.css:364](file:///workspace/src/styles/style.css#L364), [style.css:467](file:///workspace/src/styles/style.css#L467), [style.css:482](file:///workspace/src/styles/style.css#L482), [style.css:497](file:///workspace/src/styles/style.css#L497))

- **500 (Medium)** - Used for: h1 headings only ([style.css:155](file:///workspace/src/styles/style.css#L155))

- **700 (Bold)** - Loaded but not used in current implementation

**Line Heights (3 ratios):**

- **1.2** - h1 headings ([style.css:158](file:///workspace/src/styles/style.css#L158))
- **1.3** - Card titles, writing titles ([style.css:222](file:///workspace/src/styles/style.css#L222), [style.css:319](file:///workspace/src/styles/style.css#L319))
- **1.6** - Base body text ([style.css:80](file:///workspace/src/styles/style.css#L80))
- **1.7** - Subtitles, article excerpts, card descriptions, writing excerpts ([style.css:164](file:///workspace/src/styles/style.css#L164), [style.css:175](file:///workspace/src/styles/style.css#L175), [style.css:228](file:///workspace/src/styles/style.css#L228), [style.css:335](file:///workspace/src/styles/style.css#L335))
- **1.8** - About page paragraphs, list items ([style.css:377](file:///workspace/src/styles/style.css#L377), [style.css:397](file:///workspace/src/styles/style.css#L397))

**Letter Spacing (4 values):**

- **-0.02em** - h1 headings (tighter for larger sizes) ([style.css:156](file:///workspace/src/styles/style.css#L156))
- **-0.01em** - Logo, card titles, writing titles, h2 headings (slight tightening) ([style.css:106](file:///workspace/src/styles/style.css#L106), [style.css:221](file:///workspace/src/styles/style.css#L221), [style.css:318](file:///workspace/src/styles/style.css#L318), [style.css:367](file:///workspace/src/styles/style.css#L367))
- **0** - Subtitles, article excerpts (reset from base) ([style.css:167](file:///workspace/src/styles/style.css#L167), [style.css:178](file:///workspace/src/styles/style.css#L178))
- **0.1em** - Contact labels ([style.css:441](file:///workspace/src/styles/style.css#L441))
- **0.12em** - Tags ([style.css:350](file:///workspace/src/styles/style.css#L350))
- **0.15em** - Navigation links, buttons, card numbers, status, writing dates, specs title, footer (uppercase UI elements) ([style.css:125](file:///workspace/src/styles/style.css#L125), [style.css:211](file:///workspace/src/styles/style.css#L211), [style.css:249](file:///workspace/src/styles/style.css#L249), [style.css:283](file:///workspace/src/styles/style.css#L283), [style.css:309](file:///workspace/src/styles/style.css#L309), [style.css:469](file:///workspace/src/styles/style.css#L469), [style.css:499](file:///workspace/src/styles/style.css#L499))

### 3. Spacing & Layout

**Container & Section Spacing:**

- **Container max-width:** 1000px ([style.css:87](file:///workspace/src/styles/style.css#L87))
- **Container padding:** 60px (top/bottom), 40px (left/right) ([style.css:89](file:///workspace/src/styles/style.css#L89))
  - Mobile: 40px (top/bottom), 20px (left/right) ([style.css:520](file:///workspace/src/styles/style.css#L520))

**Content Max-Widths:**

- **About content:** 750px ([style.css:358](file:///workspace/src/styles/style.css#L358))
- **Subtitle/description:** 650px ([style.css:166](file:///workspace/src/styles/style.css#L166), [style.css:177](file:///workspace/src/styles/style.css#L177))
- **Card description:** 280px ([style.css:231](file:///workspace/src/styles/style.css#L231))

**Vertical Spacing Rhythm:**

Large vertical spacing (section breaks):
- **100px** - Footer margin-top ([style.css:493](file:///workspace/src/styles/style.css#L493))
- **80px** - Navigation margin-bottom, header margin-bottom, specs margin-top ([style.css:94](file:///workspace/src/styles/style.css#L94), [style.css:149](file:///workspace/src/styles/style.css#L149), [style.css:460](file:///workspace/src/styles/style.css#L460))
- **60px** - About h2 margin-top ([style.css:366](file:///workspace/src/styles/style.css#L366))
- **50px** - Specs padding-top ([style.css:461](file:///workspace/src/styles/style.css#L461))

Medium vertical spacing:
- **40px** - Card padding, contact methods margin-top, writing item padding, writing list spacing ([style.css:196](file:///workspace/src/styles/style.css#L196), [style.css:294](file:///workspace/src/styles/style.css#L294), [style.css:421](file:///workspace/src/styles/style.css#L421), [style.css:597](file:///workspace/src/styles/style.css#L597))
- **30px** - Footer padding-top ([style.css:494](file:///workspace/src/styles/style.css#L494))
- **28px** - Card description margin-bottom, specs title margin-bottom ([style.css:230](file:///workspace/src/styles/style.css#L230), [style.css:471](file:///workspace/src/styles/style.css#L471))
- **24px** - Navigation padding-bottom, card number margin-bottom ([style.css:95](file:///workspace/src/styles/style.css#L95), [style.css:213](file:///workspace/src/styles/style.css#L213))
  - Mobile card padding: 24px ([style.css:532](file:///workspace/src/styles/style.css#L532))

Small vertical spacing:
- **20px** - h1 margin-bottom, h2 margin-bottom, about p margin-bottom, about ul margin-bottom, contact item padding ([style.css:157](file:///workspace/src/styles/style.css#L157), [style.css:365](file:///workspace/src/styles/style.css#L365), [style.css:379](file:///workspace/src/styles/style.css#L379), [style.css:399](file:///workspace/src/styles/style.css#L399), [style.css:428](file:///workspace/src/styles/style.css#L428))
- **16px** - Card title margin-bottom, writing excerpt margin-bottom ([style.css:220](file:///workspace/src/styles/style.css#L220), [style.css:337](file:///workspace/src/styles/style.css#L337))
- **12px** - Writing h3 margin-bottom, button padding, specs grid gap, footer gap ([style.css:244](file:///workspace/src/styles/style.css#L244), [style.css:317](file:///workspace/src/styles/style.css#L317), [style.css:477](file:///workspace/src/styles/style.css#L477), [style.css:547](file:///workspace/src/styles/style.css#L547))
- **10px** - Button group gap, tag gap, list item margin-bottom ([style.css:238](file:///workspace/src/styles/style.css#L238), [style.css:342](file:///workspace/src/styles/style.css#L342), [style.css:403](file:///workspace/src/styles/style.css#L403))
- **8px** - Contact label margin-bottom ([style.css:443](file:///workspace/src/styles/style.css#L443))

**Horizontal Spacing & Gaps:**

- **60px** - Writing item grid gap ([style.css:297](file:///workspace/src/styles/style.css#L297))
- **40px** - Navigation links gap ([style.css:118](file:///workspace/src/styles/style.css#L118))
  - Mobile: 20px ([style.css:524](file:///workspace/src/styles/style.css#L524))
- **30px** - Specs grid column gap ([style.css:477](file:///workspace/src/styles/style.css#L477))
- **20px** - Footer link gap, button padding ([style.css:244](file:///workspace/src/styles/style.css#L244))
- **12px** - Tag padding, writing item mobile gap ([style.css:352](file:///workspace/src/styles/style.css#L352), [style.css:537](file:///workspace/src/styles/style.css#L537))
- **6px** - Tag vertical padding ([style.css:352](file:///workspace/src/styles/style.css#L352))

**Grid Gaps:**

- **2px** - Main project grid gap, contact methods gap ([style.css:186](file:///workspace/src/styles/style.css#L186), [style.css:418](file:///workspace/src/styles/file.css#L418)) - Creates minimal hairline separation

### 4. Grid System Analysis

**Is there an underlying grid?**

**No systematic grid found.** The spacing system uses **arbitrary values** rather than a consistent mathematical scale.

**Evidence:**

The spacing values used across the site:
- Large: 100px, 80px, 60px, 50px, 40px
- Medium: 30px, 28px, 24px, 20px
- Small: 16px, 12px, 10px, 8px, 6px, 2px

These don't follow common design system patterns like:
- **4px base grid** (would be: 4, 8, 12, 16, 20, 24, 28, 32, 36, 40...)
- **8px base grid** (would be: 8, 16, 24, 32, 40, 48, 56, 64...)
- **Modular scale** (would use mathematical ratios like 1.25, 1.5, 1.618)
- **T-shirt sizes** (xs, sm, md, lg, xl mapped to scale)

**Closest patterns identified:**

Some groupings suggest attempted systematization:
- Multiples of 10: 10px, 20px, 30px, 40px, 60px, 80px, 100px
- Multiples of 4: 8px, 12px, 16px, 20px, 24px, 28px, 40px
- But these overlap and show no clear hierarchy

**Impact on consistency:**

Without a systematic grid:
- Spacing decisions appear ad-hoc
- Difficult to maintain consistency when adding new components
- No clear rationale for choosing one value over another
- Harder to create predictable visual rhythm

### 5. Current Weaknesses

**Font Loading Inconsistency:**

1. **Unused Google Fonts** - BaseLayout.astro loads Inter and Playfair Display ([BaseLayout.astro:40](file:///workspace/src/layouts/BaseLayout.astro#L40)) that are never used in CSS, creating unnecessary page weight and HTTP requests

2. **Missing fallback verification** - If Apercu fonts fail to load, the fallback stack uses system fonts, but there's no verification that these provide acceptable rendering

**Type Scale Inconsistencies:**

1. **No systematic scale** - The 13 font sizes (9px, 10px, 11px, 12px, 13px, 14px, 15px, 17px, 18px, 20px, 28px) don't follow a mathematical progression (not modular scale, not linear)

2. **Arbitrary size choices:**
   - Why 17px for article excerpts but 15px for subtitles?
   - Why 13px for card descriptions but 14px for writing excerpts?
   - Why jump from 20px to 28px for h1 (8px gap) when other gaps are 1-2px?

3. **Underutilized weight range** - Bold (700) is loaded but never used, while Medium (500) is only used for h1. Most of the site relies on Regular (400) for all headings except h1.

**Hierarchy Issues:**

1. **Weak heading differentiation:**
   - h1: 28px, weight 500, -0.02em tracking
   - h2: 20px, weight 400, -0.01em tracking
   - Only 8px size difference and 1 weight step creates weak hierarchy

2. **Inconsistent secondary text styling:**
   - Subtitles use weight 300, color #666
   - Article excerpts use weight 400 + italic, color #666
   - Writing excerpts use weight 300, color #666
   - No clear system for when to use weight vs. italic vs. color

3. **UI text lacks clear tiering:**
   - Navigation: 11px, uppercase, 0.15em
   - Buttons: 10px, uppercase, 0.15em
   - Tags: 10px, uppercase, 0.12em
   - Footer: 10px, uppercase, 0.15em
   - Contact labels: 9px, uppercase, 0.1em
   - These cluster around 9-11px with inconsistent letter-spacing

**Spacing System Weaknesses:**

1. **No base unit** - Spacing values are arbitrary (2px, 6px, 8px, 10px, 12px, 16px, 20px, 24px, 28px, 30px, 40px, 50px, 60px, 80px, 100px) with no clear mathematical relationship

2. **Difficult to extend** - Adding new components requires arbitrary spacing choices without system guidance

3. **Inconsistent vertical rhythm:**
   - Section spacing varies: 60px, 80px, 100px
   - Component spacing varies: 20px, 24px, 28px, 30px, 40px
   - No clear tier system (e.g., spacing-xs, spacing-sm, spacing-md, spacing-lg)

4. **Magic numbers:**
   - Why 28px for card description margin but 30px for footer padding?
   - Why 50px for specs padding-top but 60px for container padding?
   - Decisions appear based on visual tuning rather than system

**Readability Concerns:**

1. **Small base font size** - 14px body text ([style.css:79](file:///workspace/src/styles/style.css#L79)) is below recommended 16px for body copy, potentially impacting readability

2. **Tight negative tracking on large text** - h1 uses -0.02em letter-spacing ([style.css:156](file:///workspace/src/styles/style.css#L156)), which can reduce legibility at 28px

3. **Uppercase UI elements** - Extensive use of uppercase with positive letter-spacing (0.15em) for navigation, buttons, labels creates visual noise and reduces scanability

4. **Color contrast** - Body text uses #666 gray ([style.css:165](file:///workspace/src/styles/style.css#L165)) on light gradient backgrounds, may not meet WCAG AA standards

**Font Performance:**

1. **4 font weights loaded** - Every page loads Light, Regular, Medium, and Bold ([style.css:7-37](file:///workspace/src/styles/style.css#L7-L37)), but Bold is never used, wasting ~25KB

2. **No font subsetting** - Apercu fonts load full character sets when only Latin is used

3. **WOFF2 only** - No WOFF fallback for older browsers ([style.css:9](file:///workspace/src/styles/style.css#L9))

## Code References

**Primary Typography CSS:** `src/styles/style.css` ([full file](file:///workspace/src/styles/style.css))

Key sections:
- Font face declarations: [lines 6-37](file:///workspace/src/styles/style.css#L6-L37)
- Base body styles: [lines 60-84](file:///workspace/src/styles/style.css#L60-L84)
- Heading styles: [lines 152-168](file:///workspace/src/styles/style.css#L152-L168), [lines 361-372](file:///workspace/src/styles/style.css#L361-L372)
- Navigation typography: [lines 102-114](file:///workspace/src/styles/style.css#L102-L114), [lines 121-135](file:///workspace/src/styles/style.css#L121-L135)
- Card typography: [lines 207-232](file:///workspace/src/styles/style.css#L207-L232)
- Writing typography: [lines 305-354](file:///workspace/src/styles/style.css#L305-L354)
- About page typography: [lines 361-413](file:///workspace/src/styles/style.css#L361-L413)
- Button typography: [lines 241-273](file:///workspace/src/styles/style.css#L241-L273)

**Layout Files:**
- `src/layouts/BaseLayout.astro` - [Font loading conflict (line 40)](file:///workspace/src/layouts/BaseLayout.astro#L40)

**Component Typography:**
- `src/components/ProjectCard.astro` - Uses card-related type classes
- `src/components/WritingItem.astro` - Uses writing-related type classes

**Content Examples:**
- `src/content/pages/about.md` - Markdown rendered with about-content styles
- `src/content/writing/2024-07-21-design-is-more-than.md` - Full article showing all type hierarchy

## Architecture Documentation

**Typography System Pattern:**

The current implementation uses a **global CSS class-based system** where:

1. Typography styles are defined in a single global stylesheet (`style.css`)
2. Each component/section has specific class names (e.g., `.card-title`, `.writing-excerpt`, `.subtitle`)
3. No CSS variables or design tokens for reusability
4. No preprocessor variables (no Sass/Less)
5. No utility classes (not using Tailwind or similar)
6. Responsive behavior via media queries at 768px breakpoint

**Font Loading Strategy:**

- Custom fonts loaded via `@font-face` with `font-display: swap` ([style.css:12](file:///workspace/src/styles/style.css#L12))
- Font files served from `/fonts/apercu/` directory
- WOFF2 format only
- System font fallback stack defined globally

**Styling Methodology:**

- **BEM-adjacent naming** - Classes follow patterns like `.card-title`, `.writing-item`, `.nav-links`
- **Component-scoped classes** - Each component has dedicated classes rather than shared utility classes
- **Direct element styling** - Some elements (h1, h2, footer, nav) styled directly rather than via classes

**Current Rendering Flow:**

1. BaseLayout loads global `style.css` ([BaseLayout.astro:2](file:///workspace/src/layouts/BaseLayout.astro#L2))
2. Apercu font faces declared at top of stylesheet
3. Base styles set on `body` element
4. Component styles cascade from global definitions
5. No scoped or component-level CSS

## Open Questions

1. **What is the intended primary font?** There's a conflict between Apercu (used in CSS) and Inter/Playfair Display (loaded in HTML). Should the Google Fonts link be removed?

2. **Why is Bold (700) weight loaded but never used?** Should it be removed to improve performance, or are there plans to use it?

3. **What scale should the typography follow?** Should the site adopt a modular scale (e.g., 1.25 ratio) or switch to a more systematic approach like 4px/8px increments?

4. **Should the base font size be increased?** 14px is small for body text. Industry standard is 16px. What's the rationale for 14px?

5. **Is there a design system document?** The CSS suggests an intended minimalist aesthetic, but there's no documented grid or spacing system. Does one exist elsewhere?

6. **What is the WCAG conformance target?** Some text colors (#666) on gradient backgrounds may not meet AA standards. Is this intentional or should it be audited?

7. **Are there plans for dark mode?** The current system uses absolute colors rather than semantic variables, which would make theming difficult.

8. **Should spacing adopt a token system?** Would it be valuable to migrate to CSS custom properties for spacing/typography to enable easier consistency and theming?
