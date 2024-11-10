"use client"

import { useMasterController } from "@/context/master-controller-context";
import { ScreenState } from "@/lib/control/master-controller";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function NavBar() {

    const router = useRouter();
    const {masterController, currentUser} = useMasterController();
    const authController = masterController.getAuthController();


    async function handleLogout() {
        await authController.logout();
        router.push("/");
    }

    function handleHome() {
        masterController.setState(ScreenState.SelectingLocation);
    }


    return (
        <nav className="w-full mx-auto px-6 py-6 flex flex-col md:flex-row gap-8 justify-between items-center">
            <Link href="/app">
                <h1 className="text-3xl font-bold">
                    <span role="img" aria-label="home">🏠</span> CribCheck
                </h1>
            </Link>
            <div className="flex flex-row gap-6 md:gap-10 text-lg md:text-md">
                <Link href="/app" className="hover:text-gray-400 transition duration-300" onClick={handleHome}>
                    Home
                </Link>
                <Link href="/about">
                    About
                </Link>
                {!currentUser ? (
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