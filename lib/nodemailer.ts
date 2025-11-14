import nodemailer from 'nodemailer';

type sendMailProps = {
  to: string;
  sub: string;
  message: string;
};

const transporter = nodemailer.createTransport({
  secure: true,
  host: process.env.NODEMAILER_HOST,
  port: 465,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

export async function sendMail({ to, sub, message }: sendMailProps) {
  try {
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_USER,  
      to,
      subject: sub,
      html: message,
    });
    console.log('Message sent:', info.messageId);
  } catch (error) {
    console.error('Email send error:', error);
    throw error;  
  }
}
