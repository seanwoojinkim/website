---
doc_type: research
date: 2025-11-02T14:21:20+00:00
title: "Navigation Implementation and Responsive Hamburger Menu Design"
research_question: "How to implement a responsive hamburger menu at different display sizes given the current navigation architecture?"
researcher: seanwoojinkim

git_commit: 9d2498e17d2be488835ee02d52008936f77b0d6e
branch: main
repository: portfolio

created_by: seanwoojinkim
last_updated: 2025-11-02
last_updated_by: seanwoojinkim

tags:
  - navigation
  - responsive-design
  - hamburger-menu
  - astro
  - mobile-ui
status: draft

related_docs: []
---

# Research: Navigation Implementation and Responsive Hamburger Menu Design

**Date**: November 2, 2025 14:21 UTC
**Researcher**: seanwoojinkim
**Git Commit**: 9d2498e17d2be488835ee02d52008936f77b0d6e
**Branch**: main
**Repository**: portfolio

## Research Question

How to implement a responsive hamburger menu at different display sizes given the current navigation architecture?

## Summary

The portfolio site is built with **Astro 4.0** and uses a minimalist design system with custom CSS. The current navigation is **always visible** in a horizontal layout with navigation links and a theme toggle. At the **768px breakpoint**, the navigation reduces spacing but maintains the same horizontal structure. A hamburger menu implementation would need to:

1. Hide the horizontal `.nav-links` on mobile screens (below 768px)
2. Show a hamburger button that toggles a mobile menu overlay/drawer
3. Integrate the existing ThemeToggle component into the mobile menu
4. Leverage existing View Transitions for smooth animations
5. Follow the established design system (CSS variables, spacing, typography)
6. Maintain accessibility patterns (focus states, ARIA labels)

The site currently has **no modal, drawer, or overlay components**, so this would be a new pattern to introduce. However, the codebase provides strong foundations: a comprehensive CSS design system, View Transitions support, theme-aware styling, and clean Astro component architecture.

## Detailed Findings

### 1. Current Navigation Structure

**Location**: `/Users/seankim/dev/portfolio/src/layouts/BaseLayout.astro:61-69`

```astro
<nav>
    <a href="/" class="logo">Sean Woojin Kim</a>
    <div class="nav-links">
        <a href="/" class={activePage === 'work' ? 'active' : ''}>Work</a>
        <a href="/writing" class={activePage === 'writing' ? 'active' : ''}>Notes</a>
        <a href="/about" class={activePage === 'about' ? 'active' : ''}>About</a>
        <ThemeToggle />
    </div>
</nav>
```

**Navigation Elements**:
- Logo link: "Sean Woojin Kim" (left-aligned)
- Navigation links container: `.nav-links` (right-aligned)
  - Work link (/)
  - Notes link (/writing)
  - About link (/about)
  - ThemeToggle component (sun/moon icon button)

**Active State Indicator**: Active pages receive a 2px bottom border (`/Users/seankim/dev/portfolio/src/styles/style.css:284-292`)

```css
.nav-links a.active::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--color-text-primary);
}
```

### 2. Current Navigation Styling

**Primary Nav Styles**: `/Users/seankim/dev/portfolio/src/styles/style.css:240-292`

```css
nav {
    margin-bottom: var(--space-8);
    padding-bottom: var(--space-3);
    border-bottom: var(--border-major);
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}

.nav-links {
    display: flex;
    gap: var(--space-5);  /* 40px gap between items */
}

.nav-links a {
    font-size: var(--text-base);
    font-weight: 400;
    letter-spacing: -0.01em;
    text-decoration: none;
    color: var(--color-text-secondary);
    transition: color 0.2s ease;
    position: relative;
}
```

**Key Spacing Values**:
- `--space-5`: 2.5rem (40px) - nav item gap
- `--space-3`: 1.5rem (24px) - nav bottom padding
- `--space-8`: 5rem (80px) - nav bottom margin

### 3. Responsive Design Current State

**Breakpoint**: 768px (single mobile breakpoint)

