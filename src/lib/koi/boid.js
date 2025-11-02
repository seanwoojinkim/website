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
    applyForces(forces) {
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
    update(maxSpeed) {
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
