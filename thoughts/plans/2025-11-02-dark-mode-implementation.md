---
doc_type: plan
date: 2025-11-02T05:38:10+00:00
title: "Dark Mode Implementation"
feature: "Dark Mode Toggle with Theme Persistence"

# Update phase status as implementation progresses
phases:
  - name: "Phase 1: CSS Variables & Theme System Foundation"
    status: completed
  - name: "Phase 2: Theme Toggle Component & Logic"
    status: completed
  - name: "Phase 3: Dark Mode Styles & Color Refinement"
    status: pending
  - name: "Phase 4: Theme Persistence & Flash Prevention"
    status: pending
  - name: "Phase 5: Testing & Polish"
    status: pending

git_commit: 5d5b30dcba163737124cc7345baa51e59bff8987
branch: main
repository: portfolio

created_by: seanwoojinkim
last_updated: 2025-11-02
last_updated_by: claude-code
last_updated_note: "Phase 2 completed - ThemeToggle component implemented with localStorage persistence and ARIA support"

tags:
  - dark-mode
  - theme
  - css-variables
  - localStorage
  - ui
status: draft

related_docs: []
---

# Dark Mode Implementation Plan

## Overview

### Problem Statement
The portfolio website currently only supports a light mode aesthetic with an animated pastel gradient background. Users who prefer dark interfaces or browse in low-light conditions lack a dark mode option. Additionally, there's growing expectation for modern websites to offer theme preference support.

### Proposed Solution
Implement a comprehensive dark mode system that:
- Preserves the Swiss minimalist design aesthetic in both themes
- Uses CSS custom properties (variables) for seamless theme switching
- Provides a sun/moon toggle icon inline with navigation links
- Maintains animated gradient background in dark moody colors
- Keeps the koi background visible and pleasant in dark mode
- Persists user preference in localStorage
- Prevents flash of unstyled content (FOUC) on page load
- Implements smooth 0.5s transitions between themes
- Works seamlessly with Astro's View Transitions

### Success Criteria
1. Dark mode activates via sun/moon toggle in navigation
2. User preference persists across sessions via localStorage
3. No page flash on load - correct theme shows immediately
4. All transitions between themes complete in 0.5s
5. Dark mode gradient is dark and moody while remaining animated
6. Koi background remains visible with adjusted opacity if needed
7. All text maintains WCAG AA contrast standards (4.5:1 minimum)
8. Glassmorphic cards adapt properly to dark background
9. Toggle works correctly with Astro View Transitions
10. All interactive elements (buttons, links, cards) adapt to dark theme

---

## Current State Analysis

### Existing Structure

**CSS Architecture** (`/Users/seankim/dev/portfolio/src/styles/style.css`):
- 695 lines of CSS with hardcoded color values
- Design system variables for typography and spacing (lines 40-69)
- Animated gradient background (lines 79-108)
- Glassmorphic cards with backdrop-filter (lines 223-236)
- Border system with opacity-based colors (lines 64-68)
- Accent colors for card hover states (lines 592-626)

**Key Color Values to Theme**:
- Background gradient: `#fffcf8, #fef5ed, #f5f9fb, #faf5f8, #f5fbf9` (lines 98-105)
- Text colors: `#000` (primary), `#666` (secondary), `#999` (tertiary)
- Card background: `rgba(255, 255, 255, 0.5)` (line 224)
- Card hover: `rgba(255, 255, 255, 0.65)` (line 234)
- Border colors: `rgba(0, 0, 0, 0.1)`, `rgba(0, 0, 0, 0.05)` (lines 65-67)
- Button background: `#000` with white text (line 287)
- Secondary button: `rgba(255, 255, 255, 0.4)` (line 296)

**Layout Structure** (`/Users/seankim/dev/portfolio/src/layouts/BaseLayout.astro`):
- Navigation at lines 46-53
- Nav links container at line 48-52: `<div class="nav-links">`
- Currently: Work, Writing, About links
- KoiBackground component at line 43 with fixed opacity 0.6 (line 220 in component)

**Koi Background** (`/Users/seankim/dev/portfolio/src/components/KoiBackground.astro`):
- p5.js canvas at fixed position, z-index: -1 (lines 212-221)
- Opacity: 0.6 (line 220)
- Renders koi with brush textures and colors
- Background clear with `background(255, 255, 255, 10)` (line 143)

**Astro Configuration** (`/Users/seankim/dev/portfolio/astro.config.mjs`):
- View Transitions enabled (line 22 in BaseLayout.astro)
- Static site generation mode

### Design Patterns in Use
- Swiss minimalist aesthetic with precision
- 8px grid system for spacing consistency
- Modular type scale (1.25 ratio)
- Border hierarchy (major/minor/component/interactive)
- Glassmorphism with backdrop-filter blur
- Animated 25s gradient background loop
- Fixed background canvas for koi animation
- Semantic color naming via CSS variables

### Constraints
- Must preserve exact design aesthetic and spacing
- Cannot modify core animation timings (25s gradient)
- Must work with Astro View Transitions (no SSR)
- Client-side only (static site generation)
- No build-time theme generation
- Must support p5.js canvas background
- Koi animation performance must remain unchanged

---

## Requirements Analysis

### Functional Requirements

#### FR1: Theme Toggle Component
- **Sun/moon icon button** inline with nav links
- **Visual state**: Sun icon in dark mode, moon icon in light mode
- **Position**: Rightmost position in `.nav-links` container
- **Interaction**: Click to toggle between themes
- **Accessibility**: Aria-label describing action ("Switch to dark mode")
- **Icon style**: Consistent with site's minimalist aesthetic (SVG icons)

#### FR2: Theme Switching Logic
- **Toggle function**: Switch between light and dark mode
- **CSS class application**: Add/remove `dark-mode` class on `<html>` element
- **Transition timing**: 0.5s for all color/background transitions
- **State management**: Track current theme in JavaScript
- **Event handling**: Listen for toggle clicks

#### FR3: Theme Persistence
- **localStorage key**: `theme-preference`
- **Values**: `light` or `dark`
- **Save on change**: Update localStorage on every toggle
- **Read on load**: Check localStorage before render
- **Fallback**: Default to light mode if no preference saved

#### FR4: Flash Prevention (FOUC)
- **Blocking script**: Check theme before page renders
- **Inline script**: Execute in `<head>` before CSS
- **HTML class**: Apply `dark-mode` class immediately if needed
- **No visible transition**: Theme set before first paint
- **View Transitions**: Preserve theme across Astro page transitions

#### FR5: Dark Mode Color System
- **Dark gradient**: Moody dark colors (deep blues, purples, grays)
- **Light text**: High contrast white/light gray text
- **Adjusted borders**: Light borders with low opacity
- **Card backgrounds**: Dark semi-transparent with backdrop-filter
- **Button inversion**: Light buttons on dark background
- **Accent colors**: Darker, saturated variants for hover states

### Technical Requirements

#### TR1: CSS Variables Architecture
- **Naming convention**: `--color-*` for themeable colors
- **Light mode**: Define default values in `:root`
- **Dark mode**: Override in `html.dark-mode` selector
- **Scope**: All color values must use CSS variables
- **Transitions**: Apply to `background-color`, `color`, `border-color`

