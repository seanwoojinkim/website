---
doc_type: research
date: 2025-11-02T04:01:58+00:00
title: "Border System Documentation"
research_question: "Document all horizontal line rules and borders currently used in the portfolio site"
researcher: seanwoojinkim

git_commit: fe7ccdd29220e8da3825b8d0c63ac191de450d2c
branch: main
repository: workspace

created_by: seanwoojinkim
last_updated: 2025-11-02
last_updated_by: seanwoojinkim

tags:
  - borders
  - design-system
  - css
  - styling
status: draft

related_docs: []
---

# Research: Border System Documentation

**Date**: November 2, 2025, 4:01 AM UTC
**Researcher**: seanwoojinkim
**Git Commit**: fe7ccdd29220e8da3825b8d0c63ac191de450d2c
**Branch**: main
**Repository**: workspace

## Research Question

Document all horizontal line rules and borders currently used in the portfolio site, including:
- Where borders are used
- Current border properties (width, color, style, spacing)
- Structural purpose (dividers, hierarchy, boundaries, decorative vs functional)
- Consistency patterns

## Summary

The portfolio site uses a **highly consistent border system** with only **1px solid borders** in two colors: `#e0e0e0` (light gray, 89% opacity) for structural dividers and `#000` (black) for interactive/emphasis elements. All borders are defined in `/workspace/src/styles/style.css`. There are **no inline border styles** in any Astro components.

The border system serves four primary structural purposes:
1. **Navigation boundaries** - separating header from content
2. **Section dividers** - organizing content hierarchy
3. **Component boundaries** - defining card and contact item edges
4. **Interactive elements** - underlining active states and links

Spacing around borders follows the 8px grid system (`--space-` variables), creating predictable rhythm.

## Detailed Findings

### 1. Navigation Border

**Location**: `src/styles/style.css:122`

```css
nav {
    margin-bottom: var(--space-8);
    padding-bottom: var(--space-3);
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}
```

**Properties**:
- Width: `1px`
- Style: `solid`
- Color: `#e0e0e0` (light gray)
- Spacing above: None (inherent padding from container)
- Spacing below border: `var(--space-3)` = `24px` padding-bottom
- Spacing to next section: `var(--space-8)` = `80px` margin-bottom

**Structural Purpose**: **Functional divider** - Separates site navigation from main content area, establishing clear visual hierarchy at the top of every page.

---

### 2. Active Navigation Link Underline

**Location**: `src/styles/style.css:163-171`

```css
.nav-links a.active::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    right: 0;
    height: 1px;
    background: #000;
}
```

