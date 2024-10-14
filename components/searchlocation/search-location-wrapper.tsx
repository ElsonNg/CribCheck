import { useMasterController } from "@/context/master-controller-context";
import SearchLocation from "@/components/searchlocation/search-location";


export default function SearchLocationWrapper() {

    const masterController = useMasterController();



    function handleNext() {
        masterController.goToNextState();
    }

    return (
        <div className="min-h-[58vh] flex flex-col justify-between gap-4 bg-[#ffffff] shadow-lg p-4 rounded" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <SearchLocation />
            <button type="button" onClick={handleNext}
                className="group text-white bg-[#5A76FF] rounded py-2 px-4 flex flex-row items-center justify-center gap-2 self-end">
                Continue
            </button>
        </div>
    );
}
