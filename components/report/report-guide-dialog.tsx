import React from 'react';
import ReactDOM from 'react-dom';


interface DialogProps {
    onCancel: () => void,
    children?: React.ReactNode;
}

export default function ReportGuideDialog({ onCancel, children }: DialogProps) {

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl max-h-[80%] p-6 relative overflow-y-scroll">
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
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">How we calculate your score</h2>

                <div className="text-md flex flex-col gap-2">
                    <h3 className="font-normal">CribFit uses a combination of carefully weighted factors to calculate your score, giving you a personalised evaluation of each location:</h3>
                    <ul className="list-disc list-inside">
                        <li>Proximity to supermarkets</li>
                        <li>Proximity to CHAS clinics</li>
                        <li>Proximity to schools</li>
                        <li>Proximity to MRT stations</li>
                        <li>Proximity to hawker centres</li>
                    </ul>
                    <br />
                    <p>Beyond measuring distances, CribCheck also considers the <strong>number of amenities</strong> available within target ranges. For instance, a location with multiple hawker centers or supermarkets within a close distance will score higher than one with fewer or more distant options. This is especially true for nearby hawker centers, where having several options within walking distance contributes positively to the score up to a certain point.</p>
                    <br />
                    <p>Our <strong>decay threshold strategy</strong> further refines this scoring. Amenities closer to your location have a stronger impact, while those farther away contribute less. For example, hawker centers within 300 meters will boost your score significantly, while those at 1 kilometer will have a reduced effect. This approach ensures that CribCheck prioritizes convenience, rewarding locations with amenities in practical, easy-to-reach distances.</p>
                    <br />
                    <p>Additionally, each type of amenity is <strong>weighted based on your preferences</strong>. When you assign stars to different criteria, you’re telling CribCheck which factors matter most to you. For example, if you assign five stars to proximity to MRT stations, those will have a greater impact on your score compared to criteria with fewer stars. This way, the CribFit score reflects your personal priorities, balancing the availability, quantity, and convenience of amenities that are most important to you.</p>
                    <h3 className="text-lg font-semibold mt-4">Distance Classes and Variety Thresholds</h3>
                    <p>Each criteria type has specific distance classes and a variety threshold, ensuring that closer amenities contribute more to your score:</p>
                    <ul className="list-disc list-inside ml-4">
                        <li><strong>Hawker Centres</strong>
                            <ul className="list-disc list-inside ml-6">
                                <li>Distance Classes: 300m, 500m, 1km, 2km</li>
                                <li>Variety Threshold: Up to 3 nearby hawker centres</li>
                            </ul>
                        </li>
                        <li><strong>MRT Stations</strong>
                            <ul className="list-disc list-inside ml-6">
                                <li>Distance Classes: 300m, 500m, 1km, 2km</li>
                                <li>Variety Threshold: Up to 3 nearby MRT stations</li>
                            </ul>
                        </li>
                        <li><strong>Schools</strong>
                            <ul className="list-disc list-inside ml-6">
                                <li>Distance Classes: 1km, 2km, 5km</li>
                                <li>Variety Threshold: Up to 2 nearby schools</li>
                            </ul>
                        </li>
                        <li><strong>Supermarkets</strong>
                            <ul className="list-disc list-inside ml-6">
                                <li>Distance Classes: 300m, 500m, 1km, 2km</li>
                                <li>Variety Threshold: Up to 3 nearby supermarkets</li>
                            </ul>
                        </li>
                        <li><strong>Clinics</strong>
                            <ul className="list-disc list-inside ml-6">
                                <li>Distance Classes: 1km, 2km, 5km</li>
                                <li>Variety Threshold: Up to 2 nearby clinics</li>
                            </ul>
                        </li>
                    </ul>


                    <p>The variety threshold represents the ideal number of each amenity within close proximity that contributes to a higher score. For example, if a location has 3 hawker centres within 2 kilometers, it will score better compared to one with only 1 hawker centres, while still adhering to the decay threshold strategy.</p>

                    <p>The result is a <strong>CribFit score</strong> that provides a comprehensive view of how well a location aligns with your needs, helping you make informed decisions based on your unique preferences.</p>
                </div>

                {children}
            </div>
        </div>, document.body);

}

