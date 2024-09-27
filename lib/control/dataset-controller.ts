// DEPRECATED
// class DataGovController {

//     constructor() {
        
//     }

//     async fetchDataset(datasetId: string): Promise<unknown> {
//         const url = "https://data.gov.sg/api/action/datastore_search?resource_id=" + datasetId;
//         try {
//             const response = await fetch(url);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch data');
//             }
//             const data = await response.json();
//             return data;
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             return null; // or you can throw the error to handle it further up
//         }
//     }

//     async fetchGeoJSON(datasetId: string): Promise<unknown> {

//         const url = "https://api-open.data.gov.sg/v1/public/api/datasets/" + datasetId + "/poll-download";

//         try {
//             const response = await fetch(url);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch data');
//             }
//             const jsonData = await response.json();

//             const downloadLink = jsonData.data.url;

//             if(!downloadLink) {
//                 throw new Error('Download URL not found in response');
//             }

//             const downloadResponse = await fetch(downloadLink);
//             if(!downloadResponse.ok) {  
//                 throw new Error('Failed to download data');
//             }

//             const downloadJSONData = await downloadResponse.json();
//             return downloadJSONData;

//         } catch (error) {
//             console.error('Error fetching data:', error);
//             return null; // or you can throw the error to handle it further up
//         }
//     }

//     async fetchHDBCarparkDataset() : Promise<unknown> {

//         // Source:  https://data.gov.sg/datasets/d_23f946fa557947f93a8043bbef41dd09/view
//         const datasetId = "d_23f946fa557947f93a8043bbef41dd09";
//         const data = await this.fetchDataset(datasetId);
//         return data;
//     }

//     async fetchHealthcareDataset() : Promise<unknown> {

//         // Source: https://data.gov.sg/datasets/d_e4663ad3f088a46dabd3972dc166402d/view
//         const datasetId = "d_e4663ad3f088a46dabd3972dc166402d";
//         const data = await this.fetchDataset(datasetId);
//         return data;
//     }

//     async fetchPreSchoolLocationGeoJson() : Promise<unknown> {

//         // Source: https://data.gov.sg/datasets/d_61eefab99958fd70e6aab17320a71f1c/view
//         const datasetId = "d_61eefab99958fd70e6aab17320a71f1c";
//         const data = await this.fetchGeoJSON(datasetId);
//         return data;
//     }
// }

// export const dataGovController = new DataGovController();