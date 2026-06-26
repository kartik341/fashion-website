'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
}

const categories = ['All', 'Fashion'];
const sortOptions = [
  { value: '', label: 'Default' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const featured = searchParams.get('featured') === 'true';

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    if (featured) params.set('featured', 'true');

    setLoading(true);
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [category, search, sort, featured]);

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`/products?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: search || null });
  };

  const title = featured ? 'Featured' : category ? category : 'All Collection';

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>

      {/* Page Header */}
      <div style={{
        background: '#F5F4F0',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '4rem 0 3rem',
        textAlign: 'center',
      }}>
        <div className="container">
          <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A227', marginBottom: '0.75rem' }}>
            Lunivya
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 900,
            textTransform: 'uppercase',
            fontFamily: 'Georgia, serif',
            letterSpacing: '0.05em',
            color: '#111111',
            marginBottom: '0.5rem',
          }}>
            {title}
          </h1>
          <p style={{ color: '#888', fontSize: '0.85rem', letterSpacing: '0.06em' }}>
            {loading ? 'Loading...' : `${products.length} piece${products.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 2rem 5rem' }}>

        {/* Filters bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2.5rem',
          alignItems: 'center',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}>
          {/* Search */}
          <form onSubmit={handleSearch} style={{ flex: '1 1 280px', display: 'flex', gap: '0', maxWidth: 400 }}>
            <input
              type="text"
              className="input"
              placeholder="Search the collection..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRight: 'none' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.25rem', borderRadius: 0 }}>
              →
            </button>
          </form>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => {
              const active = (cat === 'All' && !category) || category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => updateParams({ category: cat === 'All' ? null : cat, featured: null })}
                  style={{
                    padding: '0.4rem 1.25rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    border: active ? '1px solid #111111' : '1px solid rgba(0,0,0,0.15)',
                    background: active ? '#111111' : 'transparent',
                    color: active ? '#FFFFFF' : '#666666',
                    transition: 'all 0.2s',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <select
            className="input"
            style={{ width: 'auto', minWidth: 180, fontSize: '0.78rem' }}
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value || null })}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Products grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 420 }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ color: '#888', letterSpacing: '0.06em', fontSize: '0.85rem' }}>
              No pieces found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
