---
doc_type: plan
date: 2025-11-02T06:10:04+00:00
title: "Fix Koi Animation Oscillations and Jerky Movement"
feature: "koi-smoothness"
plan_reference: koi-oscillation-fix

# Update phase status as implementation progresses
phases:
  - name: "Phase 1: Derivative Damping Implementation"
    status: completed
  - name: "Phase 2: Update Loop Order Correction"
    status: completed
  - name: "Phase 3: Force Prioritization"
    status: completed
  - name: "Phase 4: Dead-Zone Filtering"
    status: completed
  - name: "Phase 5: Force Smoothing Storage Fix"
    status: completed

git_commit: 5d5b30dcba163737124cc7345baa51e59bff8987
branch: main
repository: portfolio

created_by: seanwoojinkim
last_updated: 2025-11-02
last_updated_by: claude
last_updated_note: "All 5 phases implemented successfully"

tags:
  - koi
  - flocking
  - physics
  - smoothing
  - animation
  - performance
status: completed

related_docs:
  - thoughts/research/2025-11-02-flocking-smoothness-mechanisms-complete-movement-system-documentation.md
  - thoughts/research/2025-11-02-portfolio-koi-implementation-gap-analysis.md
---

# Implementation Plan: Fix Koi Animation Oscillations and Jerky Movement

**Date**: 2025-11-02
**Author**: seanwoojinkim
**Status**: Ready for Implementation
**Estimated Total Time**: 90 minutes

## Overview

### Problem Statement

The portfolio koi animation exhibits oscillations and jerky movement compared to the original flocking implementation. User observations include:
- Weird oscillations in swimming patterns
- Abrupt directional changes (sudden 90-degree turns)
- Jerky acceleration and deceleration
- Koi appearing "trapped" in force conflicts when crowded
- Subtle jitter even during otherwise smooth motion

### Root Cause

Through comprehensive research documented in:
- `thoughts/research/2025-11-02-flocking-smoothness-mechanisms-complete-movement-system-documentation.md`
- `thoughts/research/2025-11-02-portfolio-koi-implementation-gap-analysis.md`

We identified that the portfolio implementation is missing **5 out of 7 critical smoothing mechanisms**:

1. **Derivative Damping** (MISSING) - 70% of oscillation problem
2. **Correct Update Loop Order** (BROKEN) - 20% of jerkiness
3. **Force Prioritization** (MISSING) - 10% of oscillations
4. **Dead-Zone Filtering** (MISSING) - Micro-oscillations
5. **Force Smoothing Storage** (INCORRECT) - Double-smoothing bug

### Solution Approach

This plan implements all 5 missing mechanisms in order of impact, using the original flocking implementation (`/Users/seankim/dev/visualizations/flocking/`) as the gold standard reference.

### Success Criteria

After implementation:
- Smooth, gradual directional changes (no abrupt turns)
- Resistant to rapid heading oscillations
- Graceful acceleration/deceleration curves
- Automatic conflict resolution when crowded
- No visible micro-oscillations or jitter
- Movement quality matches original flocking app

### Dependencies

- Research documents (already completed)
- Original flocking implementation (for reference)
- Portfolio koi implementation files in `src/lib/koi/`

## Current State Analysis

### Architecture Overview

The portfolio koi system consists of:
- **Boid class** (`src/lib/koi/boid.js`) - Individual koi physics and state
- **Flocking forces** (`src/lib/koi/flocking-forces.js`) - Force calculations
- **Physics config** (`src/lib/koi/physics-config.js`) - Constants and parameters
- **Flock manager** (`src/lib/koi/flock-manager.js`) - Orchestrates the system

### Current Implementation Status

| Mechanism | Status | Location |
|-----------|--------|----------|
| Velocity Smoothing | BROKEN (wrong order) | `boid.js:76-95` |
| Force Smoothing | INCORRECT (wrong storage) | `boid.js:42-70` |
| Derivative Damping | MISSING | N/A |
| Dead-Zone Filtering | MISSING | N/A |
| Force Prioritization | MISSING | N/A |
| Individual Speed Multipliers | CORRECT | `boid.js:33` |
| Neighbor Limiting | CORRECT | `flocking-forces.js:36-40` |

### Key Files to Modify

1. **`src/lib/koi/boid.js`** (primary changes)
   - Lines 10-37: Constructor - add heading tracking
   - Lines 42-70: `applyForces()` - fix storage, add prioritization, add dead-zone
   - Lines 76-95: `update()` - add derivative damping, fix velocity smoothing order

2. **`src/lib/koi/physics-config.js`** (add missing constants)
   - Add `DEAD_ZONE_THRESHOLD`
   - Add `SEPARATION_HIGH_THRESHOLD`
   - Add `SEPARATION_MED_THRESHOLD`
   - Add `PRIORITIZE_HIGH` object
   - Add `PRIORITIZE_MEDIUM` object

## Implementation Phases

---

## Phase 1: Derivative Damping Implementation

**Objective**: Add PID D-term to resist rapid heading changes
**Expected Impact**: 70% reduction in oscillations
**Time Estimate**: 30 minutes
**Priority**: CRITICAL

### Background

