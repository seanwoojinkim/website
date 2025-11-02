---
doc_type: plan
date: 2025-11-02T14:26:31+00:00
title: "Responsive Hamburger Menu Implementation"
feature: "responsive-hamburger-menu"
plan_reference: research:2025-11-02-navigation-implementation-and-responsive-hamburger-menu-design

# Update phase status as implementation progresses
phases:
  - name: "Phase 1: HamburgerButton Component"
    status: completed
  - name: "Phase 2: MobileMenu Component"
    status: completed
  - name: "Phase 3: JavaScript Interactivity"
    status: completed
  - name: "Phase 4: BaseLayout Integration"
    status: completed
  - name: "Phase 5: Social Links & Polish"
    status: in_progress

git_commit: 9d2498e17d2be488835ee02d52008936f77b0d6e
branch: main
repository: portfolio

created_by: seanwoojinkim
last_updated: 2025-11-02
last_updated_by: claude
last_updated_note: "Phases 1-4 completed successfully. Phase 5 in progress - implementation complete, testing pending."

tags:
  - navigation
  - responsive-design
  - mobile-ui
  - astro
  - accessibility
status: in_progress

related_docs: []
---

# Responsive Hamburger Menu Implementation Plan

**Date**: November 2, 2025
**Feature**: Responsive Hamburger Menu
**Plan Reference**: `thoughts/research/2025-11-02-navigation-implementation-and-responsive-hamburger-menu-design.md`

## Overview

### Problem Statement

The current navigation layout (`BaseLayout.astro:61-69`) displays horizontally on all screen sizes, reducing spacing at the 768px breakpoint but maintaining the same structure. On very small screens (< 400px), this creates usability issues:

- Navigation links can wrap to multiple lines
- ThemeToggle button may be pushed off-screen
- Touch targets are too small (< 44px)
- Horizontal space is insufficient for comfortable navigation

### Proposed Solution

Implement a responsive hamburger menu that:

1. Displays a slide-out drawer menu on mobile devices (< 768px)
2. Slides in from the right with smooth 400ms animation
3. Contains navigation links, theme toggle, and social links
4. Automatically closes when navigating to a new page
5. Includes full accessibility features (focus trap, ESC key, scroll lock)
6. Maintains active page indicators matching desktop navigation
7. Preserves theme toggle functionality inside mobile menu
8. Works seamlessly with Astro View Transitions API

### Success Criteria

**Functional Requirements**:
- Hamburger button appears only on mobile (< 768px)
- Menu slides from right with translateX animation (400ms)
- Menu closes on navigation, ESC key, or backdrop click
- Active page shows underline indicator matching desktop
- Theme toggle works identically inside mobile menu
- Social links (Email, GitHub, Instagram) accessible in menu
- Body scroll locks when menu is open

**Accessibility Requirements**:
- Focus traps within open menu
- ESC key closes menu
- ARIA attributes properly set (aria-expanded, aria-hidden, aria-label)
- Touch targets minimum 48px
- Keyboard navigation fully functional

**Visual Requirements**:
- Hamburger icon animates to X when open (☰ → ✕)
- Semi-transparent backdrop with blur effect
- Consistent with design system (colors, spacing, typography)
- Smooth animations matching site aesthetic (400ms ease)
- Active page underline uses existing style

**Performance Requirements**:
- No layout shift when toggling menu
- 60fps animations
- No impact on View Transitions behavior
- Works across page navigations

## Current State Analysis

### Navigation Architecture

**File**: `/Users/seankim/dev/portfolio/src/layouts/BaseLayout.astro`

**Current Structure (lines 61-69)**:
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

**Key Components**:
- Logo: "Sean Woojin Kim" (left-aligned)
- Nav links container: `.nav-links` (right-aligned)
- Three navigation links with active state support
- ThemeToggle component integrated inline

**Active Page Indicator**: `/Users/seankim/dev/portfolio/src/styles/style.css:284-292`
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

**Social Links**: Located in footer (`BaseLayout.astro:74-80`)
```astro
<footer>
    <span>© 2025 Sean Kim</span>
    <div style="display: flex; gap: 20px;">
        <a href="mailto:seanwoojinkim@gmail.com">Email</a>
        <a href="https://github.com/seanwoojinkim" target="_blank">GitHub</a>
        <a href="https://instagram.com/seanwooj" target="_blank">Instagram</a>
    </div>
</footer>
```

### Responsive Behavior

**Current Mobile Styles**: `/Users/seankim/dev/portfolio/src/styles/style.css:670-705`

```css
@media (max-width: 768px) {
    .container {
        padding: var(--space-5) var(--space-3);
    }

    .nav-links {
        gap: var(--space-3);  /* Reduces from 40px to 24px */
    }

    /* ... other responsive adjustments */
}
```

**Limitation**: Navigation maintains horizontal layout on mobile with reduced spacing only.

### Design System

**CSS Variables** (`/Users/seankim/dev/portfolio/src/styles/style.css:40-125`):

**Spacing** (8px grid):
- `--space-1`: 8px
- `--space-2`: 16px
- `--space-3`: 24px
- `--space-4`: 32px
- `--space-5`: 40px
- `--space-6`: 48px

**Typography**:
- `--text-xs`: 13px (UI labels)
- `--text-sm`: 14px (secondary text)
- `--text-base`: 16px (body text)
- `--text-lg`: 20px (headings)

**Colors** (theme-aware):
- `--color-text-primary`: #000 (light) / #f5f5f5 (dark)
- `--color-text-secondary`: #666 (light) / #b8b8b8 (dark)
- `--color-bg-secondary`: rgba(255,255,255,0.5) (light) / rgba(255,255,255,0.06) (dark)
- `--color-border-interactive`: #000 (light) / #f5f5f5 (dark)

**Backdrop Blur Pattern** (used throughout site):
```css
backdrop-filter: blur(8px);
-webkit-backdrop-filter: blur(8px);
```

### ThemeToggle Component

**File**: `/Users/seankim/dev/portfolio/src/components/ThemeToggle.astro`

**Implementation**:
- Toggles `html.dark-mode` class on `document.documentElement`
- Persists preference to `localStorage` (`theme-preference`)
- Re-initializes on View Transitions (`astro:after-swap` event, line 117)
- Uses SVG sun/moon icons (20x20px)
- Accessibility: Dynamic `aria-label`, keyboard focus outline

**Integration Note**: Must work identically when placed inside mobile menu.

### View Transitions

**Setup**: `/Users/seankim/dev/portfolio/src/layouts/BaseLayout.astro:34`
```astro
import { ViewTransitions } from 'astro:transitions';
<ViewTransitions />
```

**Pattern**: All page navigations use View Transitions API
**Consideration**: Mobile menu state must be managed across page transitions

### Z-Index Layers

**Current Layers**:
- KoiBackground: `z-index: -1` (behind all content)
- Regular content: default stacking context

**Required for Mobile Menu**:
- Mobile backdrop overlay: `z-index: 999`
- Mobile menu drawer: `z-index: 1000`

## Requirements Analysis

### Functional Requirements

**FR-1: Hamburger Button Display**
- Visible only on screens < 768px
- Located in top-right navigation area (replaces visible `.nav-links`)
- Animated icon: three lines (☰) → X when menu open
- ARIA attributes: `aria-expanded`, `aria-label`, `aria-controls`
- Touch target: minimum 48x48px

**FR-2: Mobile Menu Drawer**
- Slides from right side of screen
- Animation: `translateX(100%)` → `translateX(0)` in 400ms
- Width: 280px (fixed)
- Height: 100vh (full viewport height)
- Contains: nav links, theme toggle, social links
- Semi-transparent background with blur effect
- Z-index: 1000 (above backdrop)

**FR-3: Backdrop Overlay**
- Full-screen semi-transparent overlay
- Background: `rgba(0, 0, 0, 0.4)`
- Backdrop filter: `blur(8px)`
- Clicking backdrop closes menu
- Z-index: 999 (below menu)
- Animates opacity: 0 → 1 in 400ms

**FR-4: Navigation Links in Menu**
- Vertical layout with generous spacing
- Same three links: Work, Notes, About
- Active page indicator: underline (matching desktop)
- Touch targets: minimum 48px height
- Font size: `var(--text-lg)` (20px) for improved readability

**FR-5: Theme Toggle in Menu**
- Positioned within menu (not in hamburger button area)
- Identical functionality to desktop version
- Same icon size and styling
- Works with View Transitions re-initialization

**FR-6: Social Links in Menu**
- Email, GitHub, Instagram links
- Positioned at bottom of menu
- Smaller text size: `var(--text-sm)` (14px)
- Subtle separator from navigation links

**FR-7: Auto-close on Navigation**
- Menu automatically closes when user clicks any navigation link
- Ensures clean transition to new page
- Restores body scroll

**FR-8: Manual Close Options**
- ESC key press
- Backdrop click
- Close button (X) in menu header
- All methods restore body scroll

**FR-9: Body Scroll Lock**
- Prevent background scrolling when menu open
- Set `body { overflow: hidden }` when menu opens
- Restore original overflow state when menu closes

**FR-10: View Transitions Compatibility**
- Menu state resets on page navigation
- Event handlers re-initialize after `astro:after-swap`
- No conflicts with existing View Transitions setup

### Technical Requirements

**TR-1: Component Architecture**
- Create `HamburgerButton.astro` component
- Create `MobileMenu.astro` component
- Integrate both into `BaseLayout.astro`
- Maintain Astro component patterns (TypeScript interfaces, scoped styles)

**TR-2: State Management**
- Use vanilla JavaScript (no external libraries)
- Track menu open/closed state
- Handle focus management
- Re-initialize on View Transitions

**TR-3: Animation Performance**
- CSS transitions for smooth 60fps animations
- Transform-based animations (GPU accelerated)
- No layout thrashing
- Animation duration: 400ms ease

**TR-4: Responsive CSS**
- Hide `.nav-links` on mobile (< 768px)
- Show `.hamburger-button` on mobile
- Hide `.hamburger-button` on desktop (>= 768px)
- Show `.nav-links` on desktop
- Mobile menu: `display: none` on desktop

**TR-5: Accessibility**
- Focus trap within open menu
- Tab order loops between menu items
- ESC key closes menu and returns focus
- ARIA attributes properly set and updated
- Semantic HTML structure
- Keyboard-only navigation fully functional

