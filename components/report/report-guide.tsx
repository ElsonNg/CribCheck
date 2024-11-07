import { useState } from "react";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import ReportGuideDialog from "./report-guide-dialog";


export default function ReportGuide() {

    const [showDialog, setShowDialog] = useState<boolean>(false);


    function handleShowDialog() {
        setShowDialog(true);
    }

    function handleCancelDialog() {
        setShowDialog(false);
    }
    
    function handleDismissDialog() {
        setShowDialog(false);
    }

    return (<>
        <div className="group mt-2 flex flex-row justify-start items-center gap-2">
            <BsFillQuestionCircleFill size={16} color="black" className="group-hover:opacity-60" />
            <span className="font-medium text-md text-gray-800 underline cursor-pointer group-hover:opacity-60" onClick={handleShowDialog}>How we calculate your score</span>
        </div>
        {showDialog && (<ReportGuideDialog onCancel={handleCancelDialog}>
                <div className="mt-6 flex justify-end">
                    <button className="text-white px-4 py-2 ml-3 rounded-md bg-[#5A76FF] disabled:opacity-50"
                        disabled={!location}
                        onClick={handleDismissDialog}>
                        Dismiss
                    </button>
                </div>
            </ReportGuideDialog>)}
    </>)
}