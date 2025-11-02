---
doc_type: research
date: 2025-11-02T05:40:08+00:00
title: "Flocking Smoothness Mechanisms - Complete Movement System Documentation"
research_question: "How does the original flocking application achieve smooth directional movement, what smoothing mechanisms exist, and what commonly gets lost when truncating the code?"
researcher: seanwoojinkim

git_commit: 5d5b30dcba163737124cc7345baa51e59bff8987
branch: main
repository: portfolio

created_by: seanwoojinkim
last_updated: 2025-11-02
last_updated_by: seanwoojinkim

tags:
  - flocking
  - smoothness
  - velocity
  - damping
  - forces
  - movement
  - koi
  - boids
  - truncation-issues
status: complete

related_docs:
  - ../visualizations/flocking/research/2025-10-19-koi-animation-jitter-investigation.md
  - ../visualizations/flocking/research/2025-10-19-oscillation-detection-analysis-and-improvements.md
---

# Research: Flocking Smoothness Mechanisms - Complete Movement System Documentation

**Date**: 2025-11-02T05:40:08+00:00
**Researcher**: seanwoojinkim
**Git Commit**: 5d5b30dcba163737124cc7345baa51e59bff8987
**Branch**: main
**Repository**: portfolio
**Flocking Codebase**: ../visualizations/flocking

## Research Question

How does the original flocking application achieve smooth directional movement? What are ALL the smoothing mechanisms used, how do velocity and direction changes work, and what critical components are commonly lost when truncating this code for use in other projects?

## Executive Summary

The flocking simulation achieves smooth, graceful movement through a **multi-layered smoothing architecture** with **7 distinct smoothing mechanisms** working together. The system prevents oscillations and abrupt directional changes through:

1. **Velocity smoothing (0.15 lerp factor)** - Gradual velocity changes
2. **Force smoothing (0.25 lerp factor)** - Smoothed flocking forces over time
3. **Derivative damping (0.45 coefficient)** - PID D-term resists rapid heading changes
4. **Dead-zone filtering (0.01 threshold)** - Ignores micro-forces to prevent jitter
5. **Force prioritization** - Separation dominates when too close to prevent conflicts
6. **Neighbor limiting (8 closest)** - Reduces conflicting forces
7. **Max speed limiting (per-boid individual limits)** - Prevents sudden accelerations

**Critical for Smooth Movement:**
- **Speed variation must be per-boid** (not global) to create natural swimming differences
- **Velocity smoothing happens AFTER acceleration** is applied (order matters!)
- **Damping force is perpendicular to velocity** (not opposite) for smooth turns
- **Force smoothing uses previous frame values** to prevent rapid oscillations

**Commonly Lost in Truncation:**
1. **Derivative damping** - Most critical for preventing oscillations (boid.js:231-253)
2. **Force smoothing with history** - Previous frame tracking (boid.js:28-31, 120-140)
3. **Dead-zone filtering** - Micro-force elimination (boid.js:131-135)
4. **Force prioritization** - Separation dominance logic (PHYSICS_CONFIG lines 24-40)
5. **Individual speed multipliers** - Per-boid speed variation (boid.js:52-53)
6. **Proper vector operations** - Using p5.Vector methods correctly

## Detailed Findings

### 1. Core Movement Logic - How Velocity and Position Update

The movement update happens every frame in a specific order that's critical for smoothness.

#### 1.1 Position Update

**Location**: `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:255`

```javascript
this.position.add(this.velocity);
```

**Simple and direct** - position changes by current velocity vector each frame.

**Wrapping behavior** (`boid.js:553-562`):
```javascript
edges(width, height) {
    // Use margin so koi completely leaves screen before wrapping
    const margin = 60;

    if (this.position.x > width + margin) this.position.x = -margin;
    if (this.position.x < -margin) this.position.x = width + margin;
    if (this.position.y > height + margin) this.position.y = -margin;
    if (this.position.y < -margin) this.position.y = height + margin;
}
```

**Key detail**: 60-pixel margin ensures koi fully exit before wrapping (prevents visual "teleport").

#### 1.2 Velocity Update with Smoothing

**Location**: `boid.js:255-276`

```javascript
this.position.add(this.velocity);

// Smooth velocity changes - creates more fluid, graceful movement
let targetVelocity = p5.Vector.add(this.velocity, this.acceleration);

// Apply individual speed variation and audio modulation
const audioSpeedMult = 1 + audioAmplitude * audioReactivity;
let individualMaxSpeed = maxSpeed * this.speedMultiplier * audioSpeedMult;

// During scatter, increase max speed
const scatterIntensity = this.getScatterIntensity();
if (scatterIntensity > 0) {
    const scatterSpeedMult = 1 + (PHYSICS_CONFIG.SCATTER_SPEED_BOOST * scatterIntensity);
    individualMaxSpeed *= scatterSpeedMult;
}

targetVelocity.limit(individualMaxSpeed);

// Smoothly interpolate from current velocity to target velocity
const smoothing = PHYSICS_CONFIG.VELOCITY_SMOOTHING; // 0.15
this.velocity.lerp(targetVelocity, smoothing);
```

