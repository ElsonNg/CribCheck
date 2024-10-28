"use client"

import { useMasterController } from "@/context/master-controller-context";
import { CriteriaType } from "@/lib/entities/criteria-entity"
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { FaClinicMedical, FaSchool, FaShoppingCart, FaStar, FaTrain } from "react-icons/fa";
import { IoRestaurant } from "react-icons/io5";



interface CriteriaInfo {
    type: CriteriaType;
    icon: React.ReactNode;
    description: string;
}

interface CriteriaCreateFormProps {
    className?: string;
}


const CriteriaInfoList: CriteriaInfo[] = [
    {
        type: CriteriaType.proximityToHawkerCentres,
        icon: <IoRestaurant size={24} />,
        description: "Near to Hawker Centres (within 500 metres)",
    },
    {
        type: CriteriaType.proximityToMRT,
        icon: <FaTrain size={24} />,
        description: "Near to MRT Stations (within 300 metres)",
    },
    {
        type: CriteriaType.proximityToClinic,
        icon: <FaClinicMedical size={24} />,
        description: "Near to Clinics (within 5 kilometres)",
    },
    {
        type: CriteriaType.proximityToSchool,
        icon: <FaSchool size={24} />,
        description: "Near to Schools (within 1 kilometre)",
    },
    {
        type: CriteriaType.proximityToSupermarket,
        icon: <FaShoppingCart size={24} />,
        description: "Near to Supermarkets (within 1 kilometre)",
    },
];

export default function CriteriaBreakdown({ className }: CriteriaCreateFormProps) {

    const masterController = useMasterController();
    const criteriaController = masterController.getCriteriaController();

    const [criteria, setCriteria] = useState(criteriaController.getCriteriaEntity());
    const [version, setVersion] = useState(0);



    function handleSelectCriterion(criteriaType: CriteriaType, ranking: number) {

        if (criteria.getCriteriaRankingMap().has(criteriaType)) {
            criteriaController.deselectCriteron(criteriaType);
        } else {
            criteriaController.selectCriterion(criteriaType, ranking);
        }
        setCriteria(criteriaController.getCriteriaEntity());
        setVersion(prevVersion => (prevVersion == 100 ? 0 : prevVersion + 1));
    }

    function handeStarsOnClick(event: React.MouseEvent, criteriaType: CriteriaType, ranking: number) {
        event.stopPropagation();
        criteriaController.selectCriterion(criteriaType, ranking);
        setCriteria(criteriaController.getCriteriaEntity());
        setVersion(prevVersion => (prevVersion == 100 ? 0 : prevVersion + 1));
    }

    // useEffect(() => {
    //     setCriteria(criteriaController.getCriteriaEntity());
    // }, [criteriaController]);


    return (<div className={cn("flex flex-col gap-2", className)}>
        <div className="flex flex-col justify-start items-center gap-2">
            <h3 className="text-2xl font-bold">{criteria.getName()}</h3>
            {criteria.getCustom() && (<span className="text-md font-medium text-center">Choose from a list of criteria and rank them with stars (more stars = more important).<br/>Click to turn on/off a criterion.</span>)}
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
            {CriteriaInfoList.map((criteriaInfo) => {
                const isSelected = !criteria.getCustom() || criteria.getCriteriaRankingMap().has(criteriaInfo.type);
                const stars = criteria.getCriteriaRankingMap().get(criteriaInfo.type) ?? 0;
                return (
                    <div
                        key={criteriaInfo.type}
                        className={cn("w-full bg-[#EEEEEE] drop-shadow-sm border-2 rounded-md py-5 px-4 flex flex-row justify-between gap-2",
                            criteria.getCustom() ? "drop-shadow-sm" : "drop-shadow-none cursor-not-allowed",
                            {
                            "opacity-40 ": !isSelected, // Highlight if selected
                            "cursor-pointer": criteria.getCustom(),
                        },)}
                        onClick={() => criteria.getCustom() ? handleSelectCriterion(criteriaInfo.type, 1) : null} // Toggle selection
                    >
                        <div className="w-full flex flex-row justify-start items-center px-2">
                            <div className="basis-[10%]">{criteriaInfo.icon}</div>
                            <span className="basis-[90%] font-semibold">{criteriaInfo.description}</span>
                        </div>
                        <div className="flex flex-row justify-end gap-2">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} onClick={(e) => criteria.getCustom() ? handeStarsOnClick(e, criteriaInfo.type, index + 1) : null} className={cn("text-2xl", index < stars ? "text-yellow-400" : "text-gray-400")}><FaStar /></div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>)

}