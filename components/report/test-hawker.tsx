"use client"
import { useMasterController } from "@/context/master-controller-context";
import HawkerCentreEntity from "@/lib/entities/datasets/hawker-centre-entity";
import LocationEntity from "@/lib/entities/location-entity";
import { useEffect, useState } from "react"



export default function TestHawker() {

    const masterController = useMasterController();
    const [results, setResults] = useState<HawkerCentreEntity[] | null>();


    useEffect(() => {
        async function loadData() {
            const result = await masterController.getReportController().fetchRelevantData();
            //console.log(result);
            setResults(result);
        }


        loadData();
    }, [masterController,]);

    return (<div>
        <h1>Test Hawker Dataset</h1>
        <div className="max-h-[800px] overflow-y-scroll">
            <h1>Hawker Centres</h1>
            <table border={1} style={{ width: "100%", textAlign: "left" }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Location (Latitude, Longitude)</th>
                        <th>Distance to First Location</th>
                    </tr>
                </thead>
                <tbody>
                    {results && results.map((centre, index) => (
                        <tr key={index}>
                            <td>{centre.getName()}</td>
                            <td>
                                {centre.getLocation().getLongitude()}, {centre.getLocation().getLatitude()}
                            </td>
                            <td>
                                {new LocationEntity(1.287654, 103.845274).distanceToKilometres(centre.getLocation()).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>)
}