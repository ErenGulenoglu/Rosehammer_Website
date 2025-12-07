import { useEffect, useState } from "react";
import api from "@/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

declare global {
	interface Window {
		paypal: any;
	}
}

export default function Checkout() {
	const { cart, clearCart, totalAmount } = useCart();
	const { user } = useAuth();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		street_address: "",
		city: "",
		state: "",
		postalCode: "",
		country: "",
	});

	// -----------------------------
	// Load PayPal script once
	// -----------------------------
	useEffect(() => {
		if (!cart.length) return;

		const existingScript = document.querySelector("#paypal-sdk");
		if (existingScript) {
			setLoading(false);
			return;
		}

		const script = document.createElement("script");
		script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=USD`;
		script.async = true;
		script.id = "paypal-sdk";
		script.onload = () => setLoading(false);
		document.body.appendChild(script);
	}, [cart.length]);

	// -----------------------------
	// Create PayPal order on backend
	// -----------------------------
	const createOrderOnServer = async () => {
		const res = await api.post(
			"/shop/paypal/create/",
			{
				...form,
				items: cart.map((item) => ({ id: item.id })),
			},
			{
				headers: { Authorization: `Bearer ${user?.token}` },
			}
		);
		return res.data;
	};

	// -----------------------------
	// Render PayPal button
	// -----------------------------
	useEffect(() => {
		if (loading || !window.paypal || !cart.length) return;

		window.paypal
			.Buttons({
				createOrder: async () => {
					try {
						const data = await createOrderOnServer();

						localStorage.setItem("django_order_id", data.django_order_id);
						localStorage.setItem("paypal_order_id", data.paypal_order_id);

						return data.paypal_order_id;
					} catch (err: any) {
						setError("Error creating PayPal order");
						console.error(err);
						return "";
					}
				},
				onApprove: async () => {
					try {
						const django_order_id = localStorage.getItem("django_order_id");
						const paypal_order_id = localStorage.getItem("paypal_order_id");

						await api.post("/shop/paypal/capture/", { django_order_id, paypal_order_id }, { headers: { Authorization: `Bearer ${user?.token}` } });

						clearCart();
						navigate(`/order-success/${django_order_id}`);
					} catch (err) {
						setError("Error capturing PayPal order");
						console.error(err);
					}
				},
				onError: (err: any) => {
					setError("PayPal error occurred");
					console.error(err);
				},
			})
			.render("#paypal-button-container");
	}, [loading, cart, form]);

	// -----------------------------
	// Render form + PayPal
	// -----------------------------
	return (
		<div className="max-w-2xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Checkout</h1>

			{error && <p className="text-red-600 mb-4">{error}</p>}

			<div className="flex flex-col gap-2 mb-4">
				<input placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="input" />
				<input placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="input" />
				<input placeholder="Street Address" value={form.street_address} onChange={(e) => setForm({ ...form, street_address: e.target.value })} className="input" />
				<input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input" />
				<input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input" />
				<input placeholder="Postal Code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className="input" />
				<input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input" />
			</div>

			<div id="paypal-button-container" className="mt-4"></div>
		</div>
	);
}
