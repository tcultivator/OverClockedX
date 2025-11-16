import db from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
type count = {
    subscriber: number
}
export async function POST(req: NextRequest) {
    const body = await req.json()
    const checkIfAlreadySubscriber = 'SELECT COUNT(*) AS subscriber FROM subscribe_users WHERE email = ?'
    const query = 'INSERT INTO subscribe_users (email) VALUES (?)'
    try {
        const check = await db.query(checkIfAlreadySubscriber, [body.email])
        const checkResult = check[0] as count[]
        if (checkResult[0].subscriber > 0) return NextResponse.json({ status: 201 })
        await db.query(query, [body.email])
        return NextResponse.json({ status: 200 })
    } catch (err) {
        return NextResponse.json({ status: 500 })
    }
}