#### TR2: Theme Toggle Component Structure
- **Component file**: `/Users/seankim/dev/portfolio/src/components/ThemeToggle.astro`
- **Icon source**: Inline SVG (sun and moon icons)
- **Styling**: Minimal, consistent with nav link styles
- **Script**: Client-side JavaScript for toggle logic
- **Hydration**: Astro `<script>` tag (client-side only)

#### TR3: Theme Initialization Script
- **Location**: Inline `<script>` in `<head>` of BaseLayout.astro
- **Execution**: Before CSS loads (blocking)
- **Logic**: Read localStorage, apply class to HTML
- **Size**: Minimal (< 500 bytes) for performance
- **Format**: Inline (not external file)

#### TR4: Transition Performance
- **Property list**: `background, background-color, color, border-color`
- **Duration**: `0.5s`
- **Timing function**: `ease`
- **Specificity**: Apply to body, cards, buttons, all themeable elements
- **No layout shift**: Only color/background transitions

#### TR5: Koi Background Dark Mode
- **Canvas background**: Dark clearing color in dark mode
- **Koi visibility**: Ensure koi colors remain visible
- **Opacity adjustment**: May need slight increase in dark mode
- **Color inversion**: Consider adjusting koi body/fin colors
- **Implementation**: Theme-aware background clear in p5 draw loop

### Non-Functional Requirements

#### NFR1: Performance
- **No layout shift**: Theme change only affects colors
- **Smooth animations**: 60fps during 0.5s transition
- **Small bundle**: Theme logic < 1KB
- **No flicker**: Blocking script prevents flash

#### NFR2: Accessibility
- **Contrast ratios**: WCAG AA (4.5:1 for text)
- **ARIA labels**: Toggle button labeled correctly
- **Keyboard support**: Toggle via Enter/Space
- **Focus states**: Visible focus ring on toggle
- **No motion issues**: Respect prefers-reduced-motion

#### NFR3: Browser Compatibility
- **CSS variables**: All modern browsers (2020+)
- **localStorage**: Widely supported
- **Backdrop-filter**: Safari/Chrome/Firefox/Edge
- **View Transitions**: Progressive enhancement

### Out of Scope
- System preference detection (`prefers-color-scheme`) - future enhancement
- Auto-switching based on time of day
- Multiple theme options (only light/dark)
- Per-page theme preferences
- Theme customization (user-defined colors)
- Animated theme transitions beyond 0.5s fade
- Server-side theme rendering
- Theme analytics tracking

---

## Architecture Design

### CSS Variables Strategy

#### Approach
Convert all hardcoded colors to CSS custom properties with semantic naming. Define light mode values in `:root` and dark mode overrides in `html.dark-mode`.

#### Variable Naming Convention
```css
/* Background colors */
--color-bg-primary          /* Main background */
--color-bg-secondary        /* Card backgrounds */
--color-bg-secondary-hover  /* Card hover state */

/* Text colors */
--color-text-primary        /* Body text */
--color-text-secondary      /* Muted text */
--color-text-tertiary       /* Labels, metadata */

/* Border colors */
--color-border-major        /* Section dividers */
--color-border-minor        /* Item dividers */
--color-border-component    /* Component edges */
--color-border-interactive  /* Buttons, active states */

/* UI element colors */
--color-btn-primary-bg
--color-btn-primary-text
--color-btn-secondary-bg
--color-btn-secondary-text

/* Gradient stops (6 values) */
--color-gradient-1
--color-gradient-2
--color-gradient-3
--color-gradient-4
--color-gradient-5
--color-gradient-6

/* Accent colors for card hovers */
--color-accent-1 through --color-accent-9
```

#### Benefits
- Single source of truth for colors
- Easy theme switching via class toggle
- Maintainable and scalable
- No JavaScript color manipulation
- Works with View Transitions

### Component Architecture

#### ThemeToggle Component
```astro
---
// /Users/seankim/dev/portfolio/src/components/ThemeToggle.astro
---

<button
  id="theme-toggle"
  aria-label="Toggle dark mode"
  class="theme-toggle"
>
  <svg class="sun-icon" ...>...</svg>
  <svg class="moon-icon" ...>...</svg>
</button>

<style>
  .theme-toggle { /* positioning, sizing */ }
  .sun-icon { /* visible in dark mode */ }
  .moon-icon { /* visible in light mode */ }
  html.dark-mode .sun-icon { display: block; }
  html.dark-mode .moon-icon { display: none; }
</style>

<script>
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  function setTheme(theme) {
    if (theme === 'dark') {
      html.classList.add('dark-mode');
    } else {
      html.classList.remove('dark-mode');
    }
    localStorage.setItem('theme-preference', theme);
  }

  function toggleTheme() {
    const current = html.classList.contains('dark-mode') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  toggle?.addEventListener('click', toggleTheme);
</script>
```

### Theme Initialization Script

#### Inline Head Script
Add to `<head>` in BaseLayout.astro **before** CSS:

```html
<script is:inline>
  // Check localStorage and apply theme before render
  (function() {
    const stored = localStorage.getItem('theme-preference');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark-mode');
    }
  })();
</script>
```

#### Key Points
- **is:inline**: Prevents Astro from processing/bundling
- **IIFE**: Executes immediately
- **Minimal**: Only applies class, no complex logic
- **Blocking**: Runs before CSS/body render
- **View Transitions**: Persists across navigations

### Dark Mode Color Palette

#### Dark Mode Gradient (Moody & Animated)
```css
/* Deep, moody colors for dark mode gradient */
--color-gradient-1: #0a0a0f;  /* Very dark blue-black */
--color-gradient-2: #12121c;  /* Dark slate */
--color-gradient-3: #1a1a2e;  /* Deep navy */
--color-gradient-4: #16161f;  /* Dark charcoal */
--color-gradient-5: #1c1c28;  /* Dark purple-gray */
--color-gradient-6: #0f0f18;  /* Near black blue */
```

#### Dark Mode Text Colors
```css
--color-text-primary: #f5f5f5;      /* Almost white */
--color-text-secondary: #b8b8b8;    /* Light gray */
--color-text-tertiary: #888888;     /* Medium gray */
```

#### Dark Mode UI Colors
```css
--color-bg-secondary: rgba(255, 255, 255, 0.05);       /* Card bg */
--color-bg-secondary-hover: rgba(255, 255, 255, 0.08); /* Card hover */
--color-border-major: rgba(255, 255, 255, 0.15);
--color-border-minor: rgba(255, 255, 255, 0.1);
--color-border-component: rgba(255, 255, 255, 0.05);
```

#### Dark Mode Button Colors
```css
--color-btn-primary-bg: #f5f5f5;    /* Light button */
--color-btn-primary-text: #0a0a0f;  /* Dark text */
--color-btn-secondary-bg: rgba(255, 255, 255, 0.1);
--color-btn-secondary-text: #f5f5f5;
```

