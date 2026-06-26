import { NextRequest } from 'next/server';
import { getOrders, saveOrders, generateId } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const orders = getOrders();
  // Admin sees all orders; users see only their own
  const result = session.role === 'admin'
    ? orders
    : orders.filter((o) => o.userId === session.userId);

  return Response.json(result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { items, subtotal, shipping, total, address, payment } = body;

  if (!items || !address || !payment) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const orders = getOrders();
  const newOrder = {
    id: generateId('ord'),
    userId: session.userId,
    items,
    subtotal,
    shipping,
    total,
    status: 'placed' as const,
    address,
    payment,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  saveOrders(orders);

  return Response.json(newOrder, { status: 201 });
}
