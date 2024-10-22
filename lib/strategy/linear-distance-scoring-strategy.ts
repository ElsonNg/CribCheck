import LocationEntity from "@/lib/entities/location/location-entity";
import { ScoringResult, ScoringStrategy } from "@/lib/strategy/scoring-strategy";


export class LinearDistanceScoringStrategy implements ScoringStrategy {

    private minDistanceInKM: number;
    private maxDistanceInKM: number;

    constructor(minDistanceInKM: number, maxDistanceInKM: number) {
        this.minDistanceInKM = minDistanceInKM;
        this.maxDistanceInKM = maxDistanceInKM;
    }

    calculateScore(queryLocation: LocationEntity, nearbyLocations: LocationEntity[]): ScoringResult {


        let totalScore = 0;
        const validLocations: LocationEntity[] = [];

        nearbyLocations.forEach((location) => {
            const distance = queryLocation.distanceToKilometres(location);


            if (distance <= this.maxDistanceInKM) {

                let score;
                if (distance <= this.minDistanceInKM) {
                    score = 100;
                } else {
                    score = (1 - (distance - this.minDistanceInKM) / (this.maxDistanceInKM - this.minDistanceInKM)) * 100;
                }
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