**Current Mobile Behavior**: `/Users/seankim/dev/portfolio/src/styles/style.css:670-705`

```css
@media (max-width: 768px) {
    .container {
        padding: var(--space-5) var(--space-3);
    }

    .nav-links {
        gap: var(--space-3);  /* Reduces from 40px to 24px */
    }

    .grid {
        grid-template-columns: 1fr;
    }

    /* ... other responsive adjustments */
}
```

**Current Limitation**: The navigation remains horizontal on mobile, but with reduced spacing. On very small screens (< 400px), this causes:
- Navigation links to potentially wrap
- ThemeToggle button to push off-screen
- Poor touch target sizing

### 4. Design System & CSS Framework

**Framework**: Pure CSS with CSS Custom Properties (no Tailwind, Bootstrap, or CSS-in-JS)

**Design System**: `/Users/seankim/dev/portfolio/src/styles/style.css:40-125`

**Key Variables for Mobile Menu**:
```css
/* Typography */
--text-xs: 0.8125rem;    /* 13px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.25rem;      /* 20px */

/* Spacing (8px grid) */
--space-1: 0.5rem;   /* 8px */
--space-2: 1rem;     /* 16px */
--space-3: 1.5rem;   /* 24px */
--space-4: 2rem;     /* 32px */
--space-5: 2.5rem;   /* 40px */

/* Colors - Theme-aware */
--color-text-primary: #000;
--color-text-secondary: #666;
--color-bg-secondary: rgba(255, 255, 255, 0.5);
--color-border-major: rgba(0, 0, 0, 0.1);
--color-border-interactive: #000;
```

**Dark Mode**: Controlled via `html.dark-mode` class on documentElement (`/Users/seankim/dev/portfolio/src/styles/style.css:128-182`)

**Backdrop Blur**: Used extensively for glassmorphism effect
```css
backdrop-filter: blur(8px);
-webkit-backdrop-filter: blur(8px);
```

### 5. Component Architecture (Astro Framework)

**Framework**: Astro 4.0 (Static Site Generation)

**Component Pattern**: `/Users/seankim/dev/portfolio/src/components/ThemeToggle.astro`

Astro components consist of:
1. **Frontmatter** (`---` section): TypeScript/JavaScript logic
2. **Template**: HTML with component syntax
3. **Styles**: Scoped `<style>` blocks
4. **Scripts**: `<script>` blocks for client-side interactivity

**Key Scripts**:
- `<script>`: Bundled and runs per component instance
- `<script is:inline>`: Inline, unbundled script (used for theme init)

**Props Interface Pattern** (example from ThemeToggle):
```typescript
interface Props {
  title: string;
  activePage?: 'work' | 'writing' | 'about';
}
```

**Content Collections**: `/Users/seankim/dev/portfolio/src/content/config.ts`
- Projects (data collection, JSON)
- Writing (content collection, Markdown)
- Pages (content collection, Markdown)

### 6. Theme Integration

**ThemeToggle Component**: `/Users/seankim/dev/portfolio/src/components/ThemeToggle.astro`

**Implementation Details**:
- **Storage**: localStorage (`theme-preference`)
- **Class Toggle**: `html.dark-mode` on `document.documentElement`
- **Icons**: SVG sun (dark mode) and moon (light mode)
- **Initialization**: Runs inline before render to prevent flash (`/Users/seankim/dev/portfolio/src/layouts/BaseLayout.astro:24-32`)
- **View Transitions**: Re-initializes on `astro:after-swap` event (line 117)

**Accessibility**:
- Dynamic `aria-label` based on current theme
- Keyboard focus outline: `2px solid var(--color-border-interactive)`

**Integration Recommendation**: The ThemeToggle should appear **inside** the mobile menu to maintain context and reduce header clutter.

### 7. Animation Patterns & View Transitions

**View Transitions**: `/Users/seankim/dev/portfolio/src/layouts/BaseLayout.astro:34`

```astro
import { ViewTransitions } from 'astro:transitions';
<ViewTransitions />
```

