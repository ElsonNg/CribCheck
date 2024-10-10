import Footer from "@/components/footer";
import NavBar from "@/components/nav-bar";
import TestHawker from "@/components/report/test-hawker";


export default function AppPage() {

    return (
        <div className="w-full h-screen flex flex-col">
          <NavBar />
          <TestHawker/>
          <Footer/>
        </div>
      );
}