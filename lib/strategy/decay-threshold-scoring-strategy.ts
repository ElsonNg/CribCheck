import LocationEntity from "@/lib/entities/location/location-entity";
import { ScoringResult, ScoringStrategy } from "@/lib/strategy/scoring-strategy";

export class DecayThresholdScoringStrategy implements ScoringStrategy {

    private maxVariety: number; 
    private thresholds: number[]; 
    private weights: number[]; 
    private sameThresholdDecay: number[]; 

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
        for(let j = 0; j < sortedLocations.length; j++) {
            const location = sortedLocations[j];
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
                break;
            }
        }

        const result = new ScoringResult();

        // Cap the score at 100 and ensure that full score is only given for 3 centres within 0.3 km
        score = Math.max(Math.min(score, 100), 0);

        // Prevent divide-by-zero if no valid locations
        if (validLocations.length !== 0) {
            result.set(score, validLocations);
        }

        return result;
    }
}
