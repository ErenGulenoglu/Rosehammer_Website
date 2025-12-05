import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/api";
import NavigationBar from "../components/NavigationBar";
import NavigationBarMobile from "../components/NavigationBarMobile";
import Footer from "../components/Footer";
import ProductDesktop from "../components/ProductDesktop";

interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	image: string;
	type: string;
	rating: number;
	rating_count: number;
}

function ProductDetail() {
	const { id } = useParams<{ id: string }>();
	const [product, setProduct] = useState<Product | null>(null);

	useEffect(() => {
		api
			.get<Product>(`/shop/products/${id}/`)
			.then((res) => res.data)
			.then((data) => setProduct(data))
			.catch((err) => console.error(err));
	}, [id]);

	console.log("ProductDetail loaded, id =", id);
	if (!product) return <p>Loading...</p>;

	return (
		<div className="min-h-screen w-full flex flex-col">
			<div className="sticky top-0 hidden lg:block z-50">
				<NavigationBar />
			</div>
			<div className="sticky top-0 block lg:hidden z-50">
				<NavigationBarMobile />
			</div>
			<main className="flex justify-center items-center flex-grow">
				<ProductDesktop product={product} />
			</main>
			<Footer />
		</div>
	);
}

export default ProductDetail;
