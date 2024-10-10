import { useState, useEffect, useRef } from "react";
import CriteriaCard from "@/components/criteria/preset-cards";
import CheckIcon from "@/app/images/checkicon.png";
import CheckIconActive from "@/app/images/checkicon-active.png"; // Image for the active state
import { useMasterController } from "@/context/master-controller-context";

export default function CriteriaBox() {

    const masterController = useMasterController();

    function handleNext(){
        masterController.goToNextState();
    }

    const [isSelected, setIsSelected] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null); // Create a ref for the button

    const handleClick = () => {
        setIsSelected(!isSelected);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setIsSelected(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col p-6 gap-4 bg-white drop-shadow-md rounded-lg">
            <div className="w-full grid gap-4 grid-cols-3">
                <button className="focus:outline-none hover:ring-4 hover:ring-blue-500 focus:ring-4 focus:ring-blue-500 active:bg-blue-100 rounded-lg">
                    <CriteriaCard type="Singles" />
                </button>
                <button className="focus:outline-none hover:ring-4 hover:ring-blue-500 focus:ring-4 focus:ring-blue-500 active:bg-blue-100 rounded-lg">
                    <CriteriaCard type="Young Couple" />
                </button>
                <button className="focus:outline-none hover:ring-4 hover:ring-blue-500 focus:ring-4 focus:ring-blue-500 active:bg-blue-100 rounded-lg">
                    <CriteriaCard type="Family" />
                </button>
            </div>

            <p className="font-semibold text-2xl text-center">or</p>

            <div className="flex flex-row justify-center">
                <button
                    ref={buttonRef} 
                    className={`px-4 py-2 flex items-center gap-4 rounded-lg bg-[#EEEEEE] focus:outline-none ${isSelected ? "focus:ring-4 focus:ring-green-500" : ""}`}
                    onClick={handleClick}
                >
                    <span>
                        <img
                            src={isSelected ? CheckIconActive.src : CheckIcon.src}
                            alt="Check Icon"
                        />
                    </span>
                    I want to create a new preset
                </button>
            </div>

            <div className="flex flex-col gap-8">
                <button type="button" onClick={handleNext}
                    className="group text-white bg-[#5A76FF] border-gray-400 border-2 rounded py-2 px-4 flex flex-row items-center justify-center gap-2 self-end">
                    Continue
                </button>
            </div>
        </div>
    );
}