**TR-6: Browser Compatibility**
- Backdrop-filter with `-webkit-` prefix
- View Transitions as progressive enhancement
- CSS Custom Properties (ES6+ browsers)
- Touch event handling for mobile

### Out of Scope

**OS-1: Desktop Hamburger Menu**
- No hamburger menu on desktop (>= 768px)
- Desktop retains existing horizontal navigation

**OS-2: Submenu or Dropdown Navigation**
- No nested navigation structure
- Flat navigation hierarchy only

**OS-3: Search Functionality**
- No search bar in mobile menu
- Not part of current navigation

**OS-4: Persistent Menu State**
- Menu state not persisted to localStorage
- Always closed on page load/refresh

**OS-5: Swipe Gestures**
- No swipe-to-close functionality
- Touch interactions limited to tap/click

**OS-6: Menu Animations on Orientation Change**
- No special handling for orientation changes
- Standard responsive behavior only

## Architecture Design

### Component Structure

```
src/
├── layouts/
│   └── BaseLayout.astro          # Updated with mobile menu integration
├── components/
│   ├── HamburgerButton.astro     # NEW: Animated hamburger icon
│   ├── MobileMenu.astro          # NEW: Slide-out drawer menu
│   └── ThemeToggle.astro         # Existing (reused in mobile menu)
└── styles/
    └── style.css                 # Updated with mobile menu styles
```

### Component Responsibilities

**HamburgerButton.astro**:
- Renders animated hamburger icon (3 lines)
- Toggles between hamburger (☰) and X (✕)
- Emits click events to toggle menu
- ARIA attributes for accessibility
- Visible only on mobile (< 768px)

**MobileMenu.astro**:
- Renders slide-out drawer from right
- Contains navigation links structure
- Includes ThemeToggle component
- Includes social links section
- Handles backdrop overlay
- Manages open/closed visual states
- Provides close button

**BaseLayout.astro** (updated):
- Imports HamburgerButton and MobileMenu
- Conditionally displays mobile vs desktop nav
- Passes `activePage` prop to mobile menu
- Maintains existing desktop navigation
- Includes menu toggle JavaScript

### HTML Structure

```html
<nav>
    <a href="/" class="logo">Sean Woojin Kim</a>

    <!-- Desktop navigation (hidden on mobile) -->
    <div class="nav-links">
        <a href="/">Work</a>
        <a href="/writing">Notes</a>
        <a href="/about">About</a>
        <ThemeToggle />
    </div>

    <!-- Mobile hamburger button (hidden on desktop) -->
    <HamburgerButton />
</nav>

<!-- Mobile menu drawer (hidden on desktop) -->
<MobileMenu activePage={activePage} />

<!-- Mobile backdrop overlay -->
<div id="mobile-overlay" class="mobile-overlay"></div>
```

### CSS Architecture

**Responsive Strategy**:
```css
/* Desktop (>= 768px) */
@media (min-width: 768px) {
    .hamburger-button { display: none; }
    .nav-links { display: flex; }
    .mobile-menu { display: none; }
    .mobile-overlay { display: none; }
}

/* Mobile (< 768px) */
@media (max-width: 767px) {
    .hamburger-button { display: flex; }
    .nav-links { display: none; }
}
```

**Animation Pattern**:
```css
.mobile-menu {
    transform: translateX(100%);
    transition: transform 400ms ease;
}

.mobile-menu.open {
    transform: translateX(0);
}

.mobile-overlay {
    opacity: 0;
    pointer-events: none;
    transition: opacity 400ms ease;
}

.mobile-overlay.open {
    opacity: 1;
    pointer-events: auto;
}
```

### JavaScript State Management

**State Variables**:
- `isMenuOpen`: Boolean tracking menu state
- `focusableElements`: NodeList of focusable elements in menu
- `previousFocus`: Element to return focus to when closing

**Event Handlers**:
- Hamburger button click: Toggle menu open/closed
- Close button click: Close menu
- Backdrop click: Close menu
- ESC key press: Close menu
- Navigation link click: Close menu
- Tab key: Trap focus within menu

**View Transitions Integration**:
```javascript
function initMobileMenu() {
    // Initialize menu state and event handlers
}

// Initialize on load
initMobileMenu();

// Re-initialize after View Transitions
document.addEventListener('astro:after-swap', initMobileMenu);
```

## Phase-by-Phase Implementation

---

## Phase 1: HamburgerButton Component

### Objective
Create an animated hamburger button component that toggles between hamburger (☰) and X (✕) states with proper accessibility attributes.

### Prerequisites
- Access to `/Users/seankim/dev/portfolio/src/components/`
- Understanding of Astro component structure
- Design system variables available in CSS

### Files to Create

**File**: `/Users/seankim/dev/portfolio/src/components/HamburgerButton.astro`

**Complete Code**:
```astro
---
// HamburgerButton.astro - Animated hamburger menu button
---

<button
  id="hamburger-button"
  class="hamburger-button"
  aria-label="Open menu"
  aria-expanded="false"
  aria-controls="mobile-menu"
  type="button"
>
  <span class="hamburger-line"></span>
  <span class="hamburger-line"></span>
  <span class="hamburger-line"></span>
</button>

<style>
  .hamburger-button {
    display: none; /* Hidden by default, shown on mobile via media query */
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    background: none;
    border: none;
    padding: 12px;
    cursor: pointer;
    position: relative;
    z-index: 1001;
  }

  .hamburger-button:focus {
    outline: 2px solid var(--color-border-interactive);
    outline-offset: 2px;
  }

  .hamburger-line {
    width: 24px;
    height: 2px;
    background-color: var(--color-text-primary);
    transition: all 400ms ease;
    position: absolute;
  }

  .hamburger-line:nth-child(1) {
    top: 14px;
  }

  .hamburger-line:nth-child(2) {
    top: 23px;
  }

  .hamburger-line:nth-child(3) {
    top: 32px;
  }

  /* Open state - transform to X */
  .hamburger-button.open .hamburger-line:nth-child(1) {
    top: 23px;
    transform: rotate(45deg);
  }

  .hamburger-button.open .hamburger-line:nth-child(2) {
    opacity: 0;
  }

  .hamburger-button.open .hamburger-line:nth-child(3) {
    top: 23px;
    transform: rotate(-45deg);
  }

  /* Show on mobile only */
  @media (max-width: 767px) {
    .hamburger-button {
      display: flex;
    }
  }
</style>
```

### Implementation Steps

1. **Create the component file**
   - Navigate to `/Users/seankim/dev/portfolio/src/components/`
   - Create new file: `HamburgerButton.astro`
   - Paste the complete code above

2. **Verify component structure**
   - Confirm three `<span>` elements for hamburger lines
   - Check ARIA attributes are present
   - Verify CSS is scoped within `<style>` block

3. **Review styling**
   - 48x48px touch target (meets accessibility minimum)
   - Uses design system color variables (`--color-text-primary`)
   - 400ms animation timing matches requirement
   - Focus outline matches existing ThemeToggle pattern

4. **Check responsive behavior**
   - Default `display: none` (hidden on desktop)
   - Media query shows button only on mobile (< 768px)

### Accessibility Requirements

- **Touch Target**: 48x48px (exceeds 44px minimum)
- **ARIA Attributes**:
  - `aria-label`: Descriptive label for screen readers
  - `aria-expanded`: Indicates menu state (updated via JavaScript)
  - `aria-controls`: Links button to menu element
- **Focus Indicator**: 2px solid outline with offset
- **Semantic HTML**: Uses `<button>` element with `type="button"`

### Success Criteria

**Visual**:
- Button displays as three horizontal lines (hamburger icon)
- Lines are 24px wide, 2px tall, with proper spacing
- Button size is 48x48px with centered icon
- Color matches `--color-text-primary` (theme-aware)

**Functional**:
- Button only visible on screens < 768px
- Focus outline appears on keyboard focus
- Button renders without JavaScript errors
- No layout shift when button appears/disappears at breakpoint

**Code Quality**:
- No TypeScript errors
- Scoped styles don't leak to other components
- Uses established design system variables
- Follows existing component patterns

### Testing Instructions

**Manual Testing**:
1. Start dev server: `npm run dev`
2. Import component in BaseLayout (see Phase 4 for full integration)
3. View site at localhost:4321
4. Resize browser to < 768px
5. Verify button appears in navigation
6. Check button size with browser inspector (should be 48x48px)
7. Test focus state with keyboard (Tab to button)
8. Verify focus outline appears
9. Toggle theme and confirm icon color changes

**Accessibility Testing**:
1. Use screen reader (VoiceOver on macOS: Cmd+F5)
2. Navigate to button
3. Verify label reads "Open menu"
4. Check `aria-expanded` is set to "false"
5. Confirm `aria-controls` points to "mobile-menu"

**Responsive Testing**:
1. Test at 767px (mobile - button visible)
2. Test at 768px (desktop - button hidden)
3. Verify no horizontal scrollbar appears
4. Check button position in navigation (right side)

### Rollback Procedure

If issues arise:
1. Delete `/Users/seankim/dev/portfolio/src/components/HamburgerButton.astro`
2. Remove import from BaseLayout (added in Phase 4)
3. Restart dev server
4. Verify site returns to previous state

**To preserve work**:
- Commit component separately before integration
- Use git branch for development
- Test in isolation before BaseLayout integration

---

## Phase 2: MobileMenu Component

### Objective
Create a slide-out mobile menu drawer that contains navigation links, theme toggle, and social links, with proper backdrop overlay and accessibility structure.

### Prerequisites
- Phase 1 completed (HamburgerButton created)
- Access to existing ThemeToggle component
- Understanding of Astro component props

### Files to Create

**File**: `/Users/seankim/dev/portfolio/src/components/MobileMenu.astro`

