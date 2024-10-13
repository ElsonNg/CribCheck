// Define an enum for criteria types
export enum CriteriaType {
    proximityToHawkerCentres = 'proximityToHawkerCentres',
    proximityToMRT = 'proximityToMRT',
    proximityToSchool = 'proximityToSchool',
    proximityToSupermarket = 'proximityToSupermarket',
    proximityToClinic = 'proximityToClinic',
}

// Create a mapping of enum values to their labels
export const CriteriaLabels: { [key in CriteriaType]: string } = {
    [CriteriaType.proximityToHawkerCentres]: 'Proximity to Hawker Centres',
    [CriteriaType.proximityToMRT]: 'Proximity to MRT Stations',
    [CriteriaType.proximityToSchool]: 'Proximity to Schools',
    [CriteriaType.proximityToSupermarket]: 'Proximity to Supermarkets',
    [CriteriaType.proximityToClinic]: 'Proximity to Clinics',
};

export type PresetCriteriaType = "Singles" | "Young Couple" | "Family";


export default class CriteriaEntity {


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

    public clear() {
        this.criteriaRankingMap.clear();
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

    public selectCriterion(criteriaType: CriteriaType, stars: number) {
        this.criteriaRankingMap.set(criteriaType, stars);
    }

    public deselectCriterion(criteriaType: CriteriaType) {
        if (this.criteriaRankingMap.has(criteriaType)) {
            this.criteriaRankingMap.delete(criteriaType);
        }
    }

    public getWeightage(criteriaType: CriteriaType): number {
        
        const total = this.criteriaRankingMap.values().reduce((a, b) => a + b, 0);
        const ranking = this.criteriaRankingMap.get(criteriaType);
        
        if(ranking && total > 0)
            return ranking / total;
        else
            return 0;
    }
}

