import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json()
        const query = 'UPDATE orders SET order_status = ? WHERE id = ?'
        await db.query(query, ['cancel', body.order_id])
        return NextResponse.json({ status: 200 })
    } catch (err) {
        return NextResponse.json({ status: 500 })
    }
}