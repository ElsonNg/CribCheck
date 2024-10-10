
"use client"

import { useMasterController } from "@/context/master-controller-context";
import { ScreenState } from "@/lib/control/master-controller";
import { useEffect } from "react";


export default function TestScreenButtons() {
    const masterController = useMasterController();

    function handlePrevious() {
        masterController.goToPreviousState();
    }

    function handleNext() {
        masterController.goToNextState();
    }

    function handleReset() {
        masterController.setState(ScreenState.SelectingLocation);
    }

    return (
        <div className="flex flex-row items-center gap-6 p-6 border-gray-400 border-2 rounded-lg">
            <span>{masterController.getCurrentState()}</span>
            <div className="flex flex-row items-center gap-2">
                <button type="button" disabled={!masterController.canGoToPrevious()} onClick={handlePrevious} className="bg-black rounded-md px-4 py-2 text-white disabled:bg-red-600 disabled:opacity-40">Previous</button>
                <button type="button" disabled={!masterController.canGoToNext()} onClick={handleNext} className="bg-black rounded-md px-4 py-2 text-white disabled:bg-red-600 disabled:opacity-40">Next</button>
                <button type="button" onClick={handleReset} className="bg-black rounded-md px-4 py-2 text-white">Reset</button>
            </div>
        </div>)
}