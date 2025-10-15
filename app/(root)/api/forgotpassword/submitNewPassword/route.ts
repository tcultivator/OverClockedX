import db from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'
import bcrypt from "bcryptjs";
type reset_logs = {
    id: number;
    email: string;
    reset_token: string;
    expired_at: Date
}
export async function POST(req: NextRequest) {
    const body = await req.json()
    try {
        const checkQuery = 'SELECT * FROM reset_logs WHERE reset_token = ? AND expired_at > NOW()'
        const [rows] = await db.query(checkQuery, [body.token])
        const result = rows as reset_logs[]
        if (result.length === 0) return NextResponse.json({ status: 401 })

        const hashedPassword = await bcrypt.hash(body.newpassword, 10)
        const updateQuery = 'UPDATE accounts SET password = ? WHERE email = ?'
        await db.query(updateQuery, [hashedPassword, body.email])

        const deleteQuery = 'DELETE FROM reset_logs WHERE email = ? AND reset_token = ?'
        await db.query(deleteQuery, [body.email, body.token])
        
        return NextResponse.json({ status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ status: 500 })
    }
}