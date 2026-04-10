import type { Product } from "./product.type";

export interface Variant {
    _id: string;
    product_id: string;
    product?: Product;
    variant_name: string;
    stock: number;
    price: number;
    image_public_id: string;
    image_url: string;
    sku: string;
    createdAt: string;
}