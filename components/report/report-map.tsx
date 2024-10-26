import { useMasterController } from "@/context/master-controller-context";
import ClinicEntity from "@/lib/entities/datasets/clinic-entity";
import { CriteriaType } from "@/lib/entities/criteria-entity";
import HawkerCentreEntity from "@/lib/entities/datasets/hawker-centre-entity";
import MRTStationEntity from "@/lib/entities/datasets/mrt-station-entity";
import LocationEntity from "@/lib/entities/location/location-entity";
import { ScoringResult } from "@/lib/strategy/scoring-strategy";
import { Circle, GoogleMap, Marker } from "@react-google-maps/api";
import { useRef, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoRestaurant } from "react-icons/io5";

interface LatLng {
    lat: number;
    lng: number;
}



export default function ReportMap() {


    const masterController = useMasterController();
    const reportController = masterController.getReportController();
    const results = reportController.getScoringResults();

    const selectedLocation = reportController.getSelectedLocation();

    const [mapCenter, setMapCenter] = useState<LatLng>(
        { lat: selectedLocation?.latitude ?? 0, lng: selectedLocation?.longitude ?? 0 }
    );


    const [markerPosition, setMarkerPosition] = useState<LatLng>(mapCenter); // Track marker position
    const [zoomLevel, setZoomLevel] = useState<number>(12);


    function getMarkerIcon(type: CriteriaType) {

        let url = "https://raw.githubusercontent.com/ElsonNg/CribCheck/refs/heads/elson/app/images/mrt-logo.png";
        
        if (type === CriteriaType.proximityToHawkerCentres) {
            url = "https://raw.githubusercontent.com/ElsonNg/CribCheck/refs/heads/elson/app/images/restaurant-logo.png";
        } else if (type === CriteriaType.proximityToMRT) {
            url = "https://raw.githubusercontent.com/ElsonNg/CribCheck/refs/heads/elson/app/images/mrt-logo.png";
        } else if (type == CriteriaType.proximityToClinic) {
            url = "https://raw.githubusercontent.com/ElsonNg/CribCheck/refs/heads/elson/app/images/clinic-logo.png";
        } else if (type === CriteriaType.proximityToSchool) {
            url = "https://raw.githubusercontent.com/ElsonNg/CribCheck/refs/heads/elson/app/images/school-logo.png";
        } else if (type === CriteriaType.proximityToSupermarket) {  
            url = "https://raw.githubusercontent.com/ElsonNg/CribCheck/refs/heads/elson/app/images/supermarket-logo.png";
        }


        return {
            url: url,
            scaledSize: new google.maps.Size(24, 24),
            anchor: new google.maps.Point(25, 30),
        }
    }

    return (
        <div className="relative w-full aspect-[3/2]">
            <GoogleMap
                center={mapCenter}
                zoom={zoomLevel}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                options={{
                    streetViewControl: false,
                    // gestureHandling: "none",
                    disableDoubleClickZoom: true,
                }}
            >
                {/* Render markers for each location */}
                {results.get(CriteriaType.proximityToHawkerCentres) && results.get(CriteriaType.proximityToHawkerCentres)?.getValidLocations().map((location: LocationEntity, i: number) => {

                    const hawkerEntity = location as HawkerCentreEntity;
                    return (

                        <Marker
                            key={i}
                            position={{ lat: hawkerEntity.latitude, lng: hawkerEntity.longitude }}
                            title={hawkerEntity.getName()}
                            icon={getMarkerIcon(CriteriaType.proximityToHawkerCentres)}
                            zIndex={10}
                        />);
                })}

                {results.get(CriteriaType.proximityToMRT) && results.get(CriteriaType.proximityToMRT)?.getValidLocations().map((location: LocationEntity, i: number) => {

                    const mrtEntity = location as MRTStationEntity;
                    return (

                        <Marker
                            key={i}
                            position={{ lat: mrtEntity.latitude, lng: mrtEntity.longitude }}
                            title={mrtEntity.getName()}
                            icon={getMarkerIcon(CriteriaType.proximityToMRT)}
                            zIndex={10}
                        />);
                })}


                {results.get(CriteriaType.proximityToClinic) && results.get(CriteriaType.proximityToClinic)?.getValidLocations().map((location: LocationEntity, i: number) => {

                    const mrtEntity = location as ClinicEntity;
                    return (

                        <Marker
                            key={i}
                            position={{ lat: mrtEntity.latitude, lng: mrtEntity.longitude }}
                            title={mrtEntity.getName()}
                            icon={getMarkerIcon(CriteriaType.proximityToClinic)}
                            zIndex={10}
                        />);
                })}


                <Marker
                    position={mapCenter}
                    title="Location"
                    zIndex={10}
                />

                <Circle
                    center={mapCenter}
                    radius={2000} // Radius in meters
                    options={{
                        strokeColor: "#FFFF00", // Outline color
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: "#FFFF00", // Fill color
                        fillOpacity: 0.30,
                        zIndex: 5,
                    }}
                />
            </GoogleMap>
        </div>
    );
};


