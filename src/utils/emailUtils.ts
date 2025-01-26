import nodemailer from "nodemailer";

const tp = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT as string),
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendEmail(
  to: string,
  subject: string,
  body: string
): Promise<void> {
  await tp.sendMail({
    from: process.env.EMAIL_USERNAME,
    to,
    subject,
    html: body,
  });
}

export default sendEmail;