**Critical sequence**:
1. Calculate target velocity (current + acceleration)
2. Limit target to max speed (individual, not global)
3. **Lerp from current to target** (smoothing = 0.15 means 15% toward target per frame)

**Why this order matters**:
- If you limit BEFORE lerp: Sudden speed changes at the limit boundary
- If you lerp BEFORE limit: Smooth approach to max speed

**Smoothing factor 0.15**:
- Takes ~4.5 frames (75ms at 60fps) to reach 50% of a velocity change
- Takes ~13 frames (217ms) to reach 90% of a velocity change
- Creates graceful acceleration/deceleration

#### 1.3 Acceleration Application and Reset

**Location**: `boid.js:326-327`

```javascript
// Reset acceleration to zero for next frame
this.acceleration.set(0, 0, 0);
```

**Critical**: Acceleration is **ephemeral** - exists only during one frame, then reset.

Forces accumulate into acceleration in `applyForces()`, then acceleration is applied to velocity in `update()`, then reset. This prevents force accumulation bugs.

### 2. Direction/Heading Changes and Smoothing

Heading (direction) changes smoothly because of **three separate mechanisms** working together.

#### 2.1 Derivative Damping (PID D-Term)

**Location**: `boid.js:231-253`

This is the **most important** smoothing mechanism for preventing abrupt directional changes.

```javascript
// DERIVATIVE DAMPING (PID D-term) - resist rapid heading changes
const currentHeading = this.velocity.heading();
let headingChange = currentHeading - this.previousHeading;

// Normalize angle difference to -PI to PI range
while (headingChange > Math.PI) headingChange -= Math.PI * 2;
while (headingChange < -Math.PI) headingChange += Math.PI * 2;

// Calculate damping force perpendicular to velocity
const dampingCoefficient = PHYSICS_CONFIG.DAMPING_COEFFICIENT; // 0.45
const speed = this.velocity.mag();

if (speed > PHYSICS_CONFIG.MIN_SPEED_FOR_DAMPING) { // 0.1
    // Damping force magnitude opposes heading change
    const dampingMagnitude = headingChange * -dampingCoefficient * speed;

    // Apply perpendicular to current velocity direction
    const perpAngle = currentHeading + Math.PI / 2;
    const dampingForce = p5.Vector.fromAngle(perpAngle, dampingMagnitude);

    // Add damping to acceleration
    this.acceleration.add(dampingForce);
}
```

**How it works**:
1. Measure how fast heading is changing (headingChange = current - previous)
2. Create a force **opposing** that rate of change (negative coefficient)
3. Apply force **perpendicular** to velocity (causes smooth arc, not sudden stop)
4. Force magnitude proportional to speed (faster = more damping)

**Why perpendicular?**
- If damping force opposes velocity directly → fish slows down suddenly
- If damping force is perpendicular → fish curves smoothly without speed change
- This creates graceful arcing turns instead of sharp corners

**DAMPING_COEFFICIENT = 0.45**:
- Higher = more resistance to turning (smoother but less responsive)
- Lower = less resistance (more responsive but can oscillate)
- 0.45 is well-tuned balance from research

**Commonly lost in truncation**: This entire mechanism. Without it, fish make abrupt zigzag turns.

#### 2.2 Force Smoothing Over Time

**Location**: `boid.js:28-31` (initialization) and `boid.js:120-140` (application)

Forces that affect heading (alignment, cohesion, separation) are **smoothed across frames**:

```javascript
// In constructor - initialize previous frame's forces
this.previousSeparation = createVectorFunc();
this.previousAlignment = createVectorFunc();
this.previousCohesion = createVectorFunc();

// In applyForces() - smooth forces by blending with previous frame
const forceSmoothing = PHYSICS_CONFIG.FORCE_SMOOTHING; // 0.25

// Lerp each force between previous and current
const smoothedAlignment = this.previousAlignment.copy().lerp(forces.alignment, forceSmoothing);
const smoothedCohesion = this.previousCohesion.copy().lerp(forces.cohesion, forceSmoothing);
const smoothedSeparation = this.previousSeparation.copy().lerp(forces.separation, forceSmoothing);

// Store current forces for next frame
this.previousAlignment = forces.alignment.copy();
this.previousCohesion = forces.cohesion.copy();
this.previousSeparation = forces.separation.copy();
```

**Why this matters**:
- When neighbors move, forces change rapidly
- Without smoothing: Force flips direction → velocity flips → oscillation
- With smoothing: Force changes gradually → smooth curved path

**FORCE_SMOOTHING = 0.25**:
- 25% new force, 75% previous force each frame
- Takes ~6 frames (100ms) to reach 50% of a new force
- Prevents "jittery" reactions to neighbor movements

**Commonly lost in truncation**: The `previousForce` tracking. Developers often just apply current forces directly.

#### 2.3 Dead-Zone Filtering

