import { sendMail } from '@/lib/sendGridEmail';
import { NextResponse, NextRequest } from 'next/server'
const buildURL = process.env.NEXTAUTH_URL;
export async function POST(req: NextRequest) {

    const body = await req.json()
    try {
        await sendMail({
            to: body.email, sub: 'Confirm your Subscribe Request', message: `                   
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
                            <td style="padding: 32px 40px; text-align: center; background-color: #000000;">
                                <h1 style="margin: 0 0 8px; font-size: 22px; color: #ffffff; font-weight: 600;">
                                Confirm Your Subscription
                                </h1>
                                <p style="margin: 0; font-size: 13px; color: #bbbbbb;">
                                This link expires in <strong>15 minutes</strong>
                                </p>
                            </td>
                            </tr>

                            <!-- Body -->
                            <tr>
                            <td style="padding: 40px; text-align: center;">
                                <p style="font-size: 16px; color: #111111; line-height: 1.6; margin-bottom: 32px;">
                                Thank you for subscribing to our newsletter.<br />
                                Please confirm your email address to complete the process.
                                </p>

                                <!-- CTA Button -->
                                <a
                                href="${buildURL}/NewsLetterSubscriberConfirmation?email=${body.email}"
                                style="
                                    display: inline-block;
                                    padding: 14px 28px;
                                    background-color: #000000;
                                    color: #ffffff;
                                    text-decoration: none;
                                    font-size: 15px;
                                    font-weight: 600;
                                    border: 1px solid #000000;
                                "
                                >
                                Confirm Subscription
                                </a>

                            
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
                                If you did not request this subscription, you can safely ignore this email.
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