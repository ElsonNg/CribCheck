import { useState } from "react";
import ReportAddComparisonDialog from "../screens/report-add-comparison-dialog";
import SearchLocation from "../searchlocation/search-location";
import { ScreenState } from "@/lib/control/master-controller";
import { useMasterController } from "@/context/master-controller-context";



export default function ReportAddComparison() {

    const masterController = useMasterController();
    const reportController = masterController.getReportController();

    const [showAddComparisonDialog, setShowAddComparisonDialog] = useState<boolean>(false);


    function handleCancelComparison() {
        setShowAddComparisonDialog(false);
    }

    function handleFinishComparison() {
        if (masterController.getCurrentState() !== ScreenState.ViewReport) return;
        masterController.setState(ScreenState.GeneratingReport);
        setShowAddComparisonDialog(false);
    }


    function handleAddComparison() {
        setShowAddComparisonDialog(true);
    }

    return (
        <>
            <button type="button" onClick={handleAddComparison}
                className="group text-white bg-[#5A76FF] rounded py-2 px-4 flex flex-row items-center justify-center gap-2 self-end">
                {reportController.getSelectedLocationOther() ? "Change Comparison" : "Add Comparison"}
            </button>
            {showAddComparisonDialog && (<ReportAddComparisonDialog onCompare={handleFinishComparison}
                onCancel={handleCancelComparison}>
                <SearchLocation />
            </ReportAddComparisonDialog>)}
        </>
    );
}