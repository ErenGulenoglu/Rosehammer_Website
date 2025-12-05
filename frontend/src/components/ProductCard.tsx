import type { Product } from "../types/Product";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

type ProductCardProps = {
	product: Product;
};

function ProductCard({ product }: ProductCardProps) {
	const { cart, addToCart } = useCart();
	const handleAddToCart = () => {
		const exists = cart.some((p) => p.id === product.id);

		if (exists) {
			toast.error("Already in cart", {
				description: `${product.name} is already in your cart.`,
			});
			return;
		}
		addToCart(product);
		toast.success("Added to cart", {
			description: `${product.name} has been added.`,
		});
		console.log("Added product:", product);
		console.log("Cart after adding:", cart);
	};
	return (
		<div className="product-card ">
			<Card className="w-[35vh]">
				{/* Product Image */}
				<Link to={`/products/${product.id}`}>{product.image?.startsWith("http") && <img src={product.image} alt={product.name} className="w-full h-64 object-contain" />}</Link>

				<CardContent className="flex flex-col gap-2">
					<Link to={`/products/${product.id}`}>
						<CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
					</Link>
					<p className="text-sm text-muted-foreground">Rating ({product.rating_count})</p>
					<Link to={`/products/${product.id}`}>
						<p className="font-semibold">{product.type}</p>
					</Link>
					<p className="font-semibold">${parseFloat(product.price).toFixed(2)}</p>
					<div>
						<Button onClick={handleAddToCart} variant={"secondary"} className="cursor-pointer" size={"lg"}>
							Add to Cart
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default ProductCard;