Derivative damping is the most important smoothing mechanism. It applies a force perpendicular to velocity that opposes the rate of heading change (angular velocity). This creates smooth arcing turns instead of sharp zigzags.

**Reference**: Original implementation at `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:231-253`

### Prerequisites

None - this is the first phase.

### Files to Modify

1. **`src/lib/koi/boid.js`**

### Detailed Implementation Steps

#### Step 1.1: Add Heading Tracking to Constructor

**Location**: `src/lib/koi/boid.js:10-37` (constructor)

**Add after line 21** (after `this.previousCohesion`):

```javascript
// Derivative damping - track heading velocity for PID D-term
this.previousHeading = this.velocity.heading();
```

**Why**: We need to track the previous frame's heading to calculate the rate of heading change.

#### Step 1.2: Add Derivative Damping to Update Method

**Location**: `src/lib/koi/boid.js:76-95` (update method)

**Add at the beginning of `update()` method, before line 77** (before velocity update):

```javascript
// DERIVATIVE DAMPING (PID D-term) - resist rapid heading changes
const currentHeading = this.velocity.heading();
let headingChange = currentHeading - this.previousHeading;

// Normalize angle difference to -PI to PI range
while (headingChange > Math.PI) headingChange -= Math.PI * 2;
while (headingChange < -Math.PI) headingChange += Math.PI * 2;

// Calculate damping force perpendicular to velocity
const dampingCoefficient = PHYSICS_CONFIG.DAMPING_COEFFICIENT;
const speed = this.velocity.mag();

if (speed > PHYSICS_CONFIG.MIN_SPEED_FOR_DAMPING) {
    // Damping force magnitude opposes heading change
    const dampingMagnitude = headingChange * -dampingCoefficient * speed;

    // Apply perpendicular to current velocity direction
    const perpAngle = currentHeading + Math.PI / 2;
    const dampingForce = this.velocity.constructor.fromAngle(perpAngle, dampingMagnitude);

    // Add damping to acceleration
    this.acceleration.add(dampingForce);
}

this.previousHeading = currentHeading;
```

**Why perpendicular force?**
- If damping opposes velocity directly, the koi slows down abruptly
- Perpendicular force creates smooth arcing turns without speed change
- This is standard PID D-term implementation for angular systems

**Note**: Using `this.velocity.constructor.fromAngle()` ensures we use the correct p5.Vector static method.

### Configuration Changes

No changes needed - `DAMPING_COEFFICIENT` (0.45) and `MIN_SPEED_FOR_DAMPING` (0.1) already exist in `physics-config.js`.

### Testing Instructions

#### Visual Tests

1. **Single Koi Test**
   - Observe one koi swimming
   - Should make smooth, gradual turns
   - No sudden zigzag patterns
   - Turns should arc smoothly

2. **Force Application Test**
   - Use mouse interaction to attract koi
   - Should turn toward cursor in smooth arc
   - No overshoot or oscillation

3. **Multi-Koi Interaction**
   - Watch koi interact with each other
   - Separation responses should be smooth curves
   - No rapid back-and-forth oscillations

#### Quantitative Checks

Add temporary logging in `update()` method:

```javascript
// After calculating headingChange
if (Math.abs(headingChange) > Math.PI / 30) {
    console.warn('Large heading change:', headingChange);
}
```

**Expected**: Heading changes should not exceed π/30 per frame (~6 degrees).

### Success Criteria

- [ ] No console warnings about large heading changes
- [ ] Koi make smooth arcing turns (no zigzags)
- [ ] Turns look natural and fluid
- [ ] No visible back-and-forth oscillations
- [ ] 70% reduction in reported oscillation issues

### Rollback Procedure

If this causes issues:

1. Comment out the derivative damping block (lines added in step 1.2)
2. Remove `this.previousHeading` from constructor (step 1.1)
3. Commit with message: "Rollback: Remove derivative damping"

### Common Issues and Solutions

**Issue**: Koi feel "sticky" or resist turning
- **Solution**: Reduce `DAMPING_COEFFICIENT` from 0.45 to 0.3

**Issue**: Still seeing oscillations
- **Solution**: Increase `DAMPING_COEFFICIENT` from 0.45 to 0.6

**Issue**: Error "fromAngle is not a function"
- **Solution**: Check that you're using `this.velocity.constructor.fromAngle()` or import p5 properly

---

## Phase 2: Update Loop Order Correction

**Objective**: Fix velocity smoothing to use correct limit-then-lerp pattern
**Expected Impact**: 20% reduction in jerkiness
**Time Estimate**: 20 minutes
**Priority**: CRITICAL

### Background

The current implementation applies acceleration directly to velocity, then limits. The correct pattern is:
1. Create target velocity (current + acceleration)
2. Limit target to max speed
3. Lerp current velocity toward target

This ensures velocity changes are gradual, not instant.

**Reference**: Original implementation at `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:255-276`

### Prerequisites

Phase 1 completed (derivative damping adds to acceleration before velocity update)

### Files to Modify

1. **`src/lib/koi/boid.js`**

### Detailed Implementation Steps

#### Step 2.1: Replace Update Method Logic

**Location**: `src/lib/koi/boid.js:76-95` (entire `update` method)

