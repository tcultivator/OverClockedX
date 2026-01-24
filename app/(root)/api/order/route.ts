import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { sendMail } from "@/lib/sendGridEmail";
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
        await connection.query('INSERT INTO customer_address (order_id,email,rname,phone_number,address_line_1,city_municipality,barangay,province,postal_code) VALUES (?,?,?,?,?,?,?,?,?)', [resultData.insertId, body.userAdress[0].email, body.userAdress[0].rname, body.userAdress[0].phone_number, body.userAdress[0].address_line_1, body.userAdress[0].cityMunicipality, body.userAdress[0].barangay, body.userAdress[0].province, body.userAdress[0].postal_code])
        await connection.commit()

        await sendMail({
            to: body.email,
            sub: "Order Placed Successfully",
            message: `
                    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f2f2f2; padding: 40px 20px;">
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          border="0"
                          width="100%"
                          style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5;"
                        >
                          <!-- Header -->
                          <tr>
                            <td style="padding: 32px 40px; text-align: center; background-color: #000000;">
                              <h2 style="margin: 0; font-size: 22px; color: #ffffff; font-weight: 600;">
                                Order Confirmed
                              </h2>
                            </td>
                          </tr>

                          <!-- Body -->
                          <tr>
                            <td style="padding: 40px;">
                              <p style="font-size: 16px; color: #111111; line-height: 1.6; margin-top: 0;">
                                Thank you for your order. Your purchase has been successfully placed.
                              </p>

                              

                              <p style="font-size: 14px; color: #666666; line-height: 1.6; margin-bottom: 0;">
                                If you did not place this order, please contact our support team immediately.
                              </p>
                            </td>
                          </tr>

                          <!-- Footer -->
                          <tr>
                            <td
                              style="
                                padding: 20px 40px;
                                background-color: #f2f2f2;
                                text-align: center;
                                font-size: 12px;
                                color: #777777;
                              "
                            >
                              This is an automated message. Please do not reply to this email.
                            </td>
                          </tr>
                        </table>
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
