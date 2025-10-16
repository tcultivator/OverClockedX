import db from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'

type pendingUsers = {
    id: number;
    email: string;
    password: string;
    image: string;
    token: string;
    expired_at: Date;
}
export async function POST(req: NextRequest) {
    const body = await req.json()
    try {
        const checkQuery = 'SELECT * FROM pending_signup_users WHERE token = ? AND expired_at > NOW()'
        const insertQuery = 'INSERT INTO accounts (email,password,username,profile_Image,role,firstTime_signin) VALUES (?,?,?,?,?,?)'
        const deleteQuery = 'DELETE FROM pending_signup_users WHERE token = ?'

        const [rows] = await db.query(checkQuery, [body.token])
        const result = rows as pendingUsers[]
        if (result.length < 0) return NextResponse.json({ status: 404 })

        const splitData = result[0].email.split('@')
        const username = splitData[0]

        await db.query(insertQuery, [result[0].email, result[0].password, username, result[0].image, 'client', false])

        await db.query(deleteQuery, [body.token])
        
        return NextResponse.json({ status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 500 })
    }
}