**Replace lines 77-94** with:

```javascript
update(maxSpeed) {
    // Derivative damping (added in Phase 1)
    const currentHeading = this.velocity.heading();
    let headingChange = currentHeading - this.previousHeading;
    while (headingChange > Math.PI) headingChange -= Math.PI * 2;
    while (headingChange < -Math.PI) headingChange += Math.PI * 2;

    const dampingCoefficient = PHYSICS_CONFIG.DAMPING_COEFFICIENT;
    const speed = this.velocity.mag();

    if (speed > PHYSICS_CONFIG.MIN_SPEED_FOR_DAMPING) {
        const dampingMagnitude = headingChange * -dampingCoefficient * speed;
        const perpAngle = currentHeading + Math.PI / 2;
        const dampingForce = this.velocity.constructor.fromAngle(perpAngle, dampingMagnitude);
        this.acceleration.add(dampingForce);
    }

    this.previousHeading = currentHeading;

    // Update position FIRST (before velocity changes)
    this.position.add(this.velocity);

    // Create target velocity (current + acceleration)
    let targetVelocity = this.velocity.copy();
    targetVelocity.add(this.acceleration);

    // Apply speed multiplier for individual variation
    const individualMaxSpeed = maxSpeed * this.speedMultiplier;

    // Limit target velocity to max speed
    targetVelocity.limit(individualMaxSpeed);

    // CRITICAL: Smoothly interpolate toward target (this creates gradual changes!)
    const smoothing = PHYSICS_CONFIG.VELOCITY_SMOOTHING;
    this.velocity.lerp(targetVelocity, smoothing);

    // Ensure minimum speed - koi should always be moving
    const currentSpeed = this.velocity.mag();
    const minSpeed = individualMaxSpeed * 0.3;
    if (currentSpeed < minSpeed) {
        this.velocity.setMag(minSpeed);
    }

    // Reset acceleration
    this.acceleration.mult(0);
}
```

**Key Changes**:
1. **Position updates FIRST** (before velocity changes)
2. **Create targetVelocity** as intermediate calculation
3. **Limit target, not current velocity**
4. **Lerp toward target** (15% per frame = gradual change)
5. **Minimum speed check after lerp**

### Configuration Changes

No changes needed - `VELOCITY_SMOOTHING` (0.15) already exists in `physics-config.js`.

### Testing Instructions

#### Visual Tests

1. **Acceleration Test**
   - Koi should accelerate smoothly (not instant)
   - Speed changes should be gradual, visible ramping

2. **Deceleration Test**
   - When forces reduce, koi should slow gracefully
   - No sudden stops

3. **Speed Limit Test**
   - Koi should approach max speed gradually
   - No "pulsing" or sudden speed changes at the limit

#### Quantitative Checks

Add temporary logging:

```javascript
// After velocity lerp
const velocityChange = this.velocity.copy().sub(targetVelocity).mag();
if (velocityChange > individualMaxSpeed * 0.3) {
    console.warn('Large velocity change:', velocityChange);
}
```

**Expected**: Velocity changes should be gradual (< 30% of max speed per frame).

### Success Criteria

- [ ] No sudden speed changes
- [ ] Smooth acceleration curves
- [ ] Smooth deceleration curves
- [ ] No "pulsing" motion at speed limit
- [ ] Movement feels fluid and graceful

### Rollback Procedure

If this causes issues:

1. Revert `update()` method to original implementation
2. Keep derivative damping code (Phase 1)
3. Commit with message: "Rollback: Revert update loop order (keep damping)"

### Common Issues and Solutions

**Issue**: Koi feel too sluggish
- **Solution**: Increase `VELOCITY_SMOOTHING` from 0.15 to 0.25

**Issue**: Still seeing jerky movement
- **Solution**: Decrease `VELOCITY_SMOOTHING` from 0.15 to 0.10 (more smoothing)

**Issue**: Koi stop moving
- **Solution**: Check minimum speed logic is working (should be 30% of max)

---

## Phase 3: Force Prioritization

**Objective**: Dynamically prioritize separation when crowded to prevent force conflicts
**Expected Impact**: 10% reduction in oscillations, eliminates "trapped" behavior
**Time Estimate**: 20 minutes
**Priority**: CRITICAL

### Background

When koi are crowded, separation, alignment, and cohesion forces compete. Force prioritization gives separation higher weight when koi are too close, preventing push-pull oscillations.

**Reference**: Original implementation at `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:142-174`

### Prerequisites

Phases 1-2 completed

### Files to Modify

1. **`src/lib/koi/boid.js`** (applyForces method)
2. **`src/lib/koi/physics-config.js`** (add constants)

### Detailed Implementation Steps

#### Step 3.1: Add Priority Constants to Config

**Location**: `src/lib/koi/physics-config.js`

**Add after line 19** (after `MAX_NEIGHBORS`):

