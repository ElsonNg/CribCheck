

class ReportEntity {

    proximitySchool: number;
    proximityHealth: number;
    proximityTransport: number;
    proximityParks: number;
    proximityFood: number;

    constructor(){
        
        this.proximitySchool = 100000;
        this.proximityHealth = 100000;
        this.proximityTransport = 100000;
        this.proximityParks = 100000;
        this.proximityFood = 100000;

    }
    
}

export default ReportEntity;