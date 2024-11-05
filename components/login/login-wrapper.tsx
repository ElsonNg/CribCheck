"use client"

import Link from "next/link";
import GoogleLoginButton from "./google-login-button";
import { useMasterController } from "@/context/master-controller-context";


export default function LoginWrapper() {

    const { currentUser } = useMasterController();

    if (currentUser)
        return (<div className="flex flex-col gap-8">
            <h1 className="text-2xl font-medium text-center">Welcome, {currentUser.getName()}!</h1>
            <Link href="/app" className="text-center">
                <span className="text-[#0066CC] hover:text-[#0066CC]/60 hover:underline">
                    Continue to app
                </span>
            </Link>
        </div>);

    return (
        <div className="flex flex-col gap-8">
            <GoogleLoginButton />
            <Link href="/app" className="text-center">
                <span className="text-[#0066CC] hover:text-[#0066CC]/60 hover:underline">
                    Continue as guest
                </span>
            </Link>
        </div>
    );

}