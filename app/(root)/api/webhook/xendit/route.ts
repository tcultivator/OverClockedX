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
                        <td style="padding: 28px 40px; text-align: center; background-color: #000000;">
                            <h3 style="margin: 0; font-size: 20px; color: #ffffff; font-weight: 600;">
                            Payment Successful
                            </h3>
                        </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                        <td style="padding: 40px;">
                            <p style="font-size: 16px; color: #111111; line-height: 1.6; margin-top: 0;">
                            Your payment has been processed successfully.
                            </p>

                            <p style="font-size: 14px; color: #333333; line-height: 1.6;">
                            <strong>Reference ID:</strong>
                            <span style="color: #000000;">
                                ${data.reference_id || "N/A"}
                            </span>
                            </p>

                            <p style="font-size: 14px; color: #666666; line-height: 1.6; margin-bottom: 0;">
                            Thank you for your purchase. We appreciate your business.
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
                            This is an automated confirmation email.
                        </td>
                        </tr>
                    </table>
                    </div>
  `,
        });

        return NextResponse.json({ received: true });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ err: "Invalid webhook payload" }, { status: 400 });
    }
}
