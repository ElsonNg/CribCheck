let loadPromise: Promise<void> | null = null;

async function waitForImportLibrary(timeoutMs = 8000) {
    const start = Date.now();
    while (
        !(window as any).google?.maps?.importLibrary &&
        Date.now() - start < timeoutMs
    ) {
        await new Promise((r) => setTimeout(r, 25));
    }
    if (!(window as any).google?.maps?.importLibrary) {
        throw new Error("google.maps.importLibrary not available.");
    }
}

export function loadGoogleMapsLibraries(): Promise<void> {
    if (loadPromise) return loadPromise;
    if (typeof window === "undefined") {
        loadPromise = Promise.reject(new Error("Called on server."));
        return loadPromise;
    }
    loadPromise = (async () => {
        await waitForImportLibrary();
        await Promise.all([
            google.maps.importLibrary("maps"),
            google.maps.importLibrary("places"),
            google.maps.importLibrary("geocoding"),
        ]);
    })();
    (window as any).__gmapsReady = loadPromise; // optional global
    return loadPromise;
}
