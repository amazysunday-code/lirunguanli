// Cloudflare Pages Function：/api/db
// 用途：读取 / 保存 / 清空 居间利润统计系统的数据，存储在 Cloudflare KV 中
//
// 部署前必做：
// Cloudflare Dashboard → 你的 Pages 项目 → Settings → Functions
// → KV namespace bindings → Add binding
//   变量名 (Variable name)：PROFIT_KV
//   KV namespace：选择你创建好的 KV 命名空间
// 保存后需要重新部署一次才会生效。

const KEY = 'profitStatsDB';

// 读取数据：GET /api/db
export async function onRequestGet({ env }) {
  try {
    const raw = await env.PROFIT_KV.get(KEY);
    return new Response(raw ?? 'null', {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 保存数据：POST /api/db  (body 为完整的 DB JSON)
export async function onRequestPost({ env, request }) {
  try {
    const body = await request.text();
    JSON.parse(body); // 校验是合法 JSON，避免存入坏数据
    await env.PROFIT_KV.put(KEY, body);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 清空数据：DELETE /api/db
export async function onRequestDelete({ env }) {
  try {
    await env.PROFIT_KV.delete(KEY);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
