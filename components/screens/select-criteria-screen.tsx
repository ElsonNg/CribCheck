import TestScreenButtons from "@/components/ui/test-screen-buttons";
import CriteriaBox from "@/components/criteria/criteria-box"

export default function SelectCriteriaScreen() {

    return (<div className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl">Choose Criteria</h1>
        <p className="font-medium">
            We have created a few presets that might suit your needs. Alternatively you can create your own preset
        </p>
        <CriteriaBox/>
        <TestScreenButtons/>
    </div>)
}