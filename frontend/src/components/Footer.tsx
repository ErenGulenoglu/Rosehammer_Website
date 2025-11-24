import { Link } from "react-router-dom";

function Footer() {
	return (
		<div className="flex w-full justify-center items-center py-8 bg-[#0a0a0a]">
			<p className="w-[75%] text-muted-foreground text-sm text-center">
				Built by{" "}
				<Link className="font-bold underline" to="https://www.linkedin.com/in/eren-gulenoglu-95690627b/">
					Eren Gulenoglu
				</Link>
				. This project uses React components and styling sourced from{" "}
				<Link className="font-bold underline" to="https://ui.shadcn.com/">
					shadcn/ui
				</Link>
				.
			</p>
		</div>
	);
}

export default Footer;
