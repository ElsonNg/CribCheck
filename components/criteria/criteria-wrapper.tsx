"use client"

import { useState } from "react";
import CriteriaCard from "@/components/criteria/preset-cards";
import { PresetCriteriaType } from "@/lib/entities/criteria-entity";
import { useMasterController } from "@/context/master-controller-context";
import CheckIcon from "@/app/images/checkicon.png";
import CheckIconActive from "@/app/images/checkicon-active.png";
import Image from "next/image";
import CriteriaBreakdown from "./criteria-breakdown";
import { cn } from "@/lib/utils";

const criteriaOptions: PresetCriteriaType[] = ["Singles", "Young Couple", "Family"];

export default function CriteriaWrapper() {
    const masterController = useMasterController();
    const criteriaController = masterController.getCriteriaController();
    const reportController = masterController.getReportController();
    const profileController = masterController.getProfileController();

    const userProfile = profileController.getProfile();

    const [selectedOption, setSelectedOption] = useState<PresetCriteriaType | "new" | null>(null);

    // Only allow user to progress if a criteria (preset or new) is selected
    function handleContinue() {
        if (!selectedOption) return;
        reportController.setSelectedCriteria(criteriaController.getCriteriaEntity());
        masterController.goToNextState();
    };

    function handleBack() {
        masterController.goToPreviousState();
    };

    function handleCriteriaClick(criteria: PresetCriteriaType) {
        // Remove any previous criteria set
        if (selectedOption === criteria) {
            criteriaController.clearCriteria();
            setSelectedOption(null);
            // Select a preset criteria
        } else {
            if (criteria === "Saved") {
                if (userProfile.getPresets().length > 0) {
                    criteriaController.loadCriteria(userProfile.getPresets()[0].getCriteriaRankingMap());
                    criteriaController.getCriteriaEntity().setName("Saved");
                    criteriaController.getCriteriaEntity().setCustom(false);
                }
            }
            else
                criteriaController.setPresetCriteria(criteria);
            setSelectedOption(criteria);
        }
    };

    function handleNewPresetClick() {

        // Remove any previous criteria set
        if (selectedOption !== null) {
            criteriaController.clearCriteria();
        }
        criteriaController.setDefaultNew();
        setSelectedOption((prev) => (prev === "new" ? null : "new")); // Toggle "new" selection
    };


    return (
        <div className="flex flex-col p-6 gap-4 bg-white drop-shadow-md rounded-lg">
            <div className={cn("w-full grid gap-4", userProfile.getPresets().length > 0 ? "grid-cols-4" : "grid-cols-3")}>
                {criteriaOptions.map((type) => (
                    <button
                        key={type}
                        className={`focus:outline-none rounded-lg ${selectedOption === type ? "ring-4 ring-blue-500" : ""}`}
                        onClick={() => handleCriteriaClick(type)}
                    >
                        <CriteriaCard type={type} />
                    </button>
                ))}
                {userProfile.getPresets().length > 0 && (<button
                    key={"Saved"}
                    className={`focus:outline-none rounded-lg ${selectedOption === "Saved" ? "ring-4 ring-blue-500" : ""}`}
                    onClick={() => handleCriteriaClick("Saved")}
                >
                    <CriteriaCard type={"Saved"} />
                </button>)}

            </div>

            <p className="font-semibold text-2xl text-center">or</p>

            <div className="flex flex-row justify-center">
                <button
                    className={`px-4 py-2 flex flex-row items-center gap-4 rounded-lg bg-[#EEEEEE] ${selectedOption === "new" ? "ring-4 ring-green-500" : ""}`}
                    onClick={handleNewPresetClick}
                    type="button"
                >
                    <div className="basis-[10%]">
                        <Image
                            src={selectedOption === "new" ? CheckIconActive.src : CheckIcon.src}
                            alt="Check Icon"
                            width={32} height={32}
                        />
                    </div>
                    <span className="basis-[90%] whitespace-nowrap">I want to create a new preset</span>
                </button>
            </div>

            {selectedOption && (<CriteriaBreakdown key={selectedOption} className="mt-6" />)}


            <div className="flex flex-row justify-between gap-8">
                <button
                    type="button"
                    onClick={handleBack}
                    className="group text-white bg-[#5A76FF] rounded py-2 px-4 flex flex-row items-center justify-center gap-2 self-end
                    disabled:opacity-60"
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!selectedOption}
                    className="group text-white bg-[#5A76FF] rounded py-2 px-4 flex flex-row items-center justify-center gap-2 self-end
                    disabled:opacity-60"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}