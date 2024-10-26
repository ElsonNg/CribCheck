import LocationEntity from "@/lib/entities/location/location-entity";
import { ScoringResult, ScoringStrategy } from "@/lib/strategy/scoring-strategy";

/**
 * @class LinearDistanceScoringStrategy
 * 
 * A scoring strategy that calculates scores based on the distance between a query location
 * and nearby locations. The score decreases linearly as distance increases within a defined
 * range (`minDistanceInKM` to `maxDistanceInKM`).
 * 
 * Implements the `ScoringStrategy` interface.
 */
export class LinearDistanceScoringStrategy implements ScoringStrategy {
    private minDistanceInKM: number;
    private maxDistanceInKM: number;

    /**
     * Constructs an instance of `LinearDistanceScoringStrategy` with minimum and maximum distance thresholds.
     * 
     * @param {number} minDistanceInKM - The minimum distance threshold (in kilometers) at which the maximum score is given.
     * @param {number} maxDistanceInKM - The maximum distance threshold (in kilometers) beyond which the score is zero.
     */
    constructor(minDistanceInKM: number, maxDistanceInKM: number) {
        this.minDistanceInKM = minDistanceInKM;
        this.maxDistanceInKM = maxDistanceInKM;
    }

    /**
     * Calculates the score for a query location based on its proximity to nearby locations.
     * 
     * The score for each location is determined as follows:
     * - If the distance is less than or equal to `minDistanceInKM`, the score is 100.
     * - If the distance is greater than `minDistanceInKM` but within `maxDistanceInKM`,
     *   the score decreases linearly as distance increases.
     * - Locations beyond `maxDistanceInKM` receive a score of zero.
     * 
     * The final score is the average score of all nearby locations within `maxDistanceInKM`.
     * 
     * @param {LocationEntity} queryLocation - The location to score against nearby locations.
     * @param {LocationEntity[]} nearbyLocations - An array of nearby locations to evaluate.
     * @returns {ScoringResult} An object containing the calculated score and valid locations.
     */
    calculateScore(queryLocation: LocationEntity, nearbyLocations: LocationEntity[]): ScoringResult {
        let totalScore = 0;
        const validLocations: LocationEntity[] = [];

        nearbyLocations.forEach((location) => {
            const distance = queryLocation.distanceToKilometres(location);

            // Only include locations within the maximum scoring distance
            if (distance <= this.maxDistanceInKM) {
                let score;
                
                // Assign maximum score if within minimum distance
                if (distance <= this.minDistanceInKM) {
                    score = 100;
                } else {
                    // Linearly decrease score between min and max distance
                    score = (1 - (distance - this.minDistanceInKM) / (this.maxDistanceInKM - this.minDistanceInKM)) * 100;
                }

                totalScore += score;
                validLocations.push(location);
            }
        });

        const result = new ScoringResult();

        // Avoid division by zero if there are no valid locations
        if (validLocations.length !== 0) {
            result.set(totalScore / validLocations.length, validLocations);
        }

        return result;
    }
}