```javascript
// Force prioritization thresholds
SEPARATION_HIGH_THRESHOLD: 0.05,    // When separation force this strong, prioritize 90%
SEPARATION_MED_THRESHOLD: 0.02,     // When this strong, prioritize 70%

// Priority weights for different crowding levels
PRIORITIZE_HIGH: {
    separation: 0.9,     // 90% separation
    alignment: 0.1,      // 10% alignment
    cohesion: 0.1        // 10% cohesion
},

PRIORITIZE_MEDIUM: {
    separation: 0.7,     // 70% separation
    alignment: 0.5,      // 50% alignment
    cohesion: 0.5        // 50% cohesion
},
```

#### Step 3.2: Add Prioritization Logic to applyForces

**Location**: `src/lib/koi/boid.js:42-70` (applyForces method)

**Add after line 49** (after force smoothing, before storing previous forces):

```javascript
// FORCE PRIORITIZATION - Prevent oscillation from conflicting forces
const separationMag = smoothedSeparation.mag();

let alignmentWeight = 1.0;
let cohesionWeight = 1.0;
let separationWeight = 1.0;

if (separationMag > PHYSICS_CONFIG.SEPARATION_HIGH_THRESHOLD) {
    // High separation need - fish are too close
    separationWeight = PHYSICS_CONFIG.PRIORITIZE_HIGH.separation;
    alignmentWeight = PHYSICS_CONFIG.PRIORITIZE_HIGH.alignment;
    cohesionWeight = PHYSICS_CONFIG.PRIORITIZE_HIGH.cohesion;
} else if (separationMag > PHYSICS_CONFIG.SEPARATION_MED_THRESHOLD) {
    // Moderate separation need
    separationWeight = PHYSICS_CONFIG.PRIORITIZE_MEDIUM.separation;
    alignmentWeight = PHYSICS_CONFIG.PRIORITIZE_MEDIUM.alignment;
    cohesionWeight = PHYSICS_CONFIG.PRIORITIZE_MEDIUM.cohesion;
}

// Apply weights to forces
smoothedAlignment.mult(alignmentWeight);
smoothedCohesion.mult(cohesionWeight);
smoothedSeparation.mult(separationWeight);
```

**Important**: This must come AFTER force smoothing but BEFORE applying forces to acceleration.

### Configuration Changes

Added 5 new constants to `physics-config.js` (see step 3.1)

### Testing Instructions

#### Visual Tests

1. **Crowding Test**
   - Force 3 koi close together
   - They should separate cleanly without oscillating
   - No "bounce" or "trapped" behavior

2. **Normal Spacing Test**
   - When koi are normally spaced, they should flock naturally
   - All forces should work together

3. **Approach Test**
   - Watch koi approach each other
   - Separation should dominate smoothly as they get close
   - Transition should be gradual, not sudden

#### Debug Visualization (Optional)

Add temporary logging:

```javascript
// After weight calculation
if (separationMag > PHYSICS_CONFIG.SEPARATION_MED_THRESHOLD) {
    console.log('Prioritizing separation:', {
        separationMag,
        separationWeight,
        alignmentWeight
    });
}
```

### Success Criteria

- [ ] Koi separate cleanly when crowded (no oscillation)
- [ ] No "trapped" or "bouncing" behavior
- [ ] Smooth transition between priority levels
- [ ] Normal flocking behavior when not crowded
- [ ] Reduced force conflicts

### Rollback Procedure

If this causes issues:

1. Remove prioritization block from `applyForces()` (step 3.2)
2. Remove weight multiplications
3. Remove constants from `physics-config.js` (step 3.1)
4. Keep phases 1-2 intact
5. Commit with message: "Rollback: Remove force prioritization"

### Common Issues and Solutions

**Issue**: Koi separate too aggressively
- **Solution**: Reduce `PRIORITIZE_HIGH.separation` from 0.9 to 0.7

**Issue**: Still seeing crowding oscillations
- **Solution**: Increase `SEPARATION_HIGH_THRESHOLD` from 0.05 to 0.08

**Issue**: Forces feel unbalanced
- **Solution**: Adjust `PRIORITIZE_MEDIUM` weights to 0.6/0.6/0.6 (more balanced)

---

## Phase 4: Dead-Zone Filtering

**Objective**: Eliminate micro-oscillations from tiny forces
**Expected Impact**: Removes subtle jitter, creates true stillness
**Time Estimate**: 10 minutes
**Priority**: Important (not critical)

### Background

When forces nearly balance, tiny numerical variations cause micro-oscillations. Dead-zone filtering zeroes out forces below a threshold, eliminating this jitter.

**Reference**: Original implementation at `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:131-135`

### Prerequisites

Phases 1-3 completed

### Files to Modify

1. **`src/lib/koi/boid.js`** (applyForces method)
2. **`src/lib/koi/physics-config.js`** (add constant)

### Detailed Implementation Steps

#### Step 4.1: Add Dead-Zone Constant to Config

**Location**: `src/lib/koi/physics-config.js`

**Add after line 9** (after `VELOCITY_SMOOTHING`):

```javascript
// Dead-zone threshold - ignore forces below this magnitude
DEAD_ZONE_THRESHOLD: 0.01,
```

#### Step 4.2: Add Dead-Zone Filtering to applyForces

**Location**: `src/lib/koi/boid.js:42-70` (applyForces method)

**Add after force smoothing, before force prioritization**:

