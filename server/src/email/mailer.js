import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpSecure = String(process.env.SMTP_SECURE || 'false') === 'true';
const fromEmail = process.env.FROM_EMAIL || 'no-reply@example.com';

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
});

export async function sendInvoiceEmail({ to, subject, text, html, attachments }) {
  if (!smtpHost) {
    throw new Error('SMTP is not configured. Set SMTP_HOST and related env vars.');
  }
  const info = await transporter.sendMail({ from: fromEmail, to, subject, text, html, attachments });
  return info;
}