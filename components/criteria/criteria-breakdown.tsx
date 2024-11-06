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
        description: "Near to Hawker Centres (within 300m)",
    },
    {
        type: CriteriaType.proximityToMRT,
        icon: <FaTrain size={24} />,
        description: "Near to MRT Stations (within 300m)",
    },
    {
        type: CriteriaType.proximityToClinic,
        icon: <FaClinicMedical size={24} />,
        description: "Near to Clinics (within 1km)",
    },
    {
        type: CriteriaType.proximityToSchool,
        icon: <FaSchool size={24} />,
        description: "Near to Schools (within 1km)",
    },
    {
        type: CriteriaType.proximityToSupermarket,
        icon: <FaShoppingCart size={24} />,
        description: "Near to Supermarkets (within 300m)",
    },
];

export default function CriteriaBreakdown({ className }: CriteriaCreateFormProps) {

    const {masterController} = useMasterController();
    const criteriaController = masterController.getCriteriaController();

    const [criteria, setCriteria] = useState(criteriaController.getCriteriaEntity());
    const [_, setVersion] = useState(0);


    // Toggle criterion on and off
    function handleSelectCriterion(criteriaType: CriteriaType, ranking: number) {

        const map = criteria.getCriteriaRankingMap();
        if (map.size > 1 && map.has(criteriaType)) {
            criteriaController.deselectCriteron(criteriaType);
        } else {
            criteriaController.selectCriterion(criteriaType, ranking);
        }
        setCriteria(criteriaController.getCriteriaEntity());
        setVersion(prevVersion => (prevVersion == 100 ? 0 : prevVersion + 1));
    }

    // Update the number of stars for the selected criteria
    function handeStarsOnClick(event: React.MouseEvent, criteriaType: CriteriaType, ranking: number) {
        event.stopPropagation();
        criteriaController.selectCriterion(criteriaType, ranking);
        setCriteria(criteriaController.getCriteriaEntity());
        setVersion(prevVersion => (prevVersion == 100 ? 0 : prevVersion + 1));
    }


    return (<div className={cn("flex flex-col gap-2", className)}>
        <div className="flex flex-col justify-start items-center gap-2">
            <h3 className="text-2xl font-bold">{criteria.getName()}</h3>
            {criteria.getCustom() && (<span className="text-md font-medium text-center">Choose from a list of criteria and rank them with stars (more stars = more important).<br/>You may only have one saved preset at once.<br/><span className="font-normal text-[#0066CC]">To add/remove a criteria, click on the rectangle.</span></span>)}
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
            {CriteriaInfoList.map((criteriaInfo) => {
                const isSelected = !criteria.getCustom() || criteria.getCriteriaRankingMap().has(criteriaInfo.type);
                const stars = criteria.getCriteriaRankingMap().get(criteriaInfo.type) ?? 0;
                return (
                    <div
                        key={criteriaInfo.type}
                        className={cn("w-full bg-[#EEEEEE] drop-shadow-sm border-2 rounded-md py-5 px-4 flex flex-col md:flex-row justify-between gap-2",
                            criteria.getCustom() ? "drop-shadow-sm" : "drop-shadow-none cursor-not-allowed",
                            {
                            "opacity-40 ": !isSelected, // Highlight if selected
                            "cursor-pointer": criteria.getCustom(),
                        },)}
                        onClick={() => criteria.getCustom() ? handleSelectCriterion(criteriaInfo.type, 1) : null} // Toggle selection
                    >
                        <div className="w-full flex flex-row justify-center md:justify-start items-center px-2 gap-4 md:gap-0">
                            <div className="md:basis-[10%]">{criteriaInfo.icon}</div>
                            <span className="md:basis-[90%] font-semibold">{criteriaInfo.description}</span>
                        </div>
                        <div className="mt-2 md:mt-0 flex flex-row justify-center md:justify-end gap-2">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} onClick={(e) => criteria.getCustom() ? handeStarsOnClick(e, criteriaInfo.type, index + 1) : null} className={cn("text-3xl md:text-2xl", index < stars ? "text-yellow-400" : "text-gray-400")}><FaStar /></div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>)

}