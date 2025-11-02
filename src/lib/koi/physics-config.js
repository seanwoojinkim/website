/**
 * Physics Configuration (Simplified for Portfolio)
 * Basic physics constants for 3-koi flocking
 */

export const PHYSICS_CONFIG = {
    // Force smoothing - reduces jitter
    FORCE_SMOOTHING: 0.25,
    VELOCITY_SMOOTHING: 0.15,

    // Dead-zone threshold - ignore forces below this magnitude
    DEAD_ZONE_THRESHOLD: 0.01,

    // Perception - how far koi can "see"
    PERCEPTION_RADIUS: 80,  // Smaller radius for better spacing

    // Damping - smooth turns
    DAMPING_COEFFICIENT: 0.45,
    MIN_SPEED_FOR_DAMPING: 0.1,

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

    // Limit neighbors for performance
    MAX_NEIGHBORS: 8,
};
