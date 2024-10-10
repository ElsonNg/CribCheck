
/**
 * @class GovtDatasetService
 * 
 * This class provides datasets from data.gov.sg
 * It extends the 'DatasetService' abstract class and implements its 'fetchData' methods.
 * 
 * 
 */

import DatasetService from "@/lib/boundary/dataset-service";

// Define the interfaces
export interface Properties {
    Name: string;
    Description: string;
}

export interface Geometry {
    type: string;
    coordinates: number[];
}

export interface Feature {
    type: string;
    properties: Properties;
    geometry: Geometry;
}

export interface GeoJsonData {
    type: string;
    crs: {
        type: string;
        properties: {
            name: string;
        };
    };
    features: Feature[];
}



class GovtDatasetService extends DatasetService<GeoJsonData> {

    constructor(datasetId: string) {
        super("https://api-open.data.gov.sg/v1/public/api/datasets/" + datasetId + "/poll-download");
    }

    async fetchData(): Promise<GeoJsonData | null> {
        //to implement
        try {

            const response = await fetch(this.url);
            if (!response.ok) {
                throw new Error('Failed to fetch from API URL!');
            }
            const jsonData = await response.json();

            const downloadLink = jsonData.data.url;

            if (!downloadLink) {
                throw new Error("Download URL not found in response!");
            }

            const downloadResponse = await fetch(downloadLink);
            if (!downloadResponse.ok) {
                throw new Error('Failed to download GeoJSON!');
            }

            const downloadedJSONData = await downloadResponse.json();
            return downloadedJSONData as GeoJsonData;

        } catch (error) {
            console.error("Failed to fetch data from GovtDatasetService: ", error);
        }

        return null;
    }

}


export default GovtDatasetService;