**Persistent Elements**: `/Users/seankim/dev/portfolio/src/components/KoiBackground.astro:5`

```astro
<div id="koi-canvas" transition:name="koi-canvas" transition:persist></div>
```

**Existing Transition Patterns**:
- All page navigations use View Transitions API
- Koi canvas persists across page changes
- Theme toggle re-initializes after view transition
- Smooth color transitions: `transition: color 0.2s ease`

**Animation Library**: None (pure CSS transitions)

**Recommended Pattern for Mobile Menu**:
```css
.mobile-menu {
    transition: transform 0.3s ease;
    transform: translateX(100%); /* Start off-screen */
}

.mobile-menu.open {
    transform: translateX(0); /* Slide in */
}
```

### 8. Existing Modal/Overlay Patterns

**Finding**: No existing modal, drawer, or overlay components found in the codebase.

**Implication**: This is a new pattern to introduce. The implementation should:
- Follow the established design system
- Use existing CSS variables
- Apply backdrop-filter blur for consistency
- Respect theme colors
- Include proper focus trapping for accessibility

### 9. Hamburger Menu Requirements

**Where to Display**:
- Mobile screens: `@media (max-width: 768px)`
- Position: Top-right of navigation (replace visible `.nav-links`)

**Recommended Breakpoint Strategy**:
```css
/* Desktop: Show full nav */
@media (min-width: 769px) {
    .hamburger-button { display: none; }
    .nav-links { display: flex; }
    .mobile-menu { display: none; }
}

/* Mobile: Show hamburger */
@media (max-width: 768px) {
    .hamburger-button { display: flex; }
    .nav-links { display: none; }
}
```

**Menu Pattern**: Slide-out drawer (recommended over dropdown)
- **Reason**: More touch-friendly, provides space for larger tap targets
- **Direction**: Slide from right (follows natural reading direction)
- **Overlay**: Semi-transparent backdrop for focus

**Elements to Include**:
1. Work link
2. Notes link
3. About link
4. ThemeToggle component
5. Optional: Footer social links (Email, GitHub, Instagram) for quick access

**Touch Target Sizing**:
- Minimum: 44x44px (iOS recommendation)
- Recommended: 48x48px (Material Design)
- Current nav links: 16px font + padding (likely undersized for mobile)

### 10. Technical Constraints & Considerations

**Performance**:
- No runtime CSS-in-JS overhead
- Static site generation (all pages pre-rendered)
- Minimal JavaScript (only for interactivity)
- KoiBackground uses p5.js (already loaded): `/Users/seankim/dev/portfolio/src/components/KoiBackground.astro:7`

**Accessibility Checklist**:
- Focus trapping in mobile menu
- ESC key to close menu
- Click outside to close (optional)
- ARIA attributes: `aria-expanded`, `aria-controls`, `aria-label`
- Prevent body scroll when menu open
- Keyboard navigation support

**Browser Compatibility**:
- Backdrop-filter: Already used (has fallbacks with `-webkit-` prefix)
- View Transitions API: Progressive enhancement (falls back to instant navigation)
- CSS Custom Properties: Widely supported (IE11 not a concern for 2025)

**State Management**:
- No global state library (React Context, Zustand, etc.)
- Component-level state via vanilla JavaScript
- localStorage for theme persistence
- Recommendation: Use simple `data-*` attributes or class toggles

**Font Loading**:
- Apercu font with `font-display: swap` (`/Users/seankim/dev/portfolio/src/styles/style.css:12`)
- FOUT (Flash of Unstyled Text) acceptable vs blocking

### 11. Implementation Strategy

Based on the research, here's the recommended implementation approach:

#### Step 1: Create Hamburger Button Component

**File**: `/Users/seankim/dev/portfolio/src/components/HamburgerButton.astro`

**Features**:
- Animated hamburger icon (3 lines → X)
- Accessibility: proper ARIA labels
- Click handler to toggle menu state
- Styled using design system variables

#### Step 2: Create Mobile Menu Component

**File**: `/Users/seankim/dev/portfolio/src/components/MobileMenu.astro`

