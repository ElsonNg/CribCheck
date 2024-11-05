import Footer from "@/components/general/footer";
import Link from "next/link";


export default function NotFoundPage() {
    return (<div className="animate-fadeIn min-h-screen flex flex-col">
        <main className="grow flex flex-col justify-center items-center gap-24">
            <h1 className="text-5xl font-bold">
                🏠 CribCheck
            </h1>
            <span className="text-xl font-medium">Oops! Page Not Found</span>
            <Link href="/" className="text-center">
                <span className="text-[#0066CC] hover:text-[#0066CC]/60 hover:underline">
                    Return to Home
                </span>
            </Link>
        </main>
        <Footer />
    </div>)
}