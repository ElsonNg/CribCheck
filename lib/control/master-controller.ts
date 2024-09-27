import FirebaseAuthService from "@/lib/boundary/implementation/firebase-auth-service";
import AuthController from "@/lib/control/auth-controller";
import ReportController from "@/lib/control/report-controller";



export enum ScreenState {
    SelectingLocation = "SELECTING_LOCATION",
    SelectingCriteria = "SELECTING_CRITERIA",
    GeneratingReport = "GENERATING_REPORT",
    ReportGenerated = "REPORT_GENERATED",
}


/**
 * The `MasterController` class provides centralized access to key application controllers
 * such as `AuthController` and `ReportController`. It follows the Singleton pattern, 
 * ensuring a single instance throughout the application. It uses **Dependency Injection (DI)** 
 * to inject services like `AuthService` into the respective controllers.
 * 
 * @class MasterController
 */

class MasterController {

    private authController: AuthController;
    private reportController: ReportController;

    private currentState: ScreenState;

    constructor() {

        // Injecting `FirebaseAuthService` via Dependency Injection into `AuthController`.
        this.authController = new AuthController(new FirebaseAuthService());
        this.reportController = new ReportController();

        this.currentState = ScreenState.SelectingLocation;
    }

    /**
     * Retrieves the `AuthController` instance.
     * 
     * @returns {AuthController} The `AuthController` instance.
     */
    public getAuthController(): AuthController {
        return this.authController;
    }

    /**
     * Retrieves the `ReportController` instance.
     * 
     * @returns {ReportController} The `ReportController` instance.
     */
    public getReportController(): ReportController {
        return this.reportController;
    }

    /**
 * Retrieves the current screen state.
 * 
 * @returns {ScreenState} The current state of the process.
 */
    public getCurrentState(): ScreenState {
        return this.currentState;
    }

    /**
   * Allows setting a specific process state (for dynamic flow control).
   * 
   * @param state - The desired state to set.
   */
    public setState(state: ScreenState): void {
        this.currentState = state;
    }

    /**
     * Transitions to the next state in the process flow.
    */
    public goToNextState(): void {
        switch (this.currentState) {
            case ScreenState.SelectingCriteria:
                this.currentState = ScreenState.SelectingLocation;
                break;
            case ScreenState.SelectingLocation:
                this.currentState = ScreenState.GeneratingReport;
                break;
            case ScreenState.GeneratingReport:
                this.currentState = ScreenState.ReportGenerated;
                break;
            case ScreenState.ReportGenerated:
                this.currentState = ScreenState.SelectingCriteria; // Reset if needed
                break;
            default:
                throw new Error("Invalid state transition");
        }
    }

    /**
    * Transition to the previous state in the process flow.
    */
    public goToPreviousState(): void {
        switch (this.currentState) {
            case ScreenState.SelectingLocation:
                this.currentState = ScreenState.SelectingCriteria;
                break;
            case ScreenState.GeneratingReport:
                this.currentState = ScreenState.SelectingLocation;
                break;
            case ScreenState.ReportGenerated:
                this.currentState = ScreenState.GeneratingReport;
                break;
            case ScreenState.SelectingCriteria:
                // No previous state before the initial state
                console.warn("Already at the initial state");
                break;
            default:
                throw new Error("Unknown state transition");
        }
    }
}

export default MasterController;