import db from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { Accounts } from '@/types/AccountsType'
import { RandomPassword } from '@/PasswordGenerator/RandomPassword'
import { sendMail } from '@/lib/nodemailer'
import bcrypt from "bcryptjs";
export async function POST(req: NextRequest) {
    const body = await req.json()
    try {
        const checkQuery = 'SELECT * FROM accounts WHERE email = ?'
        const insertQuery = 'INSERT INTO pending_signup_users (email,password,image,token,expired_at) VALUES (?,?,?,?,DATE_ADD(NOW(), INTERVAL 15 MINUTE))'
        //generated token
        const token = RandomPassword()
        //default image for signup users
        const defaultProfile = 'https://res.cloudinary.com/djjg39yja/image/upload/v1760539730/image_pyzrpr.jpg'

        const [rows] = await db.query(checkQuery, [body.email])
        const result = rows as Accounts[]
        if (result.length > 0) return NextResponse.json({ status: 409 })
        const hashedPassword = await bcrypt.hash(body.password, 10)
        await db.query(insertQuery, [body.email, hashedPassword, defaultProfile, token])
        sendMail({
            to: body.email, sub: 'Confirm your account', message: `<div>
                    <label htmlFor="">Note:this link will expired 15 minutes</label>
                    <div style="background-color: black; padding: 10px; color: white; justify-content: center; align-items: center;">
                     <h1>Please Confirm Your Account Creation</h1>
                    <a style="background-color: blue; color: white; border-radius: 10px; width: 100%; padding: 15px; border: none;" href="http://localhost:3000/accountConfirmation?token=${token}">CONFIRM</a>
                    </div>
                </div>` })

        return NextResponse.json({ status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 500 })
    }
}