#### Dark Mode Accent Colors (Card Hovers)
```css
--color-accent-1: #2a1f1a;  /* Dark warm */
--color-accent-2: #1a2a1f;  /* Dark mint */
--color-accent-3: #1a1f2a;  /* Dark blue */
--color-accent-4: #2a1f2a;  /* Dark lavender */
--color-accent-5: #2a291a;  /* Dark cream */
--color-accent-6: #221a2a;  /* Dark purple */
--color-accent-7: #1a252a;  /* Dark sky */
--color-accent-8: #2a1a1f;  /* Dark rose */
--color-accent-9: #1a2a25;  /* Dark seafoam */
```

### Koi Background Dark Mode Strategy

#### Option 1: CSS Filter (Simplest)
Apply filter to canvas container:
```css
html.dark-mode #koi-canvas {
  filter: invert(0.9) hue-rotate(180deg);
  opacity: 0.4;
}
```

#### Option 2: Theme-Aware Clear Color (Recommended)
Modify p5 draw function to check theme:
```javascript
p.draw = function() {
  const isDark = document.documentElement.classList.contains('dark-mode');
  const bgColor = isDark
    ? { r: 10, g: 10, b: 15, a: 10 }   // Dark mode
    : { r: 255, g: 255, b: 255, a: 10 }; // Light mode

  p.clear();
  p.background(bgColor.r, bgColor.g, bgColor.b, bgColor.a);
  // ... rest of draw logic
};
```

#### Option 3: Opacity Adjustment Only
```css
html.dark-mode #koi-canvas {
  opacity: 0.4; /* Reduced from 0.6 */
}
```

**Recommendation**: Option 2 (theme-aware clear color) for best visual integration.

---

## Phase-by-Phase Implementation Plan

### Phase 1: CSS Variables & Theme System Foundation

**Goal**: Convert all hardcoded colors to CSS variables and establish theming architecture.

**Prerequisites**: None

**Files to Modify**:
1. `/Users/seankim/dev/portfolio/src/styles/style.css`

**Implementation Steps**:

#### Step 1.1: Add Color Variables to :root (Lines 40-69)
After existing design system variables, add:

```css
/* Color System - Light Mode (default) */
/* Background colors */
--color-bg-primary: transparent;  /* Used by body background */
--color-bg-secondary: rgba(255, 255, 255, 0.5);
--color-bg-secondary-hover: rgba(255, 255, 255, 0.65);

/* Text colors */
--color-text-primary: #000;
--color-text-secondary: #666;
--color-text-tertiary: #999;
--color-text-muted: #ccc;

/* Border colors (preserve opacity-based system) */
--color-border-major: rgba(0, 0, 0, 0.1);
--color-border-minor: rgba(0, 0, 0, 0.1);
--color-border-component: rgba(0, 0, 0, 0.05);
--color-border-interactive: #000;

/* Button colors */
--color-btn-primary-bg: #000;
--color-btn-primary-text: #fff;
--color-btn-secondary-bg: rgba(255, 255, 255, 0.4);
--color-btn-secondary-text: #000;
--color-btn-secondary-border: rgba(0, 0, 0, 0.2);

/* Gradient colors */
--color-gradient-1: #fffcf8;
--color-gradient-2: #fef5ed;
--color-gradient-3: #f5f9fb;
--color-gradient-4: #faf5f8;
--color-gradient-5: #f5fbf9;
--color-gradient-6: #fffcf8;

/* Card accent colors */
--color-accent-1: #fffaf0;  /* Warm peach */
--color-accent-2: #f0fff4;  /* Mint green */
--color-accent-3: #f0f8ff;  /* Light blue */
--color-accent-4: #fef5ff;  /* Lavender */
--color-accent-5: #fffef5;  /* Cream */
--color-accent-6: #f5f0ff;  /* Purple */
--color-accent-7: #f5fcff;  /* Sky blue */
--color-accent-8: #fff5f7;  /* Rose */
--color-accent-9: #f5fff8;  /* Seafoam */

/* Filler block gradients */
--color-filler-start-1: rgba(254, 249, 245, 0.3);
--color-filler-end-1: rgba(245, 248, 250, 0.3);
--color-filler-start-2: rgba(255, 250, 240, 0.3);
--color-filler-end-2: rgba(250, 245, 248, 0.3);
--color-filler-start-3: rgba(245, 250, 248, 0.3);
--color-filler-end-3: rgba(250, 248, 245, 0.3);
--color-filler-start-4: rgba(255, 245, 247, 0.3);
--color-filler-end-4: rgba(245, 250, 250, 0.3);
```

#### Step 1.2: Add Dark Mode Color Overrides
After `:root` section, add:

```css
/* Dark Mode Color Overrides */
html.dark-mode {
  /* Background colors */
  --color-bg-secondary: rgba(255, 255, 255, 0.05);
  --color-bg-secondary-hover: rgba(255, 255, 255, 0.08);

  /* Text colors */
  --color-text-primary: #f5f5f5;
  --color-text-secondary: #b8b8b8;
  --color-text-tertiary: #888888;
  --color-text-muted: #555555;

  /* Border colors */
  --color-border-major: rgba(255, 255, 255, 0.15);
  --color-border-minor: rgba(255, 255, 255, 0.1);
  --color-border-component: rgba(255, 255, 255, 0.05);
  --color-border-interactive: #f5f5f5;

  /* Button colors */
  --color-btn-primary-bg: #f5f5f5;
  --color-btn-primary-text: #0a0a0f;
  --color-btn-secondary-bg: rgba(255, 255, 255, 0.1);
  --color-btn-secondary-text: #f5f5f5;
  --color-btn-secondary-border: rgba(255, 255, 255, 0.2);

  /* Gradient colors - deep, moody palette */
  --color-gradient-1: #0a0a0f;
  --color-gradient-2: #12121c;
  --color-gradient-3: #1a1a2e;
  --color-gradient-4: #16161f;
  --color-gradient-5: #1c1c28;
  --color-gradient-6: #0f0f18;

  /* Card accent colors - darker, muted versions */
  --color-accent-1: #2a1f1a;
  --color-accent-2: #1a2a1f;
  --color-accent-3: #1a1f2a;
  --color-accent-4: #2a1f2a;
  --color-accent-5: #2a291a;
  --color-accent-6: #221a2a;
  --color-accent-7: #1a252a;
  --color-accent-8: #2a1a1f;
  --color-accent-9: #1a2a25;

  /* Filler block gradients */
  --color-filler-start-1: rgba(255, 255, 255, 0.03);
  --color-filler-end-1: rgba(255, 255, 255, 0.05);
  --color-filler-start-2: rgba(255, 255, 255, 0.04);
  --color-filler-end-2: rgba(255, 255, 255, 0.03);
  --color-filler-start-3: rgba(255, 255, 255, 0.03);
  --color-filler-end-3: rgba(255, 255, 255, 0.04);
  --color-filler-start-4: rgba(255, 255, 255, 0.05);
  --color-filler-end-4: rgba(255, 255, 255, 0.03);
}
```

#### Step 1.3: Add Transition Properties
Add to `body` rule (around line 92):