**Location**: `boid.js:131-135`

```javascript
// Dead zone: ignore very small forces to prevent micro-oscillations
const deadZoneThreshold = PHYSICS_CONFIG.DEAD_ZONE_THRESHOLD; // 0.01

if (smoothedAlignment.mag() < deadZoneThreshold) smoothedAlignment.set(0, 0);
if (smoothedCohesion.mag() < deadZoneThreshold) smoothedCohesion.set(0, 0);
if (smoothedSeparation.mag() < deadZoneThreshold) smoothedSeparation.set(0, 0);
```

**Purpose**: Eliminate tiny forces that cause "shivering" when fish are nearly balanced.

**Example scenario**:
- Fish swimming straight with 3 neighbors
- Forces nearly balanced: alignment = 0.008, cohesion = -0.007, separation = 0.002
- Without dead zone: Net force 0.003 causes micro-adjustments → fish "vibrates"
- With dead zone: All forces zeroed → fish glides smoothly

**DEAD_ZONE_THRESHOLD = 0.01**:
- Any force smaller than 1% of max force is zeroed
- Prevents numerical noise from causing visible jitter

**Commonly lost in truncation**: This filter. Results in fish that look "nervous" even when stationary.

### 3. Acceleration and Force Application

#### 3.1 Force Prioritization

**Location**: `boid.js:142-161` and `physics-config.js:24-40`

When forces conflict (separation says "go left", alignment says "go right"), the system **prioritizes separation**:

```javascript
// FORCE PRIORITIZATION - Prevent oscillation from conflicting forces
const separationMag = smoothedSeparation.mag();

let alignmentWeight = 1.0;
let cohesionWeight = 1.0;
let separationWeight = 1.0;

if (separationMag > PHYSICS_CONFIG.SEPARATION_HIGH_THRESHOLD) { // 0.05
    // High separation need - fish are too close
    separationWeight = PHYSICS_CONFIG.PRIORITIZE_HIGH.separation; // 0.9
    alignmentWeight = PHYSICS_CONFIG.PRIORITIZE_HIGH.alignment;   // 0.1
    cohesionWeight = PHYSICS_CONFIG.PRIORITIZE_HIGH.cohesion;     // 0.1
} else if (separationMag > PHYSICS_CONFIG.SEPARATION_MED_THRESHOLD) { // 0.02
    // Moderate separation need
    separationWeight = PHYSICS_CONFIG.PRIORITIZE_MEDIUM.separation; // 0.7
    alignmentWeight = PHYSICS_CONFIG.PRIORITIZE_MEDIUM.alignment;   // 0.5
    cohesionWeight = PHYSICS_CONFIG.PRIORITIZE_MEDIUM.cohesion;     // 0.5
}

// Apply weighted forces
smoothedAlignment.mult(alignmentWeight);
smoothedCohesion.mult(cohesionWeight);
smoothedSeparation.mult(separationWeight);
```

**Why this prevents oscillation**:
- Without prioritization: Forces fight each other → fish wavers
- With prioritization: When too close, separation wins decisively → fish moves away cleanly
- When far enough, all forces balanced → fish flocks normally

**Thresholds**:
- HIGH (0.05): Very close, 90% separation
- MEDIUM (0.02): Moderately close, 70% separation
- Normal (< 0.02): Balanced weights

**Commonly lost in truncation**: Entire prioritization system. Results in "vibrating" fish when crowded.

#### 3.2 Scatter Forces

**Location**: `boid.js:164-175` and `boid.js:531-546`

Random scatter behavior adds naturalistic "startled" movements:

```javascript
// SCATTER FORCES - Calculate and blend with flocking forces
const scatterIntensity = this.getScatterIntensity();
let scatterForce = null;

if (scatterIntensity > 0 && p5) {
    scatterForce = this.calculateScatterForce(maxForce, p5);

    // During scatter, reduce flocking forces
    const flockingMultiplier = 1 - scatterIntensity;
    alignmentWeight *= flockingMultiplier;
    cohesionWeight *= flockingMultiplier;
    separationWeight *= flockingMultiplier;
}

// ...later...

calculateScatterForce(maxForce, p5) {
    const intensity = this.getScatterIntensity();

    if (intensity === 0 || !this.scatterVector) {
        return new p5.Vector(0, 0);
    }

    const scatterForce = this.scatterVector.copy();
    scatterForce.limit(maxForce * PHYSICS_CONFIG.SCATTER_FORCE_MULTIPLIER); // 5x stronger
    scatterForce.mult(intensity); // Weight by intensity (0-1)

    return scatterForce;
}
```

**Key properties**:
- Scatter forces are **5x stronger** than normal forces
- During scatter, **flocking forces are reduced** (multiplied by 1 - intensity)
- Scatter has **ease-in/ease-out** over 2 seconds (see `getScatterIntensity()` at boid.js:506-523)

**Not typically needed in truncated versions**, but contributes to lifelike movement.

### 4. Critical Parameters and Constants

All smoothing constants are centralized in `physics-config.js`:

