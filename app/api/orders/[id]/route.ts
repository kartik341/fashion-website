import { NextRequest } from 'next/server';
import { getOrders, saveOrders } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const orders = getOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) return Response.json({ error: 'Not found' }, { status: 404 });

  // Users can only see their own orders
  if (session.role !== 'admin' && order.userId !== session.userId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  return Response.json(order);
}

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
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return Response.json({ error: 'Not found' }, { status: 404 });

  orders[idx] = { ...orders[idx], ...body, id, updatedAt: new Date().toISOString() };
  saveOrders(orders);
  return Response.json(orders[idx]);
}
