// Define an enum for criteria types
export enum CriteriaType {
    proximityToHawkerCentres = 'proximityToHawkerCentres',
    proximityToMRT = 'proximityToMRT',
    proximityToSchool = 'proximityToSchool',
    proximityToSupermarket = 'proximityToSupermarket',
    proximityToClinic = 'proximityToClinic',
}

// Create a mapping of enum values to their display labels
export const CriteriaLabels: { [key in CriteriaType]: string } = {
    [CriteriaType.proximityToHawkerCentres]: 'Proximity to Hawker Centres',
    [CriteriaType.proximityToMRT]: 'Proximity to MRT Stations',
    [CriteriaType.proximityToSchool]: 'Proximity to Schools',
    [CriteriaType.proximityToSupermarket]: 'Proximity to Supermarkets',
    [CriteriaType.proximityToClinic]: 'Proximity to Clinics',
};

export const CriteriaVariety: { [key in CriteriaType]: number } = {
    [CriteriaType.proximityToHawkerCentres]: 3,
    [CriteriaType.proximityToMRT]: 2,
    [CriteriaType.proximityToSchool]: 2,
    [CriteriaType.proximityToSupermarket]: 3,
    [CriteriaType.proximityToClinic]: 2,
};

export const CriteriaThresholds: { [key in CriteriaType]: number[] } = {
    [CriteriaType.proximityToHawkerCentres]: [0.3, 0.5, 1, 2],
    [CriteriaType.proximityToMRT]: [0.3, 0.5, 1, 2],
    [CriteriaType.proximityToSchool]: [1, 2, 5],
    [CriteriaType.proximityToSupermarket]: [0.3, 0.5, 1, 2],
    [CriteriaType.proximityToClinic]: [1, 2, 5],
};

// Define types for preset criteria
export type PresetCriteriaType = "Singles" | "Young Couple" | "Family" | "Saved";

/**
 * @class CriteriaEntity
 * 
 * Represents user-defined or preset criteria with customizable rankings for various `CriteriaType` options.
 * This entity allows users to select and rank criteria types, calculate weightages, and convert criteria data to JSON.
 */
export default class CriteriaEntity {
    private name: string;
    private custom: boolean;
    private criteriaRankingMap: Map<CriteriaType, number>;

    /**
     * Constructs an instance of `CriteriaEntity` with default settings.
     * Initializes an empty criteria ranking map and sets the criteria as custom by default.
     */
    constructor() {
        this.criteriaRankingMap = new Map<CriteriaType, number>();
        this.custom = true;
        this.name = "";
    }

    /**
     * Sets all criteria rankings based on an input map.
     * 
     * @param {Map<CriteriaType, number>} criteriaRankingMap - A map of criteria types to their ranking values.
     */
    public setAll(criteriaRankingMap: Map<CriteriaType, number>) {
        criteriaRankingMap.forEach((value, key) => {
            this.criteriaRankingMap.set(key, value);
        });
    }

    /**
     * Clears all criteria selections and rankings.
     */
    public clear() {
        this.criteriaRankingMap.clear();
    }

    public hasAtLeastOneCriterionSelected(): boolean {
        return this.criteriaRankingMap.size >= 1;
    }

    /**
     * Retrieves the current criteria ranking map.
     * 
     * @returns {Map<CriteriaType, number>} The map of criteria types and their associated rankings.
     */
    public getCriteriaRankingMap(): Map<CriteriaType, number> {
        return this.criteriaRankingMap;
    }

    /**
     * Selects or updates a ranking for a specific criterion.
     * 
     * @param {CriteriaType} criteriaType - The type of criterion to be ranked.
     * @param {number} stars - The ranking value for the selected criterion.
     */
    public selectCriterion(criteriaType: CriteriaType, stars: number) {
        this.criteriaRankingMap.set(criteriaType, stars);
    }

    /**
     * Deselects a criterion by removing it from the ranking map.
     * 
     * @param {CriteriaType} criteriaType - The type of criterion to be removed from the rankings.
     */
    public deselectCriterion(criteriaType: CriteriaType) {
        if (this.criteriaRankingMap.has(criteriaType)) {
            this.criteriaRankingMap.delete(criteriaType);
        }
    }

    /**
     * Sets whether the criteria configuration is custom or preset.
     * 
     * @param {boolean} custom - `true` if the criteria configuration is custom, `false` if preset.
     */
    public setCustom(custom: boolean) {
        this.custom = custom;
    }

    /**
     * Retrieves whether the criteria configuration is custom.
     * 
     * @returns {boolean} `true` if the criteria is custom, `false` if preset.
     */
    public getCustom(): boolean {
        return this.custom;
    }

    /**
     * Sets the name for this criteria configuration.
     * 
     * @param {string} name - The name to assign to the criteria configuration.
     */
    public setName(name: string) {
        this.name = name;
    }

    /**
     * Retrieves the name of this criteria configuration.
     * 
     * @returns {string} The name of the criteria configuration.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Calculates the weightage for a specific criterion based on its ranking and the total rankings.
     * 
     * @param {CriteriaType} criteriaType - The type of criterion for which to calculate weightage.
     * @returns {number} The calculated weightage as a fraction, or `0` if no ranking is found.
     */
    public getWeightage(criteriaType: CriteriaType): number {
        const total = Array.from(this.criteriaRankingMap.values()).reduce((a, b) => a + b, 0);
        const ranking = this.criteriaRankingMap.get(criteriaType);
        return ranking && total > 0 ? ranking / total : 0;
    }

    /**
     * Converts the criteria configuration to a JSON object format.
     * 
     * @returns {Record<string, unknown>} A JSON object representing the criteria configuration.
     */
    public toJSON(): Record<string, unknown> {
        return {
            criteriaRankingMap: Array.from(this.criteriaRankingMap.entries()).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {} as Record<string, number>)
        };
    }

    /**
     * Loads a JSON object into this criteria configuration, updating the criteria ranking map.
     * 
     * @param {Record<string, number>} json - The JSON object representing criteria rankings.
     */
    public fromJSON(json: Record<string, number>) {
        this.criteriaRankingMap = new Map<CriteriaType, number>();
        Object.entries(json['criteriaRankingMap']).forEach(([key, value]) => {
            this.criteriaRankingMap.set(key as CriteriaType, value as number);
        });
    }

    /**
     * Compares this criteria configuration with another `CriteriaEntity` for equality.
     * 
     * Two criteria configurations are considered equal if they contain the same criteria types with identical rankings.
     * 
     * @param {CriteriaEntity} other - The other criteria configuration to compare.
     * @returns {boolean} `true` if the configurations are equal, otherwise `false`.
     */
    public equals(other: CriteriaEntity): boolean {
        this.criteriaRankingMap.forEach((v, k) => {
            if (!other.criteriaRankingMap.has(k) || other.criteriaRankingMap.get(k) != v)
                return false;
        });
        return true;
    }
}