**Complete Code**:
```astro
---
// MobileMenu.astro - Slide-out mobile navigation drawer
import ThemeToggle from './ThemeToggle.astro';

interface Props {
  activePage?: 'work' | 'writing' | 'about';
}

const { activePage } = Astro.props;
---

<!-- Backdrop overlay -->
<div id="mobile-overlay" class="mobile-overlay" aria-hidden="true"></div>

<!-- Mobile menu drawer -->
<div
  id="mobile-menu"
  class="mobile-menu"
  aria-hidden="true"
  role="dialog"
  aria-modal="true"
  aria-label="Mobile navigation"
>
  <!-- Menu header with close button -->
  <div class="mobile-menu-header">
    <button
      id="close-menu-button"
      class="close-menu-button"
      aria-label="Close menu"
      type="button"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>

  <!-- Navigation links -->
  <nav class="mobile-nav">
    <a href="/" class={`mobile-nav-link ${activePage === 'work' ? 'active' : ''}`}>
      Work
    </a>
    <a href="/writing" class={`mobile-nav-link ${activePage === 'writing' ? 'active' : ''}`}>
      Notes
    </a>
    <a href="/about" class={`mobile-nav-link ${activePage === 'about' ? 'active' : ''}`}>
      About
    </a>
  </nav>

  <!-- Theme toggle -->
  <div class="mobile-theme-toggle">
    <ThemeToggle />
  </div>

  <!-- Social links -->
  <div class="mobile-social">
    <div class="mobile-social-label">Connect</div>
    <a href="mailto:seanwoojinkim@gmail.com" class="mobile-social-link">Email</a>
    <a href="https://github.com/seanwoojinkim" target="_blank" rel="noopener noreferrer" class="mobile-social-link">GitHub</a>
    <a href="https://instagram.com/seanwooj" target="_blank" rel="noopener noreferrer" class="mobile-social-link">Instagram</a>
  </div>
</div>

<style>
  /* Backdrop overlay */
  .mobile-overlay {
    display: none; /* Hidden on desktop */
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 400ms ease;
    z-index: 999;
  }

  .mobile-overlay.open {
    opacity: 1;
    pointer-events: auto;
  }

  /* Mobile menu drawer */
  .mobile-menu {
    display: none; /* Hidden on desktop */
    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    height: 100vh;
    background: var(--color-bg-secondary);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-left: 1px solid var(--color-border-component);
    transform: translateX(100%);
    transition: transform 400ms ease;
    z-index: 1000;
    padding: var(--space-5);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .mobile-menu.open {
    transform: translateX(0);
  }

  /* Menu header */
  .mobile-menu-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: var(--space-6);
  }

  .close-menu-button {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 12px;
    cursor: pointer;
    color: var(--color-text-secondary);
    transition: color 0.2s ease;
  }

  .close-menu-button:hover {
    color: var(--color-text-primary);
  }

  .close-menu-button:focus {
    outline: 2px solid var(--color-border-interactive);
    outline-offset: 2px;
  }

  /* Navigation links */
  .mobile-nav {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    margin-bottom: var(--space-6);
  }

  .mobile-nav-link {
    font-size: var(--text-lg);
    font-weight: 400;
    letter-spacing: -0.01em;
    text-decoration: none;
    color: var(--color-text-secondary);
    padding: var(--space-2) 0;
    transition: color 0.2s ease;
    position: relative;
    display: block;
    min-height: 48px;
    display: flex;
    align-items: center;
  }

  .mobile-nav-link:hover {
    color: var(--color-text-primary);
  }

  .mobile-nav-link:focus {
    outline: 2px solid var(--color-border-interactive);
    outline-offset: 2px;
  }

  /* Active page indicator - underline */
  .mobile-nav-link.active {
    color: var(--color-text-primary);
    font-weight: 500;
  }

  .mobile-nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background: var(--color-text-primary);
  }

  /* Theme toggle container */
  .mobile-theme-toggle {
    padding: var(--space-3) 0;
    border-top: 1px solid var(--color-border-minor);
    border-bottom: 1px solid var(--color-border-minor);
    margin-bottom: var(--space-6);
  }

  /* Social links section */
  .mobile-social {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .mobile-social-label {
    font-size: var(--text-xs);
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-text-tertiary);
    margin-bottom: var(--space-1);
  }

  .mobile-social-link {
    font-size: var(--text-sm);
    font-weight: 400;
    text-decoration: none;
    color: var(--color-text-secondary);
    padding: var(--space-1) 0;
    transition: color 0.2s ease;
    display: block;
  }

  .mobile-social-link:hover {
    color: var(--color-text-primary);
  }

  .mobile-social-link:focus {
    outline: 2px solid var(--color-border-interactive);
    outline-offset: 2px;
  }

  /* Show on mobile only */
  @media (max-width: 767px) {
    .mobile-overlay,
    .mobile-menu {
      display: block;
    }
  }
</style>
```

### Implementation Steps

1. **Create the component file**
   - Navigate to `/Users/seankim/dev/portfolio/src/components/`
   - Create new file: `MobileMenu.astro`
   - Paste the complete code above

2. **Verify component structure**
   - Backdrop overlay with ID `mobile-overlay`
   - Menu drawer with ID `mobile-menu`
   - Close button with ID `close-menu-button`
   - Navigation links with proper active state classes
   - ThemeToggle component imported and included
   - Social links section at bottom

3. **Review Props interface**
   - `activePage` prop accepts 'work', 'writing', or 'about'
   - Default value: undefined (no active page)
   - Used to set active class on navigation links

4. **Check accessibility structure**
   - Menu has `role="dialog"` and `aria-modal="true"`
   - `aria-hidden` toggles between "true" and "false"
   - Close button has descriptive `aria-label`
   - All interactive elements are keyboard focusable

5. **Verify responsive behavior**
   - Both overlay and menu hidden on desktop (`display: none`)
   - Media query shows both on mobile (< 768px)
   - Drawer starts off-screen (`translateX(100%)`)

### Accessibility Requirements

- **Dialog Role**: Menu has `role="dialog"` and `aria-modal="true"`
- **ARIA Hidden**: Properly toggles `aria-hidden` attribute
- **Touch Targets**: All interactive elements minimum 48px height
- **Focus Management**: All links and buttons are keyboard accessible
- **Focus Indicators**: 2px solid outline on focus
- **Semantic Structure**: Proper heading hierarchy and landmark roles
- **Color Contrast**: Text colors meet WCAG AA standards
- **External Links**: Social links have `rel="noopener noreferrer"` for security

### Success Criteria

**Visual**:
- Menu drawer is 280px wide, full viewport height
- Starts off-screen to the right
- Background is semi-transparent with blur effect
- Border on left edge separates from backdrop
- Navigation links have 20px font size (readable)
- Social links have 14px font size (secondary)
- Active page has underline indicator
- Close button shows X icon (24x24px)

**Functional**:
- Menu and overlay only visible on mobile (< 768px)
- Menu and overlay hidden on desktop
- Proper spacing between sections
- ThemeToggle renders correctly inside menu
- Active page class applied correctly
- All links are clickable
- Overflow scrolling works on tall screens

**Code Quality**:
- Props interface correctly typed
- ThemeToggle imported successfully
- No TypeScript errors
- Scoped styles don't leak
- Uses design system variables consistently
- Follows existing component patterns

### Testing Instructions

**Manual Testing**:
1. Start dev server: `npm run dev`
2. Temporarily add menu to BaseLayout with `.open` class:
   ```astro
   <MobileMenu activePage="work" />
   <style>
     #mobile-menu { transform: translateX(0); }
     #mobile-overlay { opacity: 1; pointer-events: auto; }
   </style>
   ```
3. Resize browser to < 768px
4. Verify menu appears on right side
5. Check all elements render correctly
6. Test each navigation link
7. Verify active state appears on "Work" page
8. Test theme toggle functionality
9. Click social links to verify they work
10. Remove temporary `.open` class after testing

**Responsive Testing**:
1. Test at 767px (mobile - menu visible when triggered)
2. Test at 768px (desktop - menu hidden)
3. Verify menu slides in from right edge
4. Check overflow scrolling on short viewports (< 600px height)
5. Test on real mobile device if possible

**Accessibility Testing**:
1. Navigate with keyboard only (Tab key)
2. Verify all links and buttons are reachable
3. Check focus indicators are visible
4. Test with screen reader (VoiceOver: Cmd+F5)
5. Verify dialog role is announced
6. Confirm aria-label for close button is read
7. Check external link warnings for social links

**Integration Testing**:
1. Pass different `activePage` props: 'work', 'writing', 'about'
2. Verify active state moves to correct link
3. Test with no `activePage` prop (all links inactive)
4. Confirm ThemeToggle works in menu context
5. Toggle theme and verify menu colors update

### Rollback Procedure

If issues arise:
1. Delete `/Users/seankim/dev/portfolio/src/components/MobileMenu.astro`
2. Remove import from BaseLayout (added in Phase 4)
3. Restart dev server
4. Verify site returns to previous state

**To preserve work**:
- Commit component separately before integration
- Use git branch for development
- Test in isolation before BaseLayout integration
- Take screenshots of visual state for reference

---

## Phase 3: JavaScript Interactivity

### Objective
Add JavaScript to manage menu state, handle open/close interactions, implement focus trapping, body scroll lock, and ensure compatibility with Astro View Transitions.

### Prerequisites
- Phase 1 completed (HamburgerButton created)
- Phase 2 completed (MobileMenu created)
- Understanding of Astro View Transitions lifecycle
- Knowledge of focus management and accessibility

### Files to Modify

**File**: `/Users/seankim/dev/portfolio/src/layouts/BaseLayout.astro`

**Location**: Add `<script>` block before closing `</body>` tag (after line 81)

