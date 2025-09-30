import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/lib/db";
export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        await db.query('UPDATE accounts SET profile_Image = ? WHERE email = ?', [body.profileImage, body.email])
        return NextResponse.json({ status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ status: 500 })
    }

}