```css
body {
  /* ... existing properties ... */
  transition: background 0.5s ease, color 0.5s ease;
}
```

#### Step 1.4: Replace Hardcoded Colors with Variables

**Body gradient background** (lines 98-108):
```css
background: linear-gradient(
    135deg,
    var(--color-gradient-1) 0%,
    var(--color-gradient-2) 20%,
    var(--color-gradient-3) 40%,
    var(--color-gradient-4) 60%,
    var(--color-gradient-5) 80%,
    var(--color-gradient-6) 100%
);
color: var(--color-text-primary);
```

**Navigation** (lines 134-176):
```css
.logo {
  color: var(--color-text-primary);
  transition: opacity 0.2s ease;
}

.nav-links a {
  color: var(--color-text-secondary);
  transition: color 0.2s ease;
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--color-text-primary);
}

.nav-links a.active::after {
  background: var(--color-text-primary);
}
```

**Borders** (replace all border values):
```css
nav {
  border-bottom: 2px solid var(--color-border-major);
}

/* Update --border-* variables in :root to use CSS variables */
--border-major: 2px solid var(--color-border-major);
--border-minor: 1px solid var(--color-border-minor);
--border-component: 1px solid var(--color-border-component);
--border-interactive: 1px solid var(--color-border-interactive);
```

**Typography colors** (lines 183-211):
```css
.subtitle {
  color: var(--color-text-secondary);
}

.about-content .article-excerpt {
  color: var(--color-text-secondary);
}
```

**Cards** (lines 223-263):
```css
.card {
  background: var(--color-bg-secondary);
  transition: all 0.5s ease;  /* Updated from 0.2s */
  border: 1px solid var(--color-border-component);
}

.card:hover {
  background: var(--color-bg-secondary-hover);
  border-color: var(--color-border-major);
}

.card-number {
  color: var(--color-text-tertiary);
}

.card-desc {
  color: var(--color-text-secondary);
}

.status {
  color: var(--color-text-muted);
}
```

**Buttons** (lines 272-304):
```css
.btn {
  background: var(--color-btn-primary-bg);
  color: var(--color-btn-primary-text);
  border: 1px solid var(--color-border-interactive);
  transition: all 0.5s ease;
}

.btn:hover {
  background: var(--color-text-secondary);  /* Slightly lighter */
}

.btn-secondary {
  background: var(--color-btn-secondary-bg);
  color: var(--color-btn-secondary-text);
  border: 1px solid var(--color-btn-secondary-border);
  transition: all 0.5s ease;
}

.btn-secondary:hover {
  border-color: var(--color-border-interactive);
  background: var(--color-bg-secondary-hover);
}
```

**Writing list** (lines 319-390):
```css
.writing-list {
  border-top: 2px solid var(--color-border-major);
}

.writing-item {
  border-bottom: 1px solid var(--color-border-minor);
  transition: background 0.5s ease;
}

.writing-item:hover {
  background: var(--color-bg-secondary);
}

.writing-date {
  color: var(--color-text-tertiary);
}

.writing-content h3 a {
  color: var(--color-text-primary);
}

.writing-excerpt {
  color: var(--color-text-secondary);
}

.tag {
  color: var(--color-text-tertiary);
  border: 1px solid var(--color-border-minor);
}
```

**About page** (lines 392-492):
```css
.about-content p {
  color: var(--color-text-secondary);
}

.about-content p a {
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-text-primary);
}

.about-content ul {
  color: var(--color-text-secondary);
}

.about-content ul li::before {
  color: var(--color-text-muted);
}

.contact-item {
  background: var(--color-bg-secondary);
  transition: all 0.5s ease;
  border: 1px solid var(--color-border-component);
}

.contact-item:hover {
  background: var(--color-bg-secondary-hover);
  border-color: var(--color-border-major);
}

.contact-label {
  color: var(--color-text-tertiary);
}

.contact-value a {
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-text-primary);
}

.specs-title {
  color: var(--color-text-tertiary);
}

.specs-label {
  color: var(--color-text-tertiary);
}

.specs-value {
  color: var(--color-text-primary);
}
```

**Footer** (lines 528-551):
```css
footer {
  border-top: 2px solid var(--color-border-major);
  color: var(--color-text-tertiary);
}

footer a {
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-text-primary);
}
```

**RSS and article nav** (lines 656-694):
```css
.rss-link a {
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-text-secondary);
}

.rss-link a:hover {
  color: var(--color-text-primary);
  border-bottom-color: var(--color-text-primary);
}

.article-nav a {
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-text-secondary);
}

.article-nav a:hover {
  color: var(--color-text-primary);
  border-bottom-color: var(--color-text-primary);
}
```

**Card accent hovers** (lines 592-626):
```css
.card:nth-child(1):hover {
  background: var(--color-accent-1);
}

.card:nth-child(2):hover {
  background: var(--color-accent-2);
}

/* ... repeat for all 9 accent colors ... */

.card:nth-child(9):hover {
  background: var(--color-accent-9);
}
```

**Filler blocks** (lines 629-654):
```css
.filler-block {
  background: linear-gradient(135deg, var(--color-filler-start-1), var(--color-filler-end-1));
  transition: all 0.5s ease;
  border: 1px solid var(--color-border-component);
}

.filler-block.variant-1 {
  background: linear-gradient(135deg, var(--color-filler-start-2), var(--color-filler-end-2));
}

.filler-block.variant-2 {
  background: linear-gradient(135deg, var(--color-filler-start-3), var(--color-filler-end-3));
}

.filler-block.variant-3 {
  background: linear-gradient(135deg, var(--color-filler-start-4), var(--color-filler-end-4));
}
```

**Success Criteria**:
- [ ] All hardcoded color values replaced with CSS variables
- [ ] Light mode appears identical to current design
- [ ] No visual regressions in light mode
- [ ] All transitions set to 0.5s on themeable properties
- [ ] CSS validates without errors
- [ ] Site builds successfully (`npm run build`)
- [ ] Manual testing: All pages render correctly in light mode

**Estimated Time**: 2-3 hours

---

### Phase 2: Theme Toggle Component & Logic

**Goal**: Create the theme toggle button component and implement toggle functionality.

**Prerequisites**: Phase 1 complete

**Files to Create**:
1. `/Users/seankim/dev/portfolio/src/components/ThemeToggle.astro`

**Files to Modify**:
1. `/Users/seankim/dev/portfolio/src/layouts/BaseLayout.astro`

**Implementation Steps**:

#### Step 2.1: Create ThemeToggle Component

Create new file at `/Users/seankim/dev/portfolio/src/components/ThemeToggle.astro`:

