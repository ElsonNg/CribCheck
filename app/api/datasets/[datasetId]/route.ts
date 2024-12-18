// app/api/datasets/route.ts
import { GeoJsonData } from '@/lib/boundary/implementation/govt-dataset-service';
import { NextRequest, NextResponse } from 'next/server';

const allowedOrigin = 'https://cribcheck.vercel.app';

export async function GET(request: NextRequest, { params }: { params: { datasetId: string } }) {

    // Validate the origin to allow only the specified domain
    const origin = request.headers.get('origin');
    if (origin !== null && origin !== allowedOrigin) {
        return NextResponse.json(
            { error: 'Forbidden' },
            { status: 403, headers: { 'Access-Control-Allow-Origin': allowedOrigin } }
        );
    }

    try {
        
        // Fetch dataset download link
        const response = await fetch(`https://api-open.data.gov.sg/v1/public/api/datasets/${params.datasetId}/poll-download`, {
            headers: {
                'Content-Type': 'application/json',
            },
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const jsonData = await response.json();
        const downloadLink = jsonData.data.url;
        if (!downloadLink) {
            throw new Error("Download URL not found in response!");
        }

        // Fetch the actual GeoJSON data from the download link
        const downloadResponse = await fetch(downloadLink, { cache: "no-store" });
        if (!downloadResponse.ok) {
            throw new Error('Failed to download GeoJSON!');
        }

        const downloadedJSONData = await downloadResponse.json();

        // Return the data with CORS headers
        return NextResponse.json(downloadedJSONData as GeoJsonData, {
            headers: {
                'Access-Control-Allow-Origin': allowedOrigin,
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch data' },
            { status: 500 }
        );
    }
}

// Optional handler for OPTIONS method (CORS preflight requests)
export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': allowedOrigin,
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}
