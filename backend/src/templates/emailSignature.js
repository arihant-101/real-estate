/**
 * HTML email signature built from brand assets (asta-logo.png, asta-text.png,
 * asta-word.png hosted on the live site). Email-client safe: tables + inline
 * styles, absolute image URLs.
 *
 * Appended automatically to every email sent through src/lib/mailer.js.
 */

const DEFAULT_SITE_URL = "https://www.astapropertymanagement.co.uk";
const COPPER = "#b9805d";
const COPPER_LIGHT = "#d9a888";
const MUTED = "#9a9a9a";

function siteUrl() {
  const raw =
    process.env.SITE_URL ||
    (process.env.FRONTEND_ORIGIN || "").split(",")[0].trim() ||
    DEFAULT_SITE_URL;
  return raw.replace(/\/$/, "");
}

/**
 * @param {{ name?: string, title?: string }} [sender] optional person details
 */
export function buildEmailSignatureHtml(sender = {}) {
  const url = siteUrl();
  const logoUrl = `${url}/asta-logo.png`;
  const textUrl = `${url}/asta-text.png`;
  const wordUrl = `${url}/asta-word.png`;

  const senderBlock =
    sender.name || sender.title
      ? `<tr>
          <td colspan="2" style="padding:0 0 10px 0;">
            ${sender.name ? `<div style="font-size:15px;font-weight:bold;color:${COPPER_LIGHT};letter-spacing:0.5px;">${sender.name}</div>` : ""}
            ${sender.title ? `<div style="font-size:12px;color:${MUTED};">${sender.title}</div>` : ""}
          </td>
        </tr>`
      : "";

  return `
<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="font-family:Arial,Helvetica,sans-serif;background-color:#000000;border-radius:12px;width:100%;max-width:560px;">
  <tr>
    <td style="padding:20px 24px;">
      <table cellpadding="0" cellspacing="0" border="0" role="presentation" width="100%">
        ${senderBlock}
        <tr>
          <td width="96" valign="middle" style="padding-right:18px;">
            <a href="${url}" style="text-decoration:none;">
              <img src="${logoUrl}" alt="ASTA Property Management logo" width="84" style="display:block;border:0;width:84px;height:auto;" />
            </a>
          </td>
          <td valign="middle" style="border-left:1px solid ${COPPER};padding-left:18px;">
            <a href="${url}" style="text-decoration:none;">
              <img src="${textUrl}" alt="ASTA" width="150" style="display:block;border:0;width:150px;height:auto;" />
              <img src="${wordUrl}" alt="Property Management" width="150" style="display:block;border:0;width:150px;height:auto;margin-top:6px;" />
            </a>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top:16px;border-top:1px solid #2a2a2a;font-size:12px;line-height:1.7;color:#e8e8e8;">
            <span style="color:${COPPER};font-weight:bold;">Office:</span>
            36 Northumberland Avenue, London, E12 5HD, United Kingdom<br />
            <span style="color:${COPPER};font-weight:bold;">Phone:</span>
            <a href="tel:+447452766766" style="color:#e8e8e8;text-decoration:none;">07452 766766</a>
            <span style="color:${MUTED};">(Mon &ndash; Fri, 9:00 &ndash; 17:30)</span><br />
            <span style="color:${COPPER};font-weight:bold;">Email:</span>
            <a href="mailto:hello@astapropertymanagement.co.uk" style="color:#e8e8e8;text-decoration:none;">hello@astapropertymanagement.co.uk</a><br />
            <span style="color:${COPPER};font-weight:bold;">Web:</span>
            <a href="${url}" style="color:${COPPER_LIGHT};text-decoration:none;letter-spacing:1px;">www.astapropertymanagement.co.uk</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}