```astro
---
// ThemeToggle.astro - Sun/Moon theme toggle button
---

<button
  id="theme-toggle"
  aria-label="Toggle dark mode"
  class="theme-toggle"
  type="button"
>
  <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
  <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
</button>

<style>
  .theme-toggle {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--color-text-secondary);
    transition: color 0.2s ease, opacity 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .theme-toggle:hover {
    color: var(--color-text-primary);
    opacity: 0.6;
  }

  .theme-toggle:focus {
    outline: 2px solid var(--color-border-interactive);
    outline-offset: 2px;
  }

  /* Show sun in dark mode, moon in light mode */
  .sun-icon {
    display: none;
  }

  .moon-icon {
    display: block;
  }

  html.dark-mode .sun-icon {
    display: block;
  }

  html.dark-mode .moon-icon {
    display: none;
  }
</style>

<script>
  function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const html = document.documentElement;

    function setTheme(theme: 'light' | 'dark') {
      if (theme === 'dark') {
        html.classList.add('dark-mode');
      } else {
        html.classList.remove('dark-mode');
      }
      localStorage.setItem('theme-preference', theme);

      // Update aria-label
      const newLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      toggle.setAttribute('aria-label', newLabel);
    }

    function toggleTheme() {
      const currentTheme = html.classList.contains('dark-mode') ? 'dark' : 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    }

    // Set initial aria-label
    const initialTheme = html.classList.contains('dark-mode') ? 'dark' : 'light';
    const initialLabel = initialTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    toggle.setAttribute('aria-label', initialLabel);

    // Listen for clicks
    toggle.addEventListener('click', toggleTheme);
  }

  // Initialize on load
  initThemeToggle();

  // Re-initialize after view transitions
  document.addEventListener('astro:after-swap', initThemeToggle);
</script>
```

#### Step 2.2: Add ThemeToggle to BaseLayout

In `/Users/seankim/dev/portfolio/src/layouts/BaseLayout.astro`:

**Add import** (after line 4):
```astro
import ThemeToggle from '../components/ThemeToggle.astro';
```

**Update nav-links** (lines 48-52):
```astro
<div class="nav-links">
    <a href="/" class={activePage === 'work' ? 'active' : ''}>Work</a>
    <a href="/writing" class={activePage === 'writing' ? 'active' : ''}>Writing</a>
    <a href="/about" class={activePage === 'about' ? 'active' : ''}>About</a>
    <ThemeToggle />
</div>
```

#### Step 2.3: Test Toggle Functionality

**Manual Testing Checklist**:
1. Load site in browser
2. Click theme toggle - should add `dark-mode` class to `<html>`
3. Click again - should remove `dark-mode` class
4. Open DevTools Console - check localStorage has `theme-preference`
5. Refresh page - theme should persist
6. Test keyboard navigation (Tab to button, Enter to toggle)
7. Check ARIA label updates on toggle
8. Navigate between pages - theme should persist across View Transitions

**Success Criteria**:
- [ ] ThemeToggle component created with sun/moon SVG icons
- [ ] Toggle button appears in navigation (rightmost position)
- [ ] Click toggles `dark-mode` class on `<html>` element
- [ ] Theme preference saved to localStorage
- [ ] ARIA label updates correctly on toggle
- [ ] Keyboard accessible (Enter/Space to toggle)
- [ ] Focus state visible
- [ ] Icons switch correctly (moon in light, sun in dark)
- [ ] Works across Astro View Transitions

**Estimated Time**: 1-2 hours

---

### Phase 3: Dark Mode Styles & Color Refinement

**Goal**: Verify dark mode colors render correctly and refine palette for optimal appearance.

**Prerequisites**: Phase 1 & 2 complete

**Files to Modify**:
1. `/Users/seankim/dev/portfolio/src/styles/style.css` (refinements only)
2. `/Users/seankim/dev/portfolio/src/components/KoiBackground.astro`

**Implementation Steps**:

#### Step 3.1: Add Dark Mode Koi Background Support

In `/Users/seankim/dev/portfolio/src/components/KoiBackground.astro`, modify the `p.draw` function (around line 135):

**Replace** (line 142-143):
```javascript
p.clear();
p.background(255, 255, 255, 10);
```

**With**:
```javascript
p.clear();
// Theme-aware background
const isDarkMode = document.documentElement.classList.contains('dark-mode');
if (isDarkMode) {
  p.background(10, 10, 15, 10);  // Dark blue-black with low alpha
} else {
  p.background(255, 255, 255, 10);  // Light mode
}
```

#### Step 3.2: Adjust Koi Canvas Opacity for Dark Mode

In `/Users/seankim/dev/portfolio/src/components/KoiBackground.astro`, update styles (line 212-221):

```css
#koi-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: auto;
  opacity: 0.6;
  transition: opacity 0.5s ease;
}

html.dark-mode #koi-canvas {
  opacity: 0.5;  /* Slightly reduced for dark mode */
}
```

#### Step 3.3: Visual Testing & Color Refinement

**Test in dark mode**:
1. Toggle to dark mode
2. Check all pages: Home, Writing, About, individual article
3. Verify contrast ratios with DevTools accessibility panel
4. Test card hovers - ensure accent colors are visible
5. Check glassmorphic effect on cards (backdrop-filter)
6. Verify button visibility and hover states
7. Test koi visibility against dark gradient

**Refinement Areas**:
- If dark gradient too dark: lighten gradient colors slightly
- If koi not visible: adjust opacity or background clear color
- If card accents too subtle: increase saturation
- If text contrast insufficient: adjust text colors
- If borders invisible: increase opacity

**Example refinements** (adjust as needed after testing):

```css
/* If dark mode gradient needs to be lighter */
html.dark-mode {
  --color-gradient-1: #12121a;  /* Slightly lighter */
  --color-gradient-2: #1a1a28;
  /* ... etc */
}

/* If card backgrounds need more visibility */
html.dark-mode {
  --color-bg-secondary: rgba(255, 255, 255, 0.07);  /* Increased from 0.05 */
}

/* If accent hovers need more punch */
html.dark-mode {
  --color-accent-1: #3a2a22;  /* More saturated */
  /* ... etc */
}
```

#### Step 3.4: Contrast Ratio Validation

Use browser DevTools or online tools to verify WCAG AA compliance:

**Minimum contrast ratios**:
- Body text (16px): 4.5:1
- Large text (20px+): 3:1
- UI components: 3:1

**Test combinations**:
- Primary text on gradient background: ≥ 4.5:1
- Secondary text on gradient: ≥ 4.5:1
- Button text on button background: ≥ 4.5:1
- Card text on card background: ≥ 4.5:1

**Success Criteria**:
- [ ] Dark mode gradient is moody and visually appealing
- [ ] Koi visible against dark background
- [ ] All text meets WCAG AA contrast standards
- [ ] Card glassmorphism works in dark mode
- [ ] Accent colors visible on card hover
- [ ] Buttons clearly visible and readable
- [ ] Borders visible but subtle
- [ ] No jarring color transitions
- [ ] Dark theme feels cohesive with light theme aesthetic
- [ ] Manual testing on multiple pages confirms quality

**Estimated Time**: 2-3 hours (includes testing and iteration)

---

### Phase 4: Theme Persistence & Flash Prevention

**Goal**: Prevent flash of unstyled content (FOUC) on page load by applying theme before render.

**Prerequisites**: Phase 1, 2, 3 complete

**Files to Modify**:
1. `/Users/seankim/dev/portfolio/src/layouts/BaseLayout.astro`

**Implementation Steps**:

#### Step 4.1: Add Inline Theme Initialization Script

