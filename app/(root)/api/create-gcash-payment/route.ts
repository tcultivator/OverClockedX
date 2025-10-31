import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Xendit from 'xendit-node';
import { PaymentRequestParameters } from "xendit-node/payment_request/models";

const xendit = new Xendit({
    secretKey: process.env.XENDIT_SECRET_KEY as string
})
const paymentRequest = xendit.PaymentRequest;

export async function POST(req: NextRequest) {
    try {
        const { amount, referenceId, phoneNumber } = await req.json();
        const data: PaymentRequestParameters = {
            amount: amount,
            paymentMethod: {
                ewallet: {
                    channelProperties: {
                        successReturnUrl: "http://localhost:3000//success",
                        failureReturnUrl: "http://localhost:3000//profile"
                    },
                    channelCode: "GCASH"
                },
                reusability: "ONE_TIME_USE",
                type: "EWALLET"
            },
            currency: "PHP",
            referenceId: referenceId,
            metadata: {
                customer_phone: phoneNumber
                
            }
        }
        const payment = await paymentRequest.createPaymentRequest({ data });
        return NextResponse.json(payment)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 500 })
    }


}