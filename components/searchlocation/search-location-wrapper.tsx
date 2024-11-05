"use client"

import { useMasterController } from "@/context/master-controller-context";
import SearchLocation from "@/components/searchlocation/search-location";
import { useState } from "react";
import LocationEntity from "@/lib/entities/location/location-entity";
import  { ScreenState } from "@/lib/control/master-controller";


export default function SearchLocationWrapper() {

    const {masterController} = useMasterController();
    const [location, setLocation] = useState<LocationEntity | null>(null);


    function handleNext() {
        if(masterController.getCurrentState() === ScreenState.SelectingLocation)
            masterController.goToNextState();
    }

    function handleOnChange(location : LocationEntity | null) {
        setLocation(location);
    }


    return (
        <div className="min-h-[58vh] flex flex-col justify-between gap-4 bg-[#ffffff] shadow-lg p-4 rounded" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <SearchLocation onChange={handleOnChange} />
            <button type="button" onClick={handleNext}
                disabled={!location}
                className="group text-white bg-[#5A76FF] disabled:opacity-50 rounded py-2 px-4 flex flex-row items-center justify-center gap-2 self-end">
                Continue
            </button>
        </div>
    );
}
