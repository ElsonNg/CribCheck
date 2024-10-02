import DatasetService from '@/lib/boundary/dataset-service';
//import { CriteriaEntity } from '@/lib/entities/criteria-entity';
import { ReportEntity } from '@/lib/entities/report-entity';

/**
 * The 'ReportController' class is responsible for managing all the datasets required for generating 
 * report score via our algorithm by interacting with 'GovtDatasetService' and '<insert other dataset>'
 */

class ReportController {

    private schoolDataset: DatasetService;
    private healthcareDataset: DatasetService;
    private publicTransportDataset: DatasetService;

    //constructor()

    /**
     * Parses the fetched JSON data into a usable format.
     * Filters out the relevant information within
     * maps relevant data to ReportEntity class
     * @param data - The raw JSON data to be parsed.
     * @returns The parsed data in a specific format.
     */
    async parseData(CriteriaEntity): Promise<ReportEntity>{

        //to implement
    }   


}


export default ReportController;
