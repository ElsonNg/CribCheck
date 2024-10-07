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


    private criteriaId: string;
    private criteriaRankingMap: Map<CriteriaType, number>;

    constructor() {
        this.criteriaId = "";
        this.criteriaRankingMap = new Map<CriteriaType, number>();
    }

    public setAll(criteriaId: string, criteriaRankingMap: Map<CriteriaType, number>) {
        this.criteriaId = criteriaId;
        this.criteriaRankingMap = criteriaRankingMap;
    }


    public getCriteriaRankingMap(): Map<CriteriaType, number> {
        return this.criteriaRankingMap;
    }

    public getCriteriaId(): string {
        return this.criteriaId;
    }

    public setCriteriaId(criteriaId: string) {
        this.criteriaId = criteriaId;
    }

    public selectCriterion(criteriaType: CriteriaType, ranking: number) {
        this.criteriaRankingMap.set(criteriaType, ranking);
    }

    public deselectCriterion(criteriaType: CriteriaType) {
        if (this.criteriaRankingMap.has(criteriaType)) {
            this.criteriaRankingMap.delete(criteriaType);
        }
    }
}

