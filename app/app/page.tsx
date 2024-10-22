import Footer from "@/components/general/footer";
import NavBar from "@/components/general/nav-bar";
import ScreenContent from "@/components/screens/screen-content";
import { Suspense } from "react";


export default function AppPage() {

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="grow mx-auto w-full max-w-7xl mb-40">
        <NavBar />
        <main className="grow flex flex-col items-center p-4">
          <ScreenContent />
        </main>
      </div>
      <Footer />
      {/* <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_MAP_API}&libraries=places,geocoding`}
        strategy="beforeInteractive"
      /> */}
    </div >

  );
}