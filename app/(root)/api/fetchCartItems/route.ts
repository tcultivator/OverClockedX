import db from "@/lib/db";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { ProductsInCartTypes } from "@/types/ProductsInCartTypes";
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const query = `SELECT cart.id, 
        cart.email, 
        cart.product_id, 
        cart.quantity, 
        products.product_name, 
        products.product_image, 
        products.price, 
        product_promotion_list.value, 
        products.stocks 
        FROM cart 
        JOIN products ON cart.product_id = products.product_id 
        LEFT JOIN product_promotion_list ON product_promotion_list.product_id = cart.product_id 
        AND product_promotion_list.isActive = 1 
        AND product_promotion_list.end_date > NOW() 
        WHERE cart.email = ?;
`
        const [rows] = await db.query(query, [body.email])
        const result = rows as ProductsInCartTypes[];
        return NextResponse.json(result);
    } catch (err) {
        console.log(err)
        return NextResponse.json({ status: 500 })
    }


}