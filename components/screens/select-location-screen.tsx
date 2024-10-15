import TestScreenButtons from "@/components/ui/test-screen-buttons";
import SearchLocationWrapper from "@/components/searchlocation/search-location-wrapper"


export default function SelectLocationScreen() {

    return (<div className="w-[95%] md:w-[90%] flex flex-col gap-2">
        <div className="flex flex-col">
            <h3 className="font-semibold text-2xl">Get Started</h3>
            <p className="font-medium">For a start, choose a location.</p>
        </div>
        <SearchLocationWrapper/>
    </div>)
}