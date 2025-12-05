import NavigationBar from "../components/NavigationBar";
import NavigationBarMobile from "../components/NavigationBarMobile";
import Footer from "../components/Footer";
import CartList from "../components/CartList";

function CartPage() {
	return (
		<div className="min-h-screen w-full flex flex-col">
			<div className="sticky top-0 hidden lg:block z-50">
				<NavigationBar />
			</div>
			<div className="sticky top-0 block lg:hidden z-50">
				<NavigationBarMobile />
			</div>
			<main className="flex justify-center items-center">
				<CartList />
			</main>
			<Footer />
		</div>
	);
}

export default CartPage;
