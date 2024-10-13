import LocationEntity from "@/lib/entities/location/location-entity";
import { ScoringResult, ScoringStrategy } from "@/lib/strategy/scoring-strategy";


export class LinearDistanceScoringStrategy implements ScoringStrategy {

    private maxDistanceInKM: number;

    constructor(maxDistanceInKM: number) {
        this.maxDistanceInKM = maxDistanceInKM;
    }

    calculateScore(queryLocation: LocationEntity, nearbyLocations: LocationEntity[]): ScoringResult {


        let totalScore = 0;
        const validLocations: LocationEntity[] = [];

        nearbyLocations.forEach((location) => {
            const distance = queryLocation.distanceToKilometres(location);

            if (distance <= this.maxDistanceInKM) {
                // Linear decay: closer locations get higher score, further ones get lower
                const score = Math.max(0, (this.maxDistanceInKM - distance) / this.maxDistanceInKM) * 100;
                totalScore += score;
                validLocations.push(location);
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