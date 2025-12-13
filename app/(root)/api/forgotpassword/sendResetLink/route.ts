import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Accounts } from "@/types/AccountsType";
import { RandomString } from "@/utils/randomStringGenerator/RandomString";
import { sendMail } from "@/lib/nodemailer";
const buildURL = process.env.NEXTAUTH_URL;
export async function POST(req: NextRequest) {
    const body = await req.json()
    try {
        const query = 'SELECT * FROM accounts WHERE email = ?'
        const [rows] = await db.query(query, [body.email])

        const result = rows as Accounts[]
        if (result.length === 0) return NextResponse.json({ status: 404 })
        const token = RandomString()
        await db.query('INSERT INTO reset_logs (email,reset_token,expired_at)VALUES(?,?,DATE_ADD(NOW(), INTERVAL 15 MINUTE))', [body.email, token])
        await sendMail({
            to: body.email, sub: 'Reset Password', message: `

                    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f2f2f2; padding: 40px 20px;">
                    <table
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        width="100%"
                        style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5;"
                    >
                        <!-- Header -->
                        <tr>
                        <td style="padding: 28px 40px; text-align: center; background-color: #000000;">
                            <h3 style="margin: 0; font-size: 20px; color: #ffffff; font-weight: 600;">
                            Reset Your Password
                            </h3>
                        </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                        <td style="padding: 40px; text-align: center;">
                            <p style="font-size: 16px; color: #111111; line-height: 1.6; margin-bottom: 24px;">
                            We received a request to reset your password.
                            </p>

                            <p style="font-size: 14px; color: #333333; line-height: 1.6;">
                            This link will expire in <strong>15 minutes</strong>.
                            </p>

                            <!-- CTA -->
                            <a
                            href="${buildURL}/reset?token=${token}"
                            style="
                                display: inline-block;
                                margin-top: 20px;
                                padding: 14px 28px;
                                background-color: #000000;
                                color: #ffffff;
                                text-decoration: none;
                                font-size: 15px;
                                font-weight: 600;
                                border: 1px solid #000000;
                            "
                            >
                            Reset Password
                            </a>

                            <p style="margin-top: 30px; font-size: 13px; color: #666666; line-height: 1.5;">
                            If you did not request a password reset, you can safely ignore this email.
                            </p>
                        </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                        <td
                            style="
                            padding: 20px 40px;
                            background-color: #f2f2f2;
                            text-align: center;
                            font-size: 12px;
                            color: #777777;
                            "
                        >
                            This is an automated security message. Please do not reply.
                        </td>
                        </tr>
                    </table>
                    </div>


            ` })
        return NextResponse.json({ status: 200 })
    } catch (err) {
        return NextResponse.json({ status: 500 })
    }

}


