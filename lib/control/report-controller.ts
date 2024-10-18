import DatasetService from '@/lib/boundary/dataset-service';
import CriteriaEntity, { CriteriaType } from '@/lib/entities/criteria-entity';
import { GeoJsonData } from '@/lib/boundary/implementation/govt-dataset-service';
import HawkerCentreEntity from '@/lib/entities/datasets/hawker-centre-entity';
import MRTStationEntity from '@/lib/entities/datasets/mrt-station-entity';
import LocationEntity from '@/lib/entities/location/location-entity';
import { ProximityScorer } from '@/lib/strategy/proximity-scorer';
import { LinearDistanceScoringStrategy } from '@/lib/strategy/linear-distance-scoring-strategy';
import { ScoringResult } from '@/lib/strategy/scoring-strategy';
import ClinicEntity from '../entities/datasets/clinic-entity';
import SchoolEntity from '../entities/datasets/school-entity';
import { ThresholdScoringStrategy } from '../strategy/threshold-scoring-strategy';
import SupermarketEntity from '../entities/datasets/supermarket-entity';
import { DecayThresholdScoringStrategy } from '../strategy/decay-threshold-scoring-strategy';
/**
 * The 'ReportController' class is responsible for managing all the datasets required for generating 
 * report score via our algorithm by interacting with 'GovtDatasetService' and '<insert other dataset>'
 */

class ReportController {

    private selectedLocationOther: LocationEntity | null;
    private selectedLocation: LocationEntity | null;
    private selectedCriteria: CriteriaEntity | null;

    // Datasets
    private hawkerCentresDataset: DatasetService<GeoJsonData>;
    private transportDataset: DatasetService<GeoJsonData>;
    private clinicDataset: DatasetService<GeoJsonData>;
    private schoolDataset: DatasetService<GeoJsonData>;
    private supermarketDataset: DatasetService<GeoJsonData>;

    // Scoring strategies
    private proximityScorer: ProximityScorer;


    private cribFitRating: number;

    private initialResult: Map<CriteriaType, ScoringResult> | null;
    private otherResult: Map<CriteriaType, ScoringResult> | null;



