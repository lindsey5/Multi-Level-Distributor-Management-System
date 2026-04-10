import type { Variant } from "./variant.type";

export interface Product {
    _id: string;
    product_name: string;
    description: string;
    thumbnail_public_id: string;
    thumbnail_url: string;
    category: string;
    createdAt: string;
    variants: Variant[];
}