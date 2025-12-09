import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "@/api";

import { Field, FieldGroup, FieldLabel } from "../components/ui/field";
import { Input } from "../components/ui/input";

declare global {
	interface Window {
		paypal: any;
	}
}

function CheckoutForm() {
	const { cart, clearCart, totalAmount } = useCart();
	const { user } = useAuth();
	const navigate = useNavigate();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [street_address, setStreetAdresss] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [postalCode, setPostalCode] = useState("");
	const [country, setCountry] = useState("");

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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

	const createOrderOnServer = async () => {
		console.log(firstName, lastName, street_address, city, state, postalCode, country);

		const firstNameValue = (document.getElementById("firstName") as HTMLInputElement)?.value;
		const lastNameValue = (document.getElementById("lastName") as HTMLInputElement)?.value;
		const streetAddressValue = (document.getElementById("street_address") as HTMLInputElement)?.value;
		const cityValue = (document.getElementById("city") as HTMLInputElement)?.value;
		const stateValue = (document.getElementById("state") as HTMLInputElement)?.value;
		const postalCodeValue = (document.getElementById("postalCode") as HTMLInputElement)?.value;
		const countryValue = (document.getElementById("country") as HTMLInputElement)?.value;

		const res = await api.post(
			"/shop/paypal/create/",
			{
				firstName: firstNameValue,
				lastName: lastNameValue,
				street_address: streetAddressValue,
				city: cityValue,
				state: stateValue,
				postalCode: postalCodeValue,
				country: countryValue,
				items: cart.map((item) => ({ id: item.id })),
			},
			{ headers: { Authorization: `Bearer ${user?.token}` } }
		);

		// const res = await api.post(
		// 	// does not send data. It needs to be fixed.
		// 	"/shop/paypal/create/",
		// 	{
		// 		firstName: firstName,
		// 		lastName: lastName,
		// 		street_address: street_address,
		// 		city: city,
		// 		state: state,
		// 		postalCode: postalCode,
		// 		country: country,
		// 		items: cart.map((item) => ({ id: item.id })),
		// 	},
		// 	{
		// 		headers: { Authorization: `Bearer ${user?.token}` },
		// 	}
		// );
		return res.data;
	};

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
						console.error(err.response.data);
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
					} catch (err: any) {
						setError("Error capturing PayPal order");
						console.error(err);
						console.error(err.response.data);
					}
				},
				onError: (err: any) => {
					setError("PayPal error occurred");
					console.error(err);
					console.error(err.response.data);
				},
			})
			.render("#paypal-button-container");
	}, [loading, cart.length]);

	return (
		<div className="w-[75%] flex flex-col gap-4 justify-center items-center lg:w-[%50]">
			<h1 className="text-2xl font-bold mb-4">Checkout: {totalAmount}</h1>

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

			{error && <p className="text-red-600 mb-4">{error}</p>}

			<FieldGroup className="w-[50%]">
				<div className="inline-flex">
					<Field>
						<FieldLabel htmlFor="firstName">First Name</FieldLabel>
						<Input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" required />
					</Field>

					<Field>
						<FieldLabel htmlFor="password">Last Name</FieldLabel>
						<Input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" required />
					</Field>
				</div>
				<div className="inline-flex">
					<Field>
						<FieldLabel htmlFor="street_address">Street Address</FieldLabel>
						<Input id="street_address" type="text" value={street_address} onChange={(e) => setStreetAdresss(e.target.value)} placeholder="Water Steet Dr" required />
					</Field>
					<Field>
						<FieldLabel htmlFor="city">City</FieldLabel>
						<Input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Berlin" required />
					</Field>
				</div>
				<div className="inline-flex">
					<Field>
						<FieldLabel htmlFor="state">State</FieldLabel>
						<Input id="state" type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="Alberta" required />
					</Field>
					<Field>
						<FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
						<Input id="postalCode" type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="ABC 123" required />
					</Field>
				</div>

				<Field>
					<FieldLabel htmlFor="country">Country</FieldLabel>
					<Input id="country" type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Canada" required />
				</Field>
			</FieldGroup>

			<div id="paypal-button-container" className="mt-4"></div>
		</div>
	);
}

export default CheckoutForm;