#### 4.1 Force Smoothing Parameters

```javascript
// physics-config.js:8-12
FORCE_SMOOTHING: 0.25,          // Blend 25% new, 75% old each frame
VELOCITY_SMOOTHING: 0.15,       // Velocity lerp factor (15% toward target)
DEAD_ZONE_THRESHOLD: 0.01,      // Ignore forces below this magnitude
```

**Tuning guidance**:
- FORCE_SMOOTHING: Increase (→0.4) for more responsiveness, decrease (→0.15) for more smoothness
- VELOCITY_SMOOTHING: Increase (→0.25) for snappier movement, decrease (→0.08) for more grace
- DEAD_ZONE: Increase if fish "vibrate" when idle, decrease if fish feel "sticky"

#### 4.2 Damping Parameters

```javascript
// physics-config.js:14-17
DAMPING_COEFFICIENT: 0.45,      // Resistance to rapid heading changes (PID D-term)
MIN_SPEED_FOR_DAMPING: 0.1,     // Only apply damping if moving faster than this
```

**Critical**: DAMPING_COEFFICIENT is the single most important parameter for smooth turns.

**Tuning**:
- Too low (< 0.2): Fish make sharp zigzags, oscillate
- Too high (> 0.6): Fish feel "sticky", hard to turn
- Sweet spot: 0.3-0.5 depending on force magnitudes

#### 4.3 Force Prioritization Thresholds

```javascript
// physics-config.js:24-40
SEPARATION_HIGH_THRESHOLD: 0.05,    // When separation force this strong, prioritize 90%
SEPARATION_MED_THRESHOLD: 0.02,     // When this strong, prioritize 70%

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
```

**Calibration**: These thresholds depend on your `separationWeight` parameter. If separation is typically 0.3-0.8, increase thresholds accordingly.

#### 4.4 Neighbor Limiting

```javascript
// physics-config.js:82
MAX_NEIGHBORS: 8,               // Limit to 8 closest neighbors
```

**Why limit?**
- More neighbors = more forces = more conflicts = more oscillation
- 8 neighbors is enough for flocking behavior without overload

**Location in code**: `flocking-forces.js:32-37`
```javascript
// Sort by distance and limit to closest N neighbors
neighborsWithDistance.sort((a, b) => a.distance - b.distance);
const closestNeighbors = neighborsWithDistance.slice(0, PHYSICS_CONFIG.MAX_NEIGHBORS);

return closestNeighbors.map(n => n.boid);
```

#### 4.5 Per-Boid Speed Variation

**Location**: `boid.js:52-53`

```javascript
// Speed variation - each koi has its own preferred speed around the global max
this.speedMultiplier = randomFunc(0.6, 1.3);
```

**Critical for natural movement**:
- Without this: All fish swim at exactly the same speed (looks robotic)
- With this: Some fish naturally faster/slower (looks organic)

**Applied during velocity limiting**:
```javascript
// boid.js:261-262
const audioSpeedMult = 1 + audioAmplitude * audioReactivity;
let individualMaxSpeed = maxSpeed * this.speedMultiplier * audioSpeedMult;
```

**Range**: 0.6 to 1.3 means:
- Slowest fish: 60% of global max speed
- Fastest fish: 130% of global max speed
- Creates visible speed diversity in the flock

### 5. Smoothing Mechanisms Summary Table

| Mechanism | Location | Factor/Threshold | Purpose | Commonly Lost? |
|-----------|----------|------------------|---------|----------------|
| **Velocity Smoothing** | boid.js:275-276 | 0.15 lerp | Gradual speed changes | Sometimes |
| **Force Smoothing** | boid.js:120-140 | 0.25 lerp | Smooth force transitions | **YES** |
| **Derivative Damping** | boid.js:231-253 | 0.45 coefficient | Resist rapid turns | **YES** |
| **Dead-Zone Filter** | boid.js:131-135 | 0.01 threshold | Eliminate micro-forces | **YES** |
| **Force Prioritization** | boid.js:142-161 | 0.05/0.02 thresholds | Prevent force conflicts | **YES** |
| **Neighbor Limiting** | flocking-forces.js:32-37 | 8 neighbors | Reduce force complexity | Sometimes |
| **Speed Variation** | boid.js:52-53, 261-262 | 0.6-1.3 range | Natural diversity | **YES** |

### 6. What Gets Lost in Truncation - Common Mistakes

Based on analysis of the full system, here's what commonly gets truncated or simplified incorrectly:

#### 6.1 Missing Derivative Damping (CRITICAL)

**Original code (boid.js:231-253)**:
```javascript
const currentHeading = this.velocity.heading();
let headingChange = currentHeading - this.previousHeading;

// Normalize angle
while (headingChange > Math.PI) headingChange -= Math.PI * 2;
while (headingChange < -Math.PI) headingChange += Math.PI * 2;

const dampingMagnitude = headingChange * -dampingCoefficient * speed;
const perpAngle = currentHeading + Math.PI / 2;
const dampingForce = p5.Vector.fromAngle(perpAngle, dampingMagnitude);

this.acceleration.add(dampingForce);
```

