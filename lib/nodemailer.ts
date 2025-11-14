import nodemailer from 'nodemailer';

type sendMailProps = {
  to: string;
  sub: string;
  message: string;
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.NODEMAILER_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
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
