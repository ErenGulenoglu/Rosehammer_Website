import React, { useEffect, useState } from "react";
import api from "@/api";
import type { Product } from "../types/Product";
import ProductCard from "./ProductCard";

const ProductList: React.FC = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		api
			.get<Product[]>("/shop/products/")
			.then((res) => {
				setProducts(res.data);
			})
			.catch((err) => {
				console.error("Error fetching products:", err);
				setError("Failed to load products.");
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <p>Loading products...</p>;
	if (error) return <p style={{ color: "red" }}>{error}</p>;
	if (products.length === 0) return <p>No products available.</p>;

	return (
		<div className="product-grid w-full flex flex-wrap items-start justify-center gap-6 p-6">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
};

export default ProductList;
