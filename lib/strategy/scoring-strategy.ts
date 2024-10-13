import LocationEntity from "../entities/location/location-entity";


// Define a type to return both score and contributing locations
export class ScoringResult {

    constructor() {
        this.score = 0;
        this.validLocations = [];
    }

    set(score: number, validLocations: LocationEntity[]) { 
        this.score = score;
        this.validLocations = validLocations;
    }

    getScore(): number {
        return this.score;
    }

    getValidLocations(): LocationEntity[] {
        return this.validLocations;
    }

    private score: number;
    private validLocations: LocationEntity[];
}


export interface ScoringStrategy {

    calculateScore(queryLocation: LocationEntity, nearbyLocations: LocationEntity[]): ScoringResult;
}