**Complete JavaScript Code**:
```javascript
<script>
  function initMobileMenu() {
    // Get DOM elements
    const hamburgerButton = document.getElementById('hamburger-button');
    const closeButton = document.getElementById('close-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');

    // Check if elements exist (they won't on desktop)
    if (!hamburgerButton || !closeButton || !mobileMenu || !mobileOverlay) {
      return;
    }

    // State
    let isMenuOpen = false;
    let previousFocus = null;

    // Get all focusable elements in the menu
    function getFocusableElements() {
      return Array.from(
        mobileMenu.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
    }

    // Open menu
    function openMenu() {
      isMenuOpen = true;
      previousFocus = document.activeElement;

      // Add open classes
      mobileMenu.classList.add('open');
      mobileOverlay.classList.add('open');
      hamburgerButton.classList.add('open');

      // Update ARIA attributes
      mobileMenu.setAttribute('aria-hidden', 'false');
      hamburgerButton.setAttribute('aria-expanded', 'true');
      hamburgerButton.setAttribute('aria-label', 'Close menu');

      // Lock body scroll
      document.body.style.overflow = 'hidden';

      // Focus first focusable element in menu
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }

    // Close menu
    function closeMenu() {
      isMenuOpen = false;

      // Remove open classes
      mobileMenu.classList.remove('open');
      mobileOverlay.classList.remove('open');
      hamburgerButton.classList.remove('open');

      // Update ARIA attributes
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamburgerButton.setAttribute('aria-expanded', 'false');
      hamburgerButton.setAttribute('aria-label', 'Open menu');

      // Unlock body scroll
      document.body.style.overflow = '';

      // Return focus to hamburger button
      if (previousFocus && previousFocus.focus) {
        previousFocus.focus();
      }
    }

    // Toggle menu
    function toggleMenu() {
      if (isMenuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    // Focus trap - handle Tab key
    function handleTabKey(event) {
      if (!isMenuOpen) return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    // Handle Escape key
    function handleEscapeKey(event) {
      if (event.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    }

    // Handle keyboard events
    function handleKeyDown(event) {
      if (event.key === 'Tab') {
        handleTabKey(event);
      } else if (event.key === 'Escape') {
        handleEscapeKey(event);
      }
    }

    // Close menu when clicking navigation links
    function handleNavLinkClick() {
      closeMenu();
    }

    // Add event listeners
    hamburgerButton.addEventListener('click', toggleMenu);
    closeButton.addEventListener('click', closeMenu);
    mobileOverlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Add click listeners to all navigation links
    const navLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', handleNavLinkClick);
    });

    // Cleanup function (for View Transitions)
    return function cleanup() {
      hamburgerButton.removeEventListener('click', toggleMenu);
      closeButton.removeEventListener('click', closeMenu);
      mobileOverlay.removeEventListener('click', closeMenu);
      document.removeEventListener('keydown', handleKeyDown);
      navLinks.forEach((link) => {
        link.removeEventListener('click', handleNavLinkClick);
      });
    };
  }

  // Initialize on page load
  let cleanup = initMobileMenu();

  // Re-initialize after View Transitions
  document.addEventListener('astro:after-swap', () => {
    // Run cleanup if it exists
    if (cleanup) {
      cleanup();
    }
    // Re-initialize
    cleanup = initMobileMenu();
  });
</script>
```

### Implementation Steps

1. **Locate insertion point**
   - Open `/Users/seankim/dev/portfolio/src/layouts/BaseLayout.astro`
   - Find closing `</body>` tag (currently line 82)
   - Insert `<script>` block before this line

2. **Add the script block**
   - Paste the complete JavaScript code above
   - Ensure it's within the `<body>` section, not in frontmatter
   - Verify proper indentation

3. **Review script structure**
   - Main function: `initMobileMenu()`
   - Helper functions: `openMenu()`, `closeMenu()`, `toggleMenu()`
   - Focus management: `getFocusableElements()`, `handleTabKey()`
   - Event handlers: `handleKeyDown()`, `handleNavLinkClick()`
   - Cleanup function for View Transitions
   - Initialization and re-initialization logic

4. **Verify event listeners**
   - Hamburger button click: `toggleMenu()`
   - Close button click: `closeMenu()`
   - Overlay click: `closeMenu()`
   - Keyboard events: `handleKeyDown()` (Tab, Escape)
   - Nav link clicks: `handleNavLinkClick()`

5. **Check View Transitions compatibility**
   - `astro:after-swap` event listener registered
   - Cleanup function removes old event listeners
   - Re-initialization creates new listeners
   - No memory leaks from duplicate listeners

### Functionality Details

**Menu State Management**:
- `isMenuOpen`: Boolean tracking current state
- `previousFocus`: Stores element to return focus to
- State synced across HTML classes, ARIA attributes, and visual state

**Open Menu Flow**:
1. Set `isMenuOpen = true`
2. Store current focus in `previousFocus`
3. Add `.open` class to menu, overlay, and hamburger button
4. Update ARIA attributes (`aria-hidden`, `aria-expanded`, `aria-label`)
5. Lock body scroll (`overflow: hidden`)
6. Focus first focusable element in menu

**Close Menu Flow**:
1. Set `isMenuOpen = false`
2. Remove `.open` class from menu, overlay, and hamburger button
3. Update ARIA attributes (reverse of open)
4. Unlock body scroll (`overflow: ''`)
5. Return focus to previous element (hamburger button)

**Focus Trap Implementation**:
- Get all focusable elements in menu (links, buttons, inputs)
- On Tab key: If on last element, wrap to first
- On Shift+Tab: If on first element, wrap to last
- Prevents focus from leaving menu while open

**Escape Key Handling**:
- Listens for Escape key press
- Closes menu if open
- Standard accessibility pattern for dialogs

**Auto-close on Navigation**:
- Adds click listener to all `.mobile-nav-link` elements
- Closes menu when any navigation link is clicked
- Ensures clean transition to new page

**View Transitions Integration**:
- Cleanup function removes all event listeners
- Prevents duplicate listeners after page navigation
- Re-initializes menu state after View Transition completes
- Menu always starts closed on new page

### Accessibility Requirements

- **Focus Management**: Focus moves to menu on open, returns on close
- **Focus Trap**: Tab key loops focus within open menu
- **Escape Key**: Closes menu and returns focus
- **ARIA Updates**: `aria-hidden`, `aria-expanded`, and `aria-label` dynamically updated
- **Body Scroll Lock**: Prevents background scrolling while menu open
- **Keyboard Navigation**: All functionality available via keyboard

### Success Criteria

**Functional**:
- Hamburger button toggles menu open/closed
- Close button closes menu
- Backdrop click closes menu
- ESC key closes menu
- Navigation links close menu on click
- Menu starts closed on page load
- Menu state resets after View Transitions

**Visual**:
- Menu slides in from right (400ms animation)
- Overlay fades in (400ms animation)
- Hamburger icon transforms to X
- Body scroll locked when menu open
- Smooth, 60fps animations

**Accessibility**:
- Focus moves to menu on open
- Focus trapped within menu while open
- Tab key loops focus correctly
- Shift+Tab loops focus correctly
- ESC key closes menu
- Focus returns to hamburger button on close
- ARIA attributes update correctly
- Screen reader announces state changes

**Code Quality**:
- No JavaScript errors in console
- No memory leaks from event listeners
- Cleanup function properly removes listeners
- View Transitions re-initialization works
- Code is well-commented
- Functions have single responsibilities

### Testing Instructions

**Manual Testing**:
1. Start dev server: `npm run dev`
2. Resize browser to < 768px
3. Click hamburger button → menu should slide in
4. Verify body scroll is locked
5. Click backdrop → menu should close
6. Open menu again
7. Click close button (X) → menu should close
8. Open menu again
9. Press ESC key → menu should close
10. Open menu, click "Work" link → menu should close, page should navigate
11. Verify menu is closed on new page

**Focus Management Testing**:
1. Use keyboard only (no mouse)
2. Tab to hamburger button
3. Press Enter to open menu
4. Verify focus moves to first menu item (Close button)
5. Press Tab repeatedly
6. Verify focus loops through: Close → Work → Notes → About → Theme Toggle → Email → GitHub → Instagram → Close
7. Press Shift+Tab from first item
8. Verify focus wraps to last item
9. Press ESC
10. Verify focus returns to hamburger button

**View Transitions Testing**:
1. Open menu
2. Click "About" link
3. Verify menu closes
4. Wait for page transition to complete
5. Open menu again
6. Close menu
7. Navigate back to "Work"
8. Verify menu functionality still works
9. Check console for errors (should be none)
10. Open and close menu several times across different pages

**Body Scroll Lock Testing**:
1. On mobile, scroll page down
2. Open menu
3. Try to scroll page content (should not scroll)
4. Menu content should scroll if tall enough
5. Close menu
6. Verify page scrolling works again
7. Test on real mobile device if possible

**Animation Performance Testing**:
1. Open browser DevTools
2. Go to Performance tab
3. Start recording
4. Open and close menu several times rapidly
5. Stop recording
6. Check for frame drops (should maintain 60fps)
7. Verify no layout thrashing

**Edge Cases**:
1. Rapidly click hamburger button (should not break)
2. Click hamburger while menu is animating (should handle gracefully)
3. Resize browser from mobile to desktop while menu open (menu should hide)
4. Open menu, navigate, use browser back button (menu should be closed)
5. Test with JavaScript disabled (menu should not break layout)

### Rollback Procedure

If issues arise:
1. Open `/Users/seankim/dev/portfolio/src/layouts/BaseLayout.astro`
2. Locate the `<script>` block added in this phase
3. Delete the entire `<script>` block
4. Save file
5. Restart dev server
6. Verify site returns to previous state (menu visible but non-interactive)

**To preserve work**:
- Commit JavaScript separately before proceeding to Phase 4
- Use git branch for development
- Test thoroughly before moving to integration phase
- Keep backup of working script in separate file

---

## Phase 4: BaseLayout Integration

### Objective
Integrate HamburgerButton and MobileMenu components into BaseLayout.astro, update responsive CSS to hide/show appropriate navigation elements at the 768px breakpoint, and ensure proper component rendering.

### Prerequisites
- Phase 1 completed (HamburgerButton created)
- Phase 2 completed (MobileMenu created)
- Phase 3 completed (JavaScript interactivity added)
- BaseLayout.astro file accessible

### Files to Modify

**File**: `/Users/seankim/dev/portfolio/src/layouts/BaseLayout.astro`

### Implementation Steps

**Step 1: Add Component Imports**

**Location**: Frontmatter section (after line 5, before line 7)

**Add these imports**:
```astro
import HamburgerButton from '../components/HamburgerButton.astro';
import MobileMenu from '../components/MobileMenu.astro';
```

**After modification, lines 1-12 should look like**:
```astro
---
import '../styles/style.css';
import { ViewTransitions } from 'astro:transitions';
import KoiBackground from '../components/KoiBackground.astro';
import ThemeToggle from '../components/ThemeToggle.astro';
import HamburgerButton from '../components/HamburgerButton.astro';
import MobileMenu from '../components/MobileMenu.astro';

interface Props {
  title: string;
  activePage?: 'work' | 'writing' | 'about';
  description?: string;
}
```

**Step 2: Update Navigation Structure**

**Location**: Navigation section (lines 61-69)

