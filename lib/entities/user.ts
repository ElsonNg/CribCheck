class User {
    private userID: number;
    private name: string;
    private email: string;
    private phoneNumber: string;

    constructor(userID: number, name: string, email: string, phoneNumber: string) {
        this.userID = userID;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    // Methods related to preferences
    getPreferences(userID: number): Preference[] {
        // Implementation here
        return [];
    }

    getUserPreferences(PreferencesID: number, userID: number): Preference {
        // Implementation here
        return new Preference();
    }

    editPreferences(PreferencesID: number, userID: number): void {
        // Implementation here
    }

    savePreferences(preferences: Preference): void {
        // Implementation here
    }

    // Methods related to locations
    getLocations(userID: number): Location[] {
        // Implementation here
        return [];
    }

    getLocation(locationID: number, userID: number): Location {
        // Implementation here
        return new Location();
    }

    saveLocation(location: Location): void {
        // Implementation here
    }

    // Methods related to reports
    getReports(userID: number): Report[] {
        // Implementation here
        return [];
    }

    getReport(reportID: number, userID: number): Report {
        // Implementation here
        return new Report();
    }

    saveReport(report: Report): void {
        // Implementation here
    }

    compareReport(report1: Report, report2: Report): Report[] {
        // Implementation here
        return [];
    }

    exportReport(reportID: number, userID: number): Report {
        // Implementation here
        return new Report();
    }
}

// Assuming that Preference, Location, and Report classes are defined somewhere else
class Preference {
    // Define properties and methods for Preference
}

class Location {
    // Define properties and methods for Location
}

class Report {
    // Define properties and methods for Report
}
