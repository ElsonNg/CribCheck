"use client"

import { useMasterController } from "@/context/master-controller-context";
import { ScreenState } from "@/lib/control/master-controller";
import SelectLocationScreen from "./select-location-screen";
import SelectCriteriaScreen from "./select-criteria-screen";
import ReportGenerationScreen from "./report-generation-screen";
import ReportResultsScreen from "./report-results-screen";
import { useEffect, useState } from "react";

export default function ScreenContent() {

    // Retrieve the master controller instance using a custom hook
    const {masterController} = useMasterController();

    // Local state to keep track of the current screen state
    const [screenState, setScreenState] = useState<ScreenState>(ScreenState.SelectingLocation);

    // Set the callback in the master controller to update 'screenState' whenever it changes in the controller.
    // This useEffect runs on component mount and when the 'masterController' changes.
    useEffect(() => {
        // The setOnStateChangeCallback allows the master controller to notify the component
        // when the state changes, triggering a re-render with the updated screen state.
        masterController.setOnStateChangeCallback(setScreenState);
        // Initialized with the default state 'SelectingLocation'
        masterController.setState(ScreenState.SelectingLocation);
    }, [masterController]);

    // An empty effect that depends on 'screenState' to trigger a re-render.
    useEffect(() => {}, [screenState]);

    // Conditionally render different screen components based on the current screen state.
    // This determines what screen the user sees depending on the app's flow.
    if (screenState == ScreenState.SelectingLocation)
        return (<SelectLocationScreen />);
    else if (screenState == ScreenState.SelectingCriteria)
        return (<SelectCriteriaScreen />);
    else if (screenState == ScreenState.GeneratingReport)
        return (<ReportGenerationScreen />);
    else if (screenState == ScreenState.ViewReport)
        return (<ReportResultsScreen />);

    // Fallback UI in case of an unhandled or unknown state.
    return (<div>Unhandled Screen State.</div>);
}
