import { useMasterController } from "@/context/master-controller-context";
import Card from "@/components/general/card";
import ReportCriteriaRating from "@/components/report/report-criteria-rating";
import { CriteriaLabels } from "@/lib/entities/criteria-entity";
import CriteriaScoreTable from "../report/criteria-score-table";
import { ScreenState } from "@/lib/control/master-controller";
import ReportMap from "../report/report-map";
import ReportResults from "../report/report-results";
import { CiHeart  } from "react-icons/ci";




export default function ReportResultsScreen() {

    const masterController = useMasterController();
    const reportController = masterController.getReportController();
    const criteriaController = masterController.getCriteriaController();
    const critieraMap = criteriaController.getCriteriaEntity().getCriteriaRankingMap();
    const scoringResults = reportController.getScoringResults();

    function handleRestart() {
        masterController.setState(ScreenState.SelectingLocation);
    }

    function handleSaveCriteria() {

    }


    return (<div className="w-[90%] p-12 flex flex-col justify-start items-start gap-6">
        <h1 className="font-bold text-4xl">Your Report Is Ready! 🎊🎊</h1>
        <div className="w-full  p-6 grid grid-cols-6 gap-4 bg-white drop-shadow-md rounded-lg">
            <Card className="col-span-2 flex flex-col gap-6">
                <div className="w-full flex flex-row justify-between items-center">
                    <h3 className="font-semibold text-2xl">🗣️ Criteria</h3>
                    <button type="button" onClick={handleSaveCriteria}
                        className="group text-black bg-gray-50 hover:opacity-90 hover:text-black/60 border rounded py-2 px-3 flex flex-row items-center justify-center gap-2 self-end">
                        <CiHeart size={24} />
                        <span>Save</span>
                    </button>

                </div>

                <div className="flex flex-col gap-2">
                    {critieraMap && Array.from(critieraMap.entries()).map(([criteraType, value]) => {
                        return (
                            <ReportCriteriaRating key={criteraType} label={CriteriaLabels[criteraType]} stars={value} />
                        );
                    })}
                </div>

            </Card>
            <Card className="col-span-3">
                <ReportMap />
            </Card>
            <Card className="col-span-6">
                <ReportResults />
            </Card>
            <Card className="col-span-6">
                {/* <ReportResults /> */}
            </Card>
            <Card className="col-span-6 flex flex-col gap-8">
                <CriteriaScoreTable scoringResults={scoringResults} />
            </Card>
        </div >
        <div className="text-lg mx-auto underline cursor-pointer hover:opacity-60" onClick={handleRestart}>
            Start Over
        </div>

    </div >)
}