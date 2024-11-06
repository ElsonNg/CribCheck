import { useState } from "react";
import ReportAddComparisonDialog from "../screens/report-add-comparison-dialog";
import SearchLocation from "../searchlocation/search-location";
import { ScreenState } from "@/lib/control/master-controller";
import { useMasterController } from "@/context/master-controller-context";
import LocationEntity from "@/lib/entities/location/location-entity";



export default function ReportAddComparison() {

    const { masterController } = useMasterController();
    const reportController = masterController.getReportController();

    const [showAddComparisonDialog, setShowAddComparisonDialog] = useState<boolean>(false);
    const [location, setLocation] = useState<LocationEntity | null>(null);

    function handleOnChange(location: LocationEntity | null) {
        setLocation(location);
    }

    // Cancel comparison
    function handleCancelComparison() {
        setShowAddComparisonDialog(false);
    }

    // After comparing, generate a new report with both locations
    function handleFinishComparison() {
        if (masterController.getCurrentState() !== ScreenState.ViewReport) return;
        reportController.clearReportResults();
        reportController.setSelectedLocationOther(location);
        masterController.setState(ScreenState.GeneratingReport);
        setShowAddComparisonDialog(false);
    }

    // Add a new comparison by showing the comparison dialog
    function handleAddComparison() {
        setShowAddComparisonDialog(true);
    }

    return (
        <>
            <button type="button" onClick={handleAddComparison}
                className="w-full md:w-fit group text-white bg-[#5A76FF] rounded py-2 px-4 flex flex-row items-center justify-center gap-2 self-end">
                {reportController.getSelectedLocationOther() ? "Change Comparison" : "Add Comparison"}
            </button>
            {showAddComparisonDialog && (<ReportAddComparisonDialog onCancel={handleCancelComparison}>
                <SearchLocation onChange={handleOnChange} />
                <div className="mt-6 flex justify-end">
                    <button
                        className="bg-black hover:bg-black/80 text-white px-4 py-2 rounded-md "
                        onClick={handleCancelComparison}
                    >
                        Cancel
                    </button>
                    <button className="text-white px-4 py-2 ml-3 rounded-md bg-[#5A76FF] disabled:opacity-50"
                        disabled={!location}
                        onClick={handleFinishComparison}>
                        Compare
                    </button>
                </div>
            </ReportAddComparisonDialog>)}
        </>
    );
}