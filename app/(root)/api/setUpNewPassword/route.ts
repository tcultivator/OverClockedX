import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
export async function PUT(req: NextRequest) {
    const body = await req.json()
    try {
        console.log(body)
        const hashedPassword = await bcrypt.hash(body.password, 10)
        const query = 'UPDATE accounts SET password = ?, firstTime_signin = ? WHERE email = ?'
        await db.query(query, [hashedPassword, false, body.email])
        return NextResponse.json({ status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ status: 500 })
    }
}