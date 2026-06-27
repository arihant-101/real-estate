import { Resend } from "resend";
import { buildEmailSignatureHtml } from "../templates/emailSignature.js";

/**
 * Central mailer: ALL outbound emails go through sendMail(), which appends the
 * ASTA branded signature automatically.
 *
 * Configure via env: RESEND_API_KEY, MAIL_FROM, SITE_URL.
 * If RESEND_API_KEY is unset, sendMail() logs and resolves without sending.
 */

let resend;

export function isMailerConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toArray(to) {
  return Array.isArray(to) ? to : [to];
}

/**
 * Send an email with the ASTA signature appended.
 *
 * @param {object} options
 * @param {string|string[]} options.to
 * @param {string} options.subject
 * @param {string} [options.html] email body as HTML
 * @param {string} [options.text] plain-text body (used to build HTML if html missing)
 * @param {{ name?: string, title?: string }} [options.sender] optional person shown on the signature
 */
export async function sendMail({ to, subject, html, text, sender }) {
  const bodyHtml =
    html ??
    `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#222;">${escapeHtml(text || "").replace(/\n/g, "<br />")}</div>`;

  const fullHtml = `${bodyHtml}
<br />
${buildEmailSignatureHtml(sender)}`;

  if (!isMailerConfigured()) {
    console.warn(`[mailer] RESEND_API_KEY not configured — skipping email "${subject}" to ${to}`);
    return { skipped: true };
  }

  const from =
    process.env.MAIL_FROM || "ASTA Property Management <hello@astapropertymanagement.co.uk>";

  const { data, error } = await getResend().emails.send({
    from,
    to: toArray(to),
    subject,
    text,
    html: fullHtml,
  });

  if (error) {
    throw new Error(error.message || "Resend send failed");
  }

  return data;
}
