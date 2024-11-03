/**
 * @class GovtDatasetService
 * 
 * This class provides access to datasets from data.gov.sg in the GeoJSON format.
 * It extends the `DatasetService` abstract class and implements its `fetchData` method 
 * to retrieve datasets by dataset ID from a specified API endpoint.
 * 
 * @extends DatasetService<GeoJsonData>
 */

import DatasetService from "@/lib/boundary/dataset-service";

// Define the interfaces representing GeoJSON structure
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

/**
 * GovtDatasetService class retrieves dataset information in GeoJSON format
 * from the Singapore government data API using a specific dataset ID.
 */
class GovtDatasetService extends DatasetService<GeoJsonData> {

    /**
     * Constructs an instance of `GovtDatasetService` with the dataset's API URL.
     * 
     * @param {string} datasetId - The ID of the dataset to fetch from data.gov.sg.
     */
    constructor(datasetId: string) {
        super(`api/datasets/${datasetId}`);
    }

    /**
     * Fetches GeoJSON data for the specified dataset.
     * 
     * This method sends a request to the provided API URL to retrieve GeoJSON data.
     * It first fetches the dataset metadata to get the download link, then downloads
     * the actual data from the provided link.
     * 
     * @returns {Promise<GeoJsonData | null>} A promise resolving to the GeoJSON data or `null` if the fetch fails.
     */
    async fetchData(): Promise<GeoJsonData | null> {
        try {
            const response = await fetch(this.url, {cache: "no-store"});
            if (!response.ok) {
                throw new Error('Failed to fetch from API URL!');
            }
            const downloadedJSONData = await response.json();
            return downloadedJSONData as GeoJsonData;

        } catch (error) {
            console.error("Failed to fetch data from GovtDatasetService: ", error);
        }

        // Return null if data fetch fails
        return null;
    }
}

export default GovtDatasetService;