```javascript
// Dead zone: ignore very small forces to prevent micro-oscillations
const deadZoneThreshold = PHYSICS_CONFIG.DEAD_ZONE_THRESHOLD;

if (smoothedAlignment.mag() < deadZoneThreshold) {
    smoothedAlignment.set(0, 0);
}
if (smoothedCohesion.mag() < deadZoneThreshold) {
    smoothedCohesion.set(0, 0);
}
if (smoothedSeparation.mag() < deadZoneThreshold) {
    smoothedSeparation.set(0, 0);
}
```

**Order matters**: Dead-zone filtering should happen AFTER smoothing but BEFORE prioritization.

### Configuration Changes

Added 1 new constant to `physics-config.js`: `DEAD_ZONE_THRESHOLD: 0.01`

### Testing Instructions

#### Visual Tests

1. **Static Balance Test**
   - Watch koi that are nearly balanced with neighbors
   - Should glide smoothly without "shivering"
   - No micro-adjustments visible

2. **Slow Movement Test**
   - Watch koi moving very slowly
   - Should be perfectly smooth, not jittery
   - No vibration or trembling

3. **Edge Cases**
   - Koi far from neighbors (should have clean zero forces)
   - Koi in perfect alignment (should glide straight)

#### Quantitative Checks

Add temporary logging:

```javascript
// Before dead-zone filtering
const forcesBefore = {
    separation: smoothedSeparation.mag(),
    alignment: smoothedAlignment.mag(),
    cohesion: smoothedCohesion.mag()
};

// After dead-zone filtering
const forcesAfter = {
    separation: smoothedSeparation.mag(),
    alignment: smoothedAlignment.mag(),
    cohesion: smoothedCohesion.mag()
};

if (forcesBefore.separation !== forcesAfter.separation) {
    console.log('Dead-zone filtered tiny forces:', forcesBefore);
}
```

**Expected**: Should see occasional filtering of forces below 0.01.

### Success Criteria

- [ ] No visible micro-oscillations or "shivering"
- [ ] Koi can glide in true straight lines
- [ ] Smooth movement at all speeds
- [ ] Clean zero-force states when isolated
- [ ] No nervous or jittery appearance

### Rollback Procedure

If this causes issues:

1. Remove dead-zone filtering block (step 4.2)
2. Remove constant from `physics-config.js` (step 4.1)
3. Keep phases 1-3 intact
4. Commit with message: "Rollback: Remove dead-zone filtering"

### Common Issues and Solutions

**Issue**: Koi feel "sticky" or unresponsive
- **Solution**: Reduce `DEAD_ZONE_THRESHOLD` from 0.01 to 0.005

**Issue**: Still seeing micro-jitter
- **Solution**: Increase `DEAD_ZONE_THRESHOLD` from 0.01 to 0.02

**Issue**: Koi snap to zero forces too abruptly
- **Solution**: Reduce threshold or add hysteresis (use 0.01 for zero-out, 0.015 to re-activate)

---

## Phase 5: Force Smoothing Storage Fix

**Objective**: Fix double-smoothing bug by storing raw forces instead of smoothed forces
**Expected Impact**: Better responsiveness, removes lag
**Time Estimate**: 10 minutes
**Priority**: Important (not critical)

### Background

The current implementation stores smoothed forces for the next frame, which creates double-smoothing. The correct approach is to store raw input forces.

**Current (WRONG)**:
```javascript
this.previousAlignment = smoothedAlignment.copy();
```

**Correct**:
```javascript
this.previousAlignment = alignment.copy();
```

**Reference**: Original implementation at `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:110-113, 126-128`

### Prerequisites

Phases 1-4 completed (optional - this can be done independently)

### Files to Modify

1. **`src/lib/koi/boid.js`** (applyForces method)

### Detailed Implementation Steps

#### Step 5.1: Fix Force Storage Logic

**Location**: `src/lib/koi/boid.js:42-70` (applyForces method)

**Find the force storage section** (currently around lines 51-59):

```javascript
// Store for next frame (make copies to avoid reference issues)
if (smoothedSeparation && smoothedSeparation.copy) {
    this.previousSeparation = smoothedSeparation.copy();
}
if (smoothedAlignment && smoothedAlignment.copy) {
    this.previousAlignment = smoothedAlignment.copy();
}
if (smoothedCohesion && smoothedCohesion.copy) {
    this.previousCohesion = smoothedCohesion.copy();
}
```

**Replace with**:

```javascript
// Store RAW forces for next frame (not smoothed - prevents double-smoothing)
if (separation && separation.copy) {
    this.previousSeparation = separation.copy();
}
if (alignment && alignment.copy) {
    this.previousAlignment = alignment.copy();
}
if (cohesion && cohesion.copy) {
    this.previousCohesion = cohesion.copy();
}
```

**Key Change**: Store `separation`, `alignment`, `cohesion` (raw inputs) instead of `smoothedSeparation`, etc.

**Why This Matters**:
- Frame N: `smoothedForce = lerp(previousForce, currentForce, 0.25)`
- If `previousForce = smoothedForce` from last frame, we're lerping already-smoothed values
- This creates exponential smoothing that accumulates lag
- Storing raw forces keeps smoothing linear and predictable

### Configuration Changes

None required.

