export interface ProductsType {
    id: number;
    product_id: string
    category: string
    parent: string
    product_name: string
    product_image: string
    price: number
    stocks: number
    description: string
    brand: string
    created_at: Date
    updated_at: Date
    value?: number | null;
}