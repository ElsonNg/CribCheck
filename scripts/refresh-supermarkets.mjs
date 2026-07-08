/**
 * Regenerates public/data/supermarkets.geojson from the data.gov.sg
 * "List of Supermarket Licences" CSV (d_11edd0117280c5776651d7891114c88c).
 *
 * The CSV only carries postal codes, so each unique postal code is geocoded
 * via the free OneMap search API. Run this whenever NEA updates the dataset
 * (quarterly):
 *
 *   npm run refresh-supermarkets
 *
 * Setting ONEMAP_API_TOKEN (free registration at onemap.gov.sg) raises the
 * OneMap rate limit from ~70 to 250 requests/min and speeds this up ~3x.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

try {
    process.loadEnvFile(path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env.local'));
} catch {
    // no .env.local — rely on the shell environment
}

const DATASET_ID = 'd_11edd0117280c5776651d7891114c88c';
const OUTPUT_PATH = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    '..', 'public', 'data', 'supermarkets.geojson'
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchDownloadLink() {
    for (let attempt = 1; attempt <= 5; attempt++) {
        const response = await fetch(
            `https://api-open.data.gov.sg/v1/public/api/datasets/${DATASET_ID}/poll-download`
        );
        const json = await response.json().catch(() => null);

        if (response.status === 429 || json?.code === 24) {
            console.log('data.gov.sg rate limited, retrying in 11s...');
            await sleep(11_000);
            continue;
        }
        if (!response.ok || !json?.data?.url) {
            throw new Error(`poll-download failed: ${JSON.stringify(json)}`);
        }
        return json.data.url;
    }
    throw new Error('poll-download kept getting rate limited');
}

/** Minimal RFC-4180 CSV parser (handles quoted fields and escaped quotes). */
function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (inQuotes) {
            if (char === '"') {
                if (text[i + 1] === '"') {
                    field += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                field += char;
            }
        } else if (char === '"') {
            inQuotes = true;
        } else if (char === ',') {
            row.push(field);
            field = '';
        } else if (char === '\r' || char === '\n') {
            if (char === '\r' && text[i + 1] === '\n') i++;
            row.push(field);
            field = '';
            if (row.some((value) => value !== '')) rows.push(row);
            row = [];
        } else {
            field += char;
        }
    }
    if (field !== '' || row.length > 0) {
        row.push(field);
        if (row.some((value) => value !== '')) rows.push(row);
    }

    const [header, ...records] = rows;
    if (!header) return [];
    return records.map((record) =>
        Object.fromEntries(header.map((column, i) => [column.trim(), record[i] ?? '']))
    );
}

async function geocodePostalCode(postalCode) {
    const token = process.env.ONEMAP_API_TOKEN;
    for (let attempt = 1; attempt <= 6; attempt++) {
        try {
            const response = await fetch(
                `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(postalCode)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`,
                { headers: token ? { Authorization: token } : undefined }
            );

            if (response.status === 429) {
                await sleep(2000 * attempt);
                continue;
            }
            if (!response.ok) return null;

            const json = await response.json();
            const result = json?.results?.[0];
            if (!result) return null;

            const lat = parseFloat(result.LATITUDE);
            const lng = parseFloat(result.LONGITUDE);
            if (isNaN(lat) || isNaN(lng)) return null;
            return { lat, lng };
        } catch {
            await sleep(1000);
        }
    }
    return null;
}

async function main() {
    console.log('Fetching supermarket licences CSV from data.gov.sg...');
    const downloadLink = await fetchDownloadLink();
    const csvText = await (await fetch(downloadLink)).text();
    const records = parseCsv(csvText);
    console.log(`Parsed ${records.length} rows`);

    const postalCodes = Array.from(new Set(
        records.map((record) => record['postal_code']).filter(Boolean)
    ));
    console.log(`Geocoding ${postalCodes.length} unique postal codes via OneMap...`);

    const coordinatesByPostalCode = new Map();
    const failed = [];
    const concurrency = 2;
    let nextIndex = 0;
    let done = 0;

    const workers = Array.from({ length: concurrency }, async () => {
        while (nextIndex < postalCodes.length) {
            const postalCode = postalCodes[nextIndex++];
            const coordinates = await geocodePostalCode(postalCode);
            if (coordinates) {
                coordinatesByPostalCode.set(postalCode, coordinates);
            } else {
                failed.push(postalCode);
            }
            done++;
            if (done % 50 === 0) console.log(`  ${done}/${postalCodes.length}`);
            await sleep(250);
        }
    });
    await Promise.all(workers);

    const features = [];
    for (const record of records) {
        const coordinates = coordinatesByPostalCode.get(record['postal_code']);
        if (!coordinates) continue;

        features.push({
            type: 'Feature',
            properties: {
                ...record,
                LIC_NAME: record['licensee_name'] ?? '',
            },
            geometry: {
                type: 'Point',
                coordinates: [coordinates.lng, coordinates.lat],
            },
        });
    }

    const geoJson = { type: 'FeatureCollection', features };
    await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
    await writeFile(OUTPUT_PATH, JSON.stringify(geoJson));

    console.log(`Wrote ${features.length} features (from ${records.length} rows) to ${OUTPUT_PATH}`);
    if (failed.length > 0) {
        console.log(`Postal codes that could not be geocoded: ${failed.join(', ')}`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
