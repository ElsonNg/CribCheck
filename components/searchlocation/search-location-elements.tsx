import locationIcon from "@/app/images/location.png"
import MasterController from "@/lib/control/master-controller";
import { useMasterController } from "@/context/master-controller-context";


export default function SearchLocationElements(){




    return (
        <div className="w-[52vw] h-[58vh] bg-[#ffffff] shadow-lg p-4 rounded" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <form className="flex items-center h-10 w-full bg-[#FAFAFA] rounded overflow-hidden ">
                <img src={locationIcon.src} alt="location" className="w-5 h-5 mx-2" />
                <input
                    type="search"
                    id="searchLocation"
                    name="searchLocation"
                    placeholder="Enter a location or postal code"
                    className="w-full h-full mx-2 border-none bg-transparent text-lg leading-7 placeholder-[#B9B9B9] focus:outline-none"
                />
            </form>
            {/* Placeholder for map */}
            <div className="w-full h-[calc(58vh-30%)] flex justify-center items-center text-4xl">
                🗺️
            </div>
            <div className="flex flex-col gap-8 mb-16">
                <button 
                    className="group text-white bg-[#5A76FF] border-gray-400 border-2 rounded py-2.5 px-6 flex flex-row items-center justify-center gap-2 self-end"
                >
                    Continue
                </button>
            </div>

        </div>
    );
}