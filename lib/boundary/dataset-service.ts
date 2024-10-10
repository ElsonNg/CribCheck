
/**
 * @class DatasetService
 * 
 * This class serves as a blueprint for any dataset service
 * (e.g. data.gov, etc.). It defines the basic functions any derived class must
 * implement for handling the dataset
 * 
 * Classes that extend 'DatasetService' must provide implementation for:
 * - 'fetchData': fetching the data using the given URL
 * - 'parseData' 
 */
abstract class DatasetService <T> {
    /** 
     * Protected property to store the URL for data fetching.
     */
    protected url: string;

    /**
     * Initializes a new instance of the DatasetService class.
     * @param url - The URL from which to fetch data.
     */
    constructor(url: string) {
        this.url = url; // Assign the provided URL to the class property
    }

    /**
     * Fetches data from the specified URL.
     * This method must be implemented by subclasses.
     * @returns A promise that resolves with the fetched JSON data.
     */
    abstract fetchData(): Promise<T | null>; // Expecting JSON data

}

// Exporting the abstract class for use in other modules.
export default DatasetService;
