import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { voucherTypes } from "@/types/voucherTypes";

export async function POST(req: NextRequest) {
    const body = await req.json()
    const query = 'SELECT * FROM voucher_code WHERE email = ?'
    try {
        const [rows] = await db.query(query, [body.email])
        const result = rows as voucherTypes[]
        return NextResponse.json(result)
    } catch (err) {
        console.log(err)
        return NextResponse.json({ state: 500 })
    }
}