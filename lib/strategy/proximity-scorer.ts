import LocationEntity from '@/lib/entities/location/location-entity';
import { CriteriaType } from '@/lib/entities/criteria-entity';
import { ScoringResult, ScoringStrategy } from './scoring-strategy';

/**
 * ProximityScorer dynamically associates scoring strategies with criteria types and calculates scores.
 */


interface ScoringParams {
    strategy: ScoringStrategy;
    weight: number;
    locations: LocationEntity[];
    enabled: boolean;
}

export class ProximityScorer {

    private strategyMap: Map<CriteriaType, ScoringParams>;
    private results : Map<CriteriaType, ScoringResult>;

    constructor() {
        this.strategyMap = new Map();
        this.results = new Map();
    }


    public disableAllStrategies() {
        this.strategyMap.forEach((value, key) => {
            value.enabled = false;
        });
    }

    public enableStrategy(criteriaType: CriteriaType, weight: number, locations: LocationEntity[]) {
        const strategyItem = this.strategyMap.get(criteriaType);
        if (strategyItem) {
            strategyItem.weight = weight;
            strategyItem.locations = locations;
            strategyItem.enabled = true;
        }
    }

    /**
     * Adds a strategy for a specific criteria type.
     *
     * @param criteriaType - The criteria type (e.g., proximityToHawkerCentres).
     * @param strategy - The strategy to use for scoring.
     * @param weight - The initial weight for the strategy (0-1).
     * @param enabled - Whether the strategy is initially enabled.
     */
    public addCriteriaStrategy(criteriaType: CriteriaType, strategy: ScoringStrategy, weight: number, enabled: boolean) {
        this.strategyMap.set(criteriaType, { strategy, weight, locations: [], enabled });
    }

    /**
     * Calculates the composite score for all enabled criteria.
     *
     * @param queryLocation - The user's location for which the score is being calculated.
     * @returns The weighted composite score.
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

                console.log("==============================");
                console.log("Criteria Type: " + criteriaType);
                console.log("Result Score: " + result.getScore());
                console.log("Weight: " + scoringParams.weight);
                console.log("Component Score: " + result.getScore() * scoringParams.weight);
                console.log("==============================");

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

    public getResults() : Map<CriteriaType, ScoringResult> {
        return this.results;
    }

}
