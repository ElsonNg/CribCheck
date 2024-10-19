import CriteriaEntity , {CriteriaType, PresetCriteriaType} from '@/lib/entities/criteria-entity';

/**
 * `CriteriaController` manages user-defined criteria, including the creation,
 * updating, ranking, and retrieval of criteria based on user preferences.
 * 
 * `CriteriaEntity` defines the essential fields required for the user to 
 * execute operations within the `CriteriaController`. It acts as a data model 
 * representing the structure of criteria objects.
 * 
 * @class CriteriaController
 */


class CriteriaController {


    /**
     * Adds user-selected criteria to the `CriteriaType` array.
     *
     * This method appends the criteria selected by the user
     * to the `CriteriaType` array.
     * 
     * Any criteria not selected by the user will not be added to the `CriteriaType` array
     *
     * For each selected criterion, the user provides a ranking number, which is stored
     * in the `number` array.
     *
     * The `CriteriaType` and `number` arrays are then mapped into `criteriaRankingMap`.
     *
     * A new `criteriaEntity` is created, and a unique `criteriaId` is auto-generated (Id not declared yet).
     * 
     * 
     */
    private currentCriteria : CriteriaEntity;

    constructor() {
        this.currentCriteria = new CriteriaEntity();
    }

    public setPresetCriteria(presetType: PresetCriteriaType): CriteriaEntity {
        

        switch (presetType) {
            case "Singles":
                this.currentCriteria.selectCriterion(CriteriaType.proximityToHawkerCentres, 4);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToMRT, 5);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToClinic, 3);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToSchool, 5);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToSupermarket, 2);
                break;
            case "Young Couple":
                this.currentCriteria.selectCriterion(CriteriaType.proximityToHawkerCentres, 3);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToMRT, 5);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToClinic, 4);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToSchool, 3);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToSupermarket, 2);

                break;
            case "Family":
                this.currentCriteria.selectCriterion(CriteriaType.proximityToHawkerCentres, 5);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToMRT, 5);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToClinic, 4);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToSchool, 4);
                this.currentCriteria.selectCriterion(CriteriaType.proximityToSupermarket, 5);
                break;
            }

        return this.currentCriteria;
    }

    public setDefaultNew() {
        this.currentCriteria.selectCriterion(CriteriaType.proximityToHawkerCentres, 1);
        this.currentCriteria.selectCriterion(CriteriaType.proximityToMRT, 1);
        this.currentCriteria.selectCriterion(CriteriaType.proximityToClinic, 1);
        this.currentCriteria.selectCriterion(CriteriaType.proximityToSchool, 1);
        this.currentCriteria.selectCriterion(CriteriaType.proximityToSupermarket, 1);
    }


    public selectCriterion(criteriaType: CriteriaType, ranking: number) {
        this.currentCriteria.selectCriterion(criteriaType, ranking);
    }

    public deselectCriteron(criteriaType: CriteriaType) {
        this.currentCriteria.deselectCriterion(criteriaType);
    }

    public loadCriteria(criteriaRankingMap: Map<CriteriaType, number>) : CriteriaEntity {
        this.currentCriteria.setAll(criteriaRankingMap);
        return this.currentCriteria;
    }

    public clearCriteria() {
        this.currentCriteria.clear();
    }

    public getCriteriaEntity() : CriteriaEntity {
        return this.currentCriteria;
    }

    // setCriteria(
    //     selectedCriteria: CriteriaType[],
    //     rankings: number[]
    // ): CriteriaEntity{
        
    //     const criteriaRankingMap = this.currentCriteria.getCriteriaRankingMap();

    //     criteriaRankingMap.clear();
    //     selectedCriteria.forEach((criteria, index) => {
    //         criteriaRankingMap.set(criteria, rankings[index]);
    //     });

    //     return this.currentCriteria;
    // }


    // ==== Database required ========//
    // /**
    //  * Updates the selected criteria or ranking based on user input.
    //  * 
    //  * This method takes the edited criteria provided by the user and searches for the corresponding 
    //  * existing criteria using their specified index. Once the matching criteria is found, the method 
    //  * updates the relevant fields with the new values. This allows for modifications to be made 
    //  * without needing to re-add criteria.
    //  * 
    //  * Partial<T> is a utility type that makes all properties of type T optional
    //  */

    // editCriteria(criteriaId: string, updatedCriteria: Partial<CriteriaEntity>) {
    // }

    // /**
    //  * Retrives criteria based on user selection
    //  * 
    //  * This method retrieves existing criteria using their specified index.
    //  * 
    //  * Returns found criteria or undefined
    //  */

    // getCriteriaById(criteriaId: string): CriteriaEntity | undefined {
    //     const criteria = this.selectedCriteria.find(c => c.criteriaId === criteriaId);
    //     if (!criteria) {
    //         throw new Error(`Criteria with ID ${criteriaId} not found`);
    //     }
    //     return criteria;
    // }

}

export default CriteriaController;