    constructor(hawkerCentresDataset: DatasetService<GeoJsonData>,
        transportDataset: DatasetService<GeoJsonData>,
        schoolDataset: DatasetService<GeoJsonData>,
        supermarketDataset: DatasetService<GeoJsonData>,
        clinicDataset: DatasetService<GeoJsonData>
    ) {

        this.hawkerCentresDataset = hawkerCentresDataset;
        this.transportDataset = transportDataset;
        this.schoolDataset = schoolDataset;
        this.clinicDataset = clinicDataset;
        this.supermarketDataset = supermarketDataset;


        this.selectedLocationOther = null;
        this.selectedLocation = null;
        this.selectedCriteria = null;
        this.initialResult = null;
        this.otherResult = null;

        this.cribFitRating = 0;

        this.proximityScorer = new ProximityScorer();
        this.proximityScorer.addCriteriaStrategy(CriteriaType.proximityToHawkerCentres, new DecayThresholdScoringStrategy(5, [0.3, 0.5, 1, 2], [100, 90, 75, 50], [0.6, 0.2, 0.1, 0.05, 0.05]));
        this.proximityScorer.addCriteriaStrategy(CriteriaType.proximityToMRT, new DecayThresholdScoringStrategy(3, [0.3, 0.5, 1, 2], [100, 90, 75, 50], [0.7, 0.2, 0.1]));
        this.proximityScorer.addCriteriaStrategy(CriteriaType.proximityToSupermarket, new DecayThresholdScoringStrategy(2, [0.3, 0.5, 1, 2], [100, 90, 75, 50], [0.6, 0.4]));
        this.proximityScorer.addCriteriaStrategy(CriteriaType.proximityToSchool, new DecayThresholdScoringStrategy(5, [1, 2, 5], [100, 75, 50], [0.6, 0.2, 0.1, 0.05, 0.05]));
        this.proximityScorer.addCriteriaStrategy(CriteriaType.proximityToClinic, new DecayThresholdScoringStrategy(2, [1, 2, 5], [100, 75, 50], [0.6, 0.4]));


        // this.proximityScorer.addCriteriaStrategy(CriteriaType.proximityToHawkerCentres, new ThresholdScoringStrategy([0.3, 0.5, 1, 2], [100, 90, 80, 50]));
        // this.proximityScorer.addCriteriaStrategy(CriteriaType.proximityToMRT, new ThresholdScoringStrategy([0.5, 0.8, 1, 2], [100, 90, 80, 50]));
        // this.proximityScorer.addCriteriaStrategy(CriteriaType.proximityToSchool, new ThresholdScoringStrategy([1, 2, 5], [100, 90, 80, 50]));
        // this.proximityScorer.addCriteriaStrategy(CriteriaType.proximityToClinic, new ThresholdScoringStrategy([1, 2, 5], [100, 90, 80, 50]));
        // this.proximityScorer.addCriteriaStrategy(CriteriaType.proximityToSupermarket, new ThresholdScoringStrategy([0.3, 0.5, 1], [100, 90, 80, 50]));


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
                        const transportData = await this.transportDataset.fetchData();
                        if (!transportData) {
                            throw new Error("Public transport dataset is not available.");
                        }

                        const mrtStations = await this.getMRTStations(transportData);
                        this.proximityScorer.enableStrategy(criteriaType, weightage, mrtStations);
                        break;

                    case CriteriaType.proximityToSchool:
                        const schoolData = await this.schoolDataset.fetchData();
                        if (!schoolData) {
                            throw new Error("School dataset is not available!");
                        }

                        const school = await this.getSchools(schoolData);
                        this.proximityScorer.enableStrategy(criteriaType, weightage, school);
                        break;

                    case CriteriaType.proximityToSupermarket:
                        // Fetch the data from clinic dataset
                        const supermarketData = await this.supermarketDataset.fetchData();
                        if (!supermarketData) {
                            throw new Error("Supermarket dataset is not available!");
                        }

                        // Create hawker entities from the data
                        const supermarkets = await this.getSupermarkets(supermarketData);

                        // Populate the data into our proximity scorer, tagging it with the criteria type and weightage
                        this.proximityScorer.enableStrategy(criteriaType, weightage, supermarkets);
                        break;

                    case CriteriaType.proximityToClinic:
                        // Fetch the data from clinic dataset
                        const clinicData = await this.clinicDataset.fetchData();
                        if (!clinicData) {
                            throw new Error("Clinic dataset is not available!");
                        }

                        // Create hawker entities from the data
                        const clinic = await this.getClinics(clinicData);

                        // Populate the data into our proximity scorer, tagging it with the criteria type and weightage
                        this.proximityScorer.enableStrategy(criteriaType, weightage, clinic);
                        break;

                    default:
                        break;
                }

            });

            await Promise.all(promises);
            this.cribFitRating = this.proximityScorer.calculateCompositeScore(this.selectedLocation);

            const results = this.proximityScorer.getResults();

            if (this.initialResult === null) {
                this.initialResult = results;
            } else {
                this.otherResult = results;
            }


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
                const loc = new LocationEntity(coordinates[1], coordinates[0]);
                const isDuplicate = hawkerCentres.some(s => s.equals(loc));
                if (!isDuplicate) {
                    hawkerCentres.push(new HawkerCentreEntity(name, loc));
                }
            }
        });

        return hawkerCentres;
    }


    async getMRTStations(data: GeoJsonData) {
        const mrtStations: MRTStationEntity[] = [];
        const parser = new DOMParser();

        data?.features.forEach((feature) => {

            const doc = parser.parseFromString(feature.properties.Description, 'text/html');

            const thElements = doc.querySelectorAll('th');

            let name = '';
            thElements.forEach((th) => {
                if (th.textContent === "STATION_NA") {
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
                const isDuplicate = mrtStations.some(station => station.getName() === name);

                if (!isDuplicate) {
                    mrtStations.push(new MRTStationEntity(name, new LocationEntity(coordinates[1], coordinates[0])))
                }
            }
        });

        return mrtStations;
    }


    async getSchools(data: GeoJsonData) {
        const school: SchoolEntity[] = [];
        const parser = new DOMParser();

        data?.features.forEach((feature) => {

            const doc = parser.parseFromString(feature.properties.Description, 'text/html');

            const thElements = doc.querySelectorAll('th');

            let name = '';
            thElements.forEach((th) => {
                if (th.textContent === "CENTRE_NAME") {
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

                const loc = new LocationEntity(coordinates[1], coordinates[0]);
                const isDuplicate = school.some(s => s.equals(loc));
                if (!isDuplicate) {
                    school.push(new SchoolEntity(name, loc));
                }

            }
        });

        return school;

    }

    async getSupermarkets(data: GeoJsonData) {
        const supermarkets: SupermarketEntity[] = [];
        const parser = new DOMParser();

        data?.features.forEach((feature) => {

            const doc = parser.parseFromString(feature.properties.Description, 'text/html');

            const thElements = doc.querySelectorAll('th');

            let name = '';
            thElements.forEach((th) => {
                if (th.textContent === "LIC_NAME") {
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
                const loc = new LocationEntity(coordinates[1], coordinates[0]);
                const isDuplicate = supermarkets.some(s => s.equals(loc));
                if (!isDuplicate)
                    supermarkets.push(new SupermarketEntity(name, loc));
            }
        });

        return supermarkets;
    }

    async getClinics(data: GeoJsonData) {
        const clinic: ClinicEntity[] = [];
        const parser = new DOMParser();

        data?.features.forEach((feature) => {

            const doc = parser.parseFromString(feature.properties.Description, 'text/html');

            const thElements = doc.querySelectorAll('th');

            let name = '';
            thElements.forEach((th) => {
                if (th.textContent === "HCI_NAME") {
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
                const loc = new LocationEntity(coordinates[1], coordinates[0]);
                const isDuplicate = clinic.some(s => s.equals(loc));
                if (!isDuplicate)
                    clinic.push(new ClinicEntity(name, loc));
            }
        });

        return clinic;
    }

    public getScoringResults(): Map<CriteriaType, ScoringResult> {
        return this.proximityScorer.getResults();
    }


    public setSelectedLocation(location: LocationEntity) {
        this.selectedLocation = location;
    }

    public setSelectedLocationOther(location: LocationEntity) {
        this.selectedLocationOther = location;
    }

    public setSelectedCriteria(criteria: CriteriaEntity) {
        this.selectedCriteria = criteria;
    }

    public getSelectedLocation(): LocationEntity | null {
        return this.selectedLocation;
    }

    public getSelectedLocationOther(): LocationEntity | null {
        return this.selectedLocationOther;
    }

    public getSelectedCriteria(): CriteriaEntity | null {
        return this.selectedCriteria;
    }

    public getInitialResult(): Map<CriteriaType, ScoringResult> | null {
        return this.initialResult;
    }

    public getOtherResult(): Map<CriteriaType, ScoringResult> | null {
        return this.otherResult;
    }

}


export default ReportController;
