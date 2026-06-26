import { NextRequest } from 'next/server';
import { getUsers, saveUsers } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return Response.json({ error: 'Not found' }, { status: 404 });

  const { role, name } = body;
  if (role) users[idx].role = role;
  if (name) users[idx].name = name;
  saveUsers(users);

  const { password: _p, ...safe } = users[idx];
  return Response.json(safe);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  // Prevent deleting self
  if (id === session.userId) {
    return Response.json({ error: 'Cannot delete yourself' }, { status: 400 });
  }

  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  saveUsers(filtered);
  return Response.json({ message: 'Deleted' });
}
