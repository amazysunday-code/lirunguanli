// functions/api/load.js
// GET /api/load  →  从 Cloudflare KV 读取 DB 数据

export async function onRequestGet(context) {
  const { env } = context;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const raw = await env.TRADE_DB.get('tradeDocDB');

    if (!raw) {
      // KV 里还没有数据，返回 null 让前端用默认值
      return new Response(JSON.stringify({ ok: true, data: null }), { status: 200, headers });
    }

    const data = JSON.parse(raw);
    return new Response(JSON.stringify({ ok: true, data }), { status: 200, headers });
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