**Replace existing nav block with**:
```astro
<nav>
    <a href="/" class="logo">Sean Woojin Kim</a>

    <!-- Desktop navigation (hidden on mobile) -->
    <div class="nav-links">
        <a href="/" class={activePage === 'work' ? 'active' : ''}>Work</a>
        <a href="/writing" class={activePage === 'writing' ? 'active' : ''}>Notes</a>
        <a href="/about" class={activePage === 'about' ? 'active' : ''}>About</a>
        <ThemeToggle />
    </div>

    <!-- Mobile hamburger button (hidden on desktop) -->
    <HamburgerButton />
</nav>

<!-- Mobile menu drawer (hidden on desktop) -->
<MobileMenu activePage={activePage} />
```

**Step 3: Verify Complete Layout Structure**

After modifications, the body section should look like:
```astro
<body>
    <KoiBackground />

    <div class="container">
        <nav>
            <a href="/" class="logo">Sean Woojin Kim</a>

            <!-- Desktop navigation (hidden on mobile) -->
            <div class="nav-links">
                <a href="/" class={activePage === 'work' ? 'active' : ''}>Work</a>
                <a href="/writing" class={activePage === 'writing' ? 'active' : ''}>Notes</a>
                <a href="/about" class={activePage === 'about' ? 'active' : ''}>About</a>
                <ThemeToggle />
            </div>

            <!-- Mobile hamburger button (hidden on desktop) -->
            <HamburgerButton />
        </nav>

        <!-- Mobile menu drawer (hidden on desktop) -->
        <MobileMenu activePage={activePage} />

        <slot />

        <footer>
            <span>© 2025 Sean Kim</span>
            <div style="display: flex; gap: 20px;">
                <a href="mailto:seanwoojinkim@gmail.com">Email</a>
                <a href="https://github.com/seanwoojinkim" target="_blank">GitHub</a>
                <a href="https://instagram.com/seanwooj" target="_blank">Instagram</a>
            </div>
        </footer>
    </div>

    <!-- JavaScript from Phase 3 -->
    <script>
      // ... (script code from Phase 3)
    </script>
</body>
```

### Files to Update (CSS)

**File**: `/Users/seankim/dev/portfolio/src/styles/style.css`

**Step 4: Add Desktop Visibility Rules**

**Location**: After line 292 (after `.nav-links a.active::after` block)

**Add this CSS**:
```css
/* Mobile menu hidden on desktop */
@media (min-width: 768px) {
    .hamburger-button,
    .mobile-menu,
    .mobile-overlay {
        display: none !important;
    }
}
```

**Step 5: Update Mobile Media Query**

**Location**: Lines 670-705 (existing `@media (max-width: 768px)` block)

**Replace existing mobile nav-links rule with**:
```css
@media (max-width: 767px) {
    .container {
        padding: var(--space-5) var(--space-3);
    }

    /* Hide desktop navigation on mobile */
    .nav-links {
        display: none;
    }

    .grid {
        grid-template-columns: 1fr;
    }

    .card {
        padding: var(--space-3);
    }

    .writing-item {
        grid-template-columns: 1fr;
        gap: var(--space-2);
    }

    .contact-methods {
        grid-template-columns: 1fr;
    }

    footer {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
    }

    footer > div {
        flex-wrap: wrap;
    }
}
```

**Key change**: Replace `gap: var(--space-3);` rule for `.nav-links` with `display: none;`

### Verification Steps

**Step 1: Check File Structure**
```bash
ls -la /Users/seankim/dev/portfolio/src/components/
```
Verify files exist:
- `HamburgerButton.astro`
- `MobileMenu.astro`
- `ThemeToggle.astro`

**Step 2: Check for TypeScript Errors**
```bash
npm run build
```
Should complete without errors.

**Step 3: Start Development Server**
```bash
npm run dev
```
Navigate to http://localhost:4321

**Step 4: Visual Inspection - Desktop (>= 768px)**
1. Open browser at width >= 768px
2. Verify desktop navigation visible:
   - Logo on left
   - Nav links on right: Work, Notes, About
   - Theme toggle visible
3. Verify hamburger button is NOT visible
4. Verify mobile menu is NOT visible
5. Open browser inspector, check computed styles:
   - `.hamburger-button` should have `display: none`
   - `.nav-links` should have `display: flex`

**Step 5: Visual Inspection - Mobile (< 768px)**
1. Resize browser to width < 768px
2. Verify hamburger button is visible (top right)
3. Verify desktop `.nav-links` is NOT visible
4. Verify mobile menu and overlay are present in DOM but not visible (transformed off-screen)
5. Open browser inspector, check computed styles:
   - `.hamburger-button` should have `display: flex`
   - `.nav-links` should have `display: none`

**Step 6: Functional Testing - Mobile**
1. Click hamburger button
2. Verify menu slides in from right
3. Verify overlay appears
4. Verify body scroll is locked
5. Check menu contents:
   - Close button (X) in header
   - Navigation links: Work, Notes, About
   - Theme toggle
   - Social links: Email, GitHub, Instagram
6. Verify active page has underline
7. Click backdrop → menu closes
8. Open menu, click close button → menu closes
9. Open menu, press ESC → menu closes
10. Open menu, click navigation link → menu closes, page navigates

**Step 7: Responsive Behavior Testing**
1. Start with mobile view (< 768px), menu closed
2. Slowly resize browser wider
3. At 768px breakpoint:
   - Hamburger button should disappear
   - Desktop nav links should appear
   - Mobile menu should remain hidden
4. Resize back to mobile
5. Verify hamburger button reappears
6. Desktop nav links should disappear

**Step 8: Page Navigation Testing**
1. Start on Work page (/)
2. Verify "Work" link has active underline
3. Open mobile menu
4. Verify "Work" link has active underline in menu
5. Click "About" link
6. Verify menu closes
7. Wait for page transition
8. Open menu again
9. Verify "About" link now has active underline
10. Repeat for all pages

**Step 9: Theme Toggle Testing**
1. Open mobile menu
2. Click theme toggle
3. Verify theme changes (light ↔ dark)
4. Verify menu colors update
5. Close menu
6. Reopen menu
7. Verify theme persisted
8. Navigate to another page
9. Open menu
10. Verify theme still correct

### Accessibility Requirements

- **Desktop Nav**: Remains accessible via keyboard (Tab navigation)
- **Mobile Nav**: Hidden on desktop (no keyboard access)
- **Hamburger Button**: Accessible via keyboard on mobile only
- **Focus Order**: Logical tab order (Logo → Desktop Nav on desktop, Logo → Hamburger on mobile)
- **ARIA States**: Properly managed by JavaScript from Phase 3

### Success Criteria

**Visual (Desktop >= 768px)**:
- Desktop navigation visible
- Hamburger button not visible
- Mobile menu not visible
- Active page underline appears on desktop nav
- Theme toggle visible in desktop nav

**Visual (Mobile < 768px)**:
- Desktop navigation not visible
- Hamburger button visible (top right)
- Mobile menu slides in when hamburger clicked
- Active page underline appears in mobile menu
- Theme toggle visible in mobile menu

**Functional**:
- All navigation links work on both desktop and mobile
- Active page indicator appears correctly on current view
- Theme toggle works on both desktop and mobile
- Mobile menu JavaScript functions correctly
- View Transitions work on both desktop and mobile
- No JavaScript errors in console

**Responsive**:
- Smooth transition at 768px breakpoint
- No layout shift when switching between mobile/desktop
- No horizontal scrollbar on any screen size
- Touch targets adequate on mobile (48px minimum)

**Code Quality**:
- No TypeScript errors
- Clean build output
- No console errors or warnings
- Components render correctly
- Props passed correctly to MobileMenu

### Testing Instructions

**Manual Testing Checklist**:
- [ ] Desktop nav visible on desktop (>= 768px)
- [ ] Hamburger visible on mobile (< 768px)
- [ ] Desktop nav hidden on mobile
- [ ] Hamburger hidden on desktop
- [ ] Mobile menu slides in from right
- [ ] Menu closes on backdrop click
- [ ] Menu closes on ESC key
- [ ] Menu closes on navigation link click
- [ ] Active page underline on desktop
- [ ] Active page underline in mobile menu
- [ ] Theme toggle works in desktop nav
- [ ] Theme toggle works in mobile menu
- [ ] Focus trap works in mobile menu
- [ ] Body scroll locks when menu open
- [ ] All social links work in mobile menu
- [ ] View Transitions work correctly
- [ ] Menu state resets after navigation

**Browser Testing**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Accessibility Testing**:
- [ ] Keyboard navigation works (Tab, Shift+Tab)
- [ ] Screen reader announces menu state
- [ ] Focus indicators visible
- [ ] ARIA attributes correct
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets adequate (48px minimum)

### Rollback Procedure

If issues arise:

**Step 1: Revert BaseLayout.astro changes**
```bash
git diff src/layouts/BaseLayout.astro
```
Review changes, then:
```bash
git checkout src/layouts/BaseLayout.astro
```

**Step 2: Revert style.css changes**
```bash
git checkout src/styles/style.css
```

**Step 3: Optionally remove components**
```bash
rm src/components/HamburgerButton.astro
rm src/components/MobileMenu.astro
```

**Step 4: Restart development server**
```bash
npm run dev
```

**Step 5: Verify site restored to previous state**
- Desktop navigation visible
- No hamburger button
- No mobile menu
- Site functions normally

**To preserve work**:
- Commit each file change separately
- Use descriptive commit messages
- Test after each commit
- Create git branch for development
- Keep backup of working files

---

## Phase 5: Social Links & Polish

### Objective
Final refinements including verifying social links functionality, adding visual polish, conducting comprehensive accessibility testing, and performing cross-browser validation. This phase ensures a production-ready implementation.

### Prerequisites
- All previous phases completed (Phases 1-4)
- Mobile menu fully functional
- All components integrated into BaseLayout
- Dev server running without errors

### Implementation Steps

**Step 1: Verify Social Links Functionality**

**Task**: Ensure all social links in mobile menu work correctly and open appropriately.

**Testing**:
1. Open mobile menu on mobile view (< 768px)
2. Scroll to social links section at bottom
3. Test each link:
   - **Email**: Click "Email" link
     - Should open default email client
     - "To:" field should contain: seanwoojinkim@gmail.com
   - **GitHub**: Click "GitHub" link
     - Should open in new tab (`target="_blank"`)
     - Should navigate to: https://github.com/seanwoojinkim
     - Check for `rel="noopener noreferrer"` (security)
   - **Instagram**: Click "Instagram" link
     - Should open in new tab (`target="_blank"`)
     - Should navigate to: https://instagram.com/seanwooj
     - Check for `rel="noopener noreferrer"` (security)

