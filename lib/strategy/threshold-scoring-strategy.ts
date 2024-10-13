import LocationEntity from "@/lib/entities/location/location-entity";
import { ScoringResult, ScoringStrategy } from "@/lib/strategy/scoring-strategy";

export class ThresholdScoringStrategy implements ScoringStrategy {
    private thresholds: number[];
    private scores: number[];

    constructor(thresholds: number[], scores: number[]) {
        this.thresholds = thresholds;
        this.scores = scores;
    }

    calculateScore(queryLocation: LocationEntity, nearbyLocations: LocationEntity[]): ScoringResult {
        let totalScore = 0;
        let validLocations: LocationEntity[] = [];

        nearbyLocations.forEach((location) => {
            const distance = queryLocation.distanceToKilometres(location);

            // Assign score based on distance thresholds
            for (let i = 0; i < this.thresholds.length; i++) {
                if (distance <= this.thresholds[i]) {
                    totalScore += this.scores[i];
                    validLocations.push(location);
                    break;
                }
            }
        });

        const result = new ScoringResult();

        // Prevent divide-by-zero
        if (validLocations.length !== 0) {
            result.set(totalScore / validLocations.length, validLocations);
        }

        return result;
    }
}
