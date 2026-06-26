import { NextRequest } from 'next/server';
import { getProducts, saveProducts } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const products = getProducts();
  const product = products.find((p) => p.id === id);
  if (!product) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(product);
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
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return Response.json({ error: 'Not found' }, { status: 404 });

  products[idx] = { ...products[idx], ...body, id };
  saveProducts(products);
  return Response.json(products[idx]);
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
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
  saveProducts(filtered);
  return Response.json({ message: 'Deleted' });
}
