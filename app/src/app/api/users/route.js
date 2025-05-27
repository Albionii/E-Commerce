export async function GET(request) {
  return new Response(JSON.stringify({ message: 'Users API working!' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}