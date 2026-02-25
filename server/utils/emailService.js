import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

const FROM = `"Rajiv Phylon" <${process.env.FROM_EMAIL}>`;
const ADMIN_EMAIL = process.env.FROM_EMAIL;

/* ─── HTML helpers ───────────────────────────────────────── */
function row(label, value) {
    if (!value) return "";
    return `
        <tr>
          <td style="padding:10px 16px;background:#f8f8f8;font-weight:600;font-size:13px;color:#555;width:180px;border-bottom:1px solid #eee;white-space:nowrap;">${label}</td>
          <td style="padding:10px 16px;font-size:13px;color:#111;border-bottom:1px solid #eee;">${value}</td>
        </tr>`;
}

function adminHtml({ name, phone, email, quantity, unit, message, productName, source }) {
    const qty = quantity ? `${quantity}${unit ? " " + unit : ""}` : null;
    const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "long", timeStyle: "short" });
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:#111111;padding:24px 32px;">
            <div style="display:inline-block;background:#F5B400;border-radius:6px;padding:6px 14px;margin-bottom:10px;">
              <span style="color:#fff;font-weight:700;font-size:12px;letter-spacing:2px;text-transform:uppercase;">New Enquiry</span>
            </div>
            <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700;">🔔 New Bulk Enquiry Received</h1>
            <p style="color:#999;margin:6px 0 0;font-size:13px;">Submitted on ${submittedAt} (IST)</p>
          </td>
        </tr>
        <!-- Product highlight -->
        ${productName ? `
        <tr>
          <td style="background:#fffbeb;border-bottom:3px solid #F5B400;padding:16px 32px;">
            <p style="margin:0;font-size:13px;color:#92400e;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Product Enquiry</p>
            <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#111;">${productName}</p>
            ${qty ? `<p style="margin:4px 0 0;font-size:13px;color:#555;">Requested Quantity: <strong>${qty}</strong></p>` : ""}
          </td>
        </tr>` : ""}
        <!-- Details table -->
        <tr>
          <td style="padding:24px 32px 8px;">
            <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#999;letter-spacing:1px;text-transform:uppercase;">Contact Details</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:8px;overflow:hidden;">
              ${row("Name", name)}
              ${row("Phone", phone ? `<a href="tel:${phone}" style="color:#F5B400;text-decoration:none;font-weight:600;">${phone}</a>` : null)}
              ${row("Email", email ? `<a href="mailto:${email}" style="color:#F5B400;text-decoration:none;">${email}</a>` : null)}
              ${row("Quantity", qty)}
              ${row("Source", source)}
            </table>
          </td>
        </tr>
        <!-- Message -->
        ${message ? `
        <tr>
          <td style="padding:8px 32px 24px;">
            <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#999;letter-spacing:1px;text-transform:uppercase;">Message</p>
            <div style="background:#f8f8f8;border-left:4px solid #F5B400;border-radius:0 8px 8px 0;padding:16px;font-size:14px;color:#333;line-height:1.7;">
              ${message.replace(/\n/g, "<br>")}
            </div>
          </td>
        </tr>` : ""}
        <!-- CTA -->
        <tr>
          <td style="padding:0 32px 32px;">
            <a href="mailto:${email || phone}" style="display:inline-block;background:#F5B400;color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;margin-right:12px;">Reply to Customer</a>
            ${phone ? `<a href="tel:${phone}" style="display:inline-block;background:#111;color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">Call Now</a>` : ""}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8f8f8;border-top:1px solid #eee;padding:16px 32px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#aaa;">This is an automated notification from Rajiv Phylon website enquiry system.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function clientHtml({ name, productName, quantity, unit, message, phone, email }) {
    const qty = quantity ? `${quantity}${unit ? " " + unit : ""}` : null;
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:#111111;padding:32px;text-align:center;">
            <div style="display:inline-block;background:#F5B400;border-radius:50%;width:56px;height:56px;line-height:56px;font-size:24px;margin-bottom:16px;">✓</div>
            <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">Thank You, ${name}!</h1>
            <p style="color:#bbb;margin:8px 0 0;font-size:14px;">Your enquiry has been received. We will get back to you within 24 hours.</p>
          </td>
        </tr>
        <!-- Enquiry summary -->
        <tr>
          <td style="padding:28px 32px;">
            <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:#999;letter-spacing:1px;text-transform:uppercase;">Your Enquiry Summary</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:8px;overflow:hidden;">
              ${row("Name", name)}
              ${row("Phone", phone)}
              ${row("Email", email)}
              ${productName ? row("Product", productName) : ""}
              ${qty ? row("Quantity", qty) : ""}
            </table>
            ${message ? `
            <div style="margin-top:16px;background:#fffbeb;border-left:4px solid #F5B400;border-radius:0 8px 8px 0;padding:16px;font-size:14px;color:#444;line-height:1.7;">
              <strong style="display:block;margin-bottom:6px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#92400e;">Your Message</strong>
              ${message.replace(/\n/g, "<br>")}
            </div>` : ""}
          </td>
        </tr>
        <!-- What happens next -->
        <tr>
          <td style="padding:0 32px 28px;">
            <div style="background:#f8f8f8;border-radius:10px;padding:20px;">
              <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#111;">What happens next?</p>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr><td style="padding:6px 0;font-size:13px;color:#555;">📞&nbsp;&nbsp;Our sales team will call you to discuss your requirements</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#555;">💬&nbsp;&nbsp;We will share product samples, pricing & MOQ details</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#555;">📦&nbsp;&nbsp;Get a custom bulk quote tailored to your business needs</td></tr>
              </table>
            </div>
          </td>
        </tr>
        <!-- Contact info -->
        <tr>
          <td style="padding:0 32px 32px;text-align:center;">
            <p style="margin:0 0 12px;font-size:13px;color:#999;">You can also reach us directly:</p>
            <a href="tel:+919876543210" style="display:inline-block;background:#111;color:#fff;font-weight:600;font-size:13px;padding:10px 22px;border-radius:8px;text-decoration:none;margin:4px;">📞 Call Us</a>
            <a href="https://wa.me/919876543210" style="display:inline-block;background:#25D366;color:#fff;font-weight:600;font-size:13px;padding:10px 22px;border-radius:8px;text-decoration:none;margin:4px;">💬 WhatsApp</a>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8f8f8;border-top:1px solid #eee;padding:20px 32px;text-align:center;">
            <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#111;">Rajiv Phylon</p>
            <p style="margin:0;font-size:12px;color:#aaa;">Premium Footwear & Textile Manufacturer | B2B Export Specialist</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ─── Public API ─────────────────────────────────────────── */

