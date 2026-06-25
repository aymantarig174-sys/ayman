const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const STORE_EMAIL = 'gamezoom100@gmail.com';

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function invoiceRows(invoice = {}) {
  const productNames = Array.isArray(invoice.products)
    ? invoice.products.map(item => `${item.name || ''}${item.quantity ? ` x ${item.quantity}` : ''}`.trim()).filter(Boolean).join(', ')
    : '';
  return [
    ['اسم العميل', invoice.customer_name],
    ['رقم الجوال', invoice.customer_phone],
    ['البريد الإلكتروني', invoice.customer_email],
    ['العنوان الوطني المختصر', invoice.short_address],
    ['المدينة', invoice.city],
    ['الحي', invoice.district],
    ['العنوان التفصيلي', invoice.address_details],
    ['اسم المنتج', productNames],
    ['المبلغ', invoice.total],
    ['رابط Google Maps', invoice.maps_url]
  ].filter(([, value]) => String(value || '').trim());
}

function buildInvoice(invoice = {}) {
  const rows = invoiceRows(invoice);
  const text = [
    'خطفة ستور',
    ...rows.map(([label, value]) => `${label}: ${value}`)
  ].join('\n');
  const htmlRows = rows.map(([label, value]) => {
    const safeValue = escapeHtml(value);
    const renderedValue = String(value || '').startsWith('http')
      ? `<a href="${safeValue}" style="color:#ffffff;text-decoration:underline">Google Maps</a>`
      : safeValue;
    return `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #2b2b2b;color:#bfbfbf;font-weight:700">${escapeHtml(label)}</td>
        <td style="padding:12px;border-bottom:1px solid #2b2b2b;color:#ffffff">${renderedValue}</td>
      </tr>
    `;
  }).join('');
  const html = `
    <div style="margin:0;padding:24px;background:#000000;color:#ffffff;font-family:Arial,Tahoma,sans-serif;direction:rtl;text-align:right">
      <div style="max-width:720px;margin:auto;background:#080808;border:1px solid #2b2b2b;border-radius:18px;padding:24px">
        <h1 style="margin:0 0 18px;color:#ffffff;font-size:28px">خطفة ستور</h1>
        <table style="width:100%;border-collapse:collapse;background:#111111;border-radius:12px;overflow:hidden">
          ${htmlRows}
        </table>
      </div>
    </div>
  `;
  return { text, html };
}

async function sendInvoiceEmail(env = {}, to, invoice) {
  if (!env.RESEND_API_KEY || !to) return { skipped: true };
  const email = buildInvoice(invoice);
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL || 'Khatafa Store <no-reply@khatafa.store>',
      to,
      subject: 'فاتورة خطفة ستور',
      text: email.text,
      html: email.html
    })
  });
  if (!response.ok) {
    const error = await response.text().catch(() => '');
    throw new Error(error || 'Unable to send invoice email');
  }
  return response.json().catch(() => ({ success: true }));
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers });
}

export async function onRequestPost({ request, env }) {
  const payload = await request.json().catch(() => ({}));
  const invoice = payload.invoice || {};
  const recipients = [invoice.customer_email, STORE_EMAIL].filter(Boolean);
  const sent = [];
  for (const recipient of recipients) {
    sent.push(await sendInvoiceEmail(env, recipient, invoice));
  }
  return new Response(JSON.stringify({ success: true, received: Boolean(payload), emails: sent.length }), { headers });
}
