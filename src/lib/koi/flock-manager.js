/**
 * Flock Manager (Simplified for Portfolio)
 * Manages 3 koi with basic flocking behavior
 */

import { Boid } from './boid.js';
import { findNeighbors, calculateAlignment, calculateCohesion, calculateSeparation, calculateAttraction } from './flocking-forces.js';

export class FlockManager {
    constructor(numBoids, width, height, p5Funcs) {
        this.boids = [];
        this.width = width;
        this.height = height;
        this.p5Funcs = p5Funcs;
        this.p5 = p5Funcs.p5Instance;

        // Initialize flock
        for (let i = 0; i < numBoids; i++) {
            this.boids.push(new Boid(
                width,
                height,
                p5Funcs.random,
                p5Funcs.createVector,
                p5Funcs.floor,
                this.p5
            ));
        }
    }

    /**
     * Update all boids
     */
    update(params, mouseTarget = null) {
        for (let boid of this.boids) {
            // Calculate flocking forces
            const neighbors = findNeighbors(boid, this.boids, boid.perceptionRadius);
            const forces = this.calculateFlockingForces(boid, neighbors, params, mouseTarget);

            // Apply forces and update
            boid.applyForces(forces);
            boid.update(params.maxSpeed);
            boid.edges(this.width, this.height);
        }
    }

    /**
     * Calculate combined flocking forces
     */
    calculateFlockingForces(boid, neighbors, params, mouseTarget = null) {
        const { createVector } = this.p5Funcs;

        const alignment = calculateAlignment(
            boid,
            neighbors,
            params.maxSpeed,
            params.maxForce,
            createVector
        );

        const cohesion = calculateCohesion(
            boid,
            neighbors,
            params.maxSpeed,
            params.maxForce,
            createVector
        );

        const separation = calculateSeparation(
            boid,
            neighbors,
            boid.perceptionRadius,
            params.maxSpeed,
            params.maxForce,
            createVector,
            this.p5
        );

        // Apply weights
        alignment.mult(params.alignmentWeight);
        cohesion.mult(params.cohesionWeight);
        separation.mult(params.separationWeight);

        const forces = { alignment, cohesion, separation };

        // Add mouse attraction if mouse target is provided
        if (mouseTarget) {
            const attraction = calculateAttraction(
                boid,
                mouseTarget,
                params.maxSpeed,
                params.maxForce,
                createVector,
                this.p5
            );
            attraction.mult(params.attractionWeight || 0.8);
            forces.attraction = attraction;
        }

        return forces;
    }
}
