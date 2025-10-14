import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
type reset_logs = {
    id: number;
    email: string;
    reset_token: string;
    expired_at: Date
}
export async function POST(req: NextRequest) {
    const body = await req.json()
    try {
        const query = 'SELECT * FROM reset_logs WHERE reset_token = ? AND expired_at > NOW()'
        const [rows] = await db.query(query, [body.token])
        const result = rows as reset_logs[]
        if (result.length === 0) {
            return NextResponse.json({ status: 500 })
        }
        return NextResponse.json({ result })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ status: 500 })
    }
}