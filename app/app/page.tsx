import Footer from "@/components/footer";
import NavBar from "@/components/nav-bar";


export default function AppPage() {

    return (
        <div className="w-full h-screen flex flex-col">
          <NavBar />
          <Footer/>
        </div>
      );
}