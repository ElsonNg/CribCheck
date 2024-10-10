"use client"

import { useMasterController } from "@/context/master-controller-context";
import { ScreenState } from "@/lib/control/master-controller";
import { useEffect } from "react";
import { PuffLoader } from "react-spinners";


export default function ReportGenerationScreen() {

    const masterController = useMasterController();
    
    useEffect(() => {
        setTimeout(() => {
            if(masterController.getCurrentState() == ScreenState.GeneratingReport)
                masterController.goToNextState();
        }, 3000);
    }, [masterController]);

    return (<div className="w-[80%] p-12 flex flex-col justify-start items-start gap-4">
        <h1 className="font-bold text-3xl">Generating Your CribFit Report</h1>
        <span className="text-lg">Churning the numbers...</span>
        <div className="w-full mt-12 flex flex-col justify-center items-center">
            <PuffLoader loading={true} size={64} aria-label="Loading Spinner"/>
        </div>
    </div>)
}