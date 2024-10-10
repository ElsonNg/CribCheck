import { useMasterController } from "@/context/master-controller-context";
import TestScreenButtons from "@/components/ui/test-screen-buttons";
import Card from "@/components/general/card";
import ReportCriteriaRating from "@/components/report/report-criteria-rating";


export default function ReportResultsScreen() {

    const masterController = useMasterController();

    return (<div className="w-[90%] p-12 flex flex-col justify-start items-start gap-6">
        <h1 className="font-bold text-4xl">Your Report Is Ready! 🎊🎊</h1>
        <div className="w-full  p-6 grid grid-cols-2 gap-4 bg-white drop-shadow-md rounded-lg">
            <Card className="col-span-1 flex flex-col gap-6">
                <h3 className="font-semibold text-2xl">🗣️ Criteria</h3>
                <div className="flex flex-col gap-2">
                    <ReportCriteriaRating label="Near an MRT station" stars={5} />
                    <ReportCriteriaRating label="Near a hospital" stars={3} />
                    <ReportCriteriaRating label="Near schools" stars={1} />
                </div>
            </Card>
            <Card className="col-span-1">
                Map
            </Card>
            <Card className="col-span-2 flex flex-col gap-8">
                <div className="flex flex-row justify-between gap-2">
                    <h3 className="font-semibold text-2xl">📑 Crib Report</h3>
                </div>
                <div className="flex flex-row justify-start items-center gap-8">
                    <h4 className="font-semibold text-4xl">CribFit Score</h4>
                    <span className="font-bold text-7xl text-green-600">50</span>
                </div>
            </Card>
        </div>
        <TestScreenButtons />
    </div>)
}