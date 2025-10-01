import db from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        const query = `INSERT INTO cart (email, product_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE created_at = NOW()`
        const [result]: any = await db.query(query, [body.email, body.product_id])
        if (result.affectedRows === 1) {
            return NextResponse.json({ status: 201 })
        }
        return NextResponse.json({ status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ status: 500 })
    }

}