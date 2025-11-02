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
        // Update velocity
        this.velocity.add(this.acceleration);

        // Apply speed multiplier for individual variation
        const targetSpeed = maxSpeed * this.speedMultiplier;
        this.velocity.limit(targetSpeed);

        // Ensure minimum speed - koi should always be moving
        const currentSpeed = this.velocity.mag();
        if (currentSpeed < targetSpeed * 0.3) {
            this.velocity.setMag(targetSpeed * 0.3);
        }

        // Update position
        this.position.add(this.velocity);

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
