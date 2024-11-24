# SC2006 Software Engineering Project

This is a project for the SC2006 Software Engineering course at Nanyang Technological University.

The project is a web application that allows users to generate a crib fit report based on their location and the proximity of various locations (e.g., hawker centres, MRT stations, schools, supermarkets, clinics).

## Links
- Video Link: [link](https://youtu.be/CQw1xYf6yow)
- Working Prototype: [link](https://cribcheck.vercel.app/)


## Tech Stack Used

- Framework: [NextJS](https://nextjs.org/)
- Language: [Typescript](https://www.typescriptlang.org/)
- Database: [Firebase](https://firebase.google.com/)
- Location API: [Google Places API](https://developers.google.com/places/web-service/overview)
- Data API: [data.gov.sg](https://data.gov.sg/)
- Hosting: [Vercel](https://vercel.com/)

## Team Members

- (Angel Chan Jin Xuan) [https://github.com/angelkyliechan]
- (Jody Ng Li Min) [https://github.com/jodyng]
- (Joyce Chen) [https://github.com/Joyyyccceee]
- (Ng Yuan Da Elson) [https://github.com/ElsonNg]
- (Nick Lee Zhi Xiang) [https://github.com/nickleezx]
  
## Disclaimer

Note that the .env file for this project has been omitted for security purposes.
This will result in compile/runtime errors.

To test out a working prototype, please go to this [link](https://cribcheck.vercel.app/).
Alternatively, you may provide a valid .env file with the following content:

- Valid Firebase project keys
- Google Places Map API key

## Installing Dependencies

Install required dependencies

```bash
npm install
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.