In `/Users/seankim/dev/portfolio/src/layouts/BaseLayout.astro`, add **before** the `<ViewTransitions />` tag (before line 22):

```astro
<!-- Theme initialization - runs before render to prevent flash -->
<script is:inline>
  (function() {
    const stored = localStorage.getItem('theme-preference');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark-mode');
    }
  })();
</script>
```

**Complete head section** should look like:
```astro
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>

    <!-- Theme initialization - runs before render to prevent flash -->
    <script is:inline>
      (function() {
        const stored = localStorage.getItem('theme-preference');
        if (stored === 'dark') {
          document.documentElement.classList.add('dark-mode');
        }
      })();
    </script>

    <ViewTransitions />

    <!-- rest of head content... -->
</head>
```

#### Step 4.2: Ensure Script Order

**Critical ordering**:
1. Theme init script (blocking, inline)
2. ViewTransitions
3. CSS import (in style.css)
4. Other meta tags

This ensures theme class is applied before CSS loads and before View Transitions initialize.

#### Step 4.3: Test Flash Prevention

**Testing procedure**:
1. Clear browser cache and localStorage
2. Load site (light mode default)
3. Toggle to dark mode
4. Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
   - Should load directly in dark mode, no flash
5. Navigate to different page via nav links
   - Should maintain dark mode, no flash
6. Open in new tab
   - Should open in dark mode (from localStorage)
7. Close browser, reopen site
   - Should remember dark mode preference

**Edge cases to test**:
- First visit (no localStorage) → defaults to light
- localStorage corrupted/invalid → defaults to light
- JavaScript disabled → defaults to light (graceful degradation)
- Fast navigation with View Transitions → theme persists

#### Step 4.4: View Transitions Compatibility

**Verify**:
- Theme persists across View Transitions page changes
- Toggle works immediately after transition
- No duplicate event listeners after transitions
- Koi background persists correctly (using `transition:persist` from line 5 in KoiBackground.astro)

**Success Criteria**:
- [ ] No flash of light mode when loading with dark preference
- [ ] Theme applies before first paint
- [ ] Hard refresh maintains theme
- [ ] New tabs/windows respect saved preference
- [ ] View Transitions preserve theme
- [ ] No console errors
- [ ] Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- [ ] Graceful degradation with JS disabled

**Estimated Time**: 1 hour

---

### Phase 5: Testing & Polish

**Goal**: Comprehensive testing across browsers, devices, and edge cases. Final polish and documentation.

**Prerequisites**: Phase 1, 2, 3, 4 complete

**Files to Create**:
1. Testing documentation (optional)

**Files to Modify**:
1. Any files needing final adjustments based on testing

**Implementation Steps**:

#### Step 5.1: Cross-Browser Testing

**Browsers to test**:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Test matrix per browser**:
- [ ] Toggle switches themes
- [ ] Theme persists on refresh
- [ ] Transitions are smooth (0.5s)
- [ ] Koi background renders correctly
- [ ] No console errors
- [ ] CSS variables supported
- [ ] localStorage works
- [ ] View Transitions work (or degrade gracefully)

#### Step 5.2: Responsive Testing

**Devices/viewports to test**:
- Desktop (1920px, 1440px, 1024px)
- Tablet (768px)
- Mobile (375px, 320px)

**Per viewport**:
- [ ] Theme toggle visible and accessible
- [ ] Dark mode colors appropriate
- [ ] Koi background scales correctly
- [ ] No horizontal scroll
- [ ] Touch targets adequate (44px minimum)

#### Step 5.3: Accessibility Audit

**Tools**:
- Chrome DevTools Lighthouse
- axe DevTools extension
- Manual keyboard testing

**Checklist**:
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Focus indicators visible in both themes
- [ ] ARIA labels correct and descriptive
- [ ] Contrast ratios meet WCAG AA
- [ ] No color-only information
- [ ] Screen reader announces theme changes

#### Step 5.4: Performance Testing

**Metrics to check**:
- [ ] Theme toggle responds instantly (< 50ms)
- [ ] Transition completes in 0.5s
- [ ] No layout shift during theme change
- [ ] Koi animation maintains 60fps in both themes
- [ ] Inline script < 500 bytes (check Network tab)
- [ ] No regression in Lighthouse performance score

#### Step 5.5: Edge Case Testing

**Scenarios**:
- [ ] Rapid toggle clicking (no race conditions)
- [ ] Toggle during View Transition animation
- [ ] localStorage quota exceeded (unlikely but test)
- [ ] Browser back/forward buttons
- [ ] Bookmark to specific page
- [ ] Direct link to article page
- [ ] Opening multiple tabs simultaneously
- [ ] Browser zoom at 200%, 50%
- [ ] High contrast mode (OS-level)
- [ ] Reduced motion preference (`prefers-reduced-motion`)

#### Step 5.6: Final Polish

**Visual refinements**:
- [ ] Check all hover states in both themes
- [ ] Verify spacing/alignment unchanged
- [ ] Confirm accent colors pleasing in dark mode
- [ ] Ensure no color "dead zones" (too similar to background)
- [ ] Test with real content (full articles, multiple projects)

**Code quality**:
- [ ] Remove console.logs from production code
- [ ] Clean up commented code
- [ ] Verify no unused CSS variables
- [ ] Check for typos in comments
- [ ] Format code consistently

#### Step 5.7: Documentation Updates

**Update README.md** (if applicable):
```markdown
## Features
- Dark mode toggle with persistent preference
- Smooth 0.5s theme transitions
- WCAG AA accessible contrast ratios
- Works with Astro View Transitions
```

**Update CONTENT_GUIDE.md or relevant docs**:
- Note theme support
- Mention any content implications (image contrast, etc.)

#### Step 5.8: Pre-Launch Checklist

- [ ] All 5 phases complete
- [ ] No console errors or warnings
- [ ] Site builds successfully (`npm run build`)
- [ ] Preview build works (`npm run preview`)
- [ ] All tests passed
- [ ] Accessibility audit passed
- [ ] Performance metrics acceptable
- [ ] Works on all target browsers
- [ ] Mobile experience polished
- [ ] Code reviewed (by code-reviewer agent if applicable)

**Success Criteria**:
- [ ] Theme toggle functions perfectly in all browsers
- [ ] No visual or functional regressions
- [ ] Accessibility standards met
- [ ] Performance maintained
- [ ] Code is clean and maintainable
- [ ] Ready for production deployment

**Estimated Time**: 3-4 hours

---

## Testing Strategy

### Automated Testing

**CSS Validation**:
```bash
# Run in development
npm run dev
# Manually inspect DevTools for CSS errors
```

**Build Testing**:
```bash
npm run build
npm run preview
# Test production build before deploying
```

**Type Checking**:
```bash
npm run astro check
# Ensure no TypeScript errors
```

### Manual Testing

#### Unit Tests (Component Level)

**ThemeToggle Component**:
1. Renders sun icon in dark mode
2. Renders moon icon in light mode
3. Click toggles theme
4. Aria-label updates
5. Focus state visible
6. Keyboard accessible

