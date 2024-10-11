import locationIcon from "@/app/images/location.png";
import MasterController from "@/lib/control/master-controller";
import { useMasterController } from "@/context/master-controller-context";
import MapElement from "@/components/searchlocation/map-element";

export default function SearchLocationElements() {

    const masterController = useMasterController();

    function handleNext() {
        masterController.goToNextState();
    }

    return (
        <div className="w-[52vw] h-[58vh] flex flex-col bg-[#ffffff] shadow-lg p-4 rounded" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            {/* Placeholder for map */}
            <MapElement></MapElement>
            <div className="flex-grow"></div>
            <div className="flex flex-col gap-8">
                <button type="button" onClick={handleNext}
                    className="group text-white bg-[#5A76FF] border-gray-400 border-2 rounded py-2 px-4 flex flex-row items-center justify-center gap-2 self-end">
                    Continue
                </button>
            </div>
        </div>
    );
}
