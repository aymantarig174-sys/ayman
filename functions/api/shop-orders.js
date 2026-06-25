const GEIDEA_ENDPOINTS = {
  ksa: {
    apiBase: 'https://api.ksamerchant.geidea.net',
    checkoutScript: 'https://www.ksamerchant.geidea.net/hpp/geideaCheckout.min.js'
  },
  uae: {
    apiBase: 'https://api.merchant.geidea.ae',
    checkoutScript: 'https://www.merchant.geidea.ae/hpp/geideaCheckout.min.js'
  },
  egypt: {
    apiBase: 'https://api.merchant.geidea.net',
    checkoutScript: 'https://www.merchant.geidea.net/hpp/geideaCheckout.min.js'
  }
};

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: jsonHeaders });
}

function clean(value = '') {
  return String(value || '').replace(/[<>]/g, '').trim().slice(0, 500);
}

function geideaConfig(env = {}) {
  const region = String(env.GEIDEA_ENV || 'ksa').toLowerCase();
  return {
    ...(GEIDEA_ENDPOINTS[region] || GEIDEA_ENDPOINTS.ksa),
    publicKey: env.GEIDEA_PUBLIC_KEY || '',
    apiPassword: env.GEIDEA_API_PASSWORD || '',
    currency: env.GEIDEA_CURRENCY || 'SAR'
  };
}

async function geideaSignature({ publicKey, apiPassword, amount, currency, merchantReferenceId, timestamp }) {
  const payload = `${publicKey}${Number(amount).toFixed(2)}${currency}${merchantReferenceId}${timestamp}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(apiPassword),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

function safeReturnUrl(request, requestedReturnUrl = '') {
  try {
    const parsed = new URL(clean(requestedReturnUrl));
    if (['gamezoom.win', 'gamezooom100.pages.dev', 'localhost', '127.0.0.1'].includes(parsed.hostname)) {
      parsed.hash = '';
      return parsed.toString();
    }
  } catch {}
  return new URL('/checkout.html?payment=return', request.url).toString();
}

function orderDescription(orderNumber) {
  return `KHATAFA-STORE-${String(orderNumber || '').replace(/[^A-Z0-9_-]/gi, '')}`.slice(0, 64);
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: jsonHeaders });
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    if (!Array.isArray(body.items) || !body.items.length) {
      return json({ success: false, error: 'السلة فارغة.' }, 400);
    }

    const amount = Number(body.total || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      return json({ success: false, error: 'إجمالي الطلب غير صحيح.' }, 400);
    }

    const config = geideaConfig(env);
    if (!config.publicKey || !config.apiPassword) {
      return json({ success: false, error: 'مفاتيح الدفع غير مضافة في إعدادات الاستضافة.' }, 500);
    }

    const orderNumber = `KHS-${Date.now().toString().slice(-9)}`;
    const timestamp = new Date().toISOString();
    const merchantReferenceId = crypto.randomUUID();
    const origin = new URL(request.url).origin;
    const currency = config.currency;
    const sessionBody = {
      amount: Number(amount.toFixed(2)),
      currency,
      timestamp,
      merchantReferenceId,
      signature: await geideaSignature({
        publicKey: config.publicKey,
        apiPassword: config.apiPassword,
        amount,
        currency,
        merchantReferenceId,
        timestamp
      }),
      callbackUrl: `${origin}/api/geidea/callback`,
      returnUrl: safeReturnUrl(request, body.returnUrl),
      language: 'ar',
      paymentOperation: 'Pay',
      customer: Object.fromEntries(Object.entries({
        name: clean(body.customer_name || 'Khatafa Customer'),
        email: clean(body.customer_email || ''),
        phoneNumber: clean(body.customer_phone || '')
      }).filter(([, value]) => value)),
      order: {
        description: orderDescription(orderNumber)
      }
    };

    const response = await fetch(`${config.apiBase}/payment-intent/api/v2/direct/session`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${config.publicKey}:${config.apiPassword}`)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sessionBody)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.responseCode !== '000') {
      return json({
        success: false,
        error: result.responseMessage || result.detailedResponseMessage || 'تعذر تجهيز الدفع'
      }, response.status || 400);
    }

    return json({
      success: true,
      provider: 'geidea',
      order_number: orderNumber,
      sessionId: result.session?.id || result.sessionId || result.id,
      checkoutScript: config.checkoutScript
    });
  } catch (error) {
    return json({ success: false, error: error.message || 'تعذر تجهيز الدفع' }, 500);
  }
}
