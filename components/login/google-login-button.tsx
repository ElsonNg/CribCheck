"use client"

import Image from "next/image";
import GoogleIcon from "@/app/images/google-icon.png";
import { useRouter } from "next/navigation";
import { useMasterController } from "@/context/master-controller-context";
import { useEffect, useTransition } from "react";


export default function GoogleLoginButton() {

    const {masterController, currentUser} = useMasterController();
    const profileController = masterController.getProfileController();
    const authController = masterController.getAuthController();
    const router = useRouter();

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if(currentUser)
            router.push("/app");
    }, [authController, currentUser, router]);


    // Logins the user with Google and fetches their profile
    function handleSignInWithGoogle() {
        startTransition(async () => {
            const authController = masterController.getAuthController();
            const user = await authController.loginWithGoogle();
            if (user) {
                await profileController.loadUserProfile(user.getId());
                router.push("/app");
            }
        });
    }

    return (<button
        onClick={handleSignInWithGoogle}
        disabled={isPending}
        className="group bg-white border-gray-400 border-2 rounded py-2.5 px-12 flex flex-row items-center justify-center gap-2">
        <Image src={GoogleIcon} alt="Google logo" width={20} height={20} className="group-hover:opacity-60" />
        <span className="group-hover:opacity-60">Sign in with Google</span>
    </button>)
}