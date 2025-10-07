import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/lib/db";

type queryResult = {
    fieldCount: number,
    affectedRows: number,
    insertId: number,
    info: string,
    serverStatus: number,
    warningStatus: number,
    changedRows: number
}
export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        console.log(body)
        const [result] = await db.query('INSERT INTO orders (email,reference_id,total_amount ,payment_status,order_status)VALUES(?,?,?,?,?)', [body.email, body.referenceId, body.total_amount, 'pending', 'pending'])
        const resultData = result as queryResult
        console.log(resultData.insertId)
        for (const item of body.checkoutItems) {
            await db.query('INSERT INTO order_items (order_id, product_id, quantity, price, sub_total)VALUES(?,?,?,?,?)', [resultData.insertId, item.product_id, item.quantity, item.price, item.price * item.quantity])
            await db.query('UPDATE products SET stocks = stocks - ? WHERE product_id = ?', [item.quantity, item.product_id])
        }
        return NextResponse.json({ status: 200 })


    } catch (err) {
        console.log(err)
        return NextResponse.json({ status: 500 })
    }

}
