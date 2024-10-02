/**
 * @class GovtDatasetService
 * 
 * This class provides datasets from data.gov.sg
 * It extends the 'DatasetService' abstract class and implements its 'fetchData' methods.
 * 
 * 
 */

import DatasetService from "@/lib/boundary/dataset-service";


class GovtDatasetService extends DatasetService <Record<string,any>> {
    
    constructor(datasetId: string){
        super("https://data.gov.sg/api/action/datastore_search?resource_id=");
        this.url.concat(datasetId);
    }

    async fetchData(): Promise<Record<string, any> | null>{
        //to implement
    }

}


export default GovtDatasetService;