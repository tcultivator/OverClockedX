export interface ProductsInCheckoutTypes {
    id: number;
    product_id: string
    product_name: string
    product_image: string
    price: number
    stocks: number
    quantity: number
    value?: number | null;
}