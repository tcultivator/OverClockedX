import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { sendMail } from "@/lib/nodemailer";
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

        const [result] = await db.query('INSERT INTO orders (email,reference_id,total_amount ,payment_status,order_status,payment_method)VALUES(?,?,?,?,?,?)', [body.email, body.referenceId, body.total_amount, 'pending', 'pending', body.payment_method])
        const resultData = result as queryResult

        for (const item of body.checkoutItems) {
            await db.query('INSERT INTO order_items (order_id, product_id, quantity, price, sub_total)VALUES(?,?,?,?,?)', [resultData.insertId, item.product_id, item.quantity, item.price, item.price * item.quantity])
            await db.query('UPDATE products SET stocks = stocks - ? AND sales_count = sales_count + ? WHERE product_id = ?', [item.quantity, item.quantity, item.product_id])
        }
        sendMail({
            to: body.email,
            sub: "Order Placed Successfully",
            message: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2>Thank you for your order!</h2>

                        <p>Your order has been successfully placed.</p>

                        <p><strong>Note:</strong> This link will expire in 15 minutes.</p>

                        <p>If you didn’t place this order, please contact support immediately.</p>
                    </div>
  `,
        });


        return NextResponse.json({ status: 200 })


    } catch (err) {

        return NextResponse.json({ status: 500 })
    }

}
