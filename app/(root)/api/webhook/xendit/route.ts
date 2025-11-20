// app/api/webhook/xendit/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { sendMail } from "@/lib/nodemailer";
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { event, data } = body
        if (event == 'payment.succeeded') {
            await db.query('UPDATE orders SET payment_status = ?,order_status = ? WHERE reference_id = ?', ['success', 'preparing', data.reference_id])
            //this update also the sales count of that product
        }
        sendMail({
            to: data.metadata.email,
            sub: "Payment Successful",
            message: `
                <div style="font-family: Arial; padding: 20px;">
                    <h3>Payment Successful 🎉</h3>
                    <p>Your payment for the order has been processed successfully.</p>
                    <p><strong>Reference_id ID:</strong> ${data.reference_id || "N/A"}</p>
                    <p>Thank you for your purchase!</p>
                </div>
  `,
        });

        return NextResponse.json({ received: true });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ err: "Invalid webhook payload" }, { status: 400 });
    }
}
