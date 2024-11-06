"use client"

import SearchLocationWrapper from "@/components/searchlocation/search-location-wrapper"


export default function SelectLocationScreen() {

    return (<div className="animate-fadeInUp w-[95%] md:w-[90%] flex flex-col gap-2">
        <div className="flex flex-col">
            <h3 className="font-semibold text-2xl">Get Started</h3>
            <p className="font-medium">Crib Check rates the quality of your crib{"'"}s location based on the amenities available.<br/>Choose a location then select your criteria and we will rate the location based on publicly available government data!</p>
            <p className="mt-4 font-medium"> To get started, select a location.</p>
        </div>
        <SearchLocationWrapper />
    </div>)
}