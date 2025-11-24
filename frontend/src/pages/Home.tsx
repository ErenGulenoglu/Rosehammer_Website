import "../components/global.css";
import NavigationBar from "../components/NavigationBar";
import NavigationBarMobile from "../components/NavigationBarMobile";
import Footer from "@/components/Footer";

import { useEffect } from "react";
import banner from "../assets/oath_of_the_horatii.png";

import FadeInTextAnimation from "@/components/animations/FadeInTextAnimation";

function Home() {
	useEffect(() => {
		document.title = "Home | Rosehammer Studios";
	}, []);

	return (
		<div>
			<div className="sticky top-0 hidden lg:block z-50">
				<NavigationBar />
			</div>
			<div className="sticky top-0 block lg:hidden z-50">
				<NavigationBarMobile />
			</div>

			<div className="w-full flex items-center justify-center">
				<div
					className="flex flex-col w-[85%] items-center justify-center gap-6 py-65 bg-cover bg-center bg-no-repeat bg-blend-overlay bg-[#181818] rounded-lg md:py-110 lg:py-68 2xl:py-75"
					style={{ backgroundImage: `url(${banner})` }}
				>
					<FadeInTextAnimation>
						<h1 className="fantasy-text text-white text-4xl [text-shadow:0_0_10px_rgba(255,255,255,0.4)] sm:text-4xl md:text-6xl lg:text-8xl xl:text-8xl ">Somnium</h1>
					</FadeInTextAnimation>
					<FadeInTextAnimation>
						<h3 className="fantasy-text w-[75%] mx-auto text-white italic text-center [text-shadow:0_0_10px_rgba(255,255,255,0.4)] text-sm sm:text-md md:text-lg lg:text-xl">
							The apocalypse has long since come, the Wanderer has forgotten to claim their souls, and now they struggle to be reborn from their own ashes.
						</h3>
					</FadeInTextAnimation>
				</div>
			</div>

			<Footer />
		</div>
	);
}

export default Home;