**Theme Initialization Script**:
1. Reads localStorage correctly
2. Applies class before render
3. Defaults to light if no preference
4. Handles corrupted localStorage gracefully

#### Integration Tests (Page Level)

**Homepage**:
- [ ] Gradient animates in both themes
- [ ] Project cards render correctly
- [ ] Card hover accents visible
- [ ] Koi background visible
- [ ] Toggle accessible

**Writing Index**:
- [ ] List items readable in both themes
- [ ] Tags visible
- [ ] Dates readable
- [ ] Hover states work

**About Page**:
- [ ] Text readable
- [ ] Contact cards visible
- [ ] Links have adequate contrast
- [ ] Specs table readable

**Individual Article**:
- [ ] Long-form text readable
- [ ] Code blocks readable (if any)
- [ ] Links visible
- [ ] Navigation breadcrumbs work

#### End-to-End Tests (User Flow)

**First-time visitor flow**:
1. Land on homepage (light mode default)
2. Browse projects
3. Toggle to dark mode
4. Navigate to Writing
5. Read article
6. Return to homepage
7. Refresh - should stay in dark mode

**Returning visitor flow**:
1. Open site (preference loaded from localStorage)
2. Should immediately show preferred theme
3. Navigate between pages - theme persists
4. Toggle theme - updates localStorage
5. Close browser, reopen - preference remembered

### Acceptance Testing

**User Acceptance Criteria**:
1. "Dark mode is easy to discover and toggle"
2. "Dark mode is visually appealing and comfortable to read"
3. "My preference is remembered across sessions"
4. "Switching themes is smooth and pleasant"
5. "The koi background looks good in both modes"

**Stakeholder Review**:
- Visual design approval (light and dark)
- Accessibility compliance confirmation
- Performance impact assessment
- User experience validation

---

## Deployment & Migration

### Pre-Deployment Checklist

- [ ] All phases complete and tested
- [ ] No console errors in production build
- [ ] CSS validates
- [ ] TypeScript checks pass
- [ ] Accessibility audit passed
- [ ] Performance acceptable
- [ ] Browser compatibility verified
- [ ] Mobile testing complete
- [ ] Code reviewed

### Deployment Steps

Since this is a static site on Vercel with automatic deployments:

1. **Commit changes**:
```bash
git add src/styles/style.css src/layouts/BaseLayout.astro src/components/ThemeToggle.astro
git commit -m "Add dark mode with theme toggle and persistence"
git push origin main
```

2. **Monitor Vercel deployment**:
- Watch build logs for errors
- Verify deployment succeeds
- Check preview URL

3. **Test production deployment**:
- Test toggle on live site
- Verify localStorage persistence
- Check all pages
- Test on mobile device

### Rollback Plan

If critical issues arise post-deployment:

**Option 1: Quick fix**:
```bash
# Fix issue locally
git add <fixed-files>
git commit -m "Fix: [description]"
git push origin main
```

**Option 2: Full rollback**:
```bash
# Revert the dark mode commit
git revert <dark-mode-commit-hash>
git push origin main
```

**Option 3: Vercel rollback**:
- Use Vercel dashboard to rollback to previous deployment
- Preserves git history

### Post-Deployment Monitoring

**Metrics to watch**:
- Vercel build success rate
- Page load times (should be unchanged)
- Browser console errors (monitor via analytics if available)
- User feedback (if feedback mechanism exists)

**User Adoption Tracking** (if analytics available):
- Percentage of users toggling to dark mode
- Percentage returning in dark mode
- Browser/device breakdown

---

## Risk Assessment & Mitigation

### Technical Risks

