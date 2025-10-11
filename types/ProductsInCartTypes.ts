export interface ProductsInCartTypes {
    id: number;
    email: string|undefined;
    product_id: string
    product_name: string
    product_image: string
    price: number
    stocks: number
    quantity: number
}