import Footer from "@/components/general/footer";
import NavBar from "@/components/general/nav-bar";
import ScreenContent from "@/components/screens/screen-content";
import { APIProvider } from "@vis.gl/react-google-maps";


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
    </div>

  );
}