// app/api/webhook/xendit/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { event, data } = body
        if(event=='payment.succeeded'){
            await db.query('UPDATE orders SET payment_status = ? WHERE reference_id = ?',['success',data.reference_id])
            //this update also the sales count of that product
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ err: "Invalid webhook payload" }, { status: 400 });
    }
}
