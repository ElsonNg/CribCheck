import TestScreenButtons from "@/components/ui/test-screen-buttons";
import SearchLocation from "@/components/searchlocation/search-location-elements"


export default function SelectLocationScreen() {

    return (<div className="flex flex-col gap-2">
        <div className="flex flex-col">
            <h3 className="font-semibold text-2xl">Get started</h3>
            <p className="font-medium">For a start, choose a location.</p>
        </div>
        <SearchLocation/>
        <TestScreenButtons/>
    </div>)
}