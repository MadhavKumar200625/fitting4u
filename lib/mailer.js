import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (!transporter) {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      throw new Error("SMTP_HOST, SMTP_USER, and SMTP_PASS must be configured");
    }

    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }

  return transporter;
}

export async function sendOtpEmail(email, otp) {
  const from = getNoReplyFrom();

  await getTransporter().sendMail({
    from,
    to: email,
    subject: "Your Fitting4U verification code",
    text: `Your Fitting4U verification code is ${otp}. It expires in 10 minutes.`,
    html: `<p>Your Fitting4U verification code is:</p><h2 style="letter-spacing: 4px">${otp}</h2><p>This code expires in 10 minutes.</p>`,
  });
}

function getNoReplyFrom() {
  // All operational email must be sent from the configured no-reply mailbox.
  // SMTP_USER is only a safe fallback for older deployments that have not set it.
  return process.env.SMTP_FROM || process.env.SMTP_USER;
}

export async function sendOrderEmail({ to, subject, heading, message, order, siteUrl, includeOrderId = true, invoice = false }) {
  if (!to) return;

  const orderId = String(order._id);
  const items = (order.items || [])
    .map((item) => {
      const fabric = typeof item.fabricId === "object" ? item.fabricId : null;
      const name = item.name || fabric?.name || "Fabric item";
      const details = [fabric?.material, fabric?.color, fabric?.gender].filter(Boolean).join(" • ");
      const link = fabric?.slug && siteUrl ? `${siteUrl}/fabrics/${fabric.slug}` : null;
      const image = fabric?.images?.[0];
      const imageUrl = image?.startsWith("http") ? image : image && siteUrl ? `${siteUrl}${image}` : null;
      return `<li style="display:flex;gap:12px;align-items:center;margin:12px 0;list-style:none"><div>${imageUrl ? `<img src="${imageUrl}" alt="${name}" width="72" height="72" style="display:block;border-radius:8px;object-fit:cover" />` : ""}</div><div><strong>${name}</strong><br/>${details || "Fabric"}<br/>${item.qty} m × ₹${item.price}${link ? `<br/><a href="${link}">View fabric</a>` : ""}</div></li>`;
    })
    .join("");
  const itemText = (order.items || [])
    .map((item) => {
      const fabric = typeof item.fabricId === "object" ? item.fabricId : null;
      const name = item.name || fabric?.name || "Fabric item";
      const link = fabric?.slug && siteUrl ? ` — ${siteUrl}/fabrics/${fabric.slug}` : "";
      return `• ${name} — ${item.qty} m × ₹${item.price}${link}`;
    })
    .join("\n");

  const orderText = includeOrderId ? `\n\nOrder: ${orderId}\nStatus: ${order.status}` : "";
  const orderHtml = includeOrderId
    ? `<p><strong>Order:</strong> ${orderId}</p><p><strong>Status:</strong> ${order.status.replaceAll("_", " ")}</p>`
    : "";
  const invoiceHtml = invoice
    ? `<section style="margin-top:24px;border:1px solid #dbe5ef;border-radius:12px;overflow:hidden"><div style="background:#003466;color:#fff;padding:16px 20px"><strong>Fitting4U Invoice</strong><br/><span style="font-size:13px">Fabric order summary</span></div><div style="padding:16px 20px"><p style="margin-top:0">${message}</p><ul style="padding:0;margin:0">${items}</ul><div style="border-top:1px solid #dbe5ef;margin-top:16px;padding-top:14px;text-align:right;font-size:18px"><strong>Total: ₹${order.total}</strong></div></div></section>`
    : `<ul style="padding:0">${items}</ul>`;

  await getTransporter().sendMail({
    from: getNoReplyFrom(),
    to,
    subject,
    text: `${heading}\n\n${message}\n\n${itemText}${invoice ? `\n\nInvoice total: ₹${order.total}` : ""}${orderText}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#1f2937"><h2 style="color:#003466">${heading}</h2>${invoice ? "" : `<p>${message}</p>`}${orderHtml}${invoiceHtml}</div>`,
  });
}