/**
 * Send enquiry notification to admin + thank-you to client
 * Non-throwing: logs errors but never fails the main request
 */
export async function sendEnquiryEmails(data) {
    const { name, phone, email, quantity, unit, message, productName, source } = data;

    const adminSubject = productName
        ? `🔔 New Enquiry: ${productName} from ${name}`
        : `🔔 New Enquiry from ${name}`;

    const clientSubject = productName
        ? `✅ Enquiry Received – ${productName} | Rajiv Phylon`
        : `✅ Your Enquiry Received | Rajiv Phylon`;

    const adminMailOptions = {
        from: FROM,
        to: ADMIN_EMAIL,
        subject: adminSubject,
        html: adminHtml({ name, phone, email, quantity, unit, message, productName, source }),
    };

    const tasks = [transporter.sendMail(adminMailOptions).catch((e) => console.error("[Email] Admin mail failed:", e.message))];

    if (email && email.includes("@")) {
        const clientMailOptions = {
            from: FROM,
            to: email,
            subject: clientSubject,
            html: clientHtml({ name, phone, email, quantity, unit, message, productName }),
        };
        tasks.push(transporter.sendMail(clientMailOptions).catch((e) => console.error("[Email] Client mail failed:", e.message)));
    }

    await Promise.allSettled(tasks);
}
