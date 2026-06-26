'use client';

import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  featured: boolean;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [id, setId] = useState<string | null>(null);

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!product) notFound();

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, image: product.images[0] || '', stock: product.stock });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '1rem 0',
        background: '#FFFFFF',
      }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.72rem', letterSpacing: '0.08em', color: '#888' }}>
            <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/products" style={{ color: '#888', textDecoration: 'none' }}>Collection</Link>
            <span>/</span>
            <span style={{ color: '#111' }}>{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product layout */}
      <div className="container" style={{ padding: '4rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '5rem',
          alignItems: 'start',
        }} className="product-detail-grid">

          {/* Left — Image */}
          <div style={{ position: 'relative', aspectRatio: '3/4', background: '#F5F4F0', overflow: 'hidden' }}>
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8rem' }}>
                👗
              </div>
            )}
            {discount > 0 && (
              <div style={{
                position: 'absolute', top: 16, left: 16,
                background: '#111', color: 'white',
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                padding: '0.3rem 0.75rem', textTransform: 'uppercase',
              }}>
                {discount}% OFF
              </div>
            )}
            {product.featured && (
              <div style={{
                position: 'absolute', top: discount > 0 ? 52 : 16, left: 16,
                background: '#C9A227', color: '#111',
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                padding: '0.3rem 0.75rem', textTransform: 'uppercase',
              }}>
                Featured
              </div>
            )}
          </div>

          {/* Right — Details */}
          <div>
            {/* Category */}
            <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C9A227', marginBottom: '0.75rem' }}>
              {product.category}
            </div>

            {/* Name */}
            <h1 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              fontFamily: 'Georgia, serif',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              color: '#111111',
              marginBottom: '1rem',
            }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span style={{ color: '#C9A227', fontSize: '0.9rem' }}>
                {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#888', letterSpacing: '0.04em' }}>
                {product.rating} ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111111' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span style={{ fontSize: '1.1rem', color: '#AAA', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Description */}
            <p style={{ color: '#555', lineHeight: 1.8, fontSize: '0.9rem', marginBottom: '2rem' }}>
              {product.description}
            </p>

            {/* Size selector */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#111' }}>
                  Size: {selectedSize}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#888', letterSpacing: '0.06em', textDecoration: 'underline', cursor: 'pointer' }}>
                  Size Guide
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      width: 44, height: 44,
                      border: selectedSize === size ? '2px solid #111111' : '1px solid rgba(0,0,0,0.15)',
                      background: selectedSize === size ? '#111111' : 'transparent',
                      color: selectedSize === size ? '#FFFFFF' : '#444',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      letterSpacing: '0.04em',
                      transition: 'all 0.2s',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock */}
            <div style={{ marginBottom: '1.5rem', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {product.stock > 0 ? (
                <span style={{ color: '#22a06b', fontWeight: 600 }}>✓ In Stock ({product.stock} available)</span>
              ) : (
                <span style={{ color: '#ef4444', fontWeight: 600 }}>Out of Stock</span>
              )}
            </div>

            {/* Quantity + Add to cart */}
            {product.stock > 0 && (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch' }}>
                {/* Qty selector */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(0,0,0,0.15)' }}>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ width: 44, height: 52, background: 'none', border: 'none', color: '#111', cursor: 'pointer', fontSize: '1.2rem' }}
                  >
                    −
                  </button>
                  <span style={{ minWidth: 36, textAlign: 'center', fontWeight: 700, fontSize: '0.95rem' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    style={{ width: 44, height: 52, background: 'none', border: 'none', color: '#111', cursor: 'pointer', fontSize: '1.2rem' }}
                  >
                    +
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  id={`add-to-cart-${product.id}`}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    fontSize: '0.78rem',
                    background: added ? '#C9A227' : '#111111',
                    color: added ? '#111' : 'white',
                    transition: 'all 0.2s',
                  }}
                  onClick={handleAddToCart}
                >
                  {added ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                {product.tags.map((tag) => (
                  <span key={tag} style={{
                    fontSize: '0.68rem', fontWeight: 600,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '0.2rem 0.65rem',
                    border: '1px solid rgba(0,0,0,0.12)',
                    color: '#666',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </div>
  );
}
