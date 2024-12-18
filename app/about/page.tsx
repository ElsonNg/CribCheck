import Footer from "@/components/general/footer";
import NavBar from "@/components/general/nav-bar";


export default function AboutPage() {

    return (
        <div className="animate-fadeInSlower w-full min-h-screen flex flex-col">
            <div className="grow mx-auto w-full max-w-7xl mb-40">
                <NavBar />
                <main className="grow flex flex-col items-center p-4 gap-12">
                    <div className="w-2xl flex flex-col gap-2 items-center text-center">
                        <h3 className="text-2xl font-bold text-center">Contributors</h3>
                        <span className="mt-2">This project is available on <a href="https://github.com/ElsonNg/CribCheck" className="underline">GitHub</a>.</span>
                        <ul className="mt-4 text-md">
                            <li><a href="https://github.com/angelkyliechan" title="Angel Chan Jin Xuan" className="hover:underline">Angel Chan Jin Xuan</a></li>
                            <li><a href="https://github.com/jodyng" title="Jody Ng Li Min" className="hover:underline">Jody Ng Li Min</a></li>
                            <li><a href="https://github.com/Joyyyccceee" title="Joyce Chen" className="hover:underline">Joyce Chen</a></li>
                            <li><a href="https://github.com/ElsonNg" title="Ng Yuan Da Elson" className="hover:underline">Ng Yuan Da Elson</a></li>
                            <li><a href="https://github.com/nickleezx" title="Nick Lee Zhi Xiang" className="hover:underline">Nick Lee Zhi Xiang</a></li>
                        </ul>
                    </div>
                    <div className="w-2xl flex flex-col gap-2 items-center text-center">
                        <h3 className="text-2xl font-bold text-center">Datasets & API</h3>
                        <ul>
                            <li><a href="https://www.data.gov.sg/" title="Data Gov SG" className="hover:underline">data.gov.sg</a></li>
                            <li><a href="https://developers.google.com/maps/documentation/javascript" title="Google Maps Javascript API" className="hover:underline">Google Maps Javascript API</a></li>
                        </ul>
                    </div>
                    <div className="w-2xl flex flex-col gap-2 items-center text-center">
                        <h3 className="text-2xl font-bold text-center">Credits</h3>
                        <ul>
                            <li><a href="https://www.flaticon.com/free-icons/singapore" title="singapore icons" className="hover:underline">Singapore icons created by Freepik - Flaticon</a></li>
                            <li><a href="https://www.freepik.com/free-vector/banner-with-diverse-happy-people-group-standing-together-white_12873006.htm" title="Singles" className="hover:underline">Singles Illustration designed by Freepik</a></li>
                            <li><a href="https://www.freepik.com/free-vector/collection-young-couples-walking_5524592.htm" title="Young couple" className="hover:underline">Young Couple Illustration designed by Freepik</a></li>
                            <li><a href="https://www.freepik.com/free-vector/hand-drawn-family-portrait_4112736.htm" title="Family" className="hover:underline">Family Illustration designed by Freepik</a></li>
                            <li><a href="https://www.freepik.com/free-vector/urban-buildings-cityscape-view-scenarios_4794195.htm" title="Urban Buildings Skyscraper" className="hover:underline">Urban buildings cityscape view scenarios created by jemastock - Freepik</a></li>
                        </ul>
                    </div>
                </main>
            </div>
            <Footer />
        </div >
    );

}