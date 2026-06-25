const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers });
}

export async function onRequest() {
  return new Response(JSON.stringify({ success: true }), { headers });
}