**Expected Behavior**:
- Email link opens email client (doesn't navigate away)
- External links open in new tab
- External links have proper security attributes
- All links close the mobile menu after click

**If links don't close menu**, add to JavaScript (in `initMobileMenu()` function):
```javascript
// Add click listeners to social links
const socialLinks = mobileMenu.querySelectorAll('.mobile-social-link');
socialLinks.forEach((link) => {
  link.addEventListener('click', () => {
    // Don't close for email links (they don't navigate)
    if (!link.href.startsWith('mailto:')) {
      closeMenu();
    }
  });
});
```

**Step 2: Visual Polish - Animation Refinement**

**Task**: Ensure animations are smooth and match the 400ms requirement.

**Verification**:
1. Open browser DevTools
2. Go to Performance tab (or Animations panel in Chrome)
3. Record while opening and closing menu multiple times
4. Verify:
   - Menu slide animation: exactly 400ms
   - Overlay fade animation: exactly 400ms
   - Hamburger icon animation: exactly 400ms
   - No frame drops (maintain 60fps)
   - Animations use CSS transitions, not JavaScript

**If timing is incorrect**, update in component styles:
- HamburgerButton.astro: `.hamburger-line { transition: all 400ms ease; }`
- MobileMenu.astro: `.mobile-menu { transition: transform 400ms ease; }`
- MobileMenu.astro: `.mobile-overlay { transition: opacity 400ms ease; }`

**Step 3: Touch Target Verification**

**Task**: Ensure all interactive elements meet 48px minimum touch target size.

**Testing**:
1. Open mobile menu
2. Use browser inspector to measure elements
3. Check minimum dimensions for:
   - Hamburger button: 48x48px ✓
   - Close button: 48x48px ✓
   - Navigation links: min-height 48px ✓
   - Theme toggle: 48x48px (check ThemeToggle.astro)
   - Social links: adequate vertical spacing for 48px targets

**If ThemeToggle is too small**, update `/Users/seankim/dev/portfolio/src/components/ThemeToggle.astro`:

**Current style** (lines 28-38):
```css
.theme-toggle {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  /* ... */
}
```

**Add minimum dimensions**:
```css
.theme-toggle {
  background: none;
  border: none;
  padding: 12px; /* Increased from 0 */
  min-width: 48px;
  min-height: 48px;
  cursor: pointer;
  /* ... */
}
```

**Step 4: Active State Polish**

**Task**: Ensure active page indicators are visually consistent between desktop and mobile.

**Testing**:
1. Navigate to Work page (/)
2. Desktop view (>= 768px):
   - "Work" link should have 2px underline
   - Underline color: `var(--color-text-primary)`
   - Positioned 3px below text
3. Mobile view (< 768px):
   - Open menu
   - "Work" link should have underline (40px wide, left-aligned)
   - Underline color: `var(--color-text-primary)`
   - Positioned at bottom of link
4. Repeat for Notes and About pages

**Expected consistency**:
- Same underline style (2px height)
- Same color (theme-aware)
- Visual weight matches between desktop and mobile
- Font weight may differ (mobile can be bolder for readability)

**Step 5: Backdrop Click Area**

**Task**: Verify backdrop click closes menu but doesn't interfere with menu content.

**Testing**:
1. Open mobile menu
2. Click directly on menu drawer (not backdrop) → menu should stay open
3. Click on backdrop (dark area outside menu) → menu should close
4. Open menu, scroll menu content (if applicable) → should scroll smoothly
5. Click on menu edge/border → menu should stay open
6. Drag from backdrop to menu → verify behavior is consistent

**Expected behavior**:
- Only clicks on backdrop (`.mobile-overlay`) close menu
- Clicks on menu itself (`.mobile-menu`) don't propagate to backdrop
- Event bubbling properly handled

**Step 6: Viewport Edge Cases**

**Task**: Test at various viewport sizes and orientations.

**Testing**:
1. **Very small mobile** (320px width):
   - Open menu
   - Menu should be 280px wide (appropriate for narrow screens)
   - Content should not overflow
   - Text should be readable
   - No horizontal scroll

2. **Tablet portrait** (768px width):
   - This is the breakpoint
   - Test at 767px (mobile) and 768px (desktop)
   - Verify clean transition between states
   - No flickering or layout shift

3. **Tablet landscape** (1024px width):
   - Desktop nav should be visible
   - Hamburger should be hidden
   - Adequate spacing in desktop nav

4. **Large desktop** (1920px width):
   - Desktop nav should be visible
   - Centered layout with max-width: 1000px
   - Navigation proportions look good

5. **Orientation change** (mobile devices):
   - Open menu in portrait
   - Rotate to landscape
   - Menu should adapt to new viewport height
   - Scrolling should work if content is taller than viewport

**Step 7: Scroll Lock Edge Cases**

**Task**: Ensure body scroll lock works correctly in various scenarios.

**Testing**:
1. **Standard flow**:
   - Page scrolled to middle
   - Open menu → background should not scroll
   - Close menu → page scroll should restore

2. **Short content**:
   - Page with no overflow (short content)
   - Open menu
   - Verify no layout shift
   - Close menu
   - Verify scroll behavior unchanged

3. **Long menu**:
   - Menu content taller than viewport (rare, but possible)
   - Open menu
   - Menu should scroll independently
   - Background should remain locked

4. **iOS Safari specific**:
   - Test on actual iPhone or simulator
   - iOS has special scrolling behavior
   - Verify rubber-band effect doesn't leak to background
   - Check for `-webkit-overflow-scrolling: touch` (already in CSS)

**Step 8: Keyboard Navigation Polish**

**Task**: Refine keyboard navigation experience.

**Testing**:
1. **Enter key on hamburger button**:
   - Tab to hamburger button
   - Press Enter → menu should open
   - Press Space → menu should open (test this)

2. **Focus visibility**:
   - Navigate entire menu with keyboard
   - Every focused element should have visible outline
   - Outline should be theme-aware (light/dark)
   - Outline should not be clipped by menu edges

3. **Skip links** (optional enhancement):
   - Consider adding "Skip to main content" link
   - Not required for this phase, but note for future

4. **Tab order**:
   - Desktop: Logo → Work → Notes → About → Theme Toggle
   - Mobile: Logo → Hamburger Button
   - Menu open: Close Button → Work → Notes → About → Theme Toggle → Email → GitHub → Instagram → (loops back to Close Button)

**If Space key doesn't open menu**, verify hamburger button is `<button>` element (not `<div>`), as buttons naturally respond to both Enter and Space.

**Step 9: Accessibility - Screen Reader Testing**

**Task**: Test with screen readers to ensure proper announcements.

**macOS VoiceOver Testing** (Cmd+F5 to enable):
1. Navigate to hamburger button
   - Should announce: "Open menu, button"
   - Should indicate it's a button that opens a menu

2. Activate hamburger button
   - Menu should open
   - Should announce state change
   - Should move focus to first menu item

3. Navigate through menu
   - Each link should announce its purpose
   - "Work, link" / "Notes, link" / "About, link"
   - Active page should be indicated (e.g., "Work, link, selected" or similar)

4. Theme toggle in menu
   - Should announce: "Toggle dark mode, button" (or current state)
   - After click, should announce new state

5. Social links
   - Should announce: "Email, link" / "GitHub, link" / "Instagram, link"
   - External links may announce "opens in new window"

6. Close menu
   - Press ESC or activate close button
   - Should announce menu closed
   - Focus should return to hamburger button

**Improvements if needed**:
- Add `aria-label` to navigation links if default isn't clear
- Add `aria-current="page"` to active page link (in addition to class)
- Ensure dialog role is properly announced

**File to modify**: `/Users/seankim/dev/portfolio/src/components/MobileMenu.astro`

**Update active link to include `aria-current`**:
```astro
<a
  href="/"
  class={`mobile-nav-link ${activePage === 'work' ? 'active' : ''}`}
  aria-current={activePage === 'work' ? 'page' : undefined}
>
  Work
</a>
```

Repeat for Notes and About links.

**Step 10: Cross-Browser Testing**

**Task**: Test on all major browsers and mobile devices.

**Desktop Browsers**:
1. **Chrome** (latest):
   - All features work
   - Animations smooth
   - DevTools show no errors
   - Backdrop blur renders correctly

2. **Firefox** (latest):
   - All features work
   - Check backdrop-filter support (may need fallback)
   - Verify animations
   - Check for console warnings

3. **Safari** (latest):
   - All features work
   - `-webkit-backdrop-filter` needed (already in CSS)
   - Verify smooth scrolling
   - Test with trackpad gestures

4. **Edge** (latest):
   - Should work identically to Chrome (Chromium-based)
   - Quick verification test

**Mobile Browsers**:
1. **Mobile Safari** (iOS):
   - Test on iPhone (various sizes if possible)
   - Touch targets adequate
   - Scroll lock works
   - No address bar interference
   - Viewport height changes handled correctly
   - Rubber-band effect doesn't leak to background

2. **Chrome Mobile** (Android):
   - Test on Android device
   - Touch interactions work
   - Menu slides smoothly
   - No performance issues

3. **Firefox Mobile**:
   - Quick verification test if available

**Browser-Specific Issues to Watch**:
- **Safari**: May require `-webkit-` prefixes for backdrop-filter
- **Firefox**: backdrop-filter may not be supported on older versions
- **iOS Safari**: Address bar shows/hides affecting viewport height
- **Android Chrome**: Different scrolling behavior than iOS

**Step 11: Performance Validation**

**Task**: Ensure implementation doesn't impact page performance.

**Testing**:
1. **Lighthouse Audit**:
   - Open DevTools → Lighthouse tab
   - Run audit on mobile
   - Check scores:
     - Performance: Should remain high (90+)
     - Accessibility: Should be 95+ (100 ideal)
     - Best Practices: Should be high
     - SEO: Should remain unchanged
   - Review any warnings or suggestions

2. **Bundle Size**:
   ```bash
   npm run build
   ```
   - Check output size
   - Verify JavaScript bundle size hasn't increased significantly
   - New components should add minimal overhead (< 5KB)

3. **Animation Performance**:
   - Open DevTools → Performance tab
   - Enable "Show paint rectangles"
   - Open and close menu multiple times
   - Look for:
     - No full-page repaints (only menu area)
     - Smooth 60fps animations
     - No forced reflows/layout thrashing

4. **Memory Leaks**:
   - Open DevTools → Memory tab
   - Take heap snapshot
   - Navigate between pages multiple times
   - Open/close menu multiple times
   - Take another heap snapshot
   - Compare: Memory should not continuously grow
   - Event listeners should be properly cleaned up

**Step 12: Dark Mode Visual Review**

**Task**: Verify mobile menu looks good in dark mode.

**Testing**:
1. Switch to dark mode (using theme toggle)
2. Open mobile menu
3. Verify colors:
   - Background: Semi-transparent white with blur (should look good over dark gradient)
   - Text colors: Light colors (readable on dark background)
   - Active page underline: Light color
   - Backdrop: Dark with blur
   - Border: Subtle, visible separation
4. Check contrast ratios (WCAG AA minimum 4.5:1 for normal text)
5. Verify theme toggle icon is correct (sun icon in dark mode)
6. Switch back to light mode while menu is open
7. Verify menu colors update dynamically

**Visual Polish Checklist**:
- [ ] Colors are theme-aware
- [ ] Backdrop blur works in both themes
- [ ] Text is readable in both themes
- [ ] Active state is visible in both themes
- [ ] Focus outlines are visible in both themes
- [ ] No harsh color contrasts or visual glitches

**Step 13: Real Device Testing**

**Task**: Test on actual mobile devices (not just browser simulation).

**iOS Testing** (iPhone):
1. Connect to dev server (use local network IP)
2. Open site in Mobile Safari
3. Test all mobile menu functionality
4. Check for iOS-specific issues:
   - Scroll lock works correctly
   - No rubber-band scrolling leak
   - Touch targets feel right
   - Animations smooth
   - No input zoom on focus (if applicable)

**Android Testing**:
1. Connect to dev server (use local network IP)
2. Open site in Chrome Mobile
3. Test all mobile menu functionality
4. Check for Android-specific issues:
   - Back button behavior (should not affect menu)
   - Touch targets adequate
   - Scroll behavior correct
   - Performance acceptable

**Step 14: Edge Case Testing**

**Task**: Test unusual scenarios that might break the implementation.

**Scenarios**:
1. **Rapid clicking**:
   - Click hamburger button rapidly (10+ times fast)
   - Menu should handle gracefully, no errors
   - Animation should not break or stack

2. **During animation**:
   - Open menu
   - Immediately close (while opening animation is running)
   - Should transition smoothly to closing
   - No visual glitches

3. **Resize during open menu**:
   - Open menu on mobile (< 768px)
   - Slowly resize browser to desktop (>= 768px)
   - Menu should disappear (CSS media query)
   - Body scroll should be restored
   - Desktop nav should appear

4. **Navigate back button**:
   - Open menu
   - Click navigation link
   - Wait for page to load
   - Click browser back button
   - Menu should be closed on previous page
   - Functionality should still work

5. **View Transitions disabled**:
   - Temporarily disable View Transitions in BaseLayout
   - Test menu functionality
   - Should still work (View Transitions are progressive enhancement)
   - Re-enable View Transitions

6. **JavaScript disabled**:
   - Disable JavaScript in browser
   - Visit site on mobile
   - Menu won't be interactive, but:
     - Desktop nav should work on desktop
     - Layout should not break
     - Site should remain usable on desktop
   - (Note: Mobile menu requires JavaScript; acceptable limitation)

**Step 15: Documentation and Code Review**

**Task**: Final code review and documentation.

**Code Review Checklist**:
- [ ] No commented-out code
- [ ] No console.log statements (unless intentional)
- [ ] Consistent code formatting
- [ ] TypeScript types are correct
- [ ] Component props are documented
- [ ] Complex logic has comments
- [ ] Variable names are descriptive
- [ ] No magic numbers (use design system variables)
- [ ] Error handling is appropriate
- [ ] Accessibility attributes are correct

**Documentation**:
- [ ] Update README if needed (new components documented)
- [ ] Add comments to any complex logic
- [ ] Document any known limitations
- [ ] Note browser support requirements
- [ ] Document responsive breakpoints

**Git Commit**:
```bash
git add .
git commit -m "feat: Add responsive hamburger menu with slide-out drawer

- Create HamburgerButton component with animated icon (☰ → ✕)
- Create MobileMenu component with slide-out drawer from right
- Add JavaScript for menu state, focus trap, and scroll lock
- Integrate components into BaseLayout with responsive CSS
- Add social links (Email, GitHub, Instagram) to mobile menu
- Implement 400ms animations matching design system
- Ensure full accessibility (ARIA, keyboard nav, screen readers)
- Test across browsers and devices
- Maintain compatibility with Astro View Transitions

Closes #[issue-number] (if applicable)"
```

### Accessibility Requirements (Final Verification)

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible on all elements
- [ ] Focus trap works correctly in menu
- [ ] ESC key closes menu
- [ ] ARIA attributes properly set and updated
- [ ] Screen reader announces all states correctly
- [ ] Touch targets meet 48px minimum
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] Active page indicated for screen readers (`aria-current="page"`)
- [ ] External links have security attributes (`rel="noopener noreferrer"`)
- [ ] Dialog role properly implemented
- [ ] Semantic HTML structure

