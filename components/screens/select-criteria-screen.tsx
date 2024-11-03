"use client"

import CriteriaWrapper from "@/components/criteria/criteria-wrapper"

export default function SelectCriteriaScreen() {

    return (<div className="animate-fadeIn flex flex-col gap-2">
        <h1 className="font-semibold text-2xl">Choose Criteria</h1>
        <p className="font-medium">
            We have created a few presets that might suit your needs. Alternatively, you can create your own preset.
        </p>
        <CriteriaWrapper/>
    </div>)
}