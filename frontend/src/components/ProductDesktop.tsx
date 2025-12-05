import { Rating, RatingButton } from "../components/ui/shadcn-io/rating";
import { Button } from "./ui/button";

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

interface ProductDesktopProps {
	product: Product;
}

function ProductDesktop({ product }: ProductDesktopProps) {
	return (
		<div className="inline-flex justify-center items-start w-[75%]">
			<div className="flex justify-center items-center mr-12 pt-12">
				<img src={product.image} alt={product.name} className="h-72" />
			</div>
			<div className="flex flex-col w-[50%] gap-2">
				<h1 className="text-3xl font-bold">{product.name}</h1>
				<div className="inline-flex justify-start items-center gap-2">
					<p>
						{product.rating}({product.rating_count})
					</p>
					<Rating value={product.rating} readOnly>
						{Array.from({ length: 5 }).map((_, index) => (
							<RatingButton key={index} />
						))}
					</Rating>
				</div>
				<p className="text-lg font-semibold">Type: {product.type}</p>
				<p className="text-lg font-semibold">Price: ${product.price}</p>
				<p className="whitespace-pre-line">{product.description}</p>
				<div>
					<Button variant={"secondary"} className="cursor-pointer">
						Add to Cart
					</Button>
				</div>
			</div>
		</div>
	);
}

export default ProductDesktop;
