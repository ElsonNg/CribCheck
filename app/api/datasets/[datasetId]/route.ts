// app/api/datasets/route.ts
import { GeoJsonData } from '@/lib/boundary/implementation/govt-dataset-service';
import { NextRequest, NextResponse } from 'next/server';

const allowedOrigin = 'https://cribcheck.vercel.app';

// data.gov.sg allows only a few anonymous requests per 10s window, so responses
// are cached in memory and concurrent requests share a single in-flight fetch.
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const cache = new Map<string, { promise: Promise<GeoJsonData>; fetchedAt: number }>();

class DatasetError extends Error {
    constructor(message: string, public readonly status: number) {
        super(message);
    }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Resolves the presigned download URL for a dataset, retrying when rate limited.
 */
async function fetchDownloadLink(datasetId: string): Promise<string> {
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const response = await fetch(`https://api-open.data.gov.sg/v1/public/api/datasets/${datasetId}/poll-download`, {
            headers: {
                'Content-Type': 'application/json',
            },
            cache: "no-store",
        });

        const jsonData = await response.json().catch(() => null);

        if (jsonData?.code === 2) {
            throw new DatasetError('Dataset does not exist on data.gov.sg', 404);
        }

        // Rate limited: the anonymous limit resets after 10 seconds
        if (response.status === 429 || jsonData?.code === 24) {
            if (attempt < maxAttempts) {
                await sleep(11_000);
                continue;
            }
            throw new DatasetError('Rate limited by data.gov.sg', 503);
        }

        const downloadLink = jsonData?.data?.url;
        if (!response.ok || !downloadLink) {
            throw new DatasetError('Download URL not found in response!', 502);
        }
        return downloadLink;
    }
    throw new DatasetError('Failed to fetch download URL', 502);
}

/**
 * Downloads a dataset and parses it as GeoJSON. Non-JSON datasets (e.g. ones
 * that migrated to CSV upstream) are rejected: those should be pregenerated
 * as static assets instead (see scripts/refresh-supermarkets.mjs).
 */
async function loadDataset(datasetId: string): Promise<GeoJsonData> {
    const downloadLink = await fetchDownloadLink(datasetId);

    const downloadResponse = await fetch(downloadLink, { cache: "no-store" });
    if (!downloadResponse.ok) {
        throw new DatasetError('Failed to download dataset!', 502);
    }

    const body = await downloadResponse.text();
    try {
        return JSON.parse(body) as GeoJsonData;
    } catch {
        throw new DatasetError('Dataset is not GeoJSON/JSON', 415);
    }
}

function getDataset(datasetId: string): Promise<GeoJsonData> {
    const cached = cache.get(datasetId);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
        return cached.promise;
    }

    const entry = { promise: loadDataset(datasetId), fetchedAt: Date.now() };
    cache.set(datasetId, entry);
    entry.promise.catch(() => {
        if (cache.get(datasetId) === entry) cache.delete(datasetId);
    });
    return entry.promise;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ datasetId: string }> }) {

    // Validate the origin to allow only the specified domain
    const origin = request.headers.get('origin');
    if (origin !== null && origin !== allowedOrigin) {
        return NextResponse.json(
            { error: 'Forbidden' },
            { status: 403, headers: { 'Access-Control-Allow-Origin': allowedOrigin } }
        );
    }

    try {
        const { datasetId } = await params;
        const data = await getDataset(datasetId);

        // Return the data with CORS headers
        return NextResponse.json(data, {
            headers: {
                'Access-Control-Allow-Origin': allowedOrigin,
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        const status = error instanceof DatasetError ? error.status : 500;
        return NextResponse.json(
            { error: error instanceof DatasetError ? error.message : 'Failed to fetch data' },
            { status }
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