**Common truncation** (WRONG):
```javascript
// Just smooth velocity, no damping
this.velocity.lerp(targetVelocity, 0.15);
```

**Problem**: Without damping, fish oscillate. Velocity smoothing alone isn't enough.

**Symptoms**: Fish make rapid back-and-forth turns, zigzag pattern, looks "jittery"

#### 6.2 Missing Force History (CRITICAL)

**Original code (boid.js:28-31, 120-140)**:
```javascript
// Store previous frame's forces
this.previousSeparation = createVectorFunc();
this.previousAlignment = createVectorFunc();
this.previousCohesion = createVectorFunc();

// ...later...

const smoothedAlignment = this.previousAlignment.copy().lerp(forces.alignment, 0.25);
this.previousAlignment = forces.alignment.copy(); // Store for next frame
```

**Common truncation** (WRONG):
```javascript
// Apply forces directly without history
this.acceleration.add(forces.alignment);
this.acceleration.add(forces.cohesion);
this.acceleration.add(forces.separation);
```

**Problem**: Forces change instantly when neighbors move, causing oscillation.

**Symptoms**: Fish "vibrate" when in a group, sudden direction changes

#### 6.3 Wrong Velocity Smoothing Order

**Original code (boid.js:255-276)**:
```javascript
let targetVelocity = p5.Vector.add(this.velocity, this.acceleration);
targetVelocity.limit(individualMaxSpeed);  // Limit FIRST
this.velocity.lerp(targetVelocity, smoothing);  // Lerp SECOND
```

**Common truncation** (WRONG):
```javascript
this.velocity.add(this.acceleration);
this.velocity.lerp(targetVelocity, smoothing);  // Lerp first
this.velocity.limit(maxSpeed);  // Limit second
```

**Problem**: Lerping before limiting can cause overshoot at speed boundaries.

**Symptoms**: Sudden speed changes, "pulsing" motion

#### 6.4 Missing Dead-Zone Filter

**Original code (boid.js:131-135)**:
```javascript
if (smoothedAlignment.mag() < 0.01) smoothedAlignment.set(0, 0);
if (smoothedCohesion.mag() < 0.01) smoothedCohesion.set(0, 0);
if (smoothedSeparation.mag() < 0.01) smoothedSeparation.set(0, 0);
```

**Common truncation** (WRONG):
```javascript
// Apply all forces, even tiny ones
this.acceleration.add(smoothedAlignment);
// ...
```

**Problem**: Tiny numerical errors accumulate, cause micro-oscillations.

**Symptoms**: Fish "shiver" when idle, never truly still

#### 6.5 Missing Force Prioritization

**Original code (boid.js:142-161)**:
```javascript
const separationMag = smoothedSeparation.mag();

if (separationMag > 0.05) {
    smoothedSeparation.mult(0.9);
    smoothedAlignment.mult(0.1);
    smoothedCohesion.mult(0.1);
} else if (separationMag > 0.02) {
    // Medium priority
}
```

**Common truncation** (WRONG):
```javascript
// All forces equally weighted always
this.acceleration.add(smoothedAlignment);
this.acceleration.add(smoothedCohesion);
this.acceleration.add(smoothedSeparation);
```

**Problem**: When too close to neighbors, conflicting forces cause oscillation.

**Symptoms**: Fish "bounce" off each other, vibrate in crowds

#### 6.6 Global Speed Instead of Individual

**Original code (boid.js:52-53, 261-262)**:
```javascript
this.speedMultiplier = randomFunc(0.6, 1.3);  // Per-boid
// ...
let individualMaxSpeed = maxSpeed * this.speedMultiplier;
```

**Common truncation** (WRONG):
```javascript
// All fish use same maxSpeed
this.velocity.limit(maxSpeed);
```

**Problem**: All fish swim at exactly the same speed.

**Symptoms**: Flock looks "robotic", no natural speed variation

#### 6.7 Incorrect Damping Force Direction

**Original code (boid.js:247-249)**:
```javascript
const dampingMagnitude = headingChange * -dampingCoefficient * speed;
const perpAngle = currentHeading + Math.PI / 2;  // PERPENDICULAR
const dampingForce = p5.Vector.fromAngle(perpAngle, dampingMagnitude);
```

**Common truncation** (WRONG):
```javascript
// Oppose velocity directly (not perpendicular)
const dampingForce = this.velocity.copy().mult(-0.1);
this.acceleration.add(dampingForce);
```

**Problem**: Direct opposition slows fish down, doesn't smooth turns.

**Symptoms**: Fish "brake" when turning, stuttering motion

### 7. Minimal Working Implementation Checklist

For a truncated flocking system that maintains smoothness, you **MUST** include:

**Tier 1 (CRITICAL - Cannot omit)**:
- [ ] Derivative damping with perpendicular force (boid.js:231-253)
- [ ] Force smoothing with previous frame history (boid.js:120-140)
- [ ] Velocity smoothing AFTER speed limiting (boid.js:255-276)
- [ ] Dead-zone filtering on forces (boid.js:131-135)

