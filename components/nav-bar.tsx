"use client"

import { authController } from "@/lib/control/auth-controller";
import { dataGovController } from "@/lib/control/data-gov-controller";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";


export default function NavBar() {

    const authUser = authController.getCurrentUser();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    async function handleLogout() {
        await authController.signOut();
        router.refresh();
    }

    function handleTest() {
        startTransition(() => {
            fetchGeoJson();
        });
    }

    async function fetchGeoJson() {
        const r = await dataGovController.fetchGeoJSON("d_61eefab99958fd70e6aab17320a71f1c");
        console.log(r);
    }

    return (
        <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex flex-row justify-between items-center">
            <Link href="/app">
                <h1 className="text-3xl font-bold">
                    <span role="img" aria-label="home">🏠</span> CribCheck
                </h1>
            </Link>
            <div className="flex flex-row gap-6 md:gap-10 text-md">
                <Link href="#" className="hover:text-gray-400 transition duration-300">
                    Home
                </Link>
                <button disabled={isPending} onClick={handleTest}>
                    Test
                </button>
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