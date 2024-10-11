"use client";

import { useState } from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng, Suggestion } from "use-places-autocomplete";
import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
} from "@vis.gl/react-google-maps";

type LatLng = {
    lat: number;
    lng: number;
};

export default function MapElement() {
    const [position, setPosition] = useState<LatLng>({ lat: 1.348502964206701, lng: 103.68308105237777 });

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            /* Define search scope, e.g., restrict to a certain country */
            // location: { lat: () => 1.3521, lng: () => 103.8198 },
            // radius: 200 * 1000,
        },
    });

    const handleSelect = async (address: string) => {
        setValue(address, false); // Set value without triggering search suggestions again
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            setPosition({ lat, lng });
        } catch (error) {
            console.error("Error fetching coordinates: ", error);
        }
    };

    return (
        <APIProvider apiKey={/*help */}>
            <div className="w-full h-[calc(58vh-30%)]">
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={!ready}
                    placeholder="Enter a location or postal code"
                    className="w-full h-10 bg-[#FAFAFA] rounded mb-2 px-3 text-lg leading-7 placeholder-[#B9B9B9] border border-[#E0E0E0] focus:outline-none"
                />
                {status === "OK" && (
                    <ul className="bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                        {data.map((suggestion: Suggestion) => (
                            <li
                                key={suggestion.place_id}
                                onClick={() => handleSelect(suggestion.description)}
                                className="p-2 cursor-pointer hover:bg-gray-100"
                            >
                                {suggestion.description}
                            </li>
                        ))}
                    </ul>
                )}
                <Map zoom={12} center={position}>
                    <AdvancedMarker position={position}>
                        <Pin />
                    </AdvancedMarker>
                </Map>
            </div>
        </APIProvider>
    );
}
