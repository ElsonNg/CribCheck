"use client"

import SearchLocationWrapper from "@/components/searchlocation/search-location-wrapper"


export default function SelectLocationScreen() {

    return (<div className="animate-fadeInUp w-[95%] md:w-[90%] flex flex-col gap-2">
        <div className="flex flex-col">
            <h3 className="font-semibold text-2xl">Get Started</h3>
            <p className="font-medium">Crib Check rates the quality of your crib/house based on the amenities and location. To get started, select a location.</p>
        </div>
        <SearchLocationWrapper/>
    </div>)
}