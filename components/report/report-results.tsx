import { useMasterController } from "@/context/master-controller-context";
import { useTransition } from "react";
import { CriteriaType } from "@/lib/entities/criteria-entity";
import { IoRestaurant } from "react-icons/io5";
import { FaBasketShopping, } from "react-icons/fa6";
import { FaClinicMedical, } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { GoHeart, GoHeartFill } from "react-icons/go";
import MRTLogo from "@/app/images/mrt-logo.png";
import Image from "next/image";
import LocationEntity from "@/lib/entities/location/location-entity";
import { ScoringResult } from "@/lib/strategy/scoring-strategy";
import ReportDataCard from "./report-data-card";


interface ReportResultsProps {

    className?: string;
    queriedLocation: LocationEntity;
    cribFitRating: number;
    results: Map<CriteriaType, ScoringResult>;
}

export default function ReportResults({ queriedLocation, cribFitRating, results }: ReportResultsProps) {

    const { masterController, currentUser } = useMasterController();
    const profileController = masterController.getProfileController();

    const [isPending, startTransition] = useTransition();
    const userProfile = profileController.getProfile();

    const nearbyHawkers = results ? results.get(CriteriaType.proximityToHawkerCentres)?.getValidLocations().filter((l) => queriedLocation!.distanceToKilometres(l) <= 2) : [];
    const nearbyMRT = results ? results.get(CriteriaType.proximityToMRT)?.getValidLocations().filter((l) => queriedLocation!.distanceToKilometres(l) <= 2) : [];
    const nearbyClinics = results ? results.get(CriteriaType.proximityToClinic)?.getValidLocations().filter((l) => queriedLocation!.distanceToKilometres(l) <= 2) : [];
    const nearbySchools = results ? results.get(CriteriaType.proximityToSchool)?.getValidLocations().filter((l) => queriedLocation!.distanceToKilometres(l) <= 2) : [];
    const nearbySupermarkets = results ? results.get(CriteriaType.proximityToSupermarket)?.getValidLocations().filter((l) => queriedLocation!.distanceToKilometres(l) <= 2) : [];

    // Save location to user's profile
    async function handleSaveLocation() {
        if (!currentUser || !queriedLocation) return;
        startTransition(() => {
            if (userProfile.hasLocation(queriedLocation))
                profileController.removeSavedLocation(currentUser, queriedLocation);
            else
                profileController.saveLocation(currentUser, queriedLocation);
        });
    }

    function getCribFitRatingColour(rating: number) {
        const clampedRating = Math.max(0, Math.min(100, rating));

        if (clampedRating <= 50) {
            // Interpolate between red (255, 0, 0) and orange (255, 165, 0)
            const ratio = clampedRating / 50;
            const red = 255;
            const green = Math.round(165 * ratio);
            const blue = 0;
            return `rgb(${red}, ${green}, ${blue})`;
        } else {
            // Interpolate between orange (255, 165, 0) and green (0, 128, 0)
            const ratio = (clampedRating - 50) / 50;
            const red = Math.round(255 * (1 - ratio));
            const green = Math.round(165 + (128 - 165) * ratio);
            const blue = 0;
            return `rgb(${red}, ${green}, ${blue})`;
        }
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col justify-center items-start gap-0.5">
                <div className="text-xl font-bold">Searched Location</div>
                <span className="text-lg font-normal">{queriedLocation.address}</span>
                {currentUser && (<button type="button"
                    disabled={isPending}
                    onClick={handleSaveLocation}
                    className="w-full md:w-fit mt-4 text-black bg-gray-50 hover:opacity-90 hover:text-black/60 border rounded py-2 px-3  flex flex-row items-center justify-center gap-2">
                    {userProfile.hasLocation(queriedLocation!) ? <GoHeartFill size={16} /> : <GoHeart size={16} />}
                    <span>{queriedLocation && userProfile.hasLocation(queriedLocation) ? "Remove Saved Location" : "Save Location"}</span>
                </button>)}
            </div>


            <div className="flex flex-col gap-6">
                <h4 className="font-semibold text-2xl">CribFit Score</h4>
                <div className="flex flex-row items-center gap-6">
                    <span className="font-bold text-7xl" style={{ color: getCribFitRatingColour(cribFitRating) }}>{cribFitRating.toFixed()}</span><span className="text-3xl font-normal">/100</span>
                </div>
            </div>

            {results && (<div className="flex flex-col gap-4">
                {/* Hawker Summary */}
                {nearbyHawkers
                    && (<ReportDataCard
                        title="Near to Hawker Centres"
                        queriedLocation={queriedLocation}
                        criteriaType={CriteriaType.proximityToHawkerCentres}
                        locations={nearbyHawkers}
                        componentScore={results.get(CriteriaType.proximityToHawkerCentres)?.getScore() ?? 0}
                    >
                        <IoRestaurant size={30} className="m-auto" />
                    </ReportDataCard>
                    )

                }
                {/* MRT Summary */}
                {nearbyMRT &&
                    (<ReportDataCard
                        title="Near to MRT Stations"
                        queriedLocation={queriedLocation}
                        criteriaType={CriteriaType.proximityToMRT}
                        locations={nearbyMRT}
                        componentScore={results.get(CriteriaType.proximityToMRT)?.getScore() ?? 0}
                    >
                        <Image src={MRTLogo} alt="MRT Logo" width={30} height={30} className="m-auto" />
                    </ReportDataCard>)
                }
                {/* Clinic Summary */}
                {nearbyClinics
                    && (<ReportDataCard
                        title="Near to Clinics"
                        queriedLocation={queriedLocation}
                        criteriaType={CriteriaType.proximityToClinic}
                        locations={nearbyClinics}
                        componentScore={results.get(CriteriaType.proximityToClinic)?.getScore() ?? 0}

                    >
                        <FaClinicMedical size={30} className="m-auto" />
                    </ReportDataCard>)
                }
                {/* Schools Summary */}
                {nearbySchools
                    && (<ReportDataCard
                        title="Near to Schools"
                        queriedLocation={queriedLocation}
                        criteriaType={CriteriaType.proximityToSchool}
                        locations={nearbySchools}
                        componentScore={results.get(CriteriaType.proximityToSchool)?.getScore() ?? 0}
                    >

                        <MdSchool size={30} className="m-auto" />
                    </ReportDataCard>)
                }
                {/* Supermarkets Summary */}
                {nearbySupermarkets
                    && (<ReportDataCard
                        title="Near to Supermarkets"
                        queriedLocation={queriedLocation}
                        criteriaType={CriteriaType.proximityToSupermarket}
                        locations={nearbySupermarkets}
                        componentScore={results.get(CriteriaType.proximityToSupermarket)?.getScore() ?? 0}

                    >
                        <FaBasketShopping size={30} className="m-auto" />
                    </ReportDataCard>)
                }
            </div>)
            }
        </div >
    );
}

