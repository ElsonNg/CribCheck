import { CriteriaEntity } from '@/lib/entities//criteria-entity';

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
     * Initializes an empty array to hold the criteria selected by the user.
     * 
     * This method sets up the storage structure for user-selected criteria, 
     * allowing for subsequent additions of the criteria.
     * 
     */

    private selectedCriteria: CriteriaEntity[] = [];

    /**
     * Adds user-selected criteria to the `selectedCriteria` array.
     *
     * This method appends the criterias that are selected by the user
     * to the `selectedCriteria` array.
     *
     * Only the user-selected preferences, indicated by a `true` Boolean value, 
     * will be added to the `selectedCriteria` array.
     */


    addCriteria(criteria: CriteriaEntity) {
        const hasTrueProximity = criteria.proximityToSchools ||
            criteria.proximityToSportsFacilities ||
            criteria.proximityToTransportation ||
            criteria.proximityToShoppingMall ||
            criteria.proximityToSuperMarket ||
            criteria.proximityToParks;

        if (hasTrueProximity) {
            this.selectedCriteria.push(criteria);
        } else {
            console.log("Criteria not added: No proximity flags are set to true.");
        }
    }

    /**
     * Rank the selected criteria by number
     * 
     * This method allows user for rank the selected criteria numerically
     * 
     */

    rankCriteria(criteriaOrder: CriteriaEntity[]) {
    }



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
