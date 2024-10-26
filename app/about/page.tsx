import Footer from "@/components/general/footer";
import NavBar from "@/components/general/nav-bar";


export default function AboutPage() {

    return (
        <div className="w-full min-h-screen flex flex-col">
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
                        <h3 className="text-2xl font-bold text-center">Credits</h3>
                        <ul>
                            <li><a href="https://www.flaticon.com/free-icons/singapore" title="singapore icons" className="hover:underline">Singapore icons created by Freepik - Flaticon</a></li>

                        </ul>
                    </div>
                </main>
            </div>
            <Footer />
        </div >
    );

}