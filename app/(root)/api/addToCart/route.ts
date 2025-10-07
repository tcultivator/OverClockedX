import db from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2";

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        const query = `INSERT INTO cart (email, product_id,quantity)
        VALUES (?, ?,?)
        ON DUPLICATE KEY UPDATE quantity = quantity + 1`
        const [result] = await db.query<ResultSetHeader>(query, [body.email, body.product_id, body.quantity])
        if (result.affectedRows === 1) {
            return NextResponse.json({ status: 201 })
        }
        return NextResponse.json({ status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ status: 500 })
    }

}