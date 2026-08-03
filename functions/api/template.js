// /functions/api/template.js
import { fillTemplate } from '../../lib/generate.js';

export async function onRequest(context) {
  const { DB } = context.env;
  const url = new URL(context.request.url);
  const text = url.searchParams.get('text');

  if (!text) {
    return new Response(JSON.stringify({ error: 'Missing "text" parameter' }), { status: 400 });
  }

  const required = ['[op1]', '[topic1]', '[op2]', '[topic2]'];
  const missing = required.filter(p => !text.includes(p));
  if (missing.length > 0) {
    return new Response(JSON.stringify({ 
      error: `Template must contain: ${missing.join(', ')}` 
    }), { status: 400 });
  }

  await DB.prepare(
    "INSERT INTO templates (template_text, creator) VALUES (?, ?)"
  ).bind(text, "AI_Agent").run();

  return new Response(JSON.stringify({
    success: true,
    message: "Template saved! The feed will now use it."
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}
