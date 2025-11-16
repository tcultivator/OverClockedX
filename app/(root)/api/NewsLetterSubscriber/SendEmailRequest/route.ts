import { sendMail } from '@/lib/nodemailer'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(req: NextRequest) {

    const body = await req.json()
    try {
        await sendMail({
            to: body.email, sub: 'Confirm your Subscribe Request', message: `                   
                    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            <tr>
                            <td style="padding: 30px 40px; text-align: center; background-color: #1a1a1a; color: #ffffff;">
                                <h1 style="margin: 0 0 10px; font-size: 24px;">Confirm your Subscribe Request</h1>
                                <p style="margin: 0; font-size: 14px; color: #cccccc;">
                                This link will expire in <strong>15 minutes</strong>.
                                </p>
                            </td>
                            </tr>
                            <tr>
                            <td style="padding: 40px; text-align: center;">
                                <p style="font-size: 16px; color: #333333; margin-bottom: 30px;">
                                Thank you for subscribing to our newsletter. To complete, please confirm your email address by clicking the button below.
                                </p>
        
                                <a href="https://overclockedx.onrender.com/NewsLetterSubscriberConfirmation?email=${body.email}"
                                style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                                Subscribe
                                </a>                                   
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

    } catch (err) {
        return NextResponse.json({ status: 500 })
    }
}