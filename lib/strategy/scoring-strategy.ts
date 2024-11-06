import LocationEntity from "../entities/location/location-entity";

/**
 * @class ScoringResult
 * 
 * Represents the result of a scoring operation, including both the calculated score
 * and the list of valid locations that contributed to this score.
 */
export class ScoringResult {


    private score: number;
    private validLocations: LocationEntity[];

  

    /**
     * Initializes a new instance of `ScoringResult` with default values.
     * The default score is set to 0, and the valid locations list is empty.
     */
    constructor() {
        this.score = 0;
        this.validLocations = [];
    }

    /**
     * Sets the score and the list of valid contributing locations for this result.
     * 
     * @param {number} score - The calculated score.
     * @param {LocationEntity[]} validLocations - An array of locations that contributed to the score.
     */
    set(score: number, validLocations: LocationEntity[]) {
        this.score = score;
        this.validLocations = validLocations;
    }

    /**
     * Retrieves the score from the scoring result.
     * 
     * @returns {number} The calculated score.
     */
    getScore(): number {
        return this.score;
    }

    /**
     * Retrieves the list of valid locations that contributed to the score.
     * 
     * @returns {LocationEntity[]} An array of valid contributing locations.
     */
    getValidLocations(): LocationEntity[] {
        return this.validLocations;
    }
}

/**
 * @interface ScoringStrategy
 * 
 * Defines the structure for a scoring strategy, requiring an implementation of
 * the `calculateScore` method that computes a score based on a query location
 * and nearby locations.
 */
export interface ScoringStrategy {
    /**
     * Calculates a score for a query location based on proximity to nearby locations.
     * 
     * @param {LocationEntity} queryLocation - The location for which the score is calculated.
     * @param {LocationEntity[]} nearbyLocations - An array of nearby locations to evaluate.
     * @returns {ScoringResult} The result of the scoring calculation, including the score and contributing locations.
     */
    calculateScore(queryLocation: LocationEntity, nearbyLocations: LocationEntity[]): ScoringResult;
}
