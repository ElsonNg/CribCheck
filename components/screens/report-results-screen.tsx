import { useMasterController } from "@/context/master-controller-context";
import TestScreenButtons from "@/components/ui/test-screen-buttons";
import Card from "@/components/general/card";
import ReportCriteriaRating from "@/components/report/report-criteria-rating";
import { CriteriaLabels } from "@/lib/entities/criteria-entity";
import CriteriaScoreTable from "../report/criteria-score-table";
import { useState } from "react";
import ReportAddComparisonDialog from "./report-add-comparison-dialog";
import SearchLocation from "../searchlocation/search-location";
import { ScreenState } from "@/lib/control/master-controller";
import ReportMap from "../report/report-map";




export default function ReportResultsScreen() {

    const masterController = useMasterController();
    const reportController = masterController.getReportController();
    const criteriaController = masterController.getCriteriaController();
    const critieraMap = criteriaController.getCriteriaEntity().getCriteriaRankingMap();
    const scoringResults = reportController.getScoringResults();

    const [showAddComparisonDialog, setShowAddComparisonDialog] = useState<boolean>(false);

    function handleAddComparison() {
        setShowAddComparisonDialog(true);
    }

    function handleCancelComparison() {
        setShowAddComparisonDialog(false);
    }

    function handleFinishComparison() {
        if(masterController.getCurrentState() !== ScreenState.ViewReport) return;
        masterController.setState(ScreenState.GeneratingReport);
        setShowAddComparisonDialog(false);
    }


    return (<div className="w-[90%] p-12 flex flex-col justify-start items-start gap-6">
        <h1 className="font-bold text-4xl">Your Report Is Ready! 🎊🎊</h1>
        <div className="w-full  p-6 grid grid-cols-5 gap-4 bg-white drop-shadow-md rounded-lg">
            <Card className="col-span-2 flex flex-col gap-6">
                <h3 className="font-semibold text-2xl">🗣️ Criteria</h3>

                <div className="flex flex-col gap-2">
                    {critieraMap && Array.from(critieraMap.entries()).map(([criteraType, value]) => {
                        return (
                            <ReportCriteriaRating key={criteraType} label={CriteriaLabels[criteraType]} stars={value} />
                        );
                    })}
                </div>

            </Card>
            <Card className="col-span-3">
                <ReportMap/>
            </Card>
            <Card className="col-span-5 flex flex-col gap-8">
                <div className="flex flex-row justify-between gap-2">
                    <h3 className="font-semibold text-2xl">📑 Crib Report</h3>
                    <button type="button" onClick={handleAddComparison}
                        className="group text-white bg-[#5A76FF] rounded py-2 px-4 flex flex-row items-center justify-center gap-2 self-end">
                        Add Comparison
                    </button>
                </div>
                <div className="flex flex-row justify-start items-center gap-8">
                    <h4 className="font-semibold text-4xl">CribFit Score</h4>
                    <span className="font-bold text-7xl text-green-600">{reportController.getCribFitRating().toFixed()}</span>
                </div>
            </Card>
            <Card className="col-span-5 flex flex-col gap-8">
                <CriteriaScoreTable scoringResults={scoringResults} />
            </Card>
        </div >
        <TestScreenButtons />
        {showAddComparisonDialog && (<ReportAddComparisonDialog onCompare={handleFinishComparison}
            onCancel={handleCancelComparison}>
            <SearchLocation />
        </ReportAddComparisonDialog>)}
    </div >)
}