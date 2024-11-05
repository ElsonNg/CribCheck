
import Footer from "@/components/general/footer";
import LoginWrapper from "@/components/login/login-wrapper";

export default function HomePage() {

    return (
        <div className="animate-fadeIn min-h-screen flex flex-col">
            <main className="grow flex flex-col justify-center items-center gap-24">
                <h1 className="text-5xl font-bold">
                    🏠 CribCheck
                </h1>
                <LoginWrapper/>
            </main>
            <Footer />
        </div>
    );

}
