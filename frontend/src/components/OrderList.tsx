import { useEffect, useState } from "react";
import api from "@/api";
import { useAuth } from "../components/AuthContext";

interface Product {
	id: string;
	name: string;
	price: string;
	image: string;
	type: string;
	rating: number;
	rating_count: number;
}

interface OrderItem {
	id: string;
	product: Product; // ✅ OBJECT, not number
	price_at_purchase: string;
}

interface Order {
	id: string;
	total_amount: string;
	is_paid: boolean;
	created_at: string;
	items: OrderItem[];
}

function OrderList() {
	const { user } = useAuth();
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const handleDelete = async (orderId: string) => {
		if (!user?.token) return;

		try {
			await api.delete(`/shop/orders/${orderId}/delete/`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			});

			// Remove order from UI instantly
			setOrders((prev) => prev.filter((o) => o.id !== orderId));
		} catch (err) {
			alert("Failed to delete order");
			console.error(err);
		}
	};

	useEffect(() => {
		if (!user?.token) return;

		const fetchOrders = async () => {
			try {
				const res = await api.get("/shop/orders", {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				});
				setOrders(res.data);
				console.log("Fetched orders:", res.data);
			} catch (err) {
				setError("Failed to load orders");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, [user]);

	if (loading) {
		return <p className="p-4">Loading orders...</p>;
	}

	if (error) {
		return <p className="p-4 text-red-600">{error}</p>;
	}

	if (orders.length === 0) {
		return <p className="p-4">You have no orders yet.</p>;
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">My Orders</h1>

			<div className="space-y-4">
				{orders.map((order) => (
					<div key={order.id} className="border rounded-lg p-4 shadow-sm">
						<div className="flex justify-between items-center mb-2">
							<p className="font-semibold">Order #{order.id}</p>

							<div className="flex items-center gap-3">
								<span className={`text-sm font-medium ${order.is_paid ? "text-green-600" : "text-yellow-600"}`}>{order.is_paid ? "Paid" : "Pending"}</span>

								{!order.is_paid && (
									<button onClick={() => handleDelete(order.id)} className="text-sm text-red-600 hover:underline">
										Delete
									</button>
								)}
							</div>
						</div>

						<p className="text-sm text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</p>

						<p className="mt-2 font-semibold">Total: ${parseFloat(order.total_amount).toFixed(2)}</p>

						<div className="mt-3">
							<h3 className="font-medium mb-1">Items</h3>
							<ul className="text-sm list-disc ml-5">
								{order.items.map((item) => (
									<li key={item.id} className="flex items-center gap-3">
										<img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-contain" />
										<span>
											{item.product.name} — ${parseFloat(item.price_at_purchase).toFixed(2)}
										</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default OrderList;
