import DatasetService from '@/lib/boundary/dataset-service';
import CriteriaEntity, { CriteriaType } from '@/lib/entities/criteria-entity';
import { GeoJsonData } from '@/lib/boundary/implementation/govt-dataset-service';
import HawkerCentreEntity from '@/lib/entities/datasets/hawker-centre-entity';
import MRTStationEntity from '@/lib/entities/datasets/mrt-station-entity';
import LocationEntity from '@/lib/entities/location/location-entity';
import { ProximityScorer } from '@/lib/strategy/proximity-scorer';
import { ScoringResult } from '@/lib/strategy/scoring-strategy';
import ClinicEntity from '@/lib/entities/datasets/clinic-entity';
import SchoolEntity from '@/lib/entities/datasets/school-entity';
import SupermarketEntity from '@/lib/entities/datasets/supermarket-entity';
import { DecayThresholdScoringStrategy } from '@/lib/strategy/decay-threshold-scoring-strategy';

/**
 * The `ReportController` manages report generation by fetching relevant data from datasets 
 * (e.g., hawker centers, transport, schools) and calculating proximity-based scores for selected locations.
 */
class ReportController {
    private selectedLocationOther: LocationEntity | null;
    private selectedLocation: LocationEntity | null;
    private selectedCriteria: CriteriaEntity | null;

    private hawkerCentresDataset: DatasetService<GeoJsonData>;
    private transportDataset: DatasetService<GeoJsonData>;
    private clinicDataset: DatasetService<GeoJsonData>;
    private schoolDataset: DatasetService<GeoJsonData>;
    private supermarketDataset: DatasetService<GeoJsonData>;

    private proximityScorer: ProximityScorer;
    private cribFitRating: number;
    private cribFitRatingOther: number;

    private reportResult: Map<CriteriaType, ScoringResult> | null;
    private reportResultOther: Map<CriteriaType, ScoringResult> | null;

    /**
     * Initializes datasets and scoring strategies for various proximity-based criteria, 
     * such as proximity to hawker centers and MRT stations.
     * 
     * @param hawkerCentresDataset - The dataset service for hawker centers.
     * @param transportDataset - The dataset service for public transport stations.
     * @param schoolDataset - The dataset service for schools.
     * @param supermarketDataset - The dataset service for supermarkets.
     * @param clinicDataset - The dataset service for clinics.
     */
    constructor(
        hawkerCentresDataset: DatasetService<GeoJsonData>,
        transportDataset: DatasetService<GeoJsonData>,
        schoolDataset: DatasetService<GeoJsonData>,
        supermarketDataset: DatasetService<GeoJsonData>,
        clinicDataset: DatasetService<GeoJsonData>
    ) {
        this.hawkerCentresDataset = hawkerCentresDataset;
        this.transportDataset = transportDataset;
        this.schoolDataset = schoolDataset;
        this.supermarketDataset = supermarketDataset;
        this.clinicDataset = clinicDataset;

        this.selectedLocationOther = null;
        this.selectedLocation = null;
        this.selectedCriteria = null;
        this.reportResult = null;
        this.reportResultOther = null;

        this.cribFitRating = 0;
        this.cribFitRatingOther = 0;

        this.proximityScorer = new ProximityScorer();

        // Define scoring strategy implementations for each criteria type
        this.proximityScorer.addCriteriaStrategy(
            CriteriaType.proximityToHawkerCentres,
            new DecayThresholdScoringStrategy(5, [0.3, 0.5, 1, 2], [100, 90, 75, 50], [0.6, 0.2, 0.1, 0.05, 0.05])
        );
        this.proximityScorer.addCriteriaStrategy(
            CriteriaType.proximityToMRT,
            new DecayThresholdScoringStrategy(3, [0.3, 0.5, 1, 2], [100, 90, 75, 50], [0.7, 0.2, 0.1])
        );
        this.proximityScorer.addCriteriaStrategy(
            CriteriaType.proximityToSupermarket,
            new DecayThresholdScoringStrategy(2, [0.3, 0.5, 1, 2], [100, 90, 75, 50], [0.6, 0.4])
        );
        this.proximityScorer.addCriteriaStrategy(
            CriteriaType.proximityToSchool,
            new DecayThresholdScoringStrategy(5, [1, 2, 5], [100, 75, 50], [0.6, 0.2, 0.1, 0.05, 0.05])
        );
        this.proximityScorer.addCriteriaStrategy(
            CriteriaType.proximityToClinic,
            new DecayThresholdScoringStrategy(2, [1, 2, 5], [100, 75, 50], [0.6, 0.4])
        );
    }

