import { getUsers } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const users = getUsers();
  // Never return passwords
  const safe = users.map(({ password: _p, ...u }) => u);
  return Response.json(safe);
}
