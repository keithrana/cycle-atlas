import nodemailer from 'nodemailer'

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TICKET_TO = 'rana.krunal7558@gmail.com' } = process.env
const transporter = SMTP_HOST && SMTP_USER && SMTP_PASS
  ? nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT || 465), secure: Number(SMTP_PORT || 465) === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } })
  : null

export const emailConfigured = !!transporter

export async function sendTicketEmail(t) {
  if (!transporter) return false
  try {
    await transporter.sendMail({
      from: SMTP_USER,
      to: TICKET_TO,
      replyTo: t.email,
      subject: `[${t.id}] ${t.topic}: new IT request from ${t.name}`,
      text: `Ticket: ${t.id}\nFrom: ${t.name} <${t.email}>\nTopic: ${t.topic}\n\n${t.message}\n`,
    })
    return true
  } catch (e) {
    console.error('Email failed:', e.message)
    return false
  }
}
