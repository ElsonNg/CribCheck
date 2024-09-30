import DatasetService from '@/lib/boundary/dataset-service';

/**
 * The 'ReportController' class is responsible for managing all the datasets required for generating 
 * report score via our algorithm by interacting with 'GovtDatasetService' and '<insert other dataset>'
 */

class ReportController {

    private schoolDataset: DatasetService;
    private healthcareDataset: DatasetService;
    private publicTransportDataset: DatasetService;

}


export default ReportController;
