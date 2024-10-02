// Define an enum for criteria types
export enum CriteriaType {
    proximityToSchools,
    proximityToSportsFacilities,
    proximityToTransportation,
    proximityToShoppingMall,
    proximityToSuperMarket,
    proximityToParks,
}


export class CriteriaEntity {
    criteriaId: string;
    criteriaRankingMap: Map<CriteriaType, number>;

    constructor(criteriaId: string, criteriaRankingMap: Map<CriteriaType, number>) {
        this.criteriaId = criteriaId;
        this.criteriaRankingMap = criteriaRankingMap;

    }
}

