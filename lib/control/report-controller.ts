import DatasetService from '@/lib/boundary/dataset-service';
import CriteriaEntity, { CriteriaType } from '@/lib/entities/criteria-entity';
import { GeoJsonData } from '@/lib/boundary/implementation/govt-dataset-service';
import HawkerCentreEntity from '@/lib/entities/datasets/hawker-centre-entity';
import LocationEntity from '@/lib/entities/location/location-entity';
import { ProximityScorer } from '@/lib/strategy/proximity-scorer';
import { LinearDistanceScoringStrategy } from '@/lib/strategy/linear-distance-scoring-strategy';
import { ScoringResult } from '@/lib/strategy/scoring-strategy';
/**
 * The 'ReportController' class is responsible for managing all the datasets required for generating 
 * report score via our algorithm by interacting with 'GovtDatasetService' and '<insert other dataset>'
 */

class ReportController {


    private selectedLocation: LocationEntity | null;
    private selectedCriteria: CriteriaEntity | null;

    // Datasets
    private hawkerCentresDataset: DatasetService<GeoJsonData>;

    // Scoring strategies
    private proximityScorer: ProximityScorer;


    private cribFitRating: number;



    constructor(hawkerCentresDataset: DatasetService<GeoJsonData>,
        transportDataset: DatasetService<GeoJsonData>,
        schoolTransportDataset: DatasetService<GeoJsonData>,
        supermarketTransportDataset: DatasetService<GeoJsonData>,
        clinicTransportDataset: DatasetService<GeoJsonData>
    ) {

        this.hawkerCentresDataset = hawkerCentresDataset;

        // TODO: Create private variables and assign the dataset services
        // TODO: Nick (Step 3) 
        // TODO: Joyce (Step 3)
        // TODO: Jody (Step 3)
        // TODO: Angel (Step 3)

        this.selectedLocation = null;
        this.selectedCriteria = null;

        this.cribFitRating = 0;

        this.proximityScorer = new ProximityScorer();
        this.proximityScorer.addCriteriaStrategy(CriteriaType.proximityToHawkerCentres, new LinearDistanceScoringStrategy(2.0), 0.5, true);
        this.proximityScorer.addCriteriaStrategy(CriteriaType.proximityToMRT, new LinearDistanceScoringStrategy(2.0), 0.5, true);

        // TODO: Add the scoring strategy for the criteria type you are working on. If unsure, use LinearDistanceScoringStrategy
        // TODO: Nick (Step 4) 
        // TODO: Joyce (Step 4)
        // TODO: Jody (Step 4)
        // TODO: Angel (Step 4)
        
    }

    async generateReport(): Promise<boolean> {

        try {

            if (this.selectedCriteria == null || this.selectedCriteria === undefined) {
                throw new Error("No criteria selected for report generation!");
            } else if (this.selectedLocation == null || this.selectedLocation === undefined) {
                throw new Error("No location selected for report generation!");
            }


            // Disable all strategies and only enable those relevant to the selected criteria
            this.proximityScorer.disableAllStrategies();

            const criteriaRankings = this.selectedCriteria.getCriteriaRankingMap();


            // Iterate through all the criteria and fetch the relevant data
            const promises = criteriaRankings.entries().map(async ([criteriaType, ranking]) => {

                const weightage = this.selectedCriteria!.getWeightage(criteriaType);

                switch (criteriaType) {

                    case CriteriaType.proximityToHawkerCentres:
                        // Fetch the data from hawker centres dataset
                        const data = await this.hawkerCentresDataset.fetchData();
                        if (!data) {
                            throw new Error("Hawker centres dataset is not available!");
                        }

                        // Create hawker entities from the data
                        const hawkerCentres = await this.getHawkerCentres(data);

                        // Populate the data into our proximity scorer, tagging it with the criteria type and weightage
                        this.proximityScorer.enableStrategy(criteriaType, weightage, hawkerCentres);
                        break;


                    case CriteriaType.proximityToMRT:
                        // TODO: Nick (Step 5) - Fetch the data from the dataset, create MRT entities from the data, and populate the data into our proximity scorer
                        break;

                    case CriteriaType.proximityToSchool:
                        // TODO: Joyce (Step 5) - Fetch the data from the dataset, create School entities from the data, and populate the data into our proximity scorer
                        break;

                    case CriteriaType.proximityToSupermarket:
                        // TODO: Jody (Step 5) - Fetch the data from the dataset, create Supermarket entities from the data, and populate the data into our proximity scorer
                        break;

                    case CriteriaType.proximityToClinic:
                        // TODO: Angel (Step 5) - Fetch the data from the dataset, create Clinic entities from the data, and populate the data into our proximity scorer
                        break;

                    default:
                        break;
                }

            });

            const results = await Promise.all(promises);
            this.cribFitRating = this.proximityScorer.calculateCompositeScore(this.selectedLocation);

            console.log("CribFit Rating: " + this.cribFitRating);
            return true;

        } catch (error) {
            console.error(error);
            return false;
        }
    }

    getCribFitRating(): number {
        return this.cribFitRating;
    }


    async getHawkerCentres(data: GeoJsonData) {
        const hawkerCentres: HawkerCentreEntity[] = [];
        const parser = new DOMParser();

        // Extract all hawker centres in dataset that are less than 2KM
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

        return hawkerCentres;
    }


    // TODO: Nick (Step 6) - Create MRT entities
    async getMRTStations(data: GeoJsonData) {
      
    }


    // TODO: Joyce (Step 6) - Create School entities
    async getSchools(data: GeoJsonData) {


    }

    // TODO: Jody (Step 6) - Create Supermarkets entities
    async getSupermarkets(data: GeoJsonData) {

    }

    // TODO: Angel (Step 6) - Create Clinic entities
    async getClinics(data: GeoJsonData) {

    }

    public getScoringResults(): Map<CriteriaType, ScoringResult> {
        return this.proximityScorer.getResults();
    }


    public setSelectedLocation(location: LocationEntity) {
        this.selectedLocation = location;
    }

    public setSelectedCriteria(criteria: CriteriaEntity) {
        this.selectedCriteria = criteria;
    }

    public getSelectedLocation(): LocationEntity | null {
        return this.selectedLocation;
    }

    public getSelectedCriteria(): CriteriaEntity | null {
        return this.selectedCriteria;
    }



}


export default ReportController;
