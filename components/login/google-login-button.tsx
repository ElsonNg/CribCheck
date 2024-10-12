"use client"

import Image from "next/image";
import GoogleIcon from "@/app/images/google-icon.png";
import { useRouter } from "next/navigation";
import MasterController from "@/lib/control/master-controller";
import { useMasterController } from "@/context/master-controller-context";


export default function GoogleLoginButton() {
    
    const masterController = useMasterController();
    const router = useRouter();
    
    async function handleSignInWithGoogle() {
        const authController = masterController.getAuthController();
        const user = await authController.loginWithGoogle();
        if(user)
            router.push("/app");
    }

    return (<button
        onClick={handleSignInWithGoogle}
        className="group bg-white border-gray-400 border-2 rounded py-2.5 px-12 flex flex-row items-center justify-center gap-2">
        <Image src={GoogleIcon} alt="Google logo" width={20} height={20} className="group-hover:opacity-60" />
        <span className="group-hover:opacity-60">Sign in with Google</span>
    </button>)
}