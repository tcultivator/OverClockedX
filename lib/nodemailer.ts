import nodemailer from 'nodemailer'
type sendMailProps = {
    to: string;
    sub: string;
    message: string;
}
const transporter = nodemailer.createTransport({
    secure: false,
    host: process.env.NODEMAILER_HOST,
    port: 587,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
})


export function sendMail({ to, sub, message }: sendMailProps) {
    transporter.sendMail({
        to: to,
        subject: sub,
        html: message
    })
    console.log('message Sent')
}