### Success Criteria (Final)

**Functional**:
- [ ] Hamburger menu appears only on mobile (< 768px)
- [ ] Desktop navigation appears only on desktop (>= 768px)
- [ ] Menu slides from right in 400ms
- [ ] Menu closes on navigation, ESC, backdrop click, or close button
- [ ] Active page shows underline indicator
- [ ] Theme toggle works identically in both contexts
- [ ] Social links work correctly
- [ ] Body scroll locks when menu open
- [ ] Focus traps within menu when open
- [ ] View Transitions work correctly
- [ ] Menu state resets after navigation
- [ ] No JavaScript errors in console

**Visual**:
- [ ] Animations smooth (60fps)
- [ ] Hamburger icon animates to X
- [ ] Backdrop blur effect renders
- [ ] Colors theme-aware (light/dark mode)
- [ ] Typography matches design system
- [ ] Spacing consistent with design system
- [ ] Active state visually clear
- [ ] No layout shifts
- [ ] Responsive transition smooth at breakpoint

**Accessibility**:
- [ ] All WCAG AA requirements met
- [ ] Lighthouse accessibility score 95+
- [ ] Screen reader testing passed
- [ ] Keyboard navigation fully functional
- [ ] Touch targets adequate
- [ ] Focus management correct
- [ ] ARIA attributes correct
- [ ] Semantic HTML

**Performance**:
- [ ] Lighthouse performance score 90+
- [ ] No memory leaks
- [ ] No layout thrashing
- [ ] Bundle size increase < 5KB
- [ ] 60fps animations
- [ ] No blocking JavaScript

**Cross-Browser**:
- [ ] Chrome (desktop & mobile) ✓
- [ ] Firefox (desktop & mobile) ✓
- [ ] Safari (desktop & mobile) ✓
- [ ] Edge (desktop) ✓
- [ ] iOS Safari ✓
- [ ] Android Chrome ✓

### Testing Instructions (Final Comprehensive Test)

**Pre-Deployment Checklist**:
1. [ ] Run `npm run build` (no errors)
2. [ ] Run Lighthouse audit (all scores acceptable)
3. [ ] Test on desktop (Chrome, Firefox, Safari)
4. [ ] Test on mobile (iOS Safari, Android Chrome)
5. [ ] Test keyboard navigation (all browsers)
6. [ ] Test screen reader (VoiceOver or NVDA)
7. [ ] Test dark mode in menu
8. [ ] Test all social links
9. [ ] Test View Transitions integration
10. [ ] Verify no console errors or warnings
11. [ ] Review git diff for any unintended changes
12. [ ] Create descriptive git commit
13. [ ] Push to repository
14. [ ] Test on staging/production environment

**Regression Testing**:
1. [ ] Desktop navigation still works
2. [ ] Active page indicators on desktop
3. [ ] Theme toggle on desktop
4. [ ] Footer social links unchanged
5. [ ] Project cards work
6. [ ] Writing page works
7. [ ] About page works
8. [ ] View Transitions on desktop
9. [ ] Koi background unaffected
10. [ ] Build process unchanged

### Rollback Procedure

**If critical issues are found**:

1. **Immediate rollback** (if deployed):
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Selective rollback** (revert specific changes):
   ```bash
   git log --oneline
   git revert <commit-hash>
   ```

3. **Complete rollback** (remove all mobile menu code):
   ```bash
   git checkout HEAD~5 src/layouts/BaseLayout.astro
   git checkout HEAD~5 src/styles/style.css
   rm src/components/HamburgerButton.astro
   rm src/components/MobileMenu.astro
   npm run build
   ```

4. **Fix forward** (if issue is minor):
   - Create hotfix branch
   - Fix specific issue
   - Test thoroughly
   - Merge back to main

### Known Limitations

**Documented Limitations**:
1. **JavaScript Required**: Mobile menu requires JavaScript to function. Desktop navigation works without JavaScript.
2. **Breakpoint Fixed**: 768px breakpoint is hardcoded. Not dynamically calculated based on content width.
3. **No Submenu Support**: Flat navigation hierarchy only. No nested menus or dropdowns.
4. **No Swipe Gestures**: Menu only opens/closes via button, backdrop, or keyboard. No swipe-to-close.
5. **View Transitions**: Menu state doesn't persist across View Transitions (intentional design decision).

**Future Enhancements** (out of scope for this phase):
- Swipe gestures for open/close
- Persistent menu state across navigations (optional)
- Dynamic breakpoint calculation
- Skip to main content link
- Search functionality in mobile menu
- Submenu support

### Final Deliverables

**Components Created**:
1. `/Users/seankim/dev/portfolio/src/components/HamburgerButton.astro`
2. `/Users/seankim/dev/portfolio/src/components/MobileMenu.astro`

**Files Modified**:
1. `/Users/seankim/dev/portfolio/src/layouts/BaseLayout.astro`
   - Added component imports
   - Updated navigation structure
   - Added mobile menu integration
   - Added JavaScript for interactivity

