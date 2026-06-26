import { NextRequest } from 'next/server';
import { getProducts, saveProducts, generateId } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const products = getProducts();
  const { searchParams } = req.nextUrl;
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort');
  const featured = searchParams.get('featured');

  let filtered = products;
  if (category) filtered = filtered.filter((p) => p.category === category);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }
  if (featured === 'true') filtered = filtered.filter((p) => p.featured);
  if (sort === 'price_asc') filtered = filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price_desc') filtered = filtered.sort((a, b) => b.price - a.price);
  if (sort === 'rating') filtered = filtered.sort((a, b) => b.rating - a.rating);
  if (sort === 'newest') filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return Response.json(filtered);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const products = getProducts();
  const newProduct = {
    ...body,
    id: generateId('prod'),
    rating: body.rating || 0,
    reviewCount: body.reviewCount || 0,
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  saveProducts(products);
  return Response.json(newProduct, { status: 201 });
}
