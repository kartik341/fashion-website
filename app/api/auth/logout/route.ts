export async function POST() {
  const response = Response.json({ message: 'Logged out' });
  const headers = new Headers(response.headers);
  headers.append('Set-Cookie', 'auth_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  return new Response(response.body, { status: 200, headers });
}
