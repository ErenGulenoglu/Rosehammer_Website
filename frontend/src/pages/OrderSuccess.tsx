import NavigationBar from "../components/NavigationBar";
import NavigationBarMobile from "../components/NavigationBarMobile";
import Footer from "../components/Footer";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/api";
import { useAuth } from "@/components/AuthContext";

export default function Checkout() {
	const { id } = useParams();
	const { user } = useAuth();

	const [order, setOrder] = useState<any>(null);
	const [items, setItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!id) return;

		api
			.get(`/shop/orders/${id}/`, {
				headers: {
					Authorization: `Bearer ${user?.token}`,
				},
			})
			.then((res) => {
				setOrder(res.data);
				setItems(res.data.items || []);
			})
			.catch((err) => {
				console.error("Failed to load order:", err);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [id]);

	if (loading) {
		return <p className="text-center mt-10">Loading order…</p>;
	}

	return (
		<div className="min-h-screen w-full flex flex-col">
			<div className="sticky top-0 hidden lg:block z-50">
				<NavigationBar />
			</div>
			<div className="sticky top-0 block lg:hidden z-50">
				<NavigationBarMobile />
			</div>

			<main className="flex justify-center items-center">
				<div className="max-w-3xl mx-auto mt-10 space-y-6">
					<h1 className="text-3xl font-bold text-green-600">Order Confirmed</h1>

					<p className="text-muted-foreground">Thank you for your purchase!</p>

					<div className="border rounded p-4">
						<p>
							<strong>Order ID:</strong> {id}
						</p>
						{order && (
							<>
								<p>
									<strong>Total:</strong> ${order.total_amount}
								</p>
								<p>
									<strong>Date:</strong> {new Date(order.created_at).toLocaleString()}
								</p>
							</>
						)}
					</div>

					<div className="border rounded p-4">
						<h2 className="font-semibold mb-2">Items</h2>

						{items.length ? (
							items.map((item) => (
								<div key={item.id} className="flex items-center justify-between gap-4 mb-2">
									<div className="flex items-center gap-3">
										<img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-contain" />
										<span>{item.product.name}</span>
									</div>
									<span>${parseFloat(item.price_at_purchase).toFixed(2)}</span>
								</div>
							))
						) : (
							<p className="text-sm text-muted-foreground">Items unavailable</p>
						)}
					</div>

					<div className="flex justify-between">
						<Link to="/orders" className="underline">
							View my orders
						</Link>

						<Link to="/products" className="underline">
							Continue shopping
						</Link>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
