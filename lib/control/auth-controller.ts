
import { firebaseAuth } from "@/app/firebase/config";
import { Auth, GoogleAuthProvider, signInWithPopup, User, } from "firebase/auth";


class AuthController {

    private auth: Auth;
    private googleProvider: GoogleAuthProvider;

    constructor(auth: Auth) {
        this.auth = auth;
        this.googleProvider = new GoogleAuthProvider();
    }

    async signInWithGoogle(): Promise<User | null> {

        try {

            const result = await signInWithPopup(this.auth, this.googleProvider);
            const user = result.user;
            return user;

        } catch (error) {
            console.error("Error signing in with Google: ", error);
            return null;
        }

    }

    async signOut(): Promise<void> {
        try {
            await this.auth.signOut();
            console.log("SIGN OUT!");
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    }

    getCurrentUser(): User | null {
        return this.auth.currentUser;
    }
}

export const authController = new AuthController(firebaseAuth);