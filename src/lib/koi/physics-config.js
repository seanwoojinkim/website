/**
 * Physics Configuration (Simplified for Portfolio)
 * Basic physics constants for 3-koi flocking
 */

export const PHYSICS_CONFIG = {
    // Force smoothing - reduces jitter
    FORCE_SMOOTHING: 0.25,
    VELOCITY_SMOOTHING: 0.15,

    // Perception - how far koi can "see"
    PERCEPTION_RADIUS: 150,  // Increased for portfolio page dimensions

    // Damping - smooth turns
    DAMPING_COEFFICIENT: 0.45,
    MIN_SPEED_FOR_DAMPING: 0.1,

    // Limit neighbors for performance
    MAX_NEIGHBORS: 8,
};
