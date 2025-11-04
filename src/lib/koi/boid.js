/**
 * Boid Class (Simplified for Portfolio)
 * Basic flocking physics and koi appearance
 */

import { selectVariety, generatePattern } from './koi-varieties.js';
import { PHYSICS_CONFIG } from './physics-config.js';

export class Boid {
    constructor(width, height, randomFunc, createVectorFunc, floorFunc, p5Instance) {
        // Physics
        this.position = createVectorFunc(randomFunc(width), randomFunc(height));
        this.velocity = p5Instance.Vector.random2D();
        this.velocity.setMag(randomFunc(0.5, 1.5));
        this.acceleration = createVectorFunc();
        this.perceptionRadius = PHYSICS_CONFIG.PERCEPTION_RADIUS;

        // Force smoothing - reduces jitter
        this.previousSeparation = createVectorFunc();
        this.previousAlignment = createVectorFunc();
        this.previousCohesion = createVectorFunc();

        // Derivative damping - track heading velocity for PID D-term
        this.previousHeading = this.velocity.heading();

        // Oscillation detection - track heading changes over time
        this.headingHistory = [];

        // Escape maneuvers - break out of oscillation and overcrowding
        this.isEscaping = false;
        this.escapeEndTime = 0;
        this.escapeDirection = null;
        this.escapeCooldownEndTime = 0;  // Prevent immediate re-triggering

        // Independence behavior - random solo swimming
        this.isIndependent = false;
        this.independenceEndTime = 0;
        this.nextIndependenceCheckTime = Date.now() + randomFunc(
            PHYSICS_CONFIG.INDEPENDENCE_CHECK_MIN,
            PHYSICS_CONFIG.INDEPENDENCE_CHECK_MAX
        );
        this.independenceChance = randomFunc(
            PHYSICS_CONFIG.INDEPENDENCE_CHANCE_MIN,
            PHYSICS_CONFIG.INDEPENDENCE_CHANCE_MAX
        );

        // Koi appearance
        const variety = selectVariety(randomFunc);
        this.variety = variety;
        this.pattern = generatePattern(variety, randomFunc, floorFunc);
        this.color = variety.base;

        // Size variations
        this.sizeMultiplier = randomFunc(0.6, 1.4);
        this.lengthMultiplier = randomFunc(0.85, 1.25);
        this.tailLength = randomFunc(0.9, 1.8);
        this.speedMultiplier = randomFunc(0.6, 1.3);

        // Animation offset - each koi undulates at different phase
        this.animationOffset = randomFunc(0, Math.PI * 2);
    }

    /**
     * Apply flocking forces with smoothing
     */
    applyForces(forces, neighborCount = 0, randomFunc = Math.random) {
        const { separation, alignment, cohesion, attraction } = forces;

        // Smooth forces with previous frame
        const smoothing = PHYSICS_CONFIG.FORCE_SMOOTHING;
        const smoothedSeparation = this.lerpVector(this.previousSeparation, separation, smoothing);
        const smoothedAlignment = this.lerpVector(this.previousAlignment, alignment, smoothing);
        const smoothedCohesion = this.lerpVector(this.previousCohesion, cohesion, smoothing);

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

        // OVERCROWDING DETECTION - detect too many neighbors or excessive forces
        const totalForceMag = smoothedAlignment.mag() +
                              smoothedCohesion.mag() +
                              smoothedSeparation.mag();

        // Check if overcrowded and not already escaping or in cooldown
        const now = Date.now();
        if (!this.isEscaping && now > this.escapeCooldownEndTime) {
            if (neighborCount > PHYSICS_CONFIG.OVERCROWDING_NEIGHBOR_LIMIT ||
                totalForceMag > PHYSICS_CONFIG.OVERCROWDING_FORCE_LIMIT) {
                this.triggerEscapeManeuver(randomFunc);
                // Clear heading history to reset oscillation detection
                this.headingHistory = [];
            }
        }

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

        // Apply to acceleration
        this.acceleration.add(smoothedSeparation);
        this.acceleration.add(smoothedAlignment);
        this.acceleration.add(smoothedCohesion);

        // Add attraction force if present (no smoothing for responsiveness)
        if (attraction && attraction.mag && attraction.mag() > 0) {
            this.acceleration.add(attraction);
        }
    }

