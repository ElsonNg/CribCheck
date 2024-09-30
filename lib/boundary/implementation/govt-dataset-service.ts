/**
 * @class GovtDatasetService
 * 
 * This class provides datasets from data.gov.sg
 * It extends the 'DatasetService' abstract class and implements its 'fetchData' and 'parseData' methods.
 * 
 * This service fetches and parses the JSON file from data.gov.sg and returns relevant information required for algorithm
 * 
 */

import DatasetService from "@/lib/boundary/dataset-service";


class GovtDatasetService extends DatasetService {
    
    constructor(datasetId: string){
        super("https://data.gov.sg/api/action/datastore_search?resource_id=");
        this.url.concat(datasetId);
    }

    async fetchData(url:string): Promise<Record<string, any>>{
        //to implement
    }

    async parseData(data: Record<string, any>): any{
        //to implement
    }
}


export default GovtDatasetService;