**Features**:
- Slide-out drawer from right
- Backdrop overlay with blur
- Contains nav links + ThemeToggle
- Closes on link click (for navigation)
- Closes on backdrop click or ESC key

#### Step 3: Update BaseLayout

**File**: `/Users/seankim/dev/portfolio/src/layouts/BaseLayout.astro`

**Changes**:
- Import HamburgerButton and MobileMenu
- Add components to nav structure
- Pass `activePage` prop to mobile menu

#### Step 4: Add Responsive CSS

**File**: `/Users/seankim/dev/portfolio/src/styles/style.css`

**Changes**:
- Hide `.nav-links` on mobile (< 768px)
- Show `.hamburger-button` on mobile
- Add mobile menu styles (drawer, overlay, animations)
- Ensure proper z-index layering (KoiBackground is z-index: -1)

#### Step 5: Add Menu State Management

**Approach**: Vanilla JavaScript with View Transitions support

**Pattern**:
```javascript
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-button');
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');

  // Toggle menu
  // Close on backdrop click
  // Close on ESC key
  // Prevent body scroll
  // Handle View Transitions re-init
}

initMobileMenu();
document.addEventListener('astro:after-swap', initMobileMenu);
```

### 12. Example Code Structure

**Mobile Menu Layout**:
```html
<!-- Mobile-only hamburger button -->
<button id="hamburger-button" class="hamburger-button" aria-label="Open menu">
  <span></span>
  <span></span>
  <span></span>
</button>

<!-- Mobile menu drawer -->
<div id="mobile-menu" class="mobile-menu" aria-hidden="true">
  <div class="mobile-menu-header">
    <button id="close-menu" aria-label="Close menu">×</button>
  </div>
  <nav class="mobile-nav">
    <a href="/" class={activePage === 'work' ? 'active' : ''}>Work</a>
    <a href="/writing" class={activePage === 'writing' ? 'active' : ''}>Notes</a>
    <a href="/about" class={activePage === 'about' ? 'active' : ''}>About</a>
    <ThemeToggle />
  </nav>
</div>

<!-- Overlay backdrop -->
<div id="mobile-overlay" class="mobile-overlay"></div>
```

**CSS Pattern**:
```css
.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: var(--color-bg-secondary);
  backdrop-filter: blur(16px);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 1000;
  padding: var(--space-5);
}

.mobile-menu.open {
  transform: translateX(0);
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 999;
}

.mobile-overlay.open {
  opacity: 1;
  pointer-events: auto;
}
```

### 13. Z-Index Layering

**Current Layers**:
- KoiBackground: `z-index: -1` (behind all content)
- Regular content: default stacking context
- Footer: default stacking context

**Recommended Mobile Menu Layers**:
- Mobile overlay: `z-index: 999`
- Mobile menu drawer: `z-index: 1000`
- Focus trap/modals: `z-index: 1001+` (future use)

### 14. Accessibility Implementation Details

**Focus Trapping**:
```javascript
// Trap focus within mobile menu when open
const focusableElements = menu.querySelectorAll(
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
);
const firstFocusable = focusableElements[0];
const lastFocusable = focusableElements[focusableElements.length - 1];

// Handle Tab key to loop focus
menu.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === firstFocusable) {
      lastFocusable.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
      firstFocusable.focus();
      e.preventDefault();
    }
  }
});
```

**Body Scroll Lock**:
```javascript
function lockScroll() {
  document.body.style.overflow = 'hidden';
}

function unlockScroll() {
  document.body.style.overflow = '';
}
```

**ARIA States**:
```javascript
// When opening menu
menu.setAttribute('aria-hidden', 'false');
hamburger.setAttribute('aria-expanded', 'true');

// When closing menu
menu.setAttribute('aria-hidden', 'true');
hamburger.setAttribute('aria-expanded', 'false');
```

## Code References

