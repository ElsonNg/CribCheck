/**
 * The `LocationPrediction` entity represents a location suggestion or prediction 
 * from the Google Places Autocomplete API. It contains a place ID and description, 
 * which can be used to fetch detailed location information.
 * 
 * @class LocationPrediction
 */
class LocationPredictionEntity {
    /**
     * The place ID associated with this prediction.
     */
    public readonly placeId: string;

    /**
     * A description of the place (usually the formatted address or name).
     */
    public readonly description: string;

    /**
     * Creates a new instance of `LocationPrediction`.
     * 
     * @param placeId - The unique place ID for this prediction.
     * @param description - A human-readable description or formatted address.
     */
    constructor(placeId: string, description: string) {
        this.placeId = placeId;
        this.description = description;
    }

    /**
     * Get the place ID of the prediction.
     * 
     * @returns {string} The unique place ID for this prediction.
     */
    public getPlaceId(): string {
        return this.placeId;
    }

    /**
     * Get the description of the prediction.
     * 
     * @returns {string} The human-readable description or formatted address.
     */
    public getDescription(): string {
        return this.description;
    }
}

export default LocationPredictionEntity;
