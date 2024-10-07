/**
 * @class FirebaseDBService
 * 
 * this class provides database services using Firebase.
 * it extends the 'DBService' abstract class and implements its 'loadUserProfile' and 'saveUserProfile' methods
 * 
 * this service handles the retrieval and saving of user profile data
 */

import DBService from "@/lib/boundary/db-service";
import { getApp, getApps, FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore, Firestore, doc, getDoc, setDoc } from "firebase/firestore";

class FirebaseDBService extends DBService<Record<string, unknown>> {

    private app: FirebaseApp;
    private db: Firestore;

    /**
     * Firebase configuration details loaded from environment varaibles.
     * this configuration is used to initialise the Firebase App instance.
     */
    private static config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    constructor() {
        super();

        // Initialize Firebase App if it doesn't exist, else fetch the initialized app
        this.app = !getApps().length ? initializeApp(FirebaseDBService.config) : getApp();

        // Initialize Firebase Auth
        this.db = getFirestore(this.app);

    }
    /** 
     * loads a user profile from Firestore by userID
     * 
     * this method fetches the user profile from the Firestore database using the userID
     * the profile is retrieved 
     * 
     * @param {string} userId - unique identifier of the user
     * @returns {Promise<Record<string,unknown> | null>} a promise that resolves to the user profile data if found or 'null' if no profile exists.
     */
    async loadUserProfile(userId: string): Promise<Record<string, unknown> | null> {
        try {
            const userDoc = doc(this.db, "users", userId);
            const userSnap = await getDoc(userDoc);

            if (userSnap.exists()) {
                return userSnap.data();
            }
            else {
                console.error(`No user profile found for userId: ${userId}`);
                return null;
            }
        }
        catch (error) {
            console.error("Error loading user profile: ", error);
            throw error;
        }
    }
    /**
     * save or updates a user profile in Firestore
     * 
     * this method saves or updates the user profile data in Firestore database
     * 
     * @param {any} userProfileData - the user profile data to be saved or updated
     * @param {string} userId - the unique identifier of the user
     * @returns {Promise<Record<string,unknown> | null>} a promise that resolves when the operation is complete or 'null' if it fails.
     */
    async saveUserProfile(userProfileData: Record<string, unknown>, userId: string): Promise<Record<string, unknown> | null> {
        try {
            const userDoc = doc(this.db, "users", userId);
            await setDoc(userDoc, userProfileData);
            return userProfileData;
        }
        catch (error) {
            console.error("Error saving user profile: ", error);
            throw error;
        }
    }


}

export default FirebaseDBService;