2. `/Users/seankim/dev/portfolio/src/styles/style.css`
   - Added mobile visibility rules
   - Updated responsive media queries
   - Hidden desktop nav on mobile

**Files Updated** (optional polish):
3. `/Users/seankim/dev/portfolio/src/components/ThemeToggle.astro`
   - Updated touch target size (if needed)

**Documentation**:
- This implementation plan
- Code comments in components
- Git commit message with detailed description

**Test Coverage**:
- Manual testing across browsers
- Accessibility testing with screen readers
- Performance testing with Lighthouse
- Real device testing (iOS and Android)
- Keyboard navigation testing
- Edge case testing

---

## Risk Assessment

### Technical Risks

**Risk 1: Animation Performance on Low-End Devices**
- **Likelihood**: Medium
- **Impact**: Medium
- **Mitigation**: Use transform-based animations (GPU accelerated), test on older devices, provide graceful degradation
- **Fallback**: Reduce animation complexity or disable blur on low-end devices

**Risk 2: Backdrop Filter Browser Support**
- **Likelihood**: Low
- **Impact**: Low
- **Mitigation**: Include `-webkit-` prefix, provide fallback background color, graceful degradation
- **Fallback**: Solid semi-transparent background without blur effect

**Risk 3: View Transitions Compatibility**
- **Likelihood**: Low
- **Impact**: Low
- **Mitigation**: View Transitions are already implemented and working, proper cleanup function in JavaScript
- **Fallback**: Menu functionality works without View Transitions (progressive enhancement)

**Risk 4: iOS Safari Scroll Lock Issues**
- **Likelihood**: Medium
- **Impact**: Medium
- **Mitigation**: Use `overflow: hidden` on body, test on real iOS devices, include `-webkit-overflow-scrolling: touch`
- **Fallback**: Document as known issue, acceptable UX degradation

**Risk 5: Focus Trap Breaking on Complex Interactions**
- **Likelihood**: Low
- **Impact**: High (accessibility)
- **Mitigation**: Thorough testing, use standard focus trap pattern, test with screen readers
- **Fallback**: Revert to simpler focus management without trap

### Implementation Risks

**Risk 6: TypeScript Type Errors**
- **Likelihood**: Low
- **Impact**: Low
- **Mitigation**: Use existing component patterns, validate types during development
- **Fallback**: Fix types incrementally, use `any` temporarily if needed (not ideal)

**Risk 7: CSS Specificity Conflicts**
- **Likelihood**: Low
- **Impact**: Low
- **Mitigation**: Use scoped styles in Astro components, follow existing naming conventions
- **Fallback**: Increase specificity or use `!important` selectively

**Risk 8: Event Listener Memory Leaks**
- **Likelihood**: Medium
- **Impact**: Medium
- **Mitigation**: Implement cleanup function, test with DevTools memory profiler, re-initialize on View Transitions
- **Fallback**: Reload page clears memory, document as known issue

**Risk 9: Z-Index Conflicts**
- **Likelihood**: Low
- **Impact**: Low
- **Mitigation**: Use well-defined z-index layers (overlay: 999, menu: 1000), test against existing elements
- **Fallback**: Adjust z-index values if conflicts arise

### User Experience Risks

**Risk 10: Menu Too Wide on Small Screens**
- **Likelihood**: Low
- **Impact**: Low
- **Mitigation**: 280px width tested on 320px screens (smallest common), leaves 40px for backdrop
- **Fallback**: Reduce menu width to 260px or make responsive

**Risk 11: Active Page Indicator Not Clear**
- **Likelihood**: Low
- **Impact**: Medium
- **Mitigation**: Use same underline style as desktop, add `aria-current="page"` for screen readers
- **Fallback**: Add background color or icon to active link

**Risk 12: Social Links Redundancy with Footer**
- **Likelihood**: Low
- **Impact**: Low
- **Mitigation**: User explicitly requested social links in menu, improves mobile UX
- **Fallback**: Remove if feedback indicates redundancy

### Accessibility Risks

**Risk 13: Screen Reader Announcement Issues**
- **Likelihood**: Medium
- **Impact**: High
- **Mitigation**: Test with VoiceOver and NVDA, use proper ARIA attributes, follow WAI-ARIA dialog pattern
- **Fallback**: Iterate on ARIA attributes based on testing feedback

**Risk 14: Keyboard Trap Doesn't Work as Expected**
- **Likelihood**: Low
- **Impact**: High
- **Mitigation**: Test thoroughly, use standard Tab key trap pattern, test with keyboard only
- **Fallback**: Remove trap, allow focus to escape (less ideal but acceptable)

**Risk 15: Color Contrast Issues in Dark Mode**
- **Likelihood**: Low
- **Impact**: Medium
- **Mitigation**: Use design system variables, test with contrast checker, verify in both themes
- **Fallback**: Adjust colors to meet WCAG AA standards

## Performance Considerations

### Bundle Size Impact

**Expected Impact**:
- HamburgerButton component: ~1KB (HTML + CSS)
- MobileMenu component: ~2KB (HTML + CSS)
- JavaScript: ~2KB (minified)
- Total: ~5KB additional bundle size

**Optimization**:
- Astro automatically scopes styles (no duplicate CSS)
- JavaScript is minified in production build
- No external dependencies added
- Components are tree-shaken (only loaded when imported)

### Runtime Performance

**Rendering**:
- Components render once on page load
- No runtime style calculation
- CSS transitions handled by GPU
- No JavaScript animation loops

**Interaction Performance**:
- Event listeners use passive listeners where possible
- No DOM queries in loops
- Focus trap calculated once on open
- Cleanup function prevents memory leaks

**Animation Performance**:
- `transform` and `opacity` animations (GPU accelerated)
- No `left`, `top`, `width`, or `height` animations (layout thrashing)
- 400ms duration (smooth without feeling sluggish)
- `will-change` not used (can cause issues if overused)

### Mobile Performance

**Considerations**:
- Touch events fire quickly (no mouse hover lag)
- Backdrop blur may be expensive on low-end devices (acceptable trade-off)
- Scroll lock prevents background reflows
- Mobile menu is display: none on desktop (no overhead)

**Testing**:
- Test on older devices (iPhone 8, Android mid-range)
- Monitor FPS with DevTools
- Check Lighthouse performance score
- Verify no jank during animations

## Security Considerations

### XSS Protection

**Mitigations**:
- No user-generated content in menu
- All links are hardcoded (no dynamic URLs)
- External links use `rel="noopener noreferrer"`
- Astro sanitizes props automatically

**Validation**:
- `activePage` prop is TypeScript enum (limited values)
- No `dangerouslySetInnerHTML` or equivalent
- No `eval()` or similar dangerous functions

### Click Hijacking

**Mitigations**:
- Menu appears on top of content (z-index: 1000)
- Backdrop prevents clicks on underlying content
- Close button is clearly visible
- No transparent overlays that could be exploited

## Documentation Requirements

### Code Documentation

**Component Documentation**:
- Add comments to complex logic in JavaScript
- Document prop interfaces in Astro components
- Explain animation timing choices
- Note accessibility considerations

**Inline Comments**:
```astro
<!-- Desktop navigation (hidden on mobile) -->
<!-- Focus trap - handle Tab key -->
<!-- Update ARIA attributes -->
```

### User-Facing Documentation

**README Updates** (optional):
- Document new components in project structure
- Note responsive behavior at 768px breakpoint
- Mention accessibility features
- List browser support requirements

**Accessibility Statement** (if exists):
- Update with mobile menu features
- Note keyboard shortcuts (ESC to close)
- Mention screen reader support

## Success Metrics

### Quantitative Metrics

**Performance**:
- Lighthouse Performance score: >= 90
- Lighthouse Accessibility score: >= 95
- Bundle size increase: < 5KB
- Animation frame rate: 60fps
- Time to Interactive: No increase

**Accessibility**:
- WCAG AA compliant: 100%
- Keyboard navigable: 100%
- Screen reader compatible: 100%
- Touch target compliance: 100% (48px minimum)

### Qualitative Metrics

**User Experience**:
- Menu feels responsive and smooth
- Animation timing feels natural (400ms)
- Touch targets feel adequate on mobile
- Active page is clearly indicated
- Navigation is intuitive

**Code Quality**:
- TypeScript types are correct
- No linter errors or warnings
- Code follows existing patterns
- Components are reusable
- Minimal code duplication

**Maintainability**:
- Easy to understand and modify
- Well-documented with comments
- Follows Astro best practices
- Uses design system consistently
- Changes are isolated to new components

## Deployment Strategy

### Pre-Deployment

**Checklist**:
1. All phases completed and tested
2. No TypeScript errors
3. Clean build output
4. Lighthouse audits passing
5. Cross-browser testing complete
6. Accessibility testing complete
7. Real device testing complete
8. Code review complete
9. Documentation updated
10. Git commit created

### Deployment Steps

**Build and Verify**:
```bash
npm run build
```

**Preview Build** (optional):
```bash
npm run preview
```
Test production build locally before deploying.

**Deploy**:
Follow existing deployment process (e.g., Netlify, Vercel, or custom).

### Post-Deployment

**Verification**:
1. Test on production URL
2. Verify mobile menu works
3. Check all links function
4. Test on real devices
5. Monitor analytics for errors (if available)
6. Check browser console for errors

**Monitoring**:
- Watch for user feedback
- Monitor error tracking (if implemented)
- Check performance metrics
- Review accessibility metrics

### Rollback Plan

**If critical issues arise**:
1. Immediate rollback to previous deployment
2. Investigate issue in development
3. Create hotfix branch
4. Test fix thoroughly
5. Redeploy with fix

**Rollback Commands**:
```bash
git revert HEAD
npm run build
# Deploy previous commit
```

## Conclusion

This implementation plan provides a comprehensive, phased approach to adding a responsive hamburger menu to the portfolio site. Each phase builds upon the previous, ensuring a systematic and testable implementation. The plan prioritizes accessibility, performance, and user experience while maintaining compatibility with the existing Astro-based architecture.

By following this plan, the implementation should result in a production-ready mobile navigation system that:
- Enhances mobile usability
- Maintains accessibility standards
- Preserves site performance
- Integrates seamlessly with existing code
- Provides a polished, professional user experience

All requirements from the initial request have been addressed, including the 400ms animation timing, slide-from-right direction, auto-close on navigation, social links integration, and active page indicators matching the desktop navigation.
