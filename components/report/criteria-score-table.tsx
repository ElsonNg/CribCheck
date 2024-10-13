import React from 'react';
import { CriteriaLabels, CriteriaType } from '@/lib/entities/criteria-entity';
import { ScoringResult } from '@/lib/strategy/scoring-strategy';

interface Props {
    scoringResults: Map<CriteriaType, ScoringResult>;
}

const CriteriaScoreTable: React.FC<Props> = ({ scoringResults }) => {
    return (
        <div className="col-span-2 flex flex-col gap-8">
            {scoringResults && (
                <table className="table-auto w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">Criteria Type</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Score</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Valid Locations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from(scoringResults.entries()).map(([criteriaType, result]) => (
                            <tr key={criteriaType} className="border-b">
                                <td className="border border-gray-300 px-4 py-2">
                                    {CriteriaLabels[criteriaType] || criteriaType}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{result.getScore().toFixed(2)}</td>
                                <td className="border border-gray-300 px-4 py-2 flex flex-col gap-2">
                                    <span className="font-bold">Locations: {result.getValidLocations().length}</span>
                                    <div className="flex flex-wrap gap-0.5">
                                        {result.getValidLocations() && result.getValidLocations().length > 0 ? (
                                            result.getValidLocations().map((location, index) => (
                                                <span key={index}>
                                                    {`Lat: ${location.latitude.toFixed(4)}, Lon: ${location.longitude.toFixed(4)}`}
                                                    {index < result.getValidLocations().length - 1 && <>, </>} {/* Add comma if not the last location */}
                                                </span>
                                            ))
                                        ) : (
                                            <span>No valid locations</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CriteriaScoreTable;
