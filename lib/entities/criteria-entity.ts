export class CriteriaEntity {
    criteriaId: string;
    proximityToSchools: boolean;
    proximityToSportsFacilities: boolean;
    proximityToTransportation: boolean;
    proximityToShoppingMall: boolean;
    proximityToSuperMarket: boolean;
    proximityToParks: boolean;

    constructor(criteriaId: string,
        proximityToSchools: boolean,
        proximityToSportsFacilities: boolean,
        proximityToTransportation: boolean,
        proximityToShoppingMall: boolean,
        proximityToSuperMarket: boolean,
        proximityToParks: boolean,


    ) {
        this.criteriaId = criteriaId;
        this.proximityToSchools = proximityToSchools;
        this.proximityToSportsFacilities = proximityToSportsFacilities;
        this.proximityToTransportation = proximityToTransportation;
        this.proximityToShoppingMall = proximityToShoppingMall;
        this.proximityToSuperMarket = proximityToSuperMarket;
        this.proximityToParks = proximityToParks;

    }
}

