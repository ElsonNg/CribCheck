import LocationEntity from "@/lib/entities/location/location-entity";
import { ScoringResult, ScoringStrategy } from "@/lib/strategy/scoring-strategy";

/**
 * @class ThresholdScoringStrategy
 * 
 * A scoring strategy that assigns scores based on distance thresholds.
 * For each nearby location, it checks if the distance falls within any defined threshold,
 * and if so, applies the corresponding score. Scores are averaged across valid locations.
 * 
 * Implements the `ScoringStrategy` interface.
 */
export class ThresholdScoringStrategy implements ScoringStrategy {
    private thresholds: number[];
    private scores: number[];

    /**
     * Constructs an instance of `ThresholdScoringStrategy` with specific distance thresholds and scores.
     * 
     * @param {number[]} thresholds - An array of distance thresholds in kilometers.
     * @param {number[]} scores - An array of scores corresponding to each threshold.
     */
    constructor(thresholds: number[], scores: number[]) {
        this.thresholds = thresholds;
        this.scores = scores;
    }

    /**
     * Calculates the score for a query location based on its proximity to nearby locations.
     * 
     * The method checks each location's distance against the defined thresholds.
     * If a location is within a threshold, it is added to the valid locations, and the corresponding
     * score is applied. The final score is an average of all scores for valid locations.
     * 
     * @param {LocationEntity} queryLocation - The user's location for scoring.
     * @param {LocationEntity[]} nearbyLocations - An array of nearby locations to evaluate.
     * @returns {ScoringResult} An object containing the calculated score and contributing locations.
     */
    calculateScore(queryLocation: LocationEntity, nearbyLocations: LocationEntity[]): ScoringResult {
        let totalScore = 0;
        const validLocations: LocationEntity[] = [];

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

        // Avoid division by zero by checking for valid locations
        if (validLocations.length !== 0) {
            result.set(totalScore / validLocations.length, validLocations);
        }

        return result;
    }
}
