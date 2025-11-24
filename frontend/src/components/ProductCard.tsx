import type { Product } from "../types/Product";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

type ProductCardProps = {
	product: Product;
};

function ProductCard({ product }: ProductCardProps) {
	return (
		<div className="product-card">
			<Card className="w-80 h-full max-w-md overflow-hidden">
				{/* Product Image */}
				<Link to={`/products/${product.id}`}>{product.image?.startsWith("http") && <img src={product.image} alt={product.name} className="w-full h-64 object-contain" />}</Link>
				<CardHeader>
					<Link to={`/products/${product.id}`}>
						<CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
					</Link>
					<p className="text-sm text-muted-foreground">Rating ({product.rating_count})</p>
				</CardHeader>

				<CardContent className="">
					<Link to={`/products/${product.id}`}>
						<p className="font-semibold">{product.type}</p>
					</Link>
					<p className="font-semibold">${parseFloat(product.price).toFixed(2)}</p>
				</CardContent>

				<CardFooter>
					<Button variant={"secondary"} className="cursor-pointer">
						Add to Cart
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}

export default ProductCard;
