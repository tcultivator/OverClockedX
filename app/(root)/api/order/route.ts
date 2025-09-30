import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        await db.query('INSERT INTO order_list (reference_id,product_id ,amount,quantity,payment_status,order_status)VALUES(?,?,?,?,?,?)', [body.reference_id, body.product_id, body.amount, body.quantity, body.payment_status, body.order_status])
        return NextResponse.json({ status: 200 })


    } catch (err) {
        console.log(err)
        return NextResponse.json({ status: 500 })
    }

}
