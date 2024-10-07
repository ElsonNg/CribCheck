export class CarPark {
    address: string;
    x_coord: string;
    y_coord: string;
  
    constructor(address: string, x_coord: string, y_coord: string) {
      this.address = address;
      this.x_coord = x_coord;
      this.y_coord = y_coord;
    }
  
    // Method to return full coordinates as a formatted string
    getFullCoordinates(): string {
      return `X: ${this.x_coord}, Y: ${this.y_coord}`;
    }
  
    // Optional: Method to return a Google Maps link with the coordinates
    getGoogleMapsLink(): string {
      return `https://www.google.com/maps?q=${this.y_coord},${this.x_coord}`;
    }
  }