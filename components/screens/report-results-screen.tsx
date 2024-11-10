import { useMasterController } from "@/context/master-controller-context";
import Card from "@/components/general/card";
import ReportCriteriaRating from "@/components/report/report-criteria-rating";
import { CriteriaLabels } from "@/lib/entities/criteria-entity";
import { ScreenState } from "@/lib/control/master-controller";
import ReportMap from "../report/report-map";
import ReportResults from "../report/report-results";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { useEffect, useState, useTransition } from "react";
import Confetti from "react-confetti-boom";
import ReportAddComparison from "../report/report-add-comparison";
import ReportGuide from "../report/report-guide";




export default function ReportResultsScreen() {

    const { masterController, currentUser } = useMasterController();

    const reportController = masterController.getReportController();
    const criteriaController = masterController.getCriteriaController();
    const profileController = masterController.getProfileController();

    const current = criteriaController.getCriteriaEntity();
    const critieraMap = current.getCriteriaRankingMap();
    const customPreset = current.getCustom();

    const userProfile = profileController.getProfile();
    const [isPending, startTransition] = useTransition();

    const [showConfetti, setShowConfetti] = useState<boolean>(true);

    useEffect(() => {
        // Set a timeout to hide confetti after 3 seconds (adjust as needed)
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 5000); // 3000 ms = 3 seconds

        // Cleanup the timer if the component unmounts
        return () => clearTimeout(timer);
    }, []);

    function handleRestart() {
        masterController.setState(ScreenState.SelectingLocation);
    }

    async function handleSavePreset() {
        if (!currentUser || !current) return;
        startTransition(() => {
            if (userProfile.hasPreset(current)) {
                profileController.removeSavedPreset(currentUser, current);
            } else {
                profileController.savePreset(currentUser, current);
            }
        });
    }


    return (
        <>
            <div className="absolute top-0 left-0 z-50 pointer-events-none">
                {showConfetti && <Confetti mode="boom" deg={90} spreadDeg={300} launchSpeed={1} shapeSize={12} particleCount={100} colors={['#ff577f', '#ff884b']} />}
            </div>
            <div className="animate-fadeIn w-full md:w-[90%] p-4 md:p-12 flex flex-col justify-start items-start gap-6">
                <div className="w-full flex flex-row justify-center md:justify-start items-center gap-6">
                    <div className="group hidden md:flex flex-row justify-start items-center gap-1 cursor-pointer" onClick={handleRestart}>
                        <MdKeyboardArrowLeft size={32} color="gray" />
                    </div>
                    <h1 className="font-bold text-2xl md:text-4xl relative text-center">Your Report Is Ready! 🎊🎊</h1>

                </div>
                <div className="w-full p-4 grid grid-cols-6 gap-4 bg-white drop-shadow-md rounded-lg">
                    <Card className="col-span-6 md:col-span-3 flex flex-col gap-6">
                        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
                            <h3 className="font-semibold text-2xl">📋  {criteriaController.getCriteriaEntity().getName()}</h3>
                            {currentUser && customPreset && (<button type="button" onClick={handleSavePreset}
                                className="w-full md:w-fit group text-black bg-gray-50 hover:opacity-90 hover:text-black/60 border rounded py-2 px-3 flex flex-row items-center justify-center gap-2 self-end">
                                {userProfile.hasPreset(current) ? <GoHeartFill size={16} /> : <GoHeart size={16} />}
                                <span>{userProfile.hasPreset(current) ? "Remove Saved Preset " : "Save Preset"}</span>
                            </button>)}

                        </div>

                        <div className="flex flex-col gap-2">
                            {critieraMap && Array.from(critieraMap.entries()).map(([criteraType, value]) => {
                                return (
                                    <ReportCriteriaRating key={criteraType} label={CriteriaLabels[criteraType]} stars={value} />
                                );
                            })}
                        </div>

                    </Card>
                    <Card className="col-span-6 md:col-span-3">
                        <ReportMap />
                    </Card>
                    <Card className="col-span-6">
                        <div className="flex flex-col gap-8">

                            <div className="flex flex-col">
                                <div className="flex flex-col md:flex-row justify-between gap-2">
                                    <h3 className="font-semibold text-2xl">📑 Crib Report</h3>
                                    <ReportAddComparison />
                                </div>
                                <ReportGuide/>
                            </div>

                            {reportController.getSelectedLocationOther() ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <Card className="col-span-2 lg:col-span-1">
                                        <ReportResults
                                            queriedLocation={reportController.getSelectedLocation()!}
                                            cribFitRating={reportController.getCribFitRating()}
                                            results={reportController.getInitialResult()!} />

                                    </Card>
                                    <Card className="col-span-2 lg:col-span-1">
                                        <ReportResults
                                            queriedLocation={reportController.getSelectedLocationOther()!}
                                            cribFitRating={reportController.getCribFitRatingOther()}
                                            results={reportController.getOtherResult()!} />

                                    </Card>
                                </div>) :
                                <ReportResults queriedLocation={reportController.getSelectedLocation()!}
                                    cribFitRating={reportController.getCribFitRating()}
                                    results={reportController.getInitialResult()!} />}
                        </div>
                    </Card>

                </div>
                <div className="text-lg font-medium mx-auto underline cursor-pointer hover:opacity-60" onClick={handleRestart}>
                    Start Over
                </div>

            </div >
        </>)
}