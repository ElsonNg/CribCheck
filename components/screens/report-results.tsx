import { useMasterController } from "@/context/master-controller-context";
import { ScreenState } from "@/lib/control/master-controller";
import { useState } from "react";
import ReportAddComparisonDialog from "./report-add-comparison-dialog";
import SearchLocation from "../searchlocation/search-location";
import { CriteriaType } from "@/lib/entities/criteria-entity";
import { IoRestaurant } from "react-icons/io5";
import { FaTrain } from "react-icons/fa6";
import { FaClinicMedical } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import MRTStationEntity from "@/lib/entities/datasets/mrt-station-entity";
import ClinicEntity from "@/lib/entities/clinic-entity";
import HawkerCentreEntity from "@/lib/entities/datasets/hawker-centre-entity";
import SchoolEntity from "@/lib/entities/datasets/school-entity";


export default function ReportResults() {

    const masterController = useMasterController();
    const reportController = masterController.getReportController();
    const [showAddComparisonDialog, setShowAddComparisonDialog] = useState<boolean>(false);

    const queriedLocation = reportController.getSelectedLocation();
    const initialResult = reportController.getInitialResult();

    const nearbyHawkers = initialResult ? initialResult.get(CriteriaType.proximityToHawkerCentres)?.getValidLocations().filter((l) => queriedLocation!.distanceToKilometres(l) <= 0.300) : [];
    const nearbyMRT = initialResult ? initialResult.get(CriteriaType.proximityToMRT)?.getValidLocations().filter((l) => queriedLocation!.distanceToKilometres(l) <= 0.800) : [];
    const nearbyClinics = initialResult ? initialResult.get(CriteriaType.proximityToClinic)?.getValidLocations().filter((l) => queriedLocation!.distanceToKilometres(l) <= 0.500) : [];
    const nearbySchools = initialResult ? initialResult.get(CriteriaType.proximityToSchool)?.getValidLocations().filter((l) => queriedLocation!.distanceToKilometres(l) <= 1.00) : [];

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
        <div className="flex flex-col gap-8">
            <div className="flex flex-row justify-between gap-2">
                <h3 className="font-semibold text-2xl">📑 Crib Report</h3>
                <button type="button" onClick={handleAddComparison}
                    className="group text-white bg-[#5A76FF] rounded py-2 px-4 flex flex-row items-center justify-center gap-2 self-end">
                    Add Comparison
                </button>
            </div>

            <div className="text-xl font-bold">Searched Location<br /><span className="font-normal">{reportController.getSelectedLocation()?.address}</span></div>

            <div className="flex flex-col gap-6">
                <h4 className="font-semibold text-2xl">CribFit Score</h4>
                <div className="flex flex-row items-center gap-6">
                    <span className="font-bold text-7xl text-green-600">{reportController.getCribFitRating().toFixed()}</span><span className="text-3xl font-normal">/100</span>
                </div>
            </div>

            {initialResult && (<div className="flex flex-col gap-4">
                {nearbyHawkers && nearbyHawkers.length > 0
                    && (<div className="px-6 py-4 flex flex-row justify-start items-center gap-8 bg-[#EEEEEE] rounded-md">
                        <IoRestaurant size={32} className="basis-[10%]" />
                        <div className="basis-[90%] flex flex-col justify-center items-start gap-0.5">
                            <span className="text-lg font-bold">Near to Hawker Centres (300m)</span>
                            <span className="text-md font-medium">{nearbyHawkers.length} location(s)</span>
                            <span className="text-md font-medium">{nearbyHawkers.map((l) => (l as HawkerCentreEntity).getName()).join(", ")}</span>

                        </div>
                    </div>)
                }
                {nearbyMRT && nearbyMRT.length > 0
                    && (<div className="px-6 py-4 flex flex-row justify-start items-center gap-8 bg-[#EEEEEE] rounded-md">
                        <FaTrain size={32} className="basis-[10%]" />
                        <div className="basis-[90%] flex flex-col justify-center items-start gap-0.5">
                            <span className="text-lg font-bold">Near to MRT Stations (800m)</span>
                            <span className="text-md font-medium">{nearbyMRT.length} location(s)</span>
                            <span className="text-md font-medium">{nearbyMRT.map((l) => (l as MRTStationEntity).getName()).join(", ")}</span>
                        </div>
                    </div>)
                }
                {nearbyClinics && nearbyClinics.length > 0
                    && (<div className="px-6 py-4 flex flex-row justify-start items-center gap-8 bg-[#EEEEEE] rounded-md">
                        <FaClinicMedical size={32} className="basis-[10%]" />
                        <div className="basis-[90%] flex flex-col justify-center items-start gap-0.5">
                            <span className="text-lg font-bold">Near to Clinics (500m)</span>
                            <span className="text-md font-medium">{nearbyClinics.length} location(s)</span>
                            <span className="text-md font-medium">{nearbyClinics.map((l) => (l as ClinicEntity).getName()).join(", ")}</span>
                        </div>
                    </div>)
                }
                {nearbySchools && nearbySchools.length > 0
                    && (<div className="px-6 py-4 flex flex-row justify-start items-center gap-8 bg-[#EEEEEE] rounded-md">
                        <MdSchool size={32} className="basis-[10%]" />
                        <div className="basis-[90%] flex flex-col justify-center items-start gap-0.5">
                            <span className="text-lg font-bold">Near to Schools (1km)</span>
                            <span className="text-md font-medium">{nearbySchools.length} location(s)</span>
                            <span className="text-md font-medium">{nearbySchools.map((l) => (l as SchoolEntity).getName()).join(", ")}</span>

                        </div>
                    </div>)
                }
            </div>)}
            {showAddComparisonDialog && (<ReportAddComparisonDialog onCompare={handleFinishComparison}
                onCancel={handleCancelComparison}>
                <SearchLocation />
            </ReportAddComparisonDialog>)}
        </div>
    );
}