- `/Users/seankim/dev/portfolio/src/layouts/BaseLayout.astro:61-69` - Current navigation structure
- `/Users/seankim/dev/portfolio/src/layouts/BaseLayout.astro:24-32` - Theme initialization script
- `/Users/seankim/dev/portfolio/src/styles/style.css:240-292` - Navigation styles
- `/Users/seankim/dev/portfolio/src/styles/style.css:670-705` - Responsive breakpoints
- `/Users/seankim/dev/portfolio/src/styles/style.css:40-125` - Design system variables
- `/Users/seankim/dev/portfolio/src/components/ThemeToggle.astro` - Theme toggle component (to be integrated in mobile menu)
- `/Users/seankim/dev/portfolio/src/components/KoiBackground.astro:5` - View Transitions persist example
- `/Users/seankim/dev/portfolio/package.json:7-10` - Build scripts and Astro version

## Architecture Documentation

### File Structure
```
src/
├── layouts/
│   └── BaseLayout.astro          # Main layout with navigation
├── components/
│   ├── ThemeToggle.astro         # Sun/moon theme toggle
│   ├── ProjectCard.astro         # Project grid item
│   ├── KoiBackground.astro       # Animated background
│   └── FillerBlock.astro         # Grid filler
├── styles/
│   └── style.css                 # Global styles + design system
├── pages/
│   ├── index.astro               # Work page
│   ├── about.astro               # About page
│   └── writing/
│       ├── index.astro           # Writing list
│       └── [slug].astro          # Individual posts
└── content/
    ├── config.ts                 # Content collections schema
    ├── projects/                 # Project data (JSON)
    ├── writing/                  # Blog posts (Markdown)
    └── pages/                    # Static pages (Markdown)
```

### Current Patterns

**Layout Inheritance**:
- All pages extend `BaseLayout.astro`
- BaseLayout provides: `<head>`, navigation, footer, global styles
- Pages provide: content via `<slot />`

**Component Composition**:
- Props via TypeScript interfaces
- Scoped styles in `<style>` blocks
- Client-side scripts with View Transitions support

**State Management**:
- No global state library
- localStorage for theme preference
- Component-level vanilla JavaScript

**Styling Approach**:
- CSS Custom Properties for theming
- No utility classes (not Tailwind)
- BEM-like naming (`.nav-links`, `.card-title`, etc.)
- 8px spacing grid system
- Modular type scale (1.25 ratio)

## Historical Context

No previous research documents or implementation notes found in the `thoughts/` directory related to navigation or mobile menu patterns.

## Related Research

No related research documents found.

## Open Questions

1. **Menu Slide Direction**: Should the mobile menu slide from right (natural for LTR) or left (alternative)?
2. **Close on Navigation**: Should the menu auto-close when a link is clicked, or stay open for multi-page browsing?
3. **Footer Links in Menu**: Should social links (Email, GitHub, Instagram) be duplicated in the mobile menu for convenience?
4. **Animation Duration**: 300ms is standard, but should it be faster (200ms) for snappier feel or slower (400ms) for smoother motion?
5. **Breakpoint Threshold**: Is 768px the right cutoff, or should it be adjusted based on logo + nav content width?
6. **Hamburger Icon Style**: Three-line hamburger (standard), or a custom icon matching the site aesthetic?
7. **Active Page Indicator**: How should the active page be indicated in the mobile menu? Bottom border won't work in vertical layout.

## Recommended Next Steps

1. **Create Hamburger Button Component** with animated icon (lines → X)
2. **Create Mobile Menu Component** with slide-out drawer pattern
3. **Update BaseLayout** to conditionally show desktop nav vs mobile hamburger
4. **Add Responsive CSS** to hide/show components at 768px breakpoint
5. **Implement Menu Toggle Logic** with accessibility features (focus trap, scroll lock, ESC key)
6. **Test Across Devices** to ensure touch targets are adequate (44px+)
7. **Verify Theme Toggle Integration** works inside mobile menu
8. **Add View Transitions Support** for menu state across page navigations (if desired)
9. **Consider Active State Styling** for mobile menu items (background highlight vs border)
10. **Performance Test** to ensure menu animations are smooth (60fps)
