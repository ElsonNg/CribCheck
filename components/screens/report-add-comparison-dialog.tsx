import { useMasterController } from '@/context/master-controller-context';
import React from 'react';
import ReactDOM from 'react-dom';


interface DialogProps {
    onCancel: () => void,
    onCompare: () => void,
    children?: React.ReactNode;
}

export default function ReportAddComparisonDialog({ onCancel, onCompare, children }: DialogProps) {

    const masterController = useMasterController();
    const reportController = masterController.getReportController();


    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
                {/* Close Button */}
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={onCancel}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Title */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Choose Another Location</h2>

                <div className="flex flex-row gap-2">
                    <h3 className="text-lg font-normal">Current Location: {reportController.getSelectedLocation()?.address}</h3>
                </div>

                {/* Insert Location Component */}
                <div id="location-component" className="my-4">
                    {children}
                </div>

                {/* Modal Actions */}
                <div className="mt-6 flex justify-end">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button className="bg-blue-500 text-white px-4 py-2 ml-3 rounded-md hover:bg-blue-600"
                        onClick={onCompare}>
                        Compare
                    </button>
                </div>
            </div>
        </div>, document.body
    );

}