### Testing Instructions

#### Visual Tests

1. **Responsiveness Test**
   - Use mouse to attract koi
   - Should respond quickly to new forces
   - No visible lag or delay

2. **Reaction Time Test**
   - Introduce sudden force (mouse click)
   - Koi should begin turning within 1 frame
   - Response should be immediate but smooth

3. **Dynamic Behavior Test**
   - Watch koi interact in changing situations
   - Should adapt quickly to neighbors moving
   - No sluggish or laggy behavior

#### Quantitative Checks

Add temporary logging:

```javascript
// In applyForces, after smoothing
console.log('Force smoothing:', {
    rawSeparation: separation.mag(),
    previousSeparation: this.previousSeparation.mag(),
    smoothedSeparation: smoothedSeparation.mag()
});
```

**Expected**: Smoothed force should be weighted average of raw and previous, not of smoothed and previous.

### Success Criteria

- [ ] Koi respond immediately to new forces (no lag)
- [ ] Still smooth (not jittery)
- [ ] Better responsiveness than before
- [ ] No sluggish behavior
- [ ] Natural reaction times

### Rollback Procedure

If this causes issues:

1. Revert force storage to store smoothed forces
2. Keep phases 1-4 intact
3. Commit with message: "Rollback: Revert force storage to smoothed values"

Note: This is unlikely to cause issues - it only improves responsiveness.

### Common Issues and Solutions

**Issue**: Koi seem more jittery after this change
- **Solution**: This shouldn't happen, but increase `FORCE_SMOOTHING` from 0.25 to 0.3

**Issue**: No noticeable change
- **Solution**: This is expected - the fix is subtle and mainly prevents lag accumulation over time

**Issue**: Error "cannot read property 'copy' of undefined"
- **Solution**: Check that force parameters are being passed correctly to `applyForces()`

---

## Deployment and Migration

### Deployment Strategy

This is a frontend-only change with no backend or database implications.

**Steps**:
1. Implement all 5 phases in order
2. Test locally at each phase
3. Commit after each phase with descriptive message
4. Final testing of all phases together
5. Deploy to production (standard build process)

### Browser Compatibility

No new browser features required - uses existing p5.js Vector methods.

**Supported browsers**: Same as current (all modern browsers)

### Performance Considerations

**Performance Impact**: Negligible to slightly positive

- Added operations: ~40-50 per koi per frame
- For 3 koi at 60fps = ~9,000 operations/second
- Negligible on modern hardware

**Actual impact**:
- Derivative damping: +20 ops/frame
- Update loop changes: +5 ops/frame (reorganization)
- Force prioritization: +10 ops/frame
- Dead-zone filtering: +15 ops/frame
- Force storage fix: -5 ops/frame (fewer copies)

**Total**: +45 ops per koi per frame (< 0.1% of typical frame budget)

### Migration Considerations

No data migration needed - this is purely algorithmic changes.

**State compatibility**:
- Existing koi state remains valid
- No breaking changes to data structures
- No localStorage or session changes

---

## Risk Assessment

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Derivative damping too aggressive | Low | Medium | Tune `DAMPING_COEFFICIENT` |
| Velocity smoothing feels sluggish | Low | Low | Adjust `VELOCITY_SMOOTHING` |
| Force prioritization too extreme | Low | Medium | Adjust threshold values |
| Dead-zone too large (unresponsive) | Very Low | Low | Reduce `DEAD_ZONE_THRESHOLD` |
| Force storage fix causes jitter | Very Low | Low | Revert to smoothed storage |

### Quality Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Movement feels different (not better) | Low | Medium | A/B test with users |
| Too smooth (loses liveliness) | Very Low | Low | Reduce smoothing factors |
| Breaks mouse interaction | Very Low | High | Test attraction forces thoroughly |
| Regression in other behaviors | Very Low | Medium | Full regression testing |

### Mitigation Strategies

1. **Phased Implementation**: Each phase can be rolled back independently
2. **Tunable Parameters**: All constants in `physics-config.js` for easy adjustment
3. **Reference Implementation**: Original flocking app as gold standard for comparison
4. **Visual Testing**: Clear visual success criteria for each phase
5. **Rollback Procedures**: Documented for each phase

---

## Testing Strategy

### Unit Testing

**Current state**: No unit tests for physics (visual-driven development)

**Recommendation**: Add unit tests for:
- Angle normalization (derivative damping)
- Vector magnitude checks (dead-zone filtering)
- Weight calculation (force prioritization)

**Optional** - Can add after implementation if needed.

### Integration Testing

Manual integration testing after each phase:

1. **Phase 1**: Test derivative damping with single koi
2. **Phase 2**: Test velocity smoothing with acceleration/deceleration
3. **Phase 3**: Test force prioritization with 3 koi crowded
4. **Phase 4**: Test dead-zone with isolated koi
5. **Phase 5**: Test responsiveness with mouse interaction

### Visual Testing

Primary testing method - visual observation:

**Test scenarios**:
1. Single koi swimming (smooth turns)
2. Two koi approaching (clean separation)
3. Three koi crowded (no oscillation)
4. Mouse attraction (responsive but smooth)
5. Long observation (no drift or instability)

