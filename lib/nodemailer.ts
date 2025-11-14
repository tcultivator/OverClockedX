import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export type SendMailProps = {
  to: string;
  sub: string;
  message: string;
};

export async function sendMail({ to, sub, message }: SendMailProps) {
  try {
    const msg = {
      to,
      from: process.env.NODEMAILER_USER!, // MUST be verified sender
      subject: sub,
      html: message,
    };

    const [response] = await sgMail.send(msg);

    console.log("Email sent:", response.statusCode);
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}
