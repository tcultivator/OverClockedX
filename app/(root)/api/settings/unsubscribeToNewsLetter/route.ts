import db from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json()
    try {
        await db.query('DELETE FROM subscribe_users WHERE email = ?', [body.email])
        return NextResponse.json({ status: 200, message: 'Successfully Unsubscribe to NewsLetter!' })
    } catch (err) {
        return NextResponse.json({ status: 500, message: 'Something went wrong!' })
    }
}