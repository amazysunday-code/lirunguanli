// functions/api/save.js
// POST /api/save  →  把 DB 数据存入 Cloudflare KV

export async function onRequestPost(context) {
  const { request, env } = context;

  // 跨域头（可选，本站调用不需要，保留备用）
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400, headers });
    }

    // 存入 KV，key 固定为 tradeDocDB
    await env.TRADE_DB.put('tradeDocDB', JSON.stringify(body));

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers });
  }
}

// 处理 OPTIONS 预检请求
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