    /**
     * Generates a report by calculating scores for selected locations based on specified criteria.
     * 
     * @returns A promise that resolves to `true` if the report generation is successful; otherwise, `false`.
     */
    async generateReport(): Promise<boolean> {
        try {
            if (!this.selectedCriteria) {
                throw new Error("No criteria selected for report generation!");
            }

            if (this.selectedLocation) {
                await this.generateResultForLocation(this.selectedLocation);
                this.cribFitRating = this.proximityScorer.calculateCompositeScore(this.selectedLocation);
                this.reportResult = new Map(this.proximityScorer.getResults());
            }
            if (this.selectedLocationOther) {
                await this.generateResultForLocation(this.selectedLocationOther);
                this.cribFitRatingOther = this.proximityScorer.calculateCompositeScore(this.selectedLocationOther);
                this.reportResultOther = new Map(this.proximityScorer.getResults());
            }

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * Generates scoring results for a given location based on active criteria and datasets.
     * 
     * @param location - The location entity for which scoring results are generated.
     * @returns A promise that resolves to `true` if the results are generated successfully; otherwise, `false`.
     */
    private async generateResultForLocation(location: LocationEntity): Promise<boolean> {
        try {
            if (!location) {
                throw new Error("No location selected for report generation!");
            }

            this.proximityScorer.disableAllStrategies();
            const criteriaRankings = this.selectedCriteria!.getCriteriaRankingMap();

            // Asynchronously fetch and score data for each relevant criteria
            const promises = Array.from(criteriaRankings.entries()).map(async ([criteriaType, ranking]) => {
                const weightage = this.selectedCriteria!.getWeightage(criteriaType);

                switch (criteriaType) {
                    case CriteriaType.proximityToHawkerCentres:
                        const hawkerData = await this.hawkerCentresDataset.fetchData();
                        if (!hawkerData) throw new Error("Hawker centres dataset is not available!");
                        const hawkerCentres = await this.getHawkerCentres(hawkerData);
                        this.proximityScorer.enableStrategy(criteriaType, weightage, hawkerCentres);
                        break;

                    case CriteriaType.proximityToMRT:
                        const transportData = await this.transportDataset.fetchData();
                        if (!transportData) throw new Error("Public transport dataset is not available.");
                        const mrtStations = await this.getMRTStations(transportData);
                        this.proximityScorer.enableStrategy(criteriaType, weightage, mrtStations);
                        break;

                    case CriteriaType.proximityToSchool:
                        const schoolData = await this.schoolDataset.fetchData();
                        if (!schoolData) throw new Error("School dataset is not available!");
                        const schools = await this.getSchools(schoolData);
                        this.proximityScorer.enableStrategy(criteriaType, weightage, schools);
                        break;

                    case CriteriaType.proximityToSupermarket:
                        const supermarketData = await this.supermarketDataset.fetchData();
                        if (!supermarketData) throw new Error("Supermarket dataset is not available!");
                        const supermarkets = await this.getSupermarkets(supermarketData);
                        this.proximityScorer.enableStrategy(criteriaType, weightage, supermarkets);
                        break;

                    case CriteriaType.proximityToClinic:
                        const clinicData = await this.clinicDataset.fetchData();
                        if (!clinicData) throw new Error("Clinic dataset is not available!");
                        const clinics = await this.getClinics(clinicData);
                        this.proximityScorer.enableStrategy(criteriaType, weightage, clinics);
                        break;

                    default:
                        break;
                }
            });

            await Promise.all(promises);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * Combines the scoring results from both locations into a single map.
     * 
     * @returns A map of `CriteriaType` to `ScoringResult` with combined results.
     */
    public getCombinedScoringResults(): Map<CriteriaType, ScoringResult> {
        const combinedResults: Map<CriteriaType, ScoringResult> = new Map<CriteriaType, ScoringResult>();

        this.reportResult?.forEach((value, key) => combinedResults.set(key, value));
        this.reportResultOther?.forEach((value, key) => combinedResults.set(key, value));

        return combinedResults;
    }

    /**
     * Extracts hawker center entities from the GeoJSON dataset.
     * 
     * @param data - The GeoJSON data representing hawker centers.
     * @returns An array of `HawkerCentreEntity` objects.
     */
    async getHawkerCentres(data: GeoJsonData): Promise<HawkerCentreEntity[]> {
        const hawkerCentres: HawkerCentreEntity[] = [];
        const parser = new DOMParser();

        data?.features.forEach((feature) => {
            const doc = parser.parseFromString(feature.properties.Description, 'text/html');
            let name = '';
            doc.querySelectorAll('th').forEach((th) => {
                if (th.textContent === "NAME") {
                    const nameElement = th.nextElementSibling;
                    name = nameElement ? nameElement.textContent || '' : '';
                }
            });

            const coordinates = feature.geometry.coordinates;
            if (coordinates && coordinates.length >= 2) {
                const loc = new LocationEntity(coordinates[1], coordinates[0]);
                if (!hawkerCentres.some(s => s.equals(loc))) {
                    hawkerCentres.push(new HawkerCentreEntity(name, loc));
                }
            }
        });

        return hawkerCentres;
    }

    /**
     * Extracts MRT station entities from the GeoJSON dataset.
     * 
     * @param data - The GeoJSON data representing MRT stations.
     * @returns An array of `MRTStationEntity` objects.
     */
    async getMRTStations(data: GeoJsonData): Promise<MRTStationEntity[]> {
        const mrtStations: MRTStationEntity[] = [];
        const parser = new DOMParser();

        data?.features.forEach((feature) => {
            const doc = parser.parseFromString(feature.properties.Description, 'text/html');
            let name = '';
            doc.querySelectorAll('th').forEach((th) => {
                if (th.textContent === "STATION_NA") {
                    const nameElement = th.nextElementSibling;
                    name = nameElement ? nameElement.textContent || '' : '';
                }
            });

            const coordinates = feature.geometry.coordinates;
            if (coordinates && coordinates.length >= 2) {
                if (!mrtStations.some(station => station.getName() === name)) {
                    mrtStations.push(new MRTStationEntity(name, new LocationEntity(coordinates[1], coordinates[0])));
                }
            }
        });

        return mrtStations;
    }

    /**
     * Extracts school entities from the GeoJSON dataset.
     * 
     * @param data - The GeoJSON data representing schools.
     * @returns An array of `SchoolEntity` objects.
     */
    async getSchools(data: GeoJsonData): Promise<SchoolEntity[]> {
        const schools: SchoolEntity[] = [];
        const parser = new DOMParser();

        data?.features.forEach((feature) => {
            const doc = parser.parseFromString(feature.properties.Description, 'text/html');
            let name = '';
            doc.querySelectorAll('th').forEach((th) => {
                if (th.textContent === "CENTRE_NAME") {
                    const nameElement = th.nextElementSibling;
                    name = nameElement ? nameElement.textContent || '' : '';
                }
            });

            const coordinates = feature.geometry.coordinates;
            if (coordinates && coordinates.length >= 2) {
                const loc = new LocationEntity(coordinates[1], coordinates[0]);
                if (!schools.some(s => s.equals(loc))) {
                    schools.push(new SchoolEntity(name, loc));
                }
            }
        });

        return schools;
    }

    /**
     * Extracts supermarket entities from the GeoJSON dataset.
     * 
     * @param data - The GeoJSON data representing supermarkets.
     * @returns An array of `SupermarketEntity` objects.
     */
    async getSupermarkets(data: GeoJsonData): Promise<SupermarketEntity[]> {
        const supermarkets: SupermarketEntity[] = [];
        const parser = new DOMParser();

        data?.features.forEach((feature) => {
            const doc = parser.parseFromString(feature.properties.Description, 'text/html');
            let name = '';
            doc.querySelectorAll('th').forEach((th) => {
                if (th.textContent === "LIC_NAME") {
                    const nameElement = th.nextElementSibling;
                    name = nameElement ? nameElement.textContent || '' : '';
                }
            });

            const coordinates = feature.geometry.coordinates;
            if (coordinates && coordinates.length >= 2) {
                const loc = new LocationEntity(coordinates[1], coordinates[0]);
                if (!supermarkets.some(s => s.equals(loc))) {
                    supermarkets.push(new SupermarketEntity(name, loc));
                }
            }
        });

        return supermarkets;
    }

    /**
     * Extracts clinic entities from the GeoJSON dataset.
     * 
     * @param data - The GeoJSON data representing clinics.
     * @returns An array of `ClinicEntity` objects.
     */
    async getClinics(data: GeoJsonData): Promise<ClinicEntity[]> {
        const clinics: ClinicEntity[] = [];
        const parser = new DOMParser();

        data?.features.forEach((feature) => {
            const doc = parser.parseFromString(feature.properties.Description, 'text/html');
            let name = '';
            doc.querySelectorAll('th').forEach((th) => {
                if (th.textContent === "HCI_NAME") {
                    const nameElement = th.nextElementSibling;
                    name = nameElement ? nameElement.textContent || '' : '';
                }
            });

            const coordinates = feature.geometry.coordinates;
            if (coordinates && coordinates.length >= 2) {
                const loc = new LocationEntity(coordinates[1], coordinates[0]);
                if (!clinics.some(s => s.equals(loc))) {
                    clinics.push(new ClinicEntity(name, loc));
                }
            }
        });

        return clinics;
    }

    /**
     * Retrieves the scoring results for the current selected criteria.
     * 
     * @returns {Map<CriteriaType, ScoringResult>} The map of criteria types to scoring results.
     */
    public getScoringResults(): Map<CriteriaType, ScoringResult> {
        return this.proximityScorer.getResults();
    }

    /**
     * Sets the selected location for which the report will be generated.
     * 
     * @param {LocationEntity} location - The primary location for report generation.
     */
    public setSelectedLocation(location: LocationEntity | null) {
        this.selectedLocation = location;
    }

    /**
     * Sets an alternative location for comparison in the report generation.
     * 
     * @param {LocationEntity} location - The secondary location for comparison.
     */
    public setSelectedLocationOther(location: LocationEntity | null) {
        this.selectedLocationOther = location;
    }

    /**
     * Sets the criteria entity used for scoring in report generation.
     * 
     * @param {CriteriaEntity} criteria - The criteria used for report scoring.
     */
    public setSelectedCriteria(criteria: CriteriaEntity) {
        this.selectedCriteria = criteria;
    }

    /**
     * Retrieves the selected primary location for the report.
     * 
     * @returns {LocationEntity | null} The selected primary location, or `null` if none is set.
     */
    public getSelectedLocation(): LocationEntity | null {
        return this.selectedLocation;
    }

    /**
     * Retrieves the selected secondary location for comparison.
     * 
     * @returns {LocationEntity | null} The selected secondary location, or `null` if none is set.
     */
    public getSelectedLocationOther(): LocationEntity | null {
        return this.selectedLocationOther;
    }

    /**
     * Retrieves the selected criteria for scoring the report.
     * 
     * @returns {CriteriaEntity | null} The criteria for report scoring, or `null` if none is set.
     */
    public getSelectedCriteria(): CriteriaEntity | null {
        return this.selectedCriteria;
    }

    /**
     * Retrieves the initial report result for the primary location.
     * 
     * @returns {Map<CriteriaType, ScoringResult> | null} The scoring results for the primary location.
     */
    public getInitialResult(): Map<CriteriaType, ScoringResult> | null {
        return this.reportResult;
    }

    /**
     * Retrieves the report result for the secondary location.
     * 
     * @returns {Map<CriteriaType, ScoringResult> | null} The scoring results for the secondary location.
     */
    public getOtherResult(): Map<CriteriaType, ScoringResult> | null {
        return this.reportResultOther;
    }

    /**
     * Retrieves the final crib fit rating calculated for the primary location.
     * 
     * @returns {number} The calculated crib fit rating for the primary location.
     */
    public getCribFitRating(): number {
        return this.cribFitRating;
    }

    /**
     * Retrieves the final crib fit rating calculated for the secondary location.
     * 
     * @returns {number} The calculated crib fit rating for the secondary location.
     */
    public getCribFitRatingOther(): number {
        return this.cribFitRatingOther;
    }

    /**
     * Clears all report results, ratings, and selected secondary location.
     */
    public clearReportResults(): void {
        this.reportResult = null;
        this.cribFitRating = 0;
        this.reportResultOther = null;
        this.cribFitRatingOther = 0;
        this.selectedLocationOther = null;
    }
}

export default ReportController;
