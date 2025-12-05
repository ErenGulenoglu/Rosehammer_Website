import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

function CartList() {
	const { cart, removeFromCart, totalAmount } = useCart();
	return (
		<div className="w-[75%] flex flex-col gap-4 justify-center items-start lg:w-[%50]">
			{/* <div className="w-full flex flex-wrap items-start justify-center gap-6 p-6"> */}
			<h1 className="text-2xl font-bold mb-6">Your Cart</h1>
			{cart.map((item) => (
				<div key={item.id} className="w-full flex flex-col items-center justify-between p-4 border rounded-lg lg:flex-row">
					<div className="flex flex-col items-center gap-4 lg:flex-row">
						<img src={item.image} alt={item.name} className="h-[20vh] object-contain" />
						<div>
							<h3 className="font-semibold">{item.name}</h3>
							<p className="text-muted-foreground text-sm">${parseFloat(item.price).toFixed(2)}</p>
						</div>
					</div>
					<Button className="cursor-pointer" variant="destructive" onClick={() => removeFromCart(item.id)}>
						Remove
					</Button>
				</div>
			))}
			<h2 className="text-xl font-bold">Total: ${totalAmount.toFixed(2)}</h2>
			<Link to="/checkout">
				<Button className="w-full cursor-pointer" size="lg">
					Proceed to Checkout
				</Button>
			</Link>
		</div>
	);
}

export default CartList;
