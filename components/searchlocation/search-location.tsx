"use client";

import { useEffect, useState, useRef, } from "react";
import { GoogleMap, Marker, } from "@react-google-maps/api";
import LocationPredictionEntity from "@/lib/entities/location/location-prediction-entity";
import { useMasterController } from "@/context/master-controller-context";
import LocationEntity from "@/lib/entities/location/location-entity";
import { ScreenState } from "@/lib/control/master-controller";

interface LatLng {
    lat: number;
    lng: number;
};

interface LocationSearchProps {
    onChange?: (location: LocationEntity) => void;
}

export default function SearchLocation({onChange} : LocationSearchProps) {

    const masterController = useMasterController();
    const authController = masterController.getAuthController();
    const locationController = masterController.getLocationController();
    const reportController = masterController.getReportController();
    const profileController = masterController.getProfileController();

    const userProfile = profileController.getProfile();

    const [mapCenter, setMapCenter] = useState<LatLng>({
        lat: 1.348502964206701,
        lng: 103.68308105237777,
    });
    const [markerPosition, setMarkerPosition] = useState<LatLng>(mapCenter); // Track marker position
    const [zoomLevel, setZoomLevel] = useState<number>(12);

    const [autocompleteSuggestions, setAutocompleteSuggestions] =
        useState<LocationPredictionEntity[] | null>(null);

    const [savedSuggestions, setSavedSuggestions] =
        useState<LocationPredictionEntity[] | null>(null);

    const [searchValue, setSearchValue] = useState<string>("");
    const mapRef = useRef<google.maps.Map | null>(null);


    function setLocation(location: LocationEntity) {

        if (masterController.getCurrentState() === ScreenState.SelectingLocation) {
            reportController.setSelectedLocation(location);
        } else if (masterController.getCurrentState() === ScreenState.ViewReport) {
            reportController.setSelectedLocationOther(location);
        }

        if(onChange)
            onChange(location);
        setMarkerPosition({ lat: location.latitude, lng: location.longitude });
    }

    // Handle location autocomplete search
    async function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;
        setSearchValue(query);

        if (query.length > 2) {
            const suggestions = await locationController.queryLocationAutoComplete(query);
            setAutocompleteSuggestions(suggestions || null);
        } else {
            setAutocompleteSuggestions(null);
        }
    };

    // Handle selecting a location from suggestions
    async function handleSelectSuggestion(prediction: LocationPredictionEntity) {
        setSearchValue(prediction.description); // Set the selected address in the search bar
        setAutocompleteSuggestions(null); // Clear suggestions

        const location = await locationController.getLocationByPrediction(prediction);
        if (location) {
            setLocation(location);
            setMapCenter({ lat: location.latitude, lng: location.longitude });
        }
    };

    // Handle map idle (when the map stops moving) to update marker's geographic position
    async function handleMapIdle() {
        const map = mapRef.current;
        if (map) {
            const newCenter = map.getCenter()?.toJSON();
            if (newCenter) {
                setMarkerPosition({ lat: newCenter.lat, lng: newCenter.lng }); // Update the marker's lat/lng to the center of the map
                const location = await locationController.getLocationByCoordinates(newCenter.lat, newCenter.lng);
                if (location) {
                    setLocation(location);
                    setSearchValue(location.address || ""); // Update the search bar with the address
                }
            }
        }
    };

    // Handle map load
    function handleMapLoad(map: google.maps.Map) {
        mapRef.current = map;
    };

    function handleOnMapCentreChanged() {
        const map = mapRef.current;
        if (map) {
            const newCenter = map.getCenter()?.toJSON();
            if (newCenter) {
                setMarkerPosition({ lat: newCenter.lat, lng: newCenter.lng }); // Update the marker's lat/lng to the center of the map
            }
        }
    }

    // Sets the current browser's location as map center on initial load
    useEffect(() => {
        locationController.getCurrentLocation().then((location) => {
            if (location) {
                setMapCenter({ lat: location.latitude, lng: location.longitude });
            }
        });

        async function loadSavedLocations() {
            const addressNames = userProfile.getLocations().map((location) => location.getAddress());
            const suggestions: LocationPredictionEntity[] = [];

            if (addressNames.length > 0) {
                const promises = addressNames.map(async (name) => {
                    return await locationController.queryLocationAutoComplete(name);

                });
                const predictions = await Promise.all(promises);
                predictions.forEach((results) => {
                    if (results && results.length > 0) suggestions.push(results[0]);
                });
            }
            return suggestions;
        }
        loadSavedLocations().then((suggestions) => {
            setSavedSuggestions(suggestions);
        });

    }, [locationController, authController, profileController, userProfile]);

    return (
        <div className="grow relative w-full h-full flex flex-col">
            {/* Input field for location search */}
            <input
                value={searchValue}
                onChange={handleSearchChange}
                type="text"
                placeholder="Enter a location or postal code"
                className="w-full h-10 bg-[#FAFAFA] rounded mb-2 px-3 text-lg leading-7 placeholder-[#B9B9B9] border border-[#E0E0E0] focus:outline-none"
            />
             {searchValue === "" && savedSuggestions && (
                <ul className="absolute top-12 z-20 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-x-hidden overflow-y-auto">
                    {savedSuggestions.map((suggestion) => (
                        <li
                            key={suggestion.placeId}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                        >
                            {suggestion.description} (Saved)
                        </li>
                    ))}
                </ul>
            )}
            {autocompleteSuggestions && (
                <ul className="absolute top-12 z-20 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-x-hidden overflow-y-auto">
                    {autocompleteSuggestions.map((suggestion) => (
                        <li
                            key={suggestion.placeId}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                        >
                            {suggestion.description}
                        </li>
                    ))}
                </ul>
            )}

            {/* Google Map */}
            <div className="grow w-full aspect-[2]">
                <GoogleMap
                    center={mapCenter} // Keep map centered
                    zoom={zoomLevel}
                    onIdle={handleMapIdle} // Update marker when panning ends
                    onCenterChanged={handleOnMapCentreChanged}
                    onLoad={handleMapLoad} // Set mapRef on map load
                    onZoomChanged={() => setZoomLevel(zoomLevel)} // Update zoom level
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    options={{
                        streetViewControl: false,
                        restriction: {
                            latLngBounds: {
                                north: 1.54,
                                south: 1.16,
                                east: 104.2,
                                west: 103.45,
                            },
                        }
                    }}
                >
                    {/* Marker is fixed to the center of the map */}
                    <Marker position={markerPosition} />
                </GoogleMap>
            </div>
        </div>
    );
}
