import db from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { Accounts } from "@/types/AccountsType";
import bcrypt from "bcryptjs";
export async function POST(req: NextRequest) {
    const body = await req.json()
    try {
        //check if password is correct
        const [rows] = await db.query('SELECT * FROM accounts WHERE email = ?', [body.email]);
        const accounts = rows as Accounts[];
        const isPasswordCorrect = await bcrypt.compare(body.currentPass, accounts[0].password)
        if (!isPasswordCorrect) {
            return NextResponse.json({ status: 404 })
        }
        const hashedPassword = await bcrypt.hash(body.newPass, 10)
        await db.query('UPDATE accounts SET password = ? WHERE email = ?', [hashedPassword, body.email])
        return NextResponse.json({ status: 200 })
    } catch (err) {
        return NextResponse.json({ status: 500 })
    }
}