**Tier 2 (HIGHLY RECOMMENDED)**:
- [ ] Force prioritization when separation is high (boid.js:142-161)
- [ ] Individual speed multipliers per boid (boid.js:52-53, 261-262)
- [ ] Neighbor limiting to N closest (flocking-forces.js:32-37)

**Tier 3 (OPTIONAL - for polish)**:
- [ ] Scatter behavior for naturalistic startles
- [ ] Independence behavior for solo swimming
- [ ] Oscillation detection and escape

**Minimum viable constants**:
```javascript
const FORCE_SMOOTHING = 0.25;
const VELOCITY_SMOOTHING = 0.15;
const DAMPING_COEFFICIENT = 0.45;
const DEAD_ZONE_THRESHOLD = 0.01;
const MIN_SPEED_FOR_DAMPING = 0.1;
```

### 8. Debugging Oscillations - What to Check

If your truncated implementation shows oscillations or abrupt movements:

1. **Check if derivative damping exists** - Search for "heading change" or "damping"
2. **Check if forces are smoothed** - Look for `previousAlignment`, `previousSeparation`, etc.
3. **Check update order** - Verify: calculate target → limit speed → lerp velocity
4. **Check damping direction** - Should be **perpendicular**, not opposite to velocity
5. **Check for dead-zone** - Forces below threshold should be zeroed
6. **Check angle normalization** - Heading differences should wrap to [-π, π]
7. **Check acceleration reset** - Should be `set(0,0,0)` each frame, not `mult(0)`

### 9. Performance Considerations

The smoothing mechanisms have minimal performance impact:

- **Force smoothing**: 3 vector lerps per frame per boid = ~50 ops
- **Derivative damping**: 1 heading calculation + 1 perpendicular force = ~20 ops
- **Dead-zone filtering**: 3 magnitude checks = ~15 ops
- **Force prioritization**: 2 magnitude comparisons + 3 multiplications = ~10 ops

**Total**: ~95 operations per boid per frame

For 100 boids at 60fps = 570,000 ops/sec = negligible on modern hardware.

**Don't skip smoothing for performance reasons** - it's not the bottleneck.

### 10. Testing Smooth Movement

To verify your implementation maintains smoothness:

**Visual tests**:
1. **Single boid test**: One boid, no neighbors - should glide smoothly
2. **Two boid test**: Two boids approaching - should curve around each other, not bounce
3. **Dense flock test**: 50+ boids - should flow like liquid, not vibrate
4. **Speed variation test**: Boids should have visibly different speeds

**Quantitative tests**:
1. **Heading change rate**: Should not exceed π/30 per frame (~6° per frame)
2. **Velocity magnitude**: Should change smoothly, no sudden jumps
3. **Acceleration spikes**: Should not exceed 2x typical acceleration
4. **Force oscillation**: Same-sign force for 5+ consecutive frames (not flip-flopping)

**Debug visualization** (optional):
- Draw velocity vectors - should rotate smoothly, not flip
- Draw acceleration vectors - should be small and consistent
- Draw heading history trail - should be curved, not zigzag

## Code References

### Core Movement System
- `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:219-327` - Main update() method
- `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:255` - Position update
- `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:255-276` - Velocity smoothing
- `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:326-327` - Acceleration reset

### Smoothing Mechanisms
- `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:231-253` - Derivative damping (PID D-term)
- `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:120-140` - Force smoothing with history
- `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:131-135` - Dead-zone filtering
- `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:142-161` - Force prioritization

### Configuration
- `/Users/seankim/dev/visualizations/flocking/src/flocking/physics-config.js:8-17` - Smoothing constants
- `/Users/seankim/dev/visualizations/flocking/src/flocking/physics-config.js:24-40` - Force prioritization config
- `/Users/seankim/dev/visualizations/flocking/src/flocking/physics-config.js:82` - Neighbor limiting

### Force Calculation
- `/Users/seankim/dev/visualizations/flocking/src/flocking/flocking-forces.js:16-38` - Neighbor finding
- `/Users/seankim/dev/visualizations/flocking/src/flocking/flocking-forces.js:50-65` - Alignment calculation
- `/Users/seankim/dev/visualizations/flocking/src/flocking/flocking-forces.js:77-93` - Cohesion calculation
- `/Users/seankim/dev/visualizations/flocking/src/flocking/flocking-forces.js:107-142` - Separation calculation

### Individual Variation
- `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:52-53` - Speed multiplier initialization
- `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:55` - Animation offset
- `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:261-262` - Individual speed application

### Behavioral Systems
- `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:334-368` - Independence behavior
- `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:468-500` - Scatter behavior
- `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:278-323` - Oscillation detection

