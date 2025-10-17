import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Accounts } from "@/types/AccountsType";
import { RandomString } from "@/utils/randomStringGenerator/RandomString";
import { sendMail } from "@/lib/nodemailer";
export async function POST(req: NextRequest) {
    const body = await req.json()
    try {
        const query = 'SELECT * FROM accounts WHERE email = ?'
        const [rows] = await db.query(query, [body.email])

        const result = rows as Accounts[]
        if (result.length === 0) return NextResponse.json({ status: 404 })
        const token = RandomString()
        await db.query('INSERT INTO reset_logs (email,reset_token,expired_at)VALUES(?,?,DATE_ADD(NOW(), INTERVAL 15 MINUTE))', [body.email, token])
        sendMail({
            to: body.email, sub: 'Reset Password', message: `<div>
                    <label htmlFor="">Note:this link will expired 15 minutes</label>
                    <a href="http://localhost:3000/reset?token=${token}">go to reset page</a>
                </div>` })
        return NextResponse.json({ status: 200 })
    } catch (err) {
        return NextResponse.json({ status: 500 })
    }

}


