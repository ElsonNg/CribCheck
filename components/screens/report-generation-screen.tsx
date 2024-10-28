"use client"

import { useMasterController } from "@/context/master-controller-context";
import { ScreenState } from "@/lib/control/master-controller";
import { useEffect, useRef } from "react";
import { PuffLoader } from "react-spinners";


export default function ReportGenerationScreen() {

    const hasStarted = useRef(false);

    const masterController = useMasterController();
    const reportController = masterController.getReportController();


    useEffect(() => {
        if (hasStarted.current) return;

        async function handleStartGenerateReport() {
            await reportController.generateReport();
            if (masterController.getCurrentState() === ScreenState.GeneratingReport) {
                masterController.goToNextState();
            }
        }

        handleStartGenerateReport();
        hasStarted.current = true;
    }, [masterController, reportController]);

    return (<div className="w-full md:w-[80%] p-12 flex flex-col justify-start items-center md:items-start gap-4">
        <h1 className="font-bold text-3xl text-center md:text-left">Generating Your CribFit Report</h1>
        <span className="text-lg">{reportController.getSelectedLocationOther() ? "Comparing both locations..." : "Churning the numbers..."}</span>
        <div className="w-full mt-12 flex flex-col justify-center items-center">
            <PuffLoader loading={true} size={64} aria-label="Loading Spinner" />
        </div>
    </div>)
}