/**
 * @class FirebaseAuthService
 * 
 * This class provides authentication services using Firebase.
 * It extends the `AuthService` abstract class and implements its `loginWithGoogle` and `logout` methods.
 * 
 * This service handles login and logout functionalities and returns user information 
 * or a status upon completion of the actions. The authentication method used here is Firebase-based.
 */

import AuthService from "@/lib/boundary/auth-service";
import { FirebaseApp, FirebaseError, FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth, User as FirebaseUser, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

class FirebaseAuthService extends AuthService<FirebaseUser> {


    private app: FirebaseApp;
    private auth: Auth;
    private googleProvider: GoogleAuthProvider;

    /**
     * Firebase configuration details loaded from environment variables.
     * This configuration is used to initialize the Firebase App instance.
     */
    private static config: FirebaseOptions = {
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
        this.app = !getApps().length ? initializeApp(FirebaseAuthService.config) : getApp();

        // Initialize Firebase Auth
        this.auth = getAuth(this.app);

        this.googleProvider = new GoogleAuthProvider();
    }

    /**
      * Logs in the user with Google using Firebase Authentication.
      * 
      * This method opens a Google login popup, allowing the user to sign in with their Google account.
      * If successful, it returns the `FirebaseUser` object representing the authenticated user.
      * 
      * @returns {Promise<FirebaseUser | null>} A promise that resolves to the authenticated Firebase user, or `null` if login fails.
      */
    async loginWithGoogle(): Promise<FirebaseUser | null> {
        try {

            const result = await signInWithPopup(this.auth, this.googleProvider);
            const user = result.user;
            return user;

        } catch (error) {
            
            const firebaseError = error as FirebaseError;

            if (firebaseError.code === 'auth/popup-closed-by-user') {
                console.warn("Google sign-in was canceled by the user.");
                return null;
            }
            
            console.error("Error signing in with Google: ", error);
            return null;
        }
    }

    /**
     * Logs out the currently authenticated user using Firebase Authentication.
     * 
     * This method signs out the current user from Firebase Authentication.
     * 
     * @returns {Promise<boolean>} A promise that resolves to `true` if the logout was successful, or `false` if an error occurred.
     */
    async logout(): Promise<boolean> {
        try {
            await this.auth.signOut();
            return true;
        } catch (error) {
            console.error("Error signing out: ", error);
            return false;
        }
    }

    /**
     * Retrieves the currently authenticated user from Firebase Authentication.
     * 
     * This method returns the `FirebaseUser` object representing the currently authenticated user.
     * If no user is authenticated, it returns `null`.
     * 
     * @returns {FirebaseUser | null} The authenticated Firebase user, or `null` if no user is currently logged in.
     */
    getCurrentUser(): FirebaseUser | null {
        return this.auth.currentUser;
    }


}

export default FirebaseAuthService;