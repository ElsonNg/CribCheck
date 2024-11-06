import { CriteriaThresholds, CriteriaType, CriteriaVariety } from "@/lib/entities/criteria-entity";
import ClinicEntity from "@/lib/entities/datasets/clinic-entity";
import HawkerCentreEntity from "@/lib/entities/datasets/hawker-centre-entity";
import MRTStationEntity from "@/lib/entities/datasets/mrt-station-entity";
import SchoolEntity from "@/lib/entities/datasets/school-entity";
import SupermarketEntity from "@/lib/entities/datasets/supermarket-entity";
import LocationEntity from "@/lib/entities/location/location-entity";
import { useEffect, useState } from "react";


interface ReportDataCardProps {
    className?: string;
    criteriaType: CriteriaType;
    queriedLocation: LocationEntity;
    locations: LocationEntity[];
    title: string;
    componentScore: number;
    children?: React.ReactNode;

}

export default function ReportDataCard({ className, children, criteriaType, title, queriedLocation, locations, componentScore }: ReportDataCardProps) {

    const [firstIndex, setFirstIndex] = useState<number>(-1);

    // Function to get the rating symbol based on componentScore
    function getRating(score: number) {
        if (score >= 100) {
            return "😊"; // Green circle for 100
        } else if (score >= 50) {
            return "😐"; // Orange circle for 50
        } else {
            return "😞"; // Gray circle for other scores
        }
    }

    function getName(location: LocationEntity) {
        if (criteriaType === CriteriaType.proximityToHawkerCentres)
            return (location as HawkerCentreEntity).getName();
        else if (criteriaType === CriteriaType.proximityToMRT)
            return (location as MRTStationEntity).getName();
        else if (criteriaType === CriteriaType.proximityToClinic)
            return (location as ClinicEntity).getName();
        else if (criteriaType === CriteriaType.proximityToSchool)
            return (location as SchoolEntity).getName();
        else if (criteriaType === CriteriaType.proximityToSupermarket)
            return (location as SupermarketEntity).getName();
        return "";
    }



    const thresholds = CriteriaThresholds[criteriaType];

    useEffect(() => {
        let index = -1;
        for (let i = 0; i < thresholds.length; i++) {
            const loc = locations.filter((location) => location.distanceToKilometres(queriedLocation) <= thresholds[i]);
            if (loc.length >= 1) {
                index = i;
                break;
            }
        }
        setFirstIndex(index);
    }, [locations, queriedLocation, thresholds]);




    return (<div className="animate-fadeInUp px-6 py-4 flex flex-col md:flex-row justify-start items-center gap-8 bg-[#EEEEEE] rounded-md">
        <div className="basis-[20%] md:basis-[10%]">
            {children}
        </div>
        <div className="basis-[60%] md:basis-[80%] flex flex-col justify-center items-start gap-2">
            <span className="text-xl font-bold">{title}</span>
            <div className="flex flex-col gap-2">
                {locations.length == 0 ? (<span className="text-md font-normal text-red-600">There are no nearby locations that are convenient.</span>) :


                    (firstIndex !== -1 && (<>
                        {firstIndex > 0 && componentScore < 100 && (<div className="font-normal text-red-600">There are no nearby locations within {thresholds[firstIndex - 1]} km away.</div>)}
                        {thresholds.slice(firstIndex).map((threshold, index) => {

                            const actualIndex = firstIndex + index;

                            const loc = locations.filter((location) => {
                                const l1 = location.distanceToKilometres(queriedLocation) <= threshold;
                                if (index == 0)
                                    return l1;
                                else
                                    return l1 && location.distanceToKilometres(queriedLocation) > thresholds[actualIndex - 1];
                            });


                            return (
                                <div key={actualIndex} className="w-full">
                                    {actualIndex == firstIndex && componentScore >= 100 && (<div className="font-normal text-green-600 mb-2">Great! There are {loc.length} locations within {thresholds[actualIndex]} km away.</div>)}
                                    <div className="mb-1">
                                        <div key={actualIndex} className="text-md font-semibold">
                                            <span className="text-md">Within {threshold < 1 ? (`${threshold * 1000}m`) : `${threshold}km`}</span>: <span className="font-normal"> {loc.length == 0 ? "None" : `${loc.length} location(s)`}</span>
                                        </div>
                                        <ul className="mt-2 text-md font-normal flex flex-col gap-0.5 list-disc list-inside">
                                            {loc.map((l, index) => {
                                                return (<li key={index}>{getName(l)} <span className="ml-0.5 text-gray-800 font-semibold text-md">{l.distanceToMetres(queriedLocation!).toFixed()}m</span></li>)
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </>))}



            </div>
        </div>
        <div className="basis-[20%] md:basis-[10%] text-end">
            <span className="font-bold text-2xl">
                {getRating(componentScore)}
            </span>
        </div>
    </div>)
}