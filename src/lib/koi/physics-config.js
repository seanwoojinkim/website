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
    PERCEPTION_RADIUS: 75,  // Optimized for smooth flocking with 5 koi (from dashboard research)

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

    // === OSCILLATION DETECTION ===
    // Detect rapid back-and-forth direction changes
    OSCILLATION_HISTORY_LENGTH: 10,     // Track last N headings
    OSCILLATION_CHECK_LENGTH: 6,        // Need at least N headings to check
    OSCILLATION_REVERSAL_THRESHOLD: 3,  // N+ reversals = oscillation

    // === OVERCROWDING DETECTION ===
    // Trigger escape when too many neighbors or forces too strong
    OVERCROWDING_NEIGHBOR_LIMIT: 15,    // Max neighbors before escaping
    OVERCROWDING_FORCE_LIMIT: 0.25,     // Max total force before escaping

    // === ESCAPE MANEUVERS ===
    // Strong directional force to break out of problematic states
    ESCAPE_DURATION_MIN: 1500,          // Min escape duration (ms)
    ESCAPE_DURATION_MAX: 3000,          // Max escape duration (ms)
    ESCAPE_COOLDOWN_MIN: 3000,          // Min cooldown after escape (ms)
    ESCAPE_COOLDOWN_MAX: 5000,          // Max cooldown after escape (ms)
    ESCAPE_ANGLE_MIN: Math.PI / 4,      // Min angle offset for escape (45°)
    ESCAPE_ANGLE_MAX: Math.PI / 2,      // Max angle offset for escape (90°)

    // === INDEPENDENCE BEHAVIOR ===
    // Random solo swimming for natural variation
    INDEPENDENCE_CHECK_MIN: 3000,       // Min time between checks (ms)
    INDEPENDENCE_CHECK_MAX: 10000,      // Max time between checks (ms)
    INDEPENDENCE_CHANCE_MIN: 0.05,      // Min chance to go independent (5%)
    INDEPENDENCE_CHANCE_MAX: 0.15,      // Max chance to go independent (15%)
    INDEPENDENCE_DURATION_MIN: 2000,    // Min independent duration (ms)
    INDEPENDENCE_DURATION_MAX: 8000,    // Max independent duration (ms)
};