### Edge Cases
- `/Users/seankim/dev/visualizations/flocking/src/flocking/boid.js:553-562` - Screen wrapping
- `/Users/seankim/dev/visualizations/flocking/src/flocking/flocking-forces.js:121-123` - Minimum distance clamping
- `/Users/seankim/dev/visualizations/flocking/src/flocking/flocking-forces.js:126-128` - Linear inverse distance (not squared)

## Historical Context (from ../visualizations/flocking/thoughts/)

### Previous Research on Smoothness

The flocking codebase has extensive research on oscillation and jitter issues:

**From `2025-10-19-oscillation-detection-analysis-and-improvements.md`**:
- Documented that damping coefficient was originally 0.3, reduced to 0.15 (too low)
- Recommended force prioritization (now implemented in current code)
- Identified that triple-layer smoothing can create 10-20 frame lag

**From `2025-10-19-koi-animation-jitter-investigation.md`**:
- Distinguished between **physics oscillation** (heading reversals) vs **animation jitter** (wave phase)
- Identified that smoothing animation RATE causes accumulation, not position
- This is separate from movement smoothness - about visual rendering

**Evolution of smoothing values**:
1. Original: Force smoothing 0.15, velocity 0.08, damping 0.3
2. After oscillation research: Force 0.25, velocity 0.15, damping 0.15 (wrong direction on damping!)
3. Current: Force 0.25, velocity 0.15, damping **0.45** (corrected to higher)

The current `DAMPING_COEFFICIENT = 0.45` in physics-config.js is higher than historical values, indicating continued tuning for smoothness.

## Architecture Documentation

### Smoothing Pipeline Flow

```
┌─────────────────────────────────────────────────────┐
│ FRAME N: Force Calculation                          │
├─────────────────────────────────────────────────────┤
│ 1. Find neighbors (closest 8 within radius)        │
│ 2. Calculate alignment, cohesion, separation        │
│ 3. Apply user-defined weights                      │
│    (separationWeight, alignmentWeight, etc.)       │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ SMOOTHING LAYER 1: Force Smoothing                  │
├─────────────────────────────────────────────────────┤
│ Blend with previous frame (25% new, 75% old)       │
│   smoothedForce = prevForce.lerp(currForce, 0.25)  │
│                                                     │
│ Store current force for next frame                 │
│   previousAlignment = forces.alignment.copy()      │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ SMOOTHING LAYER 2: Dead-Zone Filtering              │
├─────────────────────────────────────────────────────┤
│ Zero out forces below threshold (0.01)              │
│   if (force.mag() < 0.01) force.set(0, 0)          │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ SMOOTHING LAYER 3: Force Prioritization             │
├─────────────────────────────────────────────────────┤
│ When separation high (>0.05): 90% separation        │
│ When separation med (>0.02): 70% separation         │
│ Otherwise: balanced weights                        │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ Add to acceleration vector                           │
│   acceleration.add(smoothedAlignment)               │
│   acceleration.add(smoothedCohesion)                │
│   acceleration.add(smoothedSeparation)              │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ SMOOTHING LAYER 4: Derivative Damping               │
├─────────────────────────────────────────────────────┤
│ Calculate heading change rate                       │
│   headingChange = currentHeading - previousHeading  │
│                                                     │
│ Create perpendicular damping force                  │
│   dampingForce = -headingChange * 0.45 * speed     │
│   direction = currentHeading + π/2 (perpendicular)  │
│                                                     │
│ Add to acceleration                                 │
│   acceleration.add(dampingForce)                    │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ FRAME N: Physics Update                             │
├─────────────────────────────────────────────────────┤
│ Calculate target velocity                           │
│   targetVelocity = velocity + acceleration         │
│                                                     │
│ Limit to individual max speed                      │
│   maxSpeed = globalMax * speedMultiplier           │
│   targetVelocity.limit(maxSpeed)                   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ SMOOTHING LAYER 5: Velocity Smoothing               │
├─────────────────────────────────────────────────────┤
│ Lerp from current to target (15% per frame)        │
│   velocity.lerp(targetVelocity, 0.15)              │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ Update position and reset acceleration              │
│   position.add(velocity)                           │
│   acceleration.set(0, 0, 0)                        │
└─────────────────────────────────────────────────────┘
```

### Why This Multi-Layer Approach Works

Each layer handles a different type of instability:

1. **Force smoothing** → Prevents rapid force fluctuations from neighbor movements
2. **Dead-zone filtering** → Eliminates numerical noise and micro-oscillations
3. **Force prioritization** → Resolves conflicts between competing forces
4. **Derivative damping** → Stabilizes heading changes (most important for smooth turns)
5. **Velocity smoothing** → Creates graceful acceleration/deceleration

Removing ANY of these layers can cause oscillations or jitter.

## Related Research

From the flocking codebase `research/` directory:

1. **Oscillation Detection Analysis** (`2025-10-19-oscillation-detection-analysis-and-improvements.md`)
   - Detailed analysis of heading reversal detection
   - Identified missing force prioritization (now implemented)
   - Recommended damping coefficient tuning

