import LocationEntity from '@/lib/entities/location/location-entity';
import { CriteriaType } from '@/lib/entities/criteria-entity';
import { ScoringResult, ScoringStrategy } from './scoring-strategy';

/**
 * @class ProximityScorer
 * 
 * Manages and applies various scoring strategies to calculate composite scores based on proximity criteria.
 * The class dynamically associates scoring strategies with specific criteria types, enabling customized
 * scoring based on user-defined priorities.
 * 
 * This class supports enabling/disabling of strategies, weighted composite score calculation,
 * and retrieval of individual scoring results.
 */

interface ScoringParams {
    strategy: ScoringStrategy;
    weight: number;
    locations: LocationEntity[];
    enabled: boolean;
}

export class ProximityScorer {
    private strategyMap: Map<CriteriaType, ScoringParams>;
    private results: Map<CriteriaType, ScoringResult>;

    /**
     * Initializes a new instance of `ProximityScorer`.
     * 
     * Sets up empty maps for managing scoring strategies (`strategyMap`) and storing results (`results`).
     */
    constructor() {
        this.strategyMap = new Map();
        this.results = new Map();
    }

    /**
     * Disables all scoring strategies, preventing them from being included in score calculations.
     */
    public disableAllStrategies() {
        this.strategyMap.forEach((value) => {
            value.enabled = false;
        });
    }

    /**
     * Enables and configures a specific strategy based on the given criteria type.
     * 
     * @param {CriteriaType} criteriaType - The criteria type (e.g., proximityToHawkerCentres).
     * @param {number} weight - The weight to assign to this criteria in the composite score.
     * @param {LocationEntity[]} locations - An array of relevant locations to use for scoring.
     */
    public enableStrategy(criteriaType: CriteriaType, weight: number, locations: LocationEntity[]) {
        const strategyItem = this.strategyMap.get(criteriaType);
        if (strategyItem) {
            strategyItem.weight = weight;
            strategyItem.locations = locations;
            strategyItem.enabled = true;
        }
    }

    /**
     * Adds a new scoring strategy for a specified criteria type.
     * 
     * By default, new strategies are enabled with a weight of 1.0 and an empty location list.
     * 
     * @param {CriteriaType} criteriaType - The criteria type for which to add the strategy.
     * @param {ScoringStrategy} strategy - The scoring strategy to use.
     */
    public addCriteriaStrategy(criteriaType: CriteriaType, strategy: ScoringStrategy) {
        this.strategyMap.set(criteriaType, { strategy, weight: 1.0, locations: [], enabled: true });
    }

    /**
     * Calculates the composite score based on all enabled criteria and their respective weights.
     * 
     * Iterates through each enabled strategy, calculates its individual score, and aggregates
     * these into a weighted composite score based on the specified weights.
     * 
     * @param {LocationEntity} queryLocation - The reference location for which scores are calculated.
     * @returns {number} The final composite score, weighted by each criteria's weight.
     */
    public calculateCompositeScore(queryLocation: LocationEntity): number {
        let totalWeightedScore = 0;
        let totalWeight = 0;

        this.results.clear();

        // Iterate over all strategies in the strategy map
        this.strategyMap.forEach((scoringParams, criteriaType) => {
            // Only consider enabled strategies
            if (scoringParams.enabled) {
                // Calculate the score for the current criteria using its strategy
                const result = scoringParams.strategy.calculateScore(queryLocation, scoringParams.locations);
                // Store results for later use
                this.results.set(criteriaType, result);

                // Apply the weight and add to the total weighted score
                totalWeightedScore += result.getScore() * scoringParams.weight;

                // Accumulate the total weight
                totalWeight += scoringParams.weight;
            }
        });

        // If no valid strategies are enabled or total weight is 0, return 0
        if (totalWeight === 0) return 0;

        // Return the weighted average score
        return Math.floor(totalWeightedScore / totalWeight);
    }

    /**
     * Retrieves the individual scoring results for each criteria type.
     * 
     * @returns {Map<CriteriaType, ScoringResult>} A map of criteria types to their scoring results.
     */
    public getResults(): Map<CriteriaType, ScoringResult> {
        return this.results;
    }
}
