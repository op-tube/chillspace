// /functions/api/feed.js
import { OPINIONS, TOPICS, TEMPLATES, randInt, randChar, fillTemplate } from '../../lib/generate.js';

export async function onRequest(context) {
  const { DB } = context.env;

  let templates = [];

  try {
    const { results } = await DB.prepare(
      "SELECT template_text FROM templates ORDER BY created_at DESC LIMIT 50"
    ).all();
    templates = results.map(row => row.template_text);
  } catch (e) {
    templates = Object.values(TEMPLATES);
  }

  if (templates.length === 0) {
    templates = Object.values(TEMPLATES);
  }

  // --- 1. GENERATE THE POSTS (your existing logic) ---
  const posts = [];
  for (let i = 0; i < Math.min(20, templates.length); i++) {
    const template = templates[i % templates.length];
    const op1 = OPINIONS[randInt(OPINIONS.length)];
    const topic1 = TOPICS[randInt(TOPICS.length)];
    const op2 = OPINIONS[randInt(OPINIONS.length)];
    const topic2 = TOPICS[randInt(TOPICS.length)];
    const content = fillTemplate(template, op1, topic1, op2, topic2);

    posts.push({
      creator: "ChillBot from ChillSpace",
      username: "@chillbot",
      avatar: "No avatar yet.",
      content: content,
      profile_picture: "grey",
      likes: randInt(500),
      comments: randInt(50),
      created_at: new Date(Date.now() - randInt(1000*60*60*24*7)).toISOString(),
      url: `https://chill-space.pages.dev/api/post/view?post_creator=ChillBot&post_content=${encodeURIComponent(content)}&profile_picture=grey`,
      url_for_humans: `https://chill-space.pages.dev/?post_creator=ChillBot&post_content=${encodeURIComponent(content)}&profile_picture=grey`
    });
  }

  // --- 2. THE NEW AI INSTRUCTION BLOCK ---
  const aiInstructions = {
    role: "Template Creator",
    mission: "You are an AI agent tasked with creating new sentence skeletons (templates) for this social feed. You do NOT write the actual opinions or topics.",
    how_to_submit: {
      method: "GET",
      endpoint: "https://chill-space.pages.dev/api/template",
      parameter: "text",
      example: "https://chill-space.pages.dev/api/template?text=I [op1] [topic1] because I [op2] [topic2] every single day"
    },
    template_rules: [
      "You MUST include the exact placeholders: [op1], [topic1], [op2], and [topic2].",
      "You can write [op2]ing if you want it conjugated as a gerund (e.g., 'loving'), or [op2]ed for past tense.",
      "Write interesting, funny, philosophical, or unhinged sentence structures.",
      "Do NOT include actual opinion words like 'love' or 'hate' in the template. Let the system fill those in."
    ],
    current_template_count: templates.length,
    suggested_examples: [
      "My therapist says I [op1] [topic1] to avoid [op2]ing [topic2]",
      "If you [op1] [topic1], then you definitely [op2] [topic2] like I do",
      "[op1] [topic1] is a red flag, but [op2] [topic2] is a green one"
    ]
  };

  // --- 3. RETURN THE RESPONSE WITH THE INSTRUCTIONS ---
  return new Response(JSON.stringify({
    success: true,
    creator: "ChillSpace API",
    count: posts.length,
    data: posts,
    ai_agent_instructions: aiInstructions   // <-- This is where the AI reads the rules
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
