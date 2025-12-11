import db from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json()
    try {
        await db.query('DELETE FROM subscribe_users WHERE email = ?', [body.email])
        return NextResponse.json({ status: 200, message: 'You will no longer receive updates or promotional offers from us.' })
    } catch (err) {
        return NextResponse.json({ status: 500, message: 'Something went wrong to your request of Unsubscribing to News Letter' })
    }
}