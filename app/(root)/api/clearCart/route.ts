import db from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const body = await req.json()
    try {
        const query = 'DELETE FROM cart WHERE email = ?'
        await db.query(query, [body.email])
        return NextResponse.json({ status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ status: 500 })
    }

}