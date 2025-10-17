import db from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { Accounts } from '@/types/AccountsType'
import { RandomString } from '@/utils/randomStringGenerator/RandomString'
import { sendMail } from '@/lib/nodemailer'
import bcrypt from "bcryptjs";
export async function POST(req: NextRequest) {
    const body = await req.json()
    try {
        const checkQuery = 'SELECT * FROM accounts WHERE email = ?'
        const insertQuery = 'INSERT INTO pending_signup_users (email,password,image,token,expired_at) VALUES (?,?,?,?,DATE_ADD(NOW(), INTERVAL 15 MINUTE))'
        //generated token
        const token = RandomString()
        //default image for signup users
        const defaultProfile = 'https://res.cloudinary.com/djjg39yja/image/upload/v1760539730/image_pyzrpr.jpg'

        const [rows] = await db.query(checkQuery, [body.email])
        const result = rows as Accounts[]
        if (result.length > 0) return NextResponse.json({ status: 409 })
        const hashedPassword = await bcrypt.hash(body.password, 10)
        await db.query(insertQuery, [body.email, hashedPassword, defaultProfile, token])
        sendMail({
            to: body.email, sub: 'Confirm your account', message: `
            
            <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <tr>
                    <td style="padding: 30px 40px; text-align: center; background-color: #1a1a1a; color: #ffffff;">
                        <h1 style="margin: 0 0 10px; font-size: 24px;">Confirm Your Account</h1>
                        <p style="margin: 0; font-size: 14px; color: #cccccc;">
                        This link will expire in <strong>15 minutes</strong>.
                        </p>
                    </td>
                    </tr>
                    <tr>
                    <td style="padding: 40px; text-align: center;">
                        <p style="font-size: 16px; color: #333333; margin-bottom: 30px;">
                        Thank you for signing up. To complete your account setup, please confirm your email address by clicking the button below.
                        </p>

                        <a href="http://localhost:3000/accountConfirmation?token=${token}"
                        style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                        Confirm My Account
                        </a>

                        <p style="margin-top: 30px; font-size: 13px; color: #999999;">
                        ⚠️ <strong>Do not share this email</strong> with anyone. This link is unique to your account and provides access to personal information.
                        </p>
                    </td>
                    </tr>
                    <tr>
                    <td style="padding: 20px 40px; background-color: #f4f4f4; text-align: center; font-size: 12px; color: #888888;">
                        If you did not request this, you can safely ignore this email.
                    </td>
                    </tr>
                </table>
            </div>
            ` })

        return NextResponse.json({ status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 500 })
    }
}