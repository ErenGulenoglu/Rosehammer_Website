import NavigationBar from "../components/NavigationBar";
import NavigationBarMobile from "../components/NavigationBarMobile";
import Footer from "@/components/Footer";
import ProductList from "../components/ProductList";

function Products() {
	return (
		<div className="min-h-screen w-full flex flex-col">
			<div className="sticky top-0 hidden lg:block z-50">
				<NavigationBar />
			</div>
			<div className="sticky top-0 block lg:hidden z-50">
				<NavigationBarMobile />
			</div>
			<main className="flex flex-grow justify-center items-center">
				<ProductList />
			</main>
			<Footer />
		</div>
	);
}

export default Products;
