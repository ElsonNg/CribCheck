"use client";

import { useEffect, useState } from "react";
import { loadGoogleMapsLibraries } from "@/lib/google-maps-loader";

export function useGoogleMapsReady() {
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let cancelled = false;
        loadGoogleMapsLibraries()
            .then(() => {
                if (!cancelled) setReady(!!window.google?.maps?.Map);
                if (!window.google?.maps?.Map && !cancelled) {
                    setError(new Error("Map constructor unavailable."));
                }
            })
            .catch((e) => {
                if (!cancelled)
                    setError(
                        e instanceof Error
                            ? e
                            : new Error("Failed loading Google Maps.")
                    );
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return { ready, error };
}
