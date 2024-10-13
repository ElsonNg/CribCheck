import { useState } from "react";
import CriteriaCard from "@/components/criteria/preset-cards";
import { PresetCriteriaType } from "@/lib/entities/criteria-entity";
import { useMasterController } from "@/context/master-controller-context";
import CheckIcon from "@/app/images/checkicon.png";
import CheckIconActive from "@/app/images/checkicon-active.png";


const criteriaOptions: PresetCriteriaType[] = ["Singles", "Young Couple", "Family"];

export default function CriteriaBox() {
    const masterController = useMasterController();
    const criteriaController = masterController.getCriteriaController();
    const reportController = masterController.getReportController();
    const [selectedOption, setSelectedOption] = useState<PresetCriteriaType | "new" | null>(null);


    // Only allow user to progress if a criteria (preset or new) is selected
    function handleContinue() {
        if (!selectedOption) return;
        reportController.setSelectedCriteria(criteriaController.getCriteriaEntity());
        masterController.goToNextState();
    };

    function handleCriteriaClick(criteria: PresetCriteriaType) {

        // Remove any previous criteria set
        if (selectedOption === criteria) {
            criteriaController.clearCriteria();
            setSelectedOption(null);
            // Select a preset criteria
        } else {
            criteriaController.setPresetCriteria(criteria);
            setSelectedOption(criteria);
        }
    };

    function handleNewPresetClick() {

        // Remove any previous criteria set
        if (selectedOption !== null) {
            criteriaController.clearCriteria();
        }
        setSelectedOption((prev) => (prev === "new" ? null : "new")); // Toggle "new" selection
    };


    return (
        <div className="flex flex-col p-6 gap-4 bg-white drop-shadow-md rounded-lg">
            <div className="w-full grid gap-4 grid-cols-3">
                {criteriaOptions.map((type) => (
                    <button
                        key={type}
                        className={`focus:outline-none rounded-lg ${selectedOption === type ? "ring-4 ring-blue-500" : ""}`}
                        onClick={() => handleCriteriaClick(type)}
                    >
                        <CriteriaCard type={type} />
                    </button>
                ))}
            </div>

            <p className="font-semibold text-2xl text-center">or</p>

            <div className="flex flex-row justify-center">
                <button
                    className={`px-4 py-2 flex items-center gap-4 rounded-lg bg-[#EEEEEE] ${selectedOption === "new" ? "ring-4 ring-green-500" : ""}`}
                    onClick={handleNewPresetClick}
                    type="button"
                >
                    <span>
                        <img
                            src={selectedOption === "new" ? CheckIconActive.src : CheckIcon.src}
                            alt="Check Icon"
                        />
                    </span>
                    I want to create a new preset
                </button>
            </div>

            <div className="flex flex-col gap-8">
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