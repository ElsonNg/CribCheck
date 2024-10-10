import TestScreenButtons from "@/components/ui/test-screen-buttons";
import SearchLocation from "@/components/searchlocation/search-location-elements"


export default function SelectLocationScreen() {

    return (<div className="flex flex-col gap-2">
        Choose Location
        <SearchLocation/>
        <TestScreenButtons/>
    </div>)
}