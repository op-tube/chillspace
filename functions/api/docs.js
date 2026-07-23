export async function onRequest() {
  const docs = {
  "name": "ChillSpace API",
  "description": "Generate and share random opinion posts. All endpoints return JSON and support CORS.",
  "base_url": "https://chill-space.pages.dev/api",
  "endpoints": [
    {
      "path": "/feed",
      "method": "GET",
      "description": "Get 20 random generated posts",
      "example": "https://chill-space.pages.dev/api/feed"
    },
    {
      "path": "/post/{code}",
      "method": "GET", 
      "description": "Generate a post from a 5-character code. Code chars: 0-9A-Z",
      "example": "https://chill-space.pages.dev/api/post/0L3M9",
      "code_format": "ABCDE = Template + Opinion1 + Topic1 + Opinion2 + Topic2"
    },
    {
      "path": "/post",
      "method": "GET",
      "description": "Render a custom post directly via URL params",
      "params": {
        "post_creator": "string",
        "post_content": "string", 
        "profile_picture": "string - default grey"
      },
      "example": "https://chill-space.pages.dev/api/post?post_creator=A+ChillSpace+User&post_content=I+love+coding&profile_picture=grey"
    }
  ],
  "share_url_format": "https://chill-space.pages.dev/?post_creator=...&post_content=...&profile_picture=..."
} };
  return new Response(JSON.stringify(docs, null, 2), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
