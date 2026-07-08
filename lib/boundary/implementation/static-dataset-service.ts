/**
 * @class StaticDatasetService
 *
 * This class provides access to pregenerated GeoJSON datasets served as static
 * assets from the app's own `public/` directory (e.g. datasets that only exist
 * as CSV upstream and are converted/geocoded ahead of time by a script).
 *
 * @extends DatasetService<GeoJsonData>
 */

import DatasetService from "@/lib/boundary/dataset-service";
import { GeoJsonData } from "@/lib/boundary/implementation/govt-dataset-service";

class StaticDatasetService extends DatasetService<GeoJsonData> {

    /**
     * Constructs an instance of `StaticDatasetService` with the static asset path.
     *
     * @param {string} assetPath - The public path of the GeoJSON file (e.g. "/data/supermarkets.geojson").
     */
    constructor(assetPath: string) {
        super(assetPath);
    }

    /**
     * Fetches the pregenerated GeoJSON data from the static asset.
     *
     * @returns {Promise<GeoJsonData | null>} A promise resolving to the GeoJSON data or `null` if the fetch fails.
     */
    async fetchData(): Promise<GeoJsonData | null> {
        try {
            const response = await fetch(this.url);
            if (!response.ok) {
                throw new Error('Failed to fetch static dataset!');
            }
            return await response.json() as GeoJsonData;

        } catch (error) {
            console.error("Failed to fetch data from StaticDatasetService: ", error);
        }

        // Return null if data fetch fails
        return null;
    }
}

export default StaticDatasetService;
