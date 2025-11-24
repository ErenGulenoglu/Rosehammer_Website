export interface Product {
	id: number;
	name: string;
	description: string;
	price: string; // Django sends decimal as string
	image: string;
	type: string;
	rating: number;
	rating_count: number;
}