**Success criteria**: See individual phase success criteria

### Performance Testing

Monitor frame rate with:
- Chrome DevTools Performance tab
- 3 koi should maintain 60fps easily
- No frame drops or stuttering

**Benchmark**: Should be < 1ms per frame for koi physics.

---

## Documentation Requirements

### Code Documentation

1. **Inline Comments**: Added throughout implementation
   - Explain WHY each mechanism exists
   - Reference original implementation line numbers
   - Note critical ordering dependencies

2. **JSDoc Comments**: Update for modified methods
   - `applyForces()` - document new parameters
   - `update()` - document smoothing behavior

### Technical Documentation

1. **Update this plan** with actual results after implementation
   - Mark phases complete
   - Note any parameter adjustments made
   - Document any deviations from plan

2. **Create performance report** (optional)
   - Before/after measurements
   - Subjective quality assessment
   - User feedback summary

### User-Facing Documentation

None required - internal implementation change with no user interface changes.

---

## Success Metrics

### Quantitative Metrics

1. **Heading Change Rate**
   - Before: Can exceed π/30 per frame (6° per frame)
   - After: Should not exceed π/30 per frame
   - **Target**: < 6° per frame (95% of frames)

2. **Velocity Change Rate**
   - Before: Can change instantly (100% in 1 frame)
   - After: Should change gradually (15% per frame)
   - **Target**: < 30% of max per frame

3. **Force Oscillation**
   - Before: Forces can flip sign every frame
   - After: Same-sign forces for 5+ consecutive frames
   - **Target**: 80% of time windows show stable force direction

4. **Frame Rate**
   - Before: 60fps
   - After: 60fps (maintain)
   - **Target**: No degradation

### Qualitative Metrics

1. **Visual Smoothness**
   - Koi make graceful arcing turns
   - No visible zigzags or oscillations
   - Movement looks natural and fluid

2. **Responsiveness**
   - Koi respond to forces without lag
   - Interactions feel immediate but smooth
   - No sluggish or delayed behavior

3. **Stability**
   - No "trapped" or "bouncing" behavior
   - Koi can achieve stable states
   - No micro-jitter or shivering

4. **Comparison to Original**
   - Movement quality matches original flocking app
   - Passes side-by-side visual comparison
   - Indistinguishable quality level

---

## Implementation Timeline

### Estimated Timeline

| Phase | Time | Running Total |
|-------|------|---------------|
| Phase 1: Derivative Damping | 30 min | 30 min |
| Testing Phase 1 | 10 min | 40 min |
| Phase 2: Update Loop Order | 20 min | 60 min |
| Testing Phase 2 | 10 min | 70 min |
| Phase 3: Force Prioritization | 20 min | 90 min |
| Testing Phase 3 | 10 min | 100 min |
| Phase 4: Dead-Zone Filtering | 10 min | 110 min |
| Testing Phase 4 | 5 min | 115 min |
| Phase 5: Force Storage Fix | 10 min | 125 min |
| Testing Phase 5 | 5 min | 130 min |
| **Final Integration Testing** | 20 min | 150 min |
| **Documentation Updates** | 10 min | 160 min |

**Total Estimated Time**: 2 hours 40 minutes (160 minutes)
**Core Implementation Time**: 90 minutes
**Testing Time**: 40 minutes
**Buffer Time**: 30 minutes

### Recommended Schedule

**Option 1: Single Session**
- Complete all phases in one 3-hour session
- Best for maintaining context and momentum

**Option 2: Two Sessions**
- Session 1: Phases 1-3 (critical fixes) - 90 minutes
- Session 2: Phases 4-5 (polish fixes) - 30 minutes
- Best for incremental improvement

**Option 3: Five Sessions**
- One session per phase
- Best for careful testing and validation
- Total time: Same, but spread over days

---

## Code References

### Portfolio Implementation (Current State)

- **Boid Class**: `/Users/seankim/dev/portfolio/src/lib/koi/boid.js`
  - Lines 10-37: Constructor
  - Lines 42-70: `applyForces()` method
  - Lines 76-95: `update()` method

- **Force Calculation**: `/Users/seankim/dev/portfolio/src/lib/koi/flocking-forces.js`
  - Lines 20-41: `findNeighbors()`
  - Lines 47-62: `calculateAlignment()`
  - Lines 68-84: `calculateCohesion()`
  - Lines 90-123: `calculateSeparation()`

- **Physics Config**: `/Users/seankim/dev/portfolio/src/lib/koi/physics-config.js`
  - Lines 6-20: All physics constants

### Original Reference Implementation (Gold Standard)

- **Reference Boid**: `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js`
  - Lines 119-207: `applyForces()` with all 4 mechanisms
  - Lines 219-328: `update()` with derivative damping + velocity smoothing
  - Lines 28-31: Constructor with force history tracking
  - Lines 35-39: Constructor with heading tracking

- **Reference Config**: `/Users/seankim/dev/visualizations/flocking/src/flocking/physics-config.js`
  - Lines 7-17: Smoothing constants
  - Lines 24-40: Force prioritization config

### Research Documents

