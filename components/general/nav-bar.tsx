"use client"

import { useMasterController } from "@/context/master-controller-context";
import { ScreenState } from "@/lib/control/master-controller";
import AuthUserEntity from "@/lib/entities/auth-user-entity";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";


export default function NavBar() {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const masterController = useMasterController();
    const authController = masterController.getAuthController();

    // State to hold the `authUser` once it is available
    const [authUser, setAuthUser] = useState<AuthUserEntity | null>(null);

    // Fetch the current user on the client side
    useEffect(() => {
        const currentUser = authController.getCurrentUser();
        setAuthUser(currentUser);
    }, [authController]);


    

    async function handleLogout() {
        await authController.logout();
        router.push("/");
    }

    function handleHome() {
        masterController.setState(ScreenState.SelectingLocation);
    }


    return (
        <nav className="w-full mx-auto px-6 py-6 flex flex-row justify-between items-center">
            <Link href="/app">
                <h1 className="text-3xl font-bold">
                    <span role="img" aria-label="home">🏠</span> CribCheck
                </h1>
            </Link>
            <div className="flex flex-row gap-6 md:gap-10 text-md">
                <Link href="#" className="hover:text-gray-400 transition duration-300" onClick={handleHome}>
                    Home
                </Link>
                <Link href="/about">
                    About
                </Link>
                {!authUser ? (
                    <Link href="/" className="hover:text-gray-400 transition duration-300">
                        Login
                    </Link>
                )
                    :
                    (
                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    )
                }
            </div>
        </nav>
    );

}