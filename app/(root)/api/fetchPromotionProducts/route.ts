import db from "@/lib/db";
import { NextResponse } from "next/server";
type promotion_products = {
    product_id: string;
    product_name: string;
    product_image: string;
    brand: string;
    price: number;
    start_date: Date;
    end_date: Date;
    value: number;
    promotion_type: string;
}
export async function GET() {
    try {
        await db.query('UPDATE product_promotion_list SET isActive = false WHERE end_date < Now()')
        const query = `SELECT products.product_id,
        products.product_name,
        products.product_image,
        products.brand,
        products.price,
        product_promotion_list.start_date,
        product_promotion_list.end_date,
        product_promotion_list.value,
        product_promotion_list.promotion_type
         FROM product_promotion_list 
         JOIN products ON product_promotion_list.product_id = products.product_id 
         WHERE product_promotion_list.isActive = true`

        const [rows] = await db.query(query)
        const returnProducts = rows as promotion_products[]
        return NextResponse.json(returnProducts)

    } catch (err) {
        return NextResponse.json({ status: 500 })
    }
}