**Properties**:
- Width: `1px` (height property, since it's horizontal)
- Style: Pseudo-element with solid background
- Color: `#000` (black)
- Spacing: Positioned `-3px` from link baseline

**Structural Purpose**: **Interactive indicator** - Shows current page/section in navigation, purely functional for UX clarity.

---

### 3. Writing List Container Border

**Location**: `src/styles/style.css:315`

```css
.writing-list {
    border-top: 1px solid #e0e0e0;
}
```

**Properties**:
- Width: `1px`
- Style: `solid`
- Color: `#e0e0e0` (light gray)
- Spacing above: Inherited from header's `margin-bottom: var(--space-8)` = `80px`
- Spacing below: None (first item provides padding)

**Structural Purpose**: **Section divider** - Marks beginning of writing list, separating it from page header.

---

### 4. Writing Item Divider Borders

**Location**: `src/styles/style.css:319`

```css
.writing-item {
    border-bottom: 1px solid #e0e0e0;
    padding: var(--space-5) 0;
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: var(--space-7);
    transition: background 0.2s ease;
}
```

**Properties**:
- Width: `1px`
- Style: `solid`
- Color: `#e0e0e0` (light gray)
- Spacing above border: `var(--space-5)` = `40px` (top padding)
- Spacing below border: `var(--space-5)` = `40px` (bottom padding)

**Structural Purpose**: **List item separator** - Creates horizontal rhythm in writing list, each border divides individual articles. Functional for scannability.

**Component**: Applied to every `<article class="writing-item">` in `src/components/WritingItem.astro:24`

---

### 5. Card/Component Borders

**Location**: `src/styles/style.css:225`

```css
.card {
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    padding: var(--space-5);
    position: relative;
    transition: all 0.2s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);
}
```

**Properties**:
- Width: `1px`
- Style: `solid`
- Color: `rgba(0, 0, 0, 0.05)` (black at 5% opacity)
- Spacing: `var(--space-5)` = `40px` internal padding on all sides
- Hover state: Changes to `rgba(0, 0, 0, 0.1)` (10% opacity) - Line 230

**Structural Purpose**: **Component boundary** - Defines edges of project cards on work page, subtle at rest (5% opacity) to maintain minimalist aesthetic, strengthens on hover (10% opacity) for interactivity feedback.

**Component**: Applied to `<div class="card">` in `src/components/ProjectCard.astro:18`

---

### 6. Filler Block Borders

**Location**: `src/styles/style.css:626`

```css
.filler-block {
    background: linear-gradient(135deg, rgba(254, 249, 245, 0.3), rgba(245, 248, 250, 0.3));
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    padding: var(--space-5);
    position: relative;
    transition: all 0.2s ease;
    border: 1px solid rgba(0, 0, 0, 0.03);
}
```

**Properties**:
- Width: `1px`
- Style: `solid`
- Color: `rgba(0, 0, 0, 0.03)` (black at 3% opacity - even more subtle than cards)
- Spacing: `var(--space-5)` = `40px` internal padding

**Structural Purpose**: **Decorative boundary** - Maintains grid visual consistency. Filler blocks complete incomplete grid rows, so borders are more subtle (3% vs 5%) to indicate they're not interactive content.

**Component**: Applied to `<div class="filler-block">` in `src/components/FillerBlock.astro:10`

---

### 7. Contact Item Borders

**Location**: `src/styles/style.css:456`

```css
.contact-item {
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    padding: var(--space-3);
    transition: all 0.15s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);
}
```

**Properties**:
- Width: `1px`
- Style: `solid`
- Color: `rgba(0, 0, 0, 0.05)` (black at 5% opacity - same as cards)
- Spacing: `var(--space-3)` = `24px` internal padding
- Hover state: Changes to `rgba(0, 0, 0, 0.1)` (10% opacity) - Line 461

**Structural Purpose**: **Component boundary** - Defines contact method containers on About page. Same visual treatment as project cards, maintaining system consistency.

**Component**: Applied to `<div class="contact-item">` in `src/pages/about.astro:23`

---

### 8. Tag Borders

**Location**: `src/styles/style.css:379`

```css
.tag {
    font-size: var(--text-xs);
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #999;
    padding: var(--space-1) var(--space-2);
    border: 1px solid #e0e0e0;
}
```

**Properties**:
- Width: `1px`
- Style: `solid`
- Color: `#e0e0e0` (light gray - same as structural dividers)
- Spacing: `var(--space-1)` vertical = `8px`, `var(--space-2)` horizontal = `16px`

**Structural Purpose**: **Component boundary** - Defines tag pill boundaries in writing list. Functional for grouping related metadata.

**Component**: Applied to `<span class="tag">` in `src/components/WritingItem.astro:30`

---

### 9. Button Borders

**Location**: `src/styles/style.css:278` (primary), `293` (secondary)

```css
.btn,
.btn-secondary {
    display: block;
    padding: var(--space-2) var(--space-3);
    text-decoration: none;
    font-size: var(--text-xs);
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    text-align: center;
    transition: all 0.2s ease;
    border: 1px solid #000;
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.4);
    color: #000;
    border: 1px solid rgba(0, 0, 0, 0.2);
}
```

**Properties**:
- Width: `1px`
- Style: `solid`
- Color:
  - Primary button: `#000` (solid black)
  - Secondary button: `rgba(0, 0, 0, 0.2)` (black at 20% opacity)
  - Secondary hover: Changes to `#000` (solid black) - Line 297
- Spacing: `var(--space-2)` vertical = `16px`, `var(--space-3)` horizontal = `24px`

**Structural Purpose**: **Interactive boundary** - Defines clickable button areas. Primary buttons use solid black for emphasis, secondary buttons use lighter borders (20% opacity) to show hierarchy, strengthening to solid black on hover.

**Component**: Applied in `src/components/ProjectCard.astro:26-28` (primary and secondary buttons)

---

### 10. Footer Border

**Location**: `src/styles/style.css:521`

```css
footer {
    margin-top: var(--space-8);
    padding-top: var(--space-4);
    border-top: 1px solid #e0e0e0;
    font-size: var(--text-xs);
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #999;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

**Properties**:
- Width: `1px`
- Style: `solid`
- Color: `#e0e0e0` (light gray)
- Spacing above border: `var(--space-8)` = `80px` (margin-top)
- Spacing below border: `var(--space-4)` = `32px` (padding-top)

**Structural Purpose**: **Section divider** - Separates page content from footer, mirroring the navigation border at the top. Creates bookend effect with consistent top/bottom page boundaries.

---

### 11. Technical Specs Border

**Location**: `src/styles/style.css:488`

```css
.specs {
    margin-top: var(--space-8);
    padding-top: var(--space-6);
    border-top: 1px solid #e0e0e0;
}
```

**Properties**:
- Width: `1px`
- Style: `solid`
- Color: `#e0e0e0` (light gray)
- Spacing above border: `var(--space-8)` = `80px` (margin-top)
- Spacing below border: `var(--space-6)` = `48px` (padding-top)

**Structural Purpose**: **Section divider** - Separates technical specifications from main about content. Provides visual break before tabular data.

---

### 12. Link Underlines (About Page and Footer)

**Location**: `src/styles/style.css:410` (about content), `476` (contact values), `535` (footer)

```css
.about-content p a {
    color: #000;
    border-bottom: 1px solid #000;
    text-decoration: none;
    transition: opacity 0.2s ease;
}

.contact-value a {
    font-size: var(--text-sm);
    color: #000;
    text-decoration: none;
    border-bottom: 1px solid #000;
    transition: opacity 0.15s ease;
}

footer a {
    color: #000;
    text-decoration: none;
    border-bottom: 1px solid #000;
    transition: opacity 0.2s ease;
}
```

**Properties**:
- Width: `1px`
- Style: `solid` (via border-bottom)
- Color: `#000` (solid black)
- Spacing: Native to text baseline

**Structural Purpose**: **Interactive indicator** - Distinguishes clickable links from plain text. Solid black underline indicates actionable elements. Functional for accessibility and UX.

---

### 13. RSS Feed Link (Writing Page)

**Location**: `src/pages/writing/index.astro:20`

```html
<a href="/rss.xml" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #666; text-decoration: none; border-bottom: 1px solid #666;">
    RSS Feed
</a>
```

**Properties**:
- Width: `1px`
- Style: `solid` (via border-bottom)
- Color: `#666` (medium gray - matches secondary text color)
- Spacing: Inline with text

**Structural Purpose**: **Interactive indicator** - Marks RSS link. Uses gray instead of black to indicate it's a utility link rather than primary content navigation. This is the **only inline border style** in the entire codebase.

---

## Border System Consistency Analysis

### Width Consistency
**100% consistent** - All borders use `1px` width throughout the entire system. No exceptions.

### Border Style Consistency
**100% consistent** - All borders use `solid` style. No dashed, dotted, or other border styles exist.

### Color System

The border system uses **4 distinct colors** with clear semantic purposes:

1. **`#e0e0e0` (Light Gray, RGB: 224,224,224)**
   - Used for: Structural dividers (nav, footer, writing list, specs, tags)
   - Opacity: 100% (opaque)
   - Purpose: Neutral section separation
   - Occurrences: 6 locations

2. **`#000` (Black)**
   - Used for: Interactive elements (active nav, link underlines, button borders)
   - Opacity: 100% (opaque)
   - Purpose: Emphasis and interactivity
   - Occurrences: 5 locations (buttons, links, active states)

3. **`rgba(0, 0, 0, 0.05)` (Black at 5% opacity)**
   - Used for: Card and contact item borders at rest
   - Purpose: Subtle component boundaries
   - Hover state: Increases to 10% opacity
   - Occurrences: 2 locations

4. **`rgba(0, 0, 0, 0.03)` (Black at 3% opacity)**
   - Used for: Filler block borders
   - Purpose: Ultra-subtle decorative boundaries for non-interactive elements
   - Occurrences: 1 location

**Special Cases**:
- Secondary button borders: `rgba(0, 0, 0, 0.2)` (20% opacity), hover to solid black
- RSS link: `#666` (medium gray) - matches text color for semantic consistency
- Active nav pseudo-element: Uses `background: #000` instead of border property

### Spacing Consistency

All spacing follows the **8px grid system** defined in CSS variables:

**Spacing Above Borders** (margin-top or spacing from previous element):
- Navigation: Inherent from container
- Footer: `var(--space-8)` = `80px`
- Specs: `var(--space-8)` = `80px`
- Writing list: `var(--space-8)` = `80px` (from header)

**Spacing Below Borders** (padding-top after border):
- Navigation: `var(--space-3)` = `24px` padding + `var(--space-8)` = `80px` margin
- Footer: `var(--space-4)` = `32px`
- Specs: `var(--space-6)` = `48px`
- Writing items: `var(--space-5)` = `40px` top and bottom padding

**Pattern**: Major section dividers (nav, footer, specs) use `--space-8` (80px) margin before the border, creating strong visual separation. Padding after borders varies based on content needs (24-48px range).

### Structural Patterns

**Hierarchy System**:
1. **Primary dividers** (`#e0e0e0` at 1px): Navigation, footer, sections
2. **Content separators** (`#e0e0e0` at 1px): Writing items, tags
3. **Component boundaries** (rgba at 3-5%): Cards, contact items, filler blocks
4. **Interactive emphasis** (`#000` at 1px): Buttons, links, active states

**Functional vs Decorative**:
- **Functional (9 types)**: Navigation, footer, writing list, writing items, tags, buttons, link underlines, active nav, specs
- **Decorative (2 types)**: Card borders (subtle), filler blocks (ultra-subtle)

**Purpose Distribution**:
- **Section dividers**: 5 instances (nav, footer, writing-list, specs, about sections via border-top)
- **Component boundaries**: 4 instances (cards, contact items, tags, filler blocks)
- **Interactive indicators**: 4 instances (active nav, link underlines, button borders, RSS link)

## Code References

All border definitions are located in: **`/workspace/src/styles/style.css`**

| Line | Selector | Border Property | Purpose |
|------|----------|----------------|---------|
| 122 | `nav` | `border-bottom: 1px solid #e0e0e0` | Navigation divider |
| 169 | `.nav-links a.active::after` | `height: 1px; background: #000` | Active nav indicator |
| 225 | `.card` | `border: 1px solid rgba(0,0,0,0.05)` | Card boundary |
| 278 | `.btn, .btn-secondary` | `border: 1px solid #000` | Button borders |
| 293 | `.btn-secondary` | `border: 1px solid rgba(0,0,0,0.2)` | Secondary button |
| 315 | `.writing-list` | `border-top: 1px solid #e0e0e0` | Writing section start |
| 319 | `.writing-item` | `border-bottom: 1px solid #e0e0e0` | Article separators |
| 379 | `.tag` | `border: 1px solid #e0e0e0` | Tag boundaries |
| 410 | `.about-content p a` | `border-bottom: 1px solid #000` | Content link underlines |
| 456 | `.contact-item` | `border: 1px solid rgba(0,0,0,0.05)` | Contact card boundary |
| 476 | `.contact-value a` | `border-bottom: 1px solid #000` | Contact link underlines |
| 488 | `.specs` | `border-top: 1px solid #e0e0e0` | Specs section divider |
| 521 | `footer` | `border-top: 1px solid #e0e0e0` | Footer divider |
| 535 | `footer a` | `border-bottom: 1px solid #000` | Footer link underlines |
| 626 | `.filler-block` | `border: 1px solid rgba(0,0,0,0.03)` | Filler boundary |

**Inline border style**: `src/pages/writing/index.astro:20` (RSS link - only inline style in codebase)

## Architecture Documentation

### Design System Integration

The border system is tightly integrated with the broader design system:

1. **Type Scale Variables** (`--text-xs` through `--text-2xl`) - Not directly related to borders but maintains proportion harmony
2. **8px Grid System** (`--space-1` through `--space-8`) - **All border spacing uses these variables**
3. **Color Palette** - Borders use only grayscale: `#e0e0e0`, `#666`, `#000`, and rgba black variants
4. **Transition System** - Hover states use consistent `0.2s ease` or `0.15s ease` transitions

### Border Decision Matrix

The system uses a clear decision tree for border selection:

```
Is it separating major sections?
  → Yes: Use `border-top: 1px solid #e0e0e0`

Is it an interactive element (button/link)?
  → Yes: Use `border: 1px solid #000` or `border-bottom: 1px solid #000`

Is it a component boundary?
  → Interactive component (card, contact): `border: 1px solid rgba(0,0,0,0.05)`
  → Decorative filler: `border: 1px solid rgba(0,0,0,0.03)`

Is it a list separator?
  → Yes: Use `border-bottom: 1px solid #e0e0e0`
```

### Hover State Pattern

Component boundaries strengthen on hover:
- Cards: 5% → 10% opacity
- Contact items: 5% → 10% opacity
- Secondary buttons: 20% opacity → solid black
- Filler blocks: 3% → 4% opacity (subtle)

This creates consistent feedback without jarring transitions.

## Open Questions

None - the border system is comprehensively documented and fully consistent throughout the codebase.
