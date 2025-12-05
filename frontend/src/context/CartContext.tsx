import { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "../types/Product";

type CartContextType = {
	cart: Product[];
	addToCart: (product: Product) => void;
	removeFromCart: (id: number) => void;
	clearCart: () => void;
	totalAmount: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [cart, setCart] = useState<Product[]>(() => {
		const saved = localStorage.getItem("cart");
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(cart));
	}, [cart]);

	const addToCart = (product: Product) => {
		setCart((prev) => {
			if (prev.some((p) => p.id === product.id)) return prev; // prevent duplicates
			return [...prev, product];
		});
	};

	const removeFromCart = (id: number) => {
		setCart((prev) => prev.filter((p) => p.id !== id));
	};

	const clearCart = () => setCart([]);

	const totalAmount = cart.reduce((sum, p) => sum + parseFloat(p.price), 0);

	return <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalAmount }}>{children}</CartContext.Provider>;
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) throw new Error("useCart must be used inside a CartProvider");
	return context;
}
