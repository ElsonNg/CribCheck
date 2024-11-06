import { useMasterController } from "@/context/master-controller-context";
import ClinicEntity from "@/lib/entities/datasets/clinic-entity";
import { CriteriaType } from "@/lib/entities/criteria-entity";
import HawkerCentreEntity from "@/lib/entities/datasets/hawker-centre-entity";
import MRTStationEntity from "@/lib/entities/datasets/mrt-station-entity";
import LocationEntity from "@/lib/entities/location/location-entity";
import { Circle, GoogleMap, Marker } from "@react-google-maps/api";
import { useState } from "react";
import SchoolEntity from "@/lib/entities/datasets/school-entity";
import SupermarketEntity from "@/lib/entities/datasets/supermarket-entity";

interface LatLng {
    lat: number;
    lng: number;
}



export default function ReportMap() {


    const {masterController} = useMasterController();
    const reportController = masterController.getReportController();

    const combinedResults = [reportController.getInitialResult(), reportController.getOtherResult()];
    const selectedLocation = reportController.getSelectedLocation();
    const selectedLocationOther = reportController.getSelectedLocationOther();

    const [mapCenter, setMapCenter] = useState<LatLng>(
        { lat: selectedLocation?.latitude ?? 0, lng: selectedLocation?.longitude ?? 0 }
    );

    const [mapCenterOther, setMapCenterOther] = useState<LatLng>(
        { lat: selectedLocationOther?.latitude ?? 0, lng: selectedLocationOther?.longitude ?? 0 }
    );

    const [zoomLevel, setZoomLevel] = useState<number>(12);

    const maxDistanceKilometres = 2;


    // Fetch the url of the icon based on criteria type to show on the map
    function getMarkerIcon(type: CriteriaType) {

        let url = "https://raw.githubusercontent.com/ElsonNg/CribCheck/refs/heads/master/app/images/mrt-logo.png";

        if (type === CriteriaType.proximityToHawkerCentres) {
            url = "https://raw.githubusercontent.com/ElsonNg/CribCheck/refs/heads/master/app/images/restaurant-logo.png";
        } else if (type === CriteriaType.proximityToMRT) {
            url = "https://raw.githubusercontent.com/ElsonNg/CribCheck/refs/heads/master/app/images/mrt-logo.png";
        } else if (type == CriteriaType.proximityToClinic) {
            url = "https://raw.githubusercontent.com/ElsonNg/CribCheck/refs/heads/master/app/images/clinic-logo.png";
        } else if (type === CriteriaType.proximityToSchool) {
            url = "https://raw.githubusercontent.com/ElsonNg/CribCheck/refs/heads/master/app/images/school-logo.png";
        } else if (type === CriteriaType.proximityToSupermarket) {
            url = "https://raw.githubusercontent.com/ElsonNg/CribCheck/refs/heads/master/app/images/supermarket-logo.png";
        }


        return {
            url: url,
            scaledSize: new google.maps.Size(24, 24),
            anchor: new google.maps.Point(15, 20),
        }
    }

    return (
        <div className="relative w-full aspect-[3/2]">
            <div className="mb-4 flex flex-col justify-between gap-1">
                <h3 className="font-semibold text-2xl">📍 Map</h3>
                <span className="font-medium text-md ">Showing amenities within a 2-kilometer radius.</span>
            </div>
            <GoogleMap
                center={mapCenter}
                zoom={zoomLevel}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                options={{
                    streetViewControl: false,
                    disableDoubleClickZoom: true,
                }}
            >

                {combinedResults.map((results, i) => {

                    if (!results) return;

                    return (<div key={i}>

                        {/* Render markers for hawker */}
                        {results.get(CriteriaType.proximityToHawkerCentres) && results.get(CriteriaType.proximityToHawkerCentres)?.getValidLocations().map((location: LocationEntity, i: number) => {

                            const hawkerEntity = location as HawkerCentreEntity;
                            if(selectedLocation && location.distanceToKilometres(selectedLocation) > maxDistanceKilometres && !selectedLocationOther) return;
                            if(selectedLocation && location.distanceToKilometres(selectedLocation) > maxDistanceKilometres && selectedLocationOther && location.distanceToKilometres(selectedLocationOther) > maxDistanceKilometres) return;

                            return (

                                <Marker
                                    key={i}
                                    position={{ lat: hawkerEntity.latitude, lng: hawkerEntity.longitude }}
                                    title={hawkerEntity.getName()}
                                    icon={getMarkerIcon(CriteriaType.proximityToHawkerCentres)}
                                    zIndex={10}
                                />);
                        })}

                        {/* Render markers for MRT */}
                        {results.get(CriteriaType.proximityToMRT) && results.get(CriteriaType.proximityToMRT)?.getValidLocations().map((location: LocationEntity, i: number) => {

                            const mrtEntity = location as MRTStationEntity;
                            if(selectedLocation && location.distanceToKilometres(selectedLocation) > maxDistanceKilometres && !selectedLocationOther) return;
                            if(selectedLocation && location.distanceToKilometres(selectedLocation) > maxDistanceKilometres && selectedLocationOther && location.distanceToKilometres(selectedLocationOther) > maxDistanceKilometres) return;

                            return (

                                <Marker
                                    key={i}
                                    position={{ lat: mrtEntity.latitude, lng: mrtEntity.longitude }}
                                    title={mrtEntity.getName()}
                                    icon={getMarkerIcon(CriteriaType.proximityToMRT)}
                                    zIndex={10}
                                />);
                        })}

                        {/* Render markers for clinic */}
                        {results.get(CriteriaType.proximityToClinic) && results.get(CriteriaType.proximityToClinic)?.getValidLocations().map((location: LocationEntity, i: number) => {

                            const clinicEntity = location as ClinicEntity;
                            if(selectedLocation && location.distanceToKilometres(selectedLocation) > maxDistanceKilometres && !selectedLocationOther) return;
                            if(selectedLocation && location.distanceToKilometres(selectedLocation) > maxDistanceKilometres && selectedLocationOther && location.distanceToKilometres(selectedLocationOther) > maxDistanceKilometres) return;

                            return (

                                <Marker
                                    key={i}
                                    position={{ lat: clinicEntity.latitude, lng: clinicEntity.longitude }}
                                    title={clinicEntity.getName()}
                                    icon={getMarkerIcon(CriteriaType.proximityToClinic)}
                                    zIndex={10}
                                />);
                        })}

                        {/* Render markers for school */}
                        {results.get(CriteriaType.proximityToSchool) && results.get(CriteriaType.proximityToSchool)?.getValidLocations().map((location: LocationEntity, i: number) => {

                            const schoolEntity = location as SchoolEntity;
                            if(selectedLocation && location.distanceToKilometres(selectedLocation) > maxDistanceKilometres && !selectedLocationOther) return;
                            if(selectedLocation && location.distanceToKilometres(selectedLocation) > maxDistanceKilometres && selectedLocationOther && location.distanceToKilometres(selectedLocationOther) > maxDistanceKilometres) return;

                            return (

                                <Marker
                                    key={i}
                                    position={{ lat: schoolEntity.latitude, lng: schoolEntity.longitude }}
                                    title={schoolEntity.getName()}
                                    icon={getMarkerIcon(CriteriaType.proximityToSchool)}
                                    zIndex={10}
                                />);
                        })}

                        {/* Render markers for supermarket */}
                        {results.get(CriteriaType.proximityToSupermarket) && results.get(CriteriaType.proximityToSupermarket)?.getValidLocations().map((location: LocationEntity, i: number) => {

                            const supermarketEntity = location as SupermarketEntity;
                            if(selectedLocation && location.distanceToKilometres(selectedLocation) > maxDistanceKilometres && !selectedLocationOther) return;
                            if(selectedLocation && location.distanceToKilometres(selectedLocation) > maxDistanceKilometres && selectedLocationOther && location.distanceToKilometres(selectedLocationOther) > maxDistanceKilometres) return;

                            return (

                                <Marker
                                    key={i}
                                    position={{ lat: supermarketEntity.latitude, lng: supermarketEntity.longitude }}
                                    title={supermarketEntity.getName()}
                                    icon={getMarkerIcon(CriteriaType.proximityToSupermarket)}
                                    zIndex={10}
                                />);
                        })}

                    </div>);

                })}

                {/* Display the primary location and a radius */}
                {selectedLocation && (
                    <>
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
                    </>)}

                {/* Display the other location and its radius if selected */}
                {selectedLocationOther && (
                    <>
                        <Marker
                            position={mapCenterOther}
                            title="Location"
                            zIndex={10}
                        />
                        <Circle
                            center={mapCenterOther}
                            radius={2000} // Radius in meters
                            options={{
                                strokeColor: "#0099ff", // Outline color
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                fillColor: "#0099ff", // Fill color
                                fillOpacity: 0.30,
                                zIndex: 5,
                            }}
                        />
                    </>)}
            </GoogleMap>
        </div>
    );
};


