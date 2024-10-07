import LocationService from "@/lib/boundary/location-service";

class GoogleLocationService extends LocationService {
    private apiKey : string;

    constructor() {
        super();
        this.apiKey = process.env.GOOGLE_API_KEY || '';
    }
}

export default GoogleLocationService;