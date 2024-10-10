import DatasetService from '@/lib/boundary/dataset-service';
import CriteriaEntity from '@/lib/entities/criteria-entity';
import ReportEntity from '@/lib/entities/report-entity';
import { GeoJsonData } from '@/lib/boundary/implementation/govt-dataset-service';
import HawkerCentreEntity from '../entities/datasets/hawker-centre-entity';
import LocationEntity from '@/lib/entities/location-entity';
/**
 * The 'ReportController' class is responsible for managing all the datasets required for generating 
 * report score via our algorithm by interacting with 'GovtDatasetService' and '<insert other dataset>'
 */

class ReportController {

    //private transportDataset: DatasetService<Record<string, unknown>>;
    private hawkerCentresDataset: DatasetService<GeoJsonData>;
    private static NEARBY_RADIUS_KM : number = 0.5;

    constructor(hawkerCentresDataset: DatasetService<GeoJsonData>) {
        this.hawkerCentresDataset = hawkerCentresDataset;
    }

    async fetchRelevantData() {

        const hawkerData = await this.hawkerCentresDataset.fetchData();
        const currentLocation = new LocationEntity(1.287654, 103.845274);

        if(hawkerData)
        {
            const hawkerCentres : HawkerCentreEntity[] = await this.getNearbyHawkerCentres(currentLocation, hawkerData);
            return hawkerCentres;
        }
        return hawkerData;
    }

    async getNearbyHawkerCentres(queryLocation: LocationEntity, data: GeoJsonData) : Promise<HawkerCentreEntity[]> {

        const hawkerCentres : HawkerCentreEntity[] = [];
        const parser = new DOMParser();


        data?.features.forEach((feature) => {

            const doc = parser.parseFromString(feature.properties.Description, 'text/html');

            // Query all elements with <th> tag
            const thElements = doc.querySelectorAll('th');

            // Loop through each <th> and check if its text content matches "NAME"
            let name = '';
            thElements.forEach((th) => {
                if (th.textContent === "NAME") {
                    // If it matches, find the next sibling <td> and extract its text content
                    const nameElement = th.nextElementSibling;
                    if (nameElement) {
                        name = nameElement.textContent || '';
                    }
                }
            });

            // Extract the coordinates (location) from the GeoJSON geometry
            const coordinates = feature.geometry.coordinates;
            if (coordinates && coordinates.length >= 2) {
                hawkerCentres.push(new HawkerCentreEntity(name, new LocationEntity(coordinates[1], coordinates[0])))
            }
        });

        const nearbyHawkerCentres = hawkerCentres.filter((centre) => queryLocation.distanceToKilometres(centre.getLocation()) <= ReportController.NEARBY_RADIUS_KM);
        return nearbyHawkerCentres;
    }




    /**
     * Parses the fetched JSON data into a usable format.
     * Filters out the relevant information within
     * maps relevant data to ReportEntity class
     * @param data - The raw JSON data to be parsed.
     * @returns The parsed data in a specific format.
     */
    async parseData(criteria: CriteriaEntity): Promise<ReportEntity> {
        //to implement
        return new ReportEntity();
    }


}


export default ReportController;
