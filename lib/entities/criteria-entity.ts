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


    private criteriaRankingMap: Map<CriteriaType, number>;

    constructor() {
        this.criteriaRankingMap = new Map<CriteriaType, number>();
    }

    public setAll(criteriaRankingMap: Map<CriteriaType, number>) {
        this.criteriaRankingMap = criteriaRankingMap;
    }

    public clear() {
        this.criteriaRankingMap.clear();
    }


    public getCriteriaRankingMap(): Map<CriteriaType, number> {
        return this.criteriaRankingMap;
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

        if (ranking && total > 0)
            return ranking / total;
        else
            return 0;
    }

    public toJSON(): Record<string, unknown> {
        return {
            criteriaRankingMap: Array.from(this.criteriaRankingMap.entries()).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {} as Record<string, number>)
        };
    }

    public fromJSON(json: Record<string, number>) {
        this.criteriaRankingMap = new Map<CriteriaType, number>();
        Object.entries(json).forEach(([key, value]) => {
            this.criteriaRankingMap.set(key as CriteriaType, value as number);
        });
    }
}

