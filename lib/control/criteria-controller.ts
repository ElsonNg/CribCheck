import CriteriaEntity, { CriteriaType, PresetCriteriaType } from '@/lib/entities/criteria-entity';

/**
 * `CriteriaController` manages the creation, updating, ranking, and retrieval of user-defined criteria.
 * 
 * It facilitates the selection of preset or custom criteria, allowing users to define their preferences
 * and store them in a `CriteriaEntity`. This controller enables flexible configuration and management
 * of criteria within the application.
 * 
 * @class CriteriaController
 */
class CriteriaController {
    private currentCriteria: CriteriaEntity;

    /**
     * Initializes a new `CriteriaController` instance with a blank `CriteriaEntity`.
     */
    constructor() {
        this.currentCriteria = new CriteriaEntity();
    }

    /**
     * Configures preset criteria based on the specified type (e.g., Singles, Young Couple, Family).
     * 
     * This method loads a predefined set of criteria and rankings associated with the selected preset type.
     * 
     * @param presetType - The type of preset criteria to load.
     * @returns {CriteriaEntity} The configured criteria entity.
     */
    public setPresetCriteria(presetType: PresetCriteriaType): CriteriaEntity {
        this.currentCriteria.setCustom(false);
        this.currentCriteria.setName(`${presetType} Criteria`);

        switch (presetType) {
            case "Singles":
                this.currentCriteria.selectCriterion(CriteriaType.proximityToHawkerCentres, 4);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToMRT, 5);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToClinic, 3);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToSchool, 2);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToSupermarket, 3);
                break;
            case "Young Couple":
                this.currentCriteria.selectCriterion(CriteriaType.proximityToHawkerCentres, 4);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToMRT, 5);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToClinic, 3);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToSchool, 4);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToSupermarket, 4);
                break;
            case "Family":
                this.currentCriteria.selectCriterion(CriteriaType.proximityToHawkerCentres, 3);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToMRT, 4);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToClinic, 4);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToSchool, 5);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToSupermarket, 5);
                break;
        }
        return this.currentCriteria;
    }

    /**
     * Configures a default custom criteria set.
     * 
     * This method sets up a default configuration for user-defined criteria, allowing further customization.
     */
    public setDefaultNew() {
        this.currentCriteria.setCustom(true);
        this.currentCriteria.setName("My Preset");
        this.currentCriteria.selectCriterion(CriteriaType.proximityToHawkerCentres, 1);
        this.currentCriteria.selectCriterion(CriteriaType.proximityToMRT, 1);
        this.currentCriteria.selectCriterion(CriteriaType.proximityToClinic, 1);
        this.currentCriteria.selectCriterion(CriteriaType.proximityToSchool, 1);
        this.currentCriteria.selectCriterion(CriteriaType.proximityToSupermarket, 1);
    }

    /**
     * Selects a criterion and assigns it a ranking.
     * 
     * This method allows the user to specify a criterion and assign a numeric ranking based on its priority.
     * 
     * @param criteriaType - The type of criterion to select.
     * @param ranking - The priority ranking of the criterion.
     */
    public selectCriterion(criteriaType: CriteriaType, ranking: number) {
        this.currentCriteria.selectCriterion(criteriaType, ranking);
    }

    /**
     * Deselects a previously selected criterion.
     * 
     * This removes a criterion from the current criteria set, indicating it is no longer a priority.
     * 
     * @param criteriaType - The type of criterion to deselect.
     */
    public deselectCriteron(criteriaType: CriteriaType) {
        this.currentCriteria.deselectCriterion(criteriaType);
    }

    /**
     * Loads a criteria map into the current criteria entity.
     * 
     * This method directly loads a set of criteria and rankings from a predefined map,
     * useful for restoring criteria settings or bulk updates.
     * 
     * @param criteriaRankingMap - A map of criteria types to their associated rankings.
     * @returns {CriteriaEntity} The updated criteria entity.
     */
    public loadCriteria(criteriaRankingMap: Map<CriteriaType, number>): CriteriaEntity {
        this.currentCriteria.setAll(criteriaRankingMap);
        return this.currentCriteria;
    }

    /**
     * Clears all selected criteria.
     * 
     * This removes all selected criteria and rankings from the current criteria entity, 
     * resetting it to an empty state.
     */
    public clearCriteria() {
        this.currentCriteria.clear();
    }

    /**
     * Retrieves the current criteria entity.
     * 
     * This allows access to the current configuration of selected criteria and rankings.
     * 
     * @returns {CriteriaEntity} The current criteria entity.
     */
    public getCriteriaEntity(): CriteriaEntity {
        return this.currentCriteria;
    }

}

export default CriteriaController;
