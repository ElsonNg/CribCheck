
import Footer from "@/components/general/footer";
import GoogleLoginButton from "@/components/login/google-login-button";
import Link from "next/link";

export default function HomePage() {

    return (
        <div className="animate-fadeIn min-h-screen flex flex-col">
            <main className="grow flex flex-col justify-center items-center gap-24">
                <h1 className="text-5xl font-bold">
                    🏠 CribCheck
                </h1>
                <div className="flex flex-col gap-8">
                    <GoogleLoginButton />
                    <Link href="/app" className="text-center">
                        <button className="text-[#0066CC] hover:text-[#0066CC]/60 font-normal">
                            Continue as guest
                        </button>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );

}
