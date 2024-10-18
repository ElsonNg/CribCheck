import LocationEntity from "@/lib/entities/location/location-entity";
import { ScoringResult, ScoringStrategy } from "@/lib/strategy/scoring-strategy";

export class DecayThresholdScoringStrategy implements ScoringStrategy {

    private maxVariety: number; // Max number of centres that can contribute to the score
    private thresholds: number[]; // Threshold distances (e.g., [0.3, 0.5, 1] for 300m, 500m, 1km)
    private weights: number[]; // Corresponding weights for each threshold (e.g., [100, 50, 30])
    private sameThresholdDecay: number[]; // Decay factors within the same threshold (e.g., [0.6, 0.3, 0.1])

    constructor(maxVariety: number, thresholds: number[], weights: number[], sameThresholdDecay: number[]) {
        this.maxVariety = maxVariety;
        this.thresholds = thresholds;
        this.weights = weights;
        this.sameThresholdDecay = sameThresholdDecay;
    }

    calculateScore(queryLocation: LocationEntity, nearbyLocations: LocationEntity[]): ScoringResult {
        let centreCount = 0;
        let score = 0;
        const validLocations: LocationEntity[] = [];

        // Track how many centres we've counted in each threshold
        const centresInThreshold = Array(this.thresholds.length).fill(0);

        // Step 1: Sort locations by proximity (closest to farthest)
        const sortedLocations = nearbyLocations.sort((a, b) => queryLocation.distanceToKilometres(a) - queryLocation.distanceToKilometres(b));

        // Step 2: Iterate over sorted nearby locations (hawker centres)
        sortedLocations.forEach((location) => {
            const distance = queryLocation.distanceToKilometres(location);

            // Step 3: Check which threshold the distance falls into and assign the corresponding weight
            for (let i = 0; i < this.thresholds.length; i++) {
                if (distance <= this.thresholds[i] && centreCount < this.maxVariety) {
                    // Apply decayed weight if this is not the first centre in the threshold
                    const decayFactor = centresInThreshold[i] < this.sameThresholdDecay.length ? this.sameThresholdDecay[centresInThreshold[i]] : 0;

                    // The score contribution is based on the weight for the threshold and the decay factor
                    score += this.weights[i] * decayFactor;
                    centreCount++;
                    centresInThreshold[i]++; // Track how many centres are in this threshold
                    validLocations.push(location);
                    break; // Stop once we've applied the appropriate weight
                }
            }

            // Stop counting if we reach the max variety cap
            if (centreCount >= this.maxVariety) {
                return;
            }
        });

        const result = new ScoringResult();

        // Cap the score at 100 and ensure that full score is only given for 3 centres within 0.3 km
        score = Math.min(score, 100);

        // Prevent divide-by-zero if no valid locations
        if (validLocations.length !== 0) {
            result.set(score, validLocations);
        }

        return result;
    }
}