    /**
     * Update physics
     */
    update(maxSpeed, randomFunc = Math.random) {
        // Update escape state first
        this.updateEscape();

        // Update independence state
        this.updateIndependence(randomFunc);
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

        // OSCILLATION DETECTION - detect rapid back-and-forth direction changes
        // Add current heading to history
        this.headingHistory.push(currentHeading);

        // Keep only last N frames
        if (this.headingHistory.length > PHYSICS_CONFIG.OSCILLATION_HISTORY_LENGTH) {
            this.headingHistory.shift();
        }

        // Check for oscillation if we have enough history
        if (this.headingHistory.length >= PHYSICS_CONFIG.OSCILLATION_CHECK_LENGTH) {
            // Calculate direction changes between consecutive frames
            const changes = [];
            for (let i = 1; i < this.headingHistory.length; i++) {
                let diff = this.headingHistory[i] - this.headingHistory[i - 1];
                // Normalize to -PI to PI
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                changes.push(diff);
            }

            // Count direction reversals (sign changes in consecutive changes)
            let reversals = 0;
            for (let i = 1; i < changes.length; i++) {
                // If signs are opposite, it's a reversal
                if ((changes[i] > 0 && changes[i-1] < 0) || (changes[i] < 0 && changes[i-1] > 0)) {
                    reversals++;
                }
            }

            // If we have N+ reversals and not in cooldown, trigger escape
            const now = Date.now();
            if (reversals >= PHYSICS_CONFIG.OSCILLATION_REVERSAL_THRESHOLD &&
                !this.isEscaping && now > this.escapeCooldownEndTime) {
                this.triggerEscapeManeuver(randomFunc);
                // Clear history after triggering escape
                this.headingHistory = [];
            }
        }

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

    /**
     * Trigger escape maneuver to break out of oscillation or overcrowding
     */
    triggerEscapeManeuver(randomFunc) {
        this.isEscaping = true;
        this.escapeEndTime = Date.now() + randomFunc(
            PHYSICS_CONFIG.ESCAPE_DURATION_MIN,
            PHYSICS_CONFIG.ESCAPE_DURATION_MAX
        );

        // Pick a direction 45-90 degrees away from current heading
        const currentHeading = this.velocity.heading();
        const angleOffset = randomFunc(
            PHYSICS_CONFIG.ESCAPE_ANGLE_MIN,
            PHYSICS_CONFIG.ESCAPE_ANGLE_MAX
        );
        const direction = randomFunc() > 0.5 ? 1 : -1; // Randomly left or right

        this.escapeDirection = currentHeading + (angleOffset * direction);

        console.log('[Koi Anti-Jitter] Escape maneuver triggered:', {
            duration: (this.escapeEndTime - Date.now()) / 1000,
            angle: (angleOffset * direction * 180 / Math.PI).toFixed(1) + '°'
        });
    }

    /**
     * Check if this boid is currently escaping
     */
    getIsEscaping() {
        return this.isEscaping && Date.now() < this.escapeEndTime;
    }

    /**
     * Get the escape direction if currently escaping
     */
    getEscapeDirection() {
        if (this.getIsEscaping()) {
            return this.escapeDirection;
        }
        return null;
    }

    /**
     * Update escape state - called each frame
     */
    updateEscape() {
        if (this.isEscaping && Date.now() >= this.escapeEndTime) {
            this.isEscaping = false;
            this.escapeDirection = null;

            // Set cooldown period to prevent immediate re-triggering
            const cooldownDuration = Math.random() *
                (PHYSICS_CONFIG.ESCAPE_COOLDOWN_MAX - PHYSICS_CONFIG.ESCAPE_COOLDOWN_MIN) +
                PHYSICS_CONFIG.ESCAPE_COOLDOWN_MIN;
            this.escapeCooldownEndTime = Date.now() + cooldownDuration;

            // Clear heading history to reset oscillation detection
            this.headingHistory = [];

            console.log('[Koi Anti-Jitter] Escape maneuver ended, cooldown:', (cooldownDuration / 1000).toFixed(1) + 's');
        }
    }

    /**
     * Update independence behavior - periodically decide to go solo
     */
    updateIndependence(randomFunc) {
        const currentTime = Date.now();

        if (this.isIndependent) {
            // Currently independent - check if time is up
            if (currentTime >= this.independenceEndTime) {
                this.isIndependent = false;
                // Schedule next check
                this.nextIndependenceCheckTime = currentTime + randomFunc(
                    PHYSICS_CONFIG.INDEPENDENCE_CHECK_MIN,
                    PHYSICS_CONFIG.INDEPENDENCE_CHECK_MAX
                );
                console.log('[Koi Anti-Jitter] Independence ended');
            }
        } else {
            // Not independent - check if it's time to evaluate
            if (currentTime >= this.nextIndependenceCheckTime) {
                // Roll the dice - should this koi go independent?
                if (randomFunc() < this.independenceChance) {
                    this.isIndependent = true;
                    // Go independent for configured duration
                    const duration = randomFunc(
                        PHYSICS_CONFIG.INDEPENDENCE_DURATION_MIN,
                        PHYSICS_CONFIG.INDEPENDENCE_DURATION_MAX
                    );
                    this.independenceEndTime = currentTime + duration;
                    console.log('[Koi Anti-Jitter] Going independent for', (duration / 1000).toFixed(1) + 's');
                } else {
                    // Didn't go independent - schedule next check
                    this.nextIndependenceCheckTime = currentTime + randomFunc(
                        PHYSICS_CONFIG.INDEPENDENCE_CHECK_MIN,
                        PHYSICS_CONFIG.INDEPENDENCE_CHECK_MAX
                    );
                }
            }
        }
    }

    /**
     * Check if this boid is currently independent
     */
    getIsIndependent() {
        return this.isIndependent;
    }

    /**
     * Wrap edges - koi reappear on opposite side
     */
    edges(width, height) {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }

        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }

    /**
     * Helper: Linear interpolation between two vectors
     */
    lerpVector(a, b, amt) {
        const result = a.copy();
        result.lerp(b, amt);
        return result;
    }
}
