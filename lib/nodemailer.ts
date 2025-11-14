import nodemailer from "nodemailer";
type sendMailProps = {
  to: string;
  sub: string;
  message: string;
};
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey", // literally use "apikey" here
    pass: process.env.SENDGRID_API_KEY,
  },
});

export async function sendMail({ to, sub, message }: sendMailProps) {
  console.log("SENDGRID_API_KEY:", process.env.SENDGRID_API_KEY ? "loaded" : "MISSING");
  try {
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to,
      subject: sub,
      html: message,
    });
    console.log("Message sent:", info.messageId);
  } catch (err) {
    console.error("Email send error:", err);
    throw err;
  }
}