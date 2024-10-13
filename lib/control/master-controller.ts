import FirebaseAuthService from "@/lib/boundary/implementation/firebase-auth-service";
import AuthController from "@/lib/control/auth-controller";
import ReportController from "@/lib/control/report-controller";
import GovtDatasetService from "@/lib/boundary/implementation/govt-dataset-service";
import LocationController from "@/lib/control/location-controller";
import GoogleLocationService from "@/lib/boundary/implementation/google-location-service";
import CriteriaController from "./criteria-controller";

/**
 * Enum representing the possible screen states in the application.
 */
export enum ScreenState {
    SelectingLocation = "SELECTING_LOCATION",
    SelectingCriteria = "SELECTING_CRITERIA",
    GeneratingReport = "GENERATING_REPORT",
    ViewReport = "VIEW_REPORT",
}

/**
 * The `MasterController` class provides centralized access to key application controllers
 * such as `AuthController` and `ReportController`. It follows the Singleton pattern, 
 * ensuring a single instance throughout the application. It uses **Dependency Injection (DI)** 
 * to inject services like `AuthService` into the respective controllers. 
 * This class also manages the flow between different screen states.
 *
 * @class MasterController
 */
class MasterController {

    private authController: AuthController;
    private reportController: ReportController;
    private locationController: LocationController;
    private criteriaController: CriteriaController;

    private currentState: ScreenState;
    private onStateChangeCallback?: (state: ScreenState) => void;

    /**
     * Constructor for `MasterController` which initializes `AuthController` and `ReportController`.
     * It sets the initial state of the application to `SelectingLocation`.
     */
    constructor() {
        // Injecting `FirebaseAuthService` via Dependency Injection into `AuthController`.
        this.authController = new AuthController(new FirebaseAuthService());

        // Initialize the `ReportController` with the required government dataset service.
        const hawkerCentresDatasetId = "d_4a086da0a5553be1d89383cd90d07ecd";

        // TODO: Initialize the dataset with the correct id
        // TODO: Nick (Step 2) 
        // TODO: Joyce (Step 2)
        // TODO: Jody (Step 2)
        // TODO: Angel (Step 2)
        const transportDatasetId = "";
        const schoolTransportDatasetId = "";
        const supermarketTransportDatasetId = "";
        const clinicTransportDatasetId = "";

        this.reportController = new ReportController(new GovtDatasetService(hawkerCentresDatasetId),
            new GovtDatasetService(transportDatasetId),
            new GovtDatasetService(schoolTransportDatasetId),
            new GovtDatasetService(supermarketTransportDatasetId),
            new GovtDatasetService(clinicTransportDatasetId));



        // Initialize the `LocationController` with the required location service.
        this.locationController = new LocationController(new GoogleLocationService());

        // Initialize the 'CriteriaController'
        this.criteriaController = new CriteriaController();

        // Set the initial state of the screen flow.
        this.currentState = ScreenState.SelectingLocation;
    }

    /**
     * Retrieves the `AuthController` instance.
     *
     * @returns {AuthController} The `AuthController` instance used for authentication management.
     */
    public getAuthController(): AuthController {
        return this.authController;
    }

    /**
     * Retrieves the `ReportController` instance.
     *
     * @returns {ReportController} The `ReportController` instance used for report generation.
     */
    public getReportController(): ReportController {
        return this.reportController;
    }


    /**
     * Retrieves the `LocationController` instance.
     *
     * @returns {LocationController} The `LocationController` instance used for location-related operations.
     */
    public getLocationController(): LocationController {
        return this.locationController;
    }

    /**
     * Retrieves the `CriteriaController` instance.
     *
     * @returns {CriteriaController} The `CriteriaController` instance used for selecting/creating criteria
     */
    public getCriteriaController(): CriteriaController {
        return this.criteriaController;
    }

    /**
     * Retrieves the current screen state.
     *
     * @returns {ScreenState} The current screen state of the process.
     */
    public getCurrentState(): ScreenState {
        return this.currentState;
    }

    /**
     * Sets a callback function to be called whenever the screen state changes.
     * This callback allows React components to update their state accordingly.
     *
     * @param callback - A function to handle state changes. It receives the new state as its parameter.
     */
    public setOnStateChangeCallback(callback: (state: ScreenState) => void): void {
        this.onStateChangeCallback = callback;
    }

    /**
     * Sets the current state to a specific screen state and triggers the state change callback.
     *
     * @param state - The new state to set.
     * @throws {Error} If the state change callback is not defined.
     */
    public setState(state: ScreenState): void {
        if (this.onStateChangeCallback === undefined)
            throw new Error("No callback set for state change events in MasterController.");

        this.currentState = state;
        this.onStateChangeCallback(state);  // Trigger the callback with the new state.
    }

    /**
     * Transitions to the next screen state in the process flow and triggers the state change callback.
     *
     * @throws {Error} If the state change callback is not defined or if an invalid transition occurs.
     */
    public goToNextState(): void {
        if (this.onStateChangeCallback === undefined)
            throw new Error("No callback set for state change events in MasterController.");

        // Determine the next state based on the current state.
        switch (this.currentState) {
            case ScreenState.SelectingLocation:
                this.currentState = ScreenState.SelectingCriteria;
                break;
            case ScreenState.SelectingCriteria:
                this.currentState = ScreenState.GeneratingReport;
                break;
            case ScreenState.GeneratingReport:
                this.currentState = ScreenState.ViewReport;
                break;
            case ScreenState.ViewReport:
                this.currentState = ScreenState.SelectingLocation; // Reset to initial state if needed.
                break;
            default:
                throw new Error("Invalid state transition");
        }

        // Trigger the state change callback with the new state.
        this.onStateChangeCallback(this.currentState);
    }

    /**
     * Transitions to the previous screen state in the process flow and triggers the state change callback.
     *
     * @throws {Error} If the state change callback is not defined or if an unknown state is encountered.
     */
    public goToPreviousState(): void {
        if (this.onStateChangeCallback === undefined)
            throw new Error("No callback set for state change events in MasterController.");

        // Determine the previous state based on the current state.
        switch (this.currentState) {
            case ScreenState.SelectingCriteria:
                this.currentState = ScreenState.SelectingLocation;
                break;
            case ScreenState.GeneratingReport:
                this.currentState = ScreenState.SelectingCriteria;
                break;
            case ScreenState.ViewReport:
                this.currentState = ScreenState.GeneratingReport;
                break;
            case ScreenState.SelectingLocation:
                // No previous state before `SelectingLocation`.
                console.warn("Already at the initial state");
                break;
            default:
                throw new Error("Unknown state transition");
        }

        // Trigger the state change callback with the new state.
        this.onStateChangeCallback(this.currentState);
    }

    /**
     * Checks whether the user can transition to the previous screen state.
     * 
     * @returns {boolean} `true` if a previous state transition is possible, `false` otherwise.
     */
    public canGoToPrevious(): boolean {
        return this.currentState !== ScreenState.SelectingLocation;
    }

    /**
     * Checks whether the user can transition to the next screen state.
     * 
     * @returns {boolean} `true` if a next state transition is possible, `false` otherwise.
     */
    public canGoToNext(): boolean {
        return this.currentState !== ScreenState.ViewReport;
    }
}

export default MasterController;
