import "../components/global.css";

import NavigationBar from "../components/NavigationBar";
import NavigationBarMobile from "../components/NavigationBarMobile";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";

import { useEffect } from "react";

import image1 from "../assets/faithful_unto_death.jpg";
import image2 from "../assets/imaginary_view_of_rome_with_equestrian.jpg";
import image3 from "../assets/modern_rome.jpg";

import api from "@/api";
import FadeInTextAnimation from "@/components/animations/FadeInTextAnimation";

function LoTA() {
	useEffect(() => {
		document.title = "The Land of The Awakened | Rosehammer Studios";
	}, []);

	return (
		<div className="flex flex-col items-center justify-center">
			<div className="w-full sticky top-0 hidden lg:block z-50">
				<NavigationBar />
			</div>
			<div className="w-full  sticky top-0 block lg:hidden z-50">
				<NavigationBarMobile />
			</div>
			<div className="w-full flex flex-col items-center justify-center">
				<div
					className="flex flex-col w-[85%] items-center justify-center py-20 bg-cover bg-center bg-no-repeat bg-blend-overlay bg-[#181818] rounded-b-lg gap-5 lg:gap-10 lg:py-60"
					style={{ backgroundImage: `url(${image3})` }}
				>
					<div className="flex flex-col w-[75%] items-center justify-center">
						<h1 className="fantasy-text text-white font-bold text-center opacity-50 text-2xl md:text-3xl lg:text-6xl">Welcome to</h1>
						<FadeInTextAnimation>
							<h1 className="fantasy-text text-white font-bold underline underline-offset-8 text-center text-2xl md:text-3xl lg:text-6xl">The Land of The Awakened</h1>
						</FadeInTextAnimation>
					</div>
					<div className="flex w-[75%] items-center justify-center md:w-[65%]">
						<h3 className="fantasy-text text-white italic text-left text-sm sm:text-lg md:text-lg lg:text-2xl">
							&nbsp;&nbsp;&nbsp;&nbsp;"About twenty years after the War of Flames... The world has lost an Alf tree, and the ruins of the war are still being repaired. The should be protectors of the
							Somnium are weakened warring with each other. Evil is on the rise siezing the opportunity. Adventurers are needed like never before."
						</h3>
					</div>
				</div>
				<div className="flex flex-col w-[85%] lg:flex-row  items-center justify-center py-20 gap-12 md:gap-0 rounded-lg">
					<div className="flex flex-col w-[75%] lg:w-[50%] items-center justify-center md:pb-10 lg:pb-0">
						<img src={image2} alt="LoTA Art of City" className="w-[55%] min-w-xs rounded-md" />
					</div>
					<div className="flex flex-col w-[75%] items-left justify-center gap-6">
						<FadeInTextAnimation onetime={false}>
							<h2 className="fantasy-text scroll-m-20 border-b pb-2 text-3xl tracking-tight first:mt-0">Introduction to The Land of The Awakened</h2>
						</FadeInTextAnimation>
						<FadeInTextAnimation onetime={false}>
							<p className="leading-7 [&:not(:first-child)]:mt-6">
								The Land of The Awakened is a religious term brought by The Church of The Eight, which shapes the political boundaries of the habitation space of the sleepers—creations of the eight
								dreamers that carry free will. The Land of The Awakened—or LoTA is the central geography in the world of Somnium, where the sleepers struggle in order to protect their civilizations
								and survive.
							</p>
							<p className="leading-7 [&:not(:first-child)]:mt-6">
								What makes LoTA unique is the access to arcane powers being scarce, and other magical practices such as holy magic and nature magic being questioned by The Church of The Eight. People
								who carry these powers tend to not reveal themselves out of the fear that they might find themselves burning in a steak, their sentence read by the bishop of their diocese. The
								practice of arcane magic is forbid to humans by the elves after the War of Flames. However, this reservence is different in countries other than the Senate and People of Utland.
							</p>
							<p className="leading-7 [&:not(:first-child)]:mt-6">
								Especially countries like Gerontocracy of Ard Caëd, Kingdom of Dol Caëd, and Veretia is where gnomes, halflings, and elves interact with arcane in their lives more freely, connected to
								their differences in beliefs with SPQU. They became more conservative with their arcane after the War of Flames, and the destruction that humans caused.
							</p>
							<p className="leading-7 [&:not(:first-child)]:mt-6">
								After the War of Flames, when the countries are tired and elves turned their heads of a darkness rising in further south of the Endless Forest, decentralized power groups and
								individuals are in need of adventurers who will help them to pick of the meats of political, military, economic, religious, and magical influence from the bones of the Land of The
								Awakened.
							</p>
							<p className="leading-7 [&:not(:first-child)]:mt-6">
								LoTA is a medieval low-fantasy setting that can be played with many different TTRPG systems such as Dungeons & Dragons, Pathfinder, Fate, and many more.
							</p>
						</FadeInTextAnimation>
					</div>
				</div>
				<div className="flex flex-col lg:flex-row w-[85%] items-center justify-center pb-20 gap-12 md:gap-0 rounded-lg">
					<div className="flex flex-col w-[75%] lg:w-[50%] items-start justify-start gap-6">
						<h3 className="fantasy-text scroll-m-20 text-2xl font-semibold tracking-tight underline">Download Introductionary Material for LoTA</h3>
						<div className="flex w-full items-start justify-start pb-20 lg:pb-0">
							<Button
								onClick={async () => {
									const res = await api.get("/api/download/paper-structure.pdf", { responseType: "blob" });
									const url = URL.createObjectURL(new Blob([res.data]));
									const a = document.createElement("a");
									a.href = url;
									a.download = "paper-structure.pdf";
									a.click();
									a.remove();
								}}
								variant="outline"
								className="cursor-pointer"
							>
								Download PDF (coming soon)
							</Button>
						</div>
					</div>
					<div className="flex w-[75%] md:w-[50%] items-center justify-center">
						<img src={image1} alt="LoTA Art of Soldier" className="w-[55%] min-w-xs rounded-md" />
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default LoTA;
