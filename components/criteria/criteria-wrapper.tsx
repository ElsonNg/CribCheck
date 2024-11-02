"use client"

import { useState } from "react";
import CriteriaCard from "@/components/criteria/preset-cards";
import { PresetCriteriaType } from "@/lib/entities/criteria-entity";
import { useMasterController } from "@/context/master-controller-context";
import CriteriaBreakdown from "./criteria-breakdown";
import { cn } from "@/lib/utils";
import { FaCheckCircle } from "react-icons/fa";
import  { ScreenState } from "@/lib/control/master-controller";

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

        if(masterController.getCurrentState() === ScreenState.SelectingCriteria)
            masterController.goToNextState();
    };

    function handleBack() {
        if(masterController.getCurrentState() === ScreenState.SelectingCriteria)
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
        <div className="mt-6 flex flex-col p-6 gap-4 bg-white drop-shadow-md rounded-lg">
            <div className={cn("w-full grid gap-4", userProfile.getPresets().length > 0 ? "grid-cols-1 md:grid-cols-4" : "grid-cols-1 md:grid-cols-3")}>
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

            <div className="mb-8 w-full flex flex-row justify-center">
                <button
                    className={`px-4 py-3 md:py-2 w-full md:w-fit flex flex-row items-center gap-4 rounded-lg bg-[#EEEEEE] ${selectedOption === "new" ? "ring-4 ring-green-500" : ""}`}
                    onClick={handleNewPresetClick}
                    type="button"
                >
                    <div className="basis-[10%]">
                        <FaCheckCircle color={selectedOption === "new" ? "green" : ""}/>
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
                    disabled={!selectedOption || !criteriaController.getCriteriaEntity().hasAtLeastOneCriterionSelected()} 
                    className="group text-white bg-[#5A76FF] rounded py-2 px-4 flex flex-row items-center justify-center gap-2 self-end
                    disabled:opacity-60"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}