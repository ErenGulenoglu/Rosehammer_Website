import { useEffect, useState } from "react";
import api from "@/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

import { Field, FieldDescription, FieldGroup, FieldLabel } from "../components/ui/field";
import { Input } from "../components/ui/input";

import NavigationBar from "../components/NavigationBar";
import NavigationBarMobile from "../components/NavigationBarMobile";
import CheckoutForm from "../components/CheckoutForm";
import Footer from "../components/Footer";

declare global {
	interface Window {
		paypal: any;
	}
}

export default function Checkout() {
	const { cart } = useCart();

	return (
		<div className="min-h-screen w-full flex flex-col">
			<div className="sticky top-0 hidden lg:block z-50">
				<NavigationBar />
			</div>
			<div className="sticky top-0 block lg:hidden z-50">
				<NavigationBarMobile />
			</div>

			<main className="flex justify-center items-center">
				{cart.length === 0 ? (
					<p>Your cart is empty</p>
				) : (
					<>
						<CheckoutForm />
					</>
				)}
			</main>

			<Footer />
		</div>
	);
}
