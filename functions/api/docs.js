export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const docs = {
    name: "Chill Space API",
    version: "1.0.0",
    baseUrl: url.origin,
    endpoints: [
      {
        path: "/api/feed",
        method: "GET",
        description: "Get the main feed posts"
      },
      {
        path: "/api/docs",
        method: "GET", 
        description: "Get this API documentation"
      }
    ],
    note: "All responses are JSON"
  };

  return new Response(JSON.stringify(docs, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
