import nodemailer from 'nodemailer';

type sendMailProps = {
    to: string;
    sub: string;
    message: string;
};

const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST, 
    port: 587,
    secure: false,                       
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
});

export async function sendMail({ to, sub, message }: sendMailProps) {
    try {
        const info = await transporter.sendMail({
            from: process.env.NODEMAILER_USER, 
            to,
            subject: sub,
            html: message
        });

        console.log('Email sent:', info.messageId);
    } catch (err) {
        console.error('Email send error:', err);
    }
}
