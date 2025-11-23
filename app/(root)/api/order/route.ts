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
    const connection = await db.getConnection()
    const body = await req.json();
    try {
        await connection.beginTransaction()
        const [result] = await connection.query('INSERT INTO orders (email,reference_id,total_amount ,payment_status,order_status,payment_method)VALUES(?,?,?,?,?,?)', [body.email, body.referenceId, body.total_amount, 'pending', 'pending', body.payment_method])
        const resultData = result as queryResult
        //this update query should be move in admin/ if admin accept order then update the stocks// only the update should be move, the insert remain the same!
        for (const item of body.checkoutItems) {
            console.log('eto ung quantity', item.quantity)
            const finalPriceOfItem = item.price - (item.value != null ? item.value : 0)
            await connection.query('INSERT INTO order_items (order_id, product_id, quantity, price, sub_total)VALUES(?,?,?,?,?)', [resultData.insertId, item.product_id, item.quantity, finalPriceOfItem, finalPriceOfItem * item.quantity])
            // await db.query('UPDATE products SET stocks = stocks - ?, sales_count = sales_count + ? WHERE product_id = ?', [item.quantity, item.quantity, item.product_id])
        }
        await connection.query('INSERT INTO customer_address (order_id,email,rname,phone_number,country,city_municipality,barangay,province,trademark) VALUES (?,?,?,?,?,?,?,?,?)', [resultData.insertId, body.userAdress[0].email, body.userAdress[0].rname, body.userAdress[0].phone_number, body.userAdress[0].country, body.userAdress[0].cityMunicipality, body.userAdress[0].barangay, body.userAdress[0].province, body.userAdress[0].trademark])
        await connection.commit()

        await sendMail({
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
        console.error('eto ung error :',err)
        await connection.rollback()
        return NextResponse.json({ status: 500 })
    }
    finally {
        connection.release()
    }

}
