export type GroupedOrder = {
    order_id: number;
    email: string;
    reference_id: string;
    total_amount: number;
    payment_status: string;
    payment_method: string;
    order_status: string;
    created_at: string;
    items: {
        product_id: string;
        product_name: string;
        product_image: string;
        quantity: number;
        price: number;
        sub_total: number;
    }[];
};