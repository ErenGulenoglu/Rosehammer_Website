import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import api from "../api";
import { toast } from "sonner";
import NavigationBar from "../components/NavigationBar";
import NavigationBarMobile from "../components/NavigationBarMobile";
import Footer from "@/components/Footer";
import { useAuth } from "../components/AuthContext";

const CheckoutPage: React.FC = () => {
	const { cart, clearCart, totalAmount } = useCart();
	const [address, setAddress] = useState("");
	const [loading, setLoading] = useState(false);
	const { user } = useAuth();

	const handleCheckout = async () => {
		if (!address) {
			toast.error("Please enter your address");
			return;
		}

		if (cart.length === 0) {
			toast.error("Your cart is empty");
			return;
		}

		setLoading(true);

		try {
			const response = await api.post(
				"/shop/create_order/",
				{ items: cart, address },
				{
					headers: { Authorization: `Bearer ${user?.token}` },
				}
			);

			if (response.data.order_id) {
				toast.success("Order placed successfully!");
				clearCart();
				setAddress("");
			}
		} catch (error: any) {
			toast.error(error.response?.data?.detail || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen w-full flex flex-col">
			<div className="sticky top-0 hidden lg:block z-50">
				<NavigationBar />
			</div>
			<div className="sticky top-0 block lg:hidden z-50">
				<NavigationBarMobile />
			</div>
			<main className="w-[75%] mx-auto p-4">
				<h1 className="text-2xl font-bold mb-4">Checkout</h1>

				{cart.length === 0 ? (
					<p>Your cart is empty</p>
				) : (
					<>
						<div className="mb-4">
							{cart.map((item) => (
								<div key={item.id} className="flex justify-between items-center border rounded p-4 mb-2">
									<div className="flex items-center gap-4">
										<img src={item.image} alt={item.name} className="h-20 object-contain" />
										<div>
											<h3 className="font-semibold">{item.name}</h3>
											<p className="text-sm text-muted-foreground">${parseFloat(item.price).toFixed(2)}</p>
										</div>
									</div>
								</div>
							))}
						</div>

						<div className="mb-4 font-semibold text-lg">Total: ${totalAmount.toFixed(2)}</div>

						<div className="mb-4">
							<label className="block mb-1 font-medium">Address:</label>
							<textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="w-full border rounded p-2" />
						</div>

						<button onClick={handleCheckout} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50">
							{loading ? "Placing order..." : "Place Order"}
						</button>
					</>
				)}
			</main>
			<Footer />
		</div>
	);
};

export default CheckoutPage;