- **Smoothing Mechanisms Documentation**: `/Users/seankim/dev/portfolio/thoughts/research/2025-11-02-flocking-smoothness-mechanisms-complete-movement-system-documentation.md`
  - Complete documentation of all 7 smoothing mechanisms
  - Detailed code examples and explanations
  - Common truncation mistakes

- **Gap Analysis**: `/Users/seankim/dev/portfolio/thoughts/research/2025-11-02-portfolio-koi-implementation-gap-analysis.md`
  - Identifies specific missing mechanisms
  - Priority order for fixes
  - Expected impact percentages

---

## Appendix A: Configuration Parameters

### Current Configuration

```javascript
// src/lib/koi/physics-config.js (BEFORE changes)
export const PHYSICS_CONFIG = {
    FORCE_SMOOTHING: 0.25,
    VELOCITY_SMOOTHING: 0.15,
    PERCEPTION_RADIUS: 80,
    DAMPING_COEFFICIENT: 0.45,
    MIN_SPEED_FOR_DAMPING: 0.1,
    MAX_NEIGHBORS: 8,
};
```

### Final Configuration

```javascript
// src/lib/koi/physics-config.js (AFTER all phases)
export const PHYSICS_CONFIG = {
    // Force smoothing - reduces jitter
    FORCE_SMOOTHING: 0.25,
    VELOCITY_SMOOTHING: 0.15,
    DEAD_ZONE_THRESHOLD: 0.01,          // ADDED in Phase 4

    // Perception - how far koi can "see"
    PERCEPTION_RADIUS: 80,

    // Damping - smooth turns
    DAMPING_COEFFICIENT: 0.45,
    MIN_SPEED_FOR_DAMPING: 0.1,

    // Force prioritization thresholds - ADDED in Phase 3
    SEPARATION_HIGH_THRESHOLD: 0.05,
    SEPARATION_MED_THRESHOLD: 0.02,

    // Priority weights for different crowding levels - ADDED in Phase 3
    PRIORITIZE_HIGH: {
        separation: 0.9,
        alignment: 0.1,
        cohesion: 0.1
    },

    PRIORITIZE_MEDIUM: {
        separation: 0.7,
        alignment: 0.5,
        cohesion: 0.5
    },

    // Limit neighbors for performance
    MAX_NEIGHBORS: 8,
};
```

### Parameter Tuning Guide

If after implementation you need to adjust behavior:

**More Smooth, Less Responsive**:
- Decrease `VELOCITY_SMOOTHING` (0.15 → 0.10)
- Increase `FORCE_SMOOTHING` (0.25 → 0.30)
- Increase `DAMPING_COEFFICIENT` (0.45 → 0.60)

**More Responsive, Less Smooth**:
- Increase `VELOCITY_SMOOTHING` (0.15 → 0.20)
- Decrease `FORCE_SMOOTHING` (0.25 → 0.20)
- Decrease `DAMPING_COEFFICIENT` (0.45 → 0.35)

**Reduce Separation Aggressiveness**:
- Decrease `SEPARATION_HIGH_THRESHOLD` (0.05 → 0.03)
- Reduce `PRIORITIZE_HIGH.separation` (0.9 → 0.7)

**More Separation (Less Crowding)**:
- Increase `SEPARATION_HIGH_THRESHOLD` (0.05 → 0.08)
- Increase `PRIORITIZE_HIGH.separation` (0.9 → 0.95)

---

## Appendix B: Visual Comparison Checklist

Use this checklist to compare before/after implementation:

### Before Implementation (Current Issues)

- [ ] Koi oscillate back and forth (zigzag pattern)
- [ ] Abrupt 90-degree turns
- [ ] Jerky acceleration (instant speed changes)
- [ ] Jerky deceleration (sudden stops)
- [ ] Koi "bounce" off each other when crowded
- [ ] Koi get "trapped" in force conflicts
- [ ] Subtle jitter/shivering even when smooth
- [ ] Nervous appearance (never truly still)

### After Implementation (Expected Results)

- [ ] Smooth arcing turns (no zigzags)
- [ ] Gradual directional changes (no abrupt turns)
- [ ] Smooth acceleration curves
- [ ] Smooth deceleration curves
- [ ] Clean separation when crowded (no bounce)
- [ ] No trapped behavior
- [ ] No micro-jitter or shivering
- [ ] Can glide smoothly in straight lines
- [ ] Movement quality matches original flocking app

---

## Conclusion

This plan provides a systematic, phased approach to fixing all oscillation and jerkiness issues in the portfolio koi animation. By implementing the 5 missing smoothing mechanisms in order of impact, we can achieve production-quality smooth movement that matches the original flocking implementation.

**Key Success Factors**:
1. Follow phases in order (highest impact first)
2. Test thoroughly after each phase
3. Use provided rollback procedures if needed
4. Tune parameters based on visual feedback
5. Reference original implementation when in doubt

**Expected Outcome**:
After implementation, the koi animation will exhibit smooth, graceful movement with no oscillations, no jerky transitions, and natural flocking behavior that matches the quality of the original flocking application.

The total implementation time is estimated at 2-3 hours, with the option to implement critical fixes first (Phases 1-3) in 90 minutes for immediate 90% improvement, then polish with Phases 4-5 later.