2. **Animation Jitter Investigation** (`2025-10-19-koi-animation-jitter-investigation.md`)
   - Separate issue: animation wave phase vs physics movement
   - Identified smoothing rate vs smoothing position
   - Not about movement smoothness (about visual rendering)

## Recommendations for Truncated Implementations

### Minimal Viable Smoothing

If you MUST truncate, this is the absolute minimum to maintain smoothness:

```javascript
class Boid {
    constructor() {
        // Required state
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.acceleration = createVector();

        // CRITICAL: Previous frame tracking
        this.previousAlignment = createVector();
        this.previousCohesion = createVector();
        this.previousSeparation = createVector();
        this.previousHeading = this.velocity.heading();

        // Individual variation
        this.speedMultiplier = random(0.6, 1.3);
    }

    applyForces(forces) {
        // CRITICAL: Force smoothing with history
        const smoothedAlignment = this.previousAlignment.copy().lerp(forces.alignment, 0.25);
        const smoothedCohesion = this.previousCohesion.copy().lerp(forces.cohesion, 0.25);
        const smoothedSeparation = this.previousSeparation.copy().lerp(forces.separation, 0.25);

        // CRITICAL: Dead-zone filtering
        if (smoothedAlignment.mag() < 0.01) smoothedAlignment.set(0, 0);
        if (smoothedCohesion.mag() < 0.01) smoothedCohesion.set(0, 0);
        if (smoothedSeparation.mag() < 0.01) smoothedSeparation.set(0, 0);

        // Store for next frame
        this.previousAlignment = forces.alignment.copy();
        this.previousCohesion = forces.cohesion.copy();
        this.previousSeparation = forces.separation.copy();

        // Add to acceleration
        this.acceleration.add(smoothedAlignment);
        this.acceleration.add(smoothedCohesion);
        this.acceleration.add(smoothedSeparation);
    }

    update(maxSpeed) {
        // CRITICAL: Derivative damping
        const currentHeading = this.velocity.heading();
        let headingChange = currentHeading - this.previousHeading;

        // Normalize to -PI to PI
        while (headingChange > Math.PI) headingChange -= Math.PI * 2;
        while (headingChange < -Math.PI) headingChange += Math.PI * 2;

        // Apply perpendicular damping force
        const speed = this.velocity.mag();
        if (speed > 0.1) {
            const dampingMagnitude = headingChange * -0.45 * speed;
            const perpAngle = currentHeading + Math.PI / 2;
            const dampingForce = p5.Vector.fromAngle(perpAngle, dampingMagnitude);
            this.acceleration.add(dampingForce);
        }

        this.previousHeading = currentHeading;

        // Update position
        this.position.add(this.velocity);

        // CRITICAL: Correct order - limit first, lerp second
        let targetVelocity = p5.Vector.add(this.velocity, this.acceleration);
        targetVelocity.limit(maxSpeed * this.speedMultiplier);
        this.velocity.lerp(targetVelocity, 0.15);

        // Reset acceleration
        this.acceleration.set(0, 0, 0);
    }
}
```

This is ~60 lines but captures all critical smoothing mechanisms.

### What To Add Back If Oscillations Occur

If this minimal version still shows oscillations:

1. **Add force prioritization** (boid.js:142-161) - Most effective fix
2. **Increase damping coefficient** from 0.45 to 0.6
3. **Add neighbor limiting** to 8 closest (flocking-forces.js:32-37)
4. **Increase velocity smoothing** from 0.15 to 0.2

## Open Questions

1. **Is there an optimal combination of smoothing layers?**
   - Current system has 5 layers, but could some be combined or removed?
   - What's the minimum number of layers for smooth movement?

2. **How do smoothing parameters scale with flock size?**
   - Current values tuned for ~80 boids
   - Do they need adjustment for 10 boids? 500 boids?

3. **Is derivative damping still needed if forces are heavily smoothed?**
   - Triple force smoothing creates 10-20 frame lag
   - Could remove one force smoothing layer if damping is strong enough?

4. **What's the performance impact of storing force history for 1000 boids?**
   - Each boid stores 3 vectors (6 floats) of history
   - 1000 boids = 6000 floats = 24KB of memory (negligible)
   - But is there cache locality impact?

5. **Can force prioritization be made adaptive?**
   - Current thresholds (0.05, 0.02) are hardcoded
   - Could they adapt based on local density or force magnitudes?

## Conclusion

The flocking simulation's smooth movement is NOT the result of any single "trick" - it's a carefully orchestrated system of **7 complementary smoothing mechanisms** working together. The most commonly lost elements in truncation are:

1. **Derivative damping** (perpendicular force opposing heading changes)
2. **Force smoothing with history** (blending current and previous forces)
3. **Force prioritization** (separation dominance when crowded)

Without these three, fish will exhibit oscillations, abrupt turns, and jittery movement. The velocity smoothing alone (which most developers keep) is NOT sufficient.

For maximum smoothness with minimal code, include at minimum: force smoothing, derivative damping, dead-zone filtering, and correct velocity update ordering. These add ~40 lines of code but are essential for graceful movement.
