// app/api/datasets/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, {params} : {params: {datasetId: string}}) {
    try {
        const response = await fetch(`https://api-open.data.gov.sg/v1/public/api/datasets/${params.datasetId}/poll-download`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        // Return the data with CORS headers
        return NextResponse.json(data, {
            headers: {
                'Access-Control-Allow-Origin': 'https://cribcheck.vercel.app', // Replace with your actual Vercel domain
                'Access-Control-Allow-Methods': 'GET,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        },);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch data' },
            { status: 500 }
        );
    }
}