**Risk 1: CSS Variable Browser Support**
- **Likelihood**: Low
- **Impact**: High
- **Mitigation**: CSS variables supported in all browsers since 2016. Graceful degradation for ancient browsers (they'll see light mode only).
- **Contingency**: Provide fallback values in critical places.

**Risk 2: localStorage Not Available**
- **Likelihood**: Low
- **Impact**: Medium
- **Mitigation**: Wrap localStorage access in try-catch, default to light mode if unavailable.
- **Contingency**: Theme still toggles per-session, just doesn't persist.

**Risk 3: Flash of Unstyled Content (FOUC)**
- **Likelihood**: Medium (if script placement wrong)
- **Impact**: High (poor UX)
- **Mitigation**: Inline blocking script in `<head>` before CSS.
- **Contingency**: If flash occurs, move script earlier or use cookie instead of localStorage.

**Risk 4: View Transitions Conflict**
- **Likelihood**: Low
- **Impact**: Medium
- **Mitigation**: Test thoroughly with View Transitions enabled. Use `astro:after-swap` event to re-initialize.
- **Contingency**: Disable View Transitions if irreconcilable (unlikely).

**Risk 5: Koi Background Not Visible in Dark Mode**
- **Likelihood**: Medium
- **Impact**: Medium (aesthetic degradation)
- **Mitigation**: Test thoroughly, adjust opacity/colors/clear color.
- **Contingency**: Hide koi in dark mode or invert colors via CSS filter.

**Risk 6: Performance Degradation**
- **Likelihood**: Low
- **Impact**: Medium
- **Mitigation**: Transitions only on color properties, no layout changes. Test on low-end devices.
- **Contingency**: Reduce transition duration or remove for mobile.

### Design Risks

**Risk 7: Dark Mode Colors Don't Match Aesthetic**
- **Likelihood**: Medium
- **Impact**: Medium
- **Mitigation**: Iterative refinement in Phase 3 with stakeholder feedback.
- **Contingency**: Adjust palette, may require multiple iterations.

**Risk 8: Contrast Ratio Failures**
- **Likelihood**: Medium
- **Impact**: High (accessibility)
- **Mitigation**: Use contrast checking tools during development. Adjust colors to meet WCAG AA.
- **Contingency**: Lighten/darken colors as needed, prioritize accessibility over aesthetics.

**Risk 9: Accent Colors Too Subtle**
- **Likelihood**: Medium
- **Impact**: Low (minor aesthetic issue)
- **Mitigation**: Test hover states thoroughly, increase saturation if needed.
- **Contingency**: Use lighter/brighter accent colors in dark mode.

### User Experience Risks

**Risk 10: Toggle Not Discoverable**
- **Likelihood**: Low
- **Impact**: Medium
- **Mitigation**: Prominent placement in nav, familiar sun/moon icons.
- **Contingency**: Add tooltip or introductory message (out of scope for v1).

**Risk 11: Unexpected Theme on First Visit**
- **Likelihood**: Low
- **Impact**: Low
- **Mitigation**: Default to light mode (current design).
- **Contingency**: In future, detect system preference via `prefers-color-scheme`.

---

## Performance Considerations

### Bundle Size Impact

**Added code**:
- Inline theme init script: ~200 bytes (minified)
- ThemeToggle component: ~500 bytes JS + ~400 bytes CSS
- CSS variables: ~1KB additional CSS (offset by removing hardcoded values)
- **Total impact**: < 2KB

**Mitigation**: Negligible impact on page load time.

### Runtime Performance

**Theme toggle**:
- DOM class toggle: < 1ms
- localStorage write: < 5ms
- CSS transitions: 0.5s (GPU-accelerated)
- **Total**: Instant user feedback

**Page load**:
- Inline script execution: < 1ms (blocking but tiny)
- No additional network requests
- CSS variables: No performance impact

### Rendering Performance

**Transitions**:
- Only color/background properties transition
- No layout recalculation
- GPU-accelerated via `transform` (for koi canvas opacity)
- 60fps target maintained

**Koi background**:
- Same performance in both modes
- Theme check adds < 0.1ms per frame (negligible)
- No impact on animation smoothness

### Optimization Strategies

1. **Minimize inline script**: Keep theme init script tiny
2. **Debounce toggle**: Prevent rapid clicking issues (built-in via transition)
3. **Lazy transitions**: Only transition visible elements
4. **GPU acceleration**: Ensure transitions use composited properties

---

## Security Considerations

### localStorage Security

**Consideration**: localStorage is not encrypted and accessible to any script on the domain.

**Risk Level**: Low (theme preference is not sensitive data)

**Best Practices**:
- Only store non-sensitive data (`light` or `dark`)
- Validate input before writing (prevent injection)
- Handle localStorage errors gracefully

### XSS Prevention

**Consideration**: Inline script in `<head>` could be injection vector.

**Mitigation**:
- No user input in theme init script
- Hardcoded logic only
- Astro sanitizes all content by default

**Risk Level**: Very Low

### Content Security Policy

**Consideration**: Inline scripts may violate strict CSP.

**Mitigation**:
- Use `is:inline` directive (Astro-safe)
- If CSP needed, use nonce or hash
- Currently no CSP on site, so not an issue

**Future-proofing**: Document inline script for CSP allowlist if added later.

---

## Future Enhancements

**Out of scope for initial implementation, but documented for future consideration**:

### Enhancement 1: System Preference Detection
- Detect `prefers-color-scheme` media query
- Auto-set theme on first visit based on OS setting
- Allow manual override
- **Complexity**: Low
- **Value**: High

### Enhancement 2: Theme Transition Animations
- Animated gradient morph instead of fade
- Icon rotation/morph animation
- **Complexity**: Medium
- **Value**: Medium (polish)

### Enhancement 3: Multiple Themes
- Add "auto" option (follows system)
- Potential for accent color variants
- **Complexity**: High
- **Value**: Medium

### Enhancement 4: Per-Page Theme
- Remember theme preference per page
- Useful if certain pages better suited to specific theme
- **Complexity**: Medium
- **Value**: Low

### Enhancement 5: Koi Color Themes
- Koi colors adapt to theme (e.g., bioluminescent koi in dark mode)
- Requires significant p5.js changes
- **Complexity**: High
- **Value**: High (visual impact)

### Enhancement 6: Smooth State Transitions
- Animate between theme states with view transitions API
- Morph sun to moon with keyframe animations
- **Complexity**: Medium
- **Value**: Medium

---

## Code Examples

### Complete CSS Variables (Condensed)

```css
:root {
  /* Light mode (default) */
  --color-bg-secondary: rgba(255, 255, 255, 0.5);
  --color-text-primary: #000;
  --color-text-secondary: #666;
  --color-gradient-1: #fffcf8;
  --color-gradient-2: #fef5ed;
  /* ... etc */
}

html.dark-mode {
  /* Dark mode overrides */
  --color-bg-secondary: rgba(255, 255, 255, 0.05);
  --color-text-primary: #f5f5f5;
  --color-text-secondary: #b8b8b8;
  --color-gradient-1: #0a0a0f;
  --color-gradient-2: #12121c;
  /* ... etc */
}
```

### Theme Init Script (Complete)

```html
<script is:inline>
  (function() {
    const stored = localStorage.getItem('theme-preference');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark-mode');
    }
  })();
</script>
```

### Toggle Function (Complete)

```javascript
function toggleTheme() {
  const html = document.documentElement;
  const current = html.classList.contains('dark-mode') ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';

  if (next === 'dark') {
    html.classList.add('dark-mode');
  } else {
    html.classList.remove('dark-mode');
  }

  localStorage.setItem('theme-preference', next);

  const label = next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  document.getElementById('theme-toggle')?.setAttribute('aria-label', label);
}
```

---

## Appendix

### File Change Summary

| File | Lines Changed | Type |
|------|---------------|------|
| `src/styles/style.css` | ~100-150 | Modified (add variables, replace colors) |
| `src/layouts/BaseLayout.astro` | ~10 | Modified (add script, import toggle) |
| `src/components/ThemeToggle.astro` | ~100 | Created (new component) |
| `src/components/KoiBackground.astro` | ~5 | Modified (theme-aware background) |

**Total estimated changes**: ~215-265 lines

### Browser Support Matrix

| Browser | Min Version | CSS Variables | localStorage | View Transitions |
|---------|-------------|---------------|--------------|------------------|
| Chrome | 49+ | ✅ | ✅ | ✅ (111+) |
| Firefox | 31+ | ✅ | ✅ | ❌ (degrades) |
| Safari | 9.1+ | ✅ | ✅ | ❌ (degrades) |
| Edge | 15+ | ✅ | ✅ | ✅ (111+) |

**Graceful Degradation**: Site works in all browsers; View Transitions enhance but aren't required.

### Accessibility Compliance

**WCAG 2.1 Level AA**:
- ✅ 1.4.3 Contrast (Minimum): 4.5:1 text, 3:1 UI
- ✅ 2.1.1 Keyboard: Toggle accessible via keyboard
- ✅ 2.4.7 Focus Visible: Focus indicator on toggle
- ✅ 4.1.2 Name, Role, Value: ARIA labels correct

**Testing Tools**:
- Chrome DevTools Lighthouse
- axe DevTools
- WebAIM Contrast Checker
- Manual keyboard testing

### Color Palette Reference

**Light Mode Gradient**:
- `#fffcf8` - Warm white
- `#fef5ed` - Warm cream
- `#f5f9fb` - Cool white
- `#faf5f8` - Pink-tinted white
- `#f5fbf9` - Mint white
- `#fffcf8` - Warm white (loop)

**Dark Mode Gradient**:
- `#0a0a0f` - Deep blue-black
- `#12121c` - Dark slate
- `#1a1a2e` - Deep navy
- `#16161f` - Dark charcoal
- `#1c1c28` - Dark purple-gray
- `#0f0f18` - Near black blue (loop)

---

## Conclusion

This plan provides a comprehensive, phased approach to implementing dark mode on the portfolio website. By following these phases sequentially and validating success criteria at each step, the implementation should be smooth, maintainable, and high-quality.

Key strengths of this approach:
- **CSS-first**: No JavaScript color manipulation
- **Performance-conscious**: Minimal bundle impact
- **Accessible**: WCAG AA compliant
- **Maintainable**: Clear variable naming, well-documented
- **Tested**: Comprehensive testing strategy
- **Future-proof**: Extensible for future enhancements

Upon completion, users will enjoy a polished dark mode experience that maintains the site's Swiss minimalist aesthetic while providing comfortable reading in low-light conditions.
