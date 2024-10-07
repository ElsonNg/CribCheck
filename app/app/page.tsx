<<<<<<< HEAD
import Footer from "@/components/general/footer";
import NavBar from "@/components/general/nav-bar";
import ScreenContent from "@/components/screens/screen-content";
=======
import Footer from "@/components/footer";
import NavBar from "@/components/nav-bar";
import SearchLocation from "@/components/searchlocation/search-location-elements"
>>>>>>> aeae7dc (Added location search UI)


export default function AppPage() {

<<<<<<< HEAD
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
=======
    return (
        <div className="w-full h-screen flex flex-col">
          <NavBar />
          <div className="min-height: fit-content flex flex-col justify-center items-center">
            <SearchLocation />
          </div>
          <Footer/>
        </div>
      );
>>>>>>> aeae7dc (Added location search UI)
}