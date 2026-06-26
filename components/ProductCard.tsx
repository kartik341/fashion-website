'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

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

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        id={`product-card-${product.id}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          overflow: 'hidden',
          cursor: 'pointer',
          background: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        {/* Product Image */}
        <div style={{
          position: 'relative',
          height: 340,
          background: '#F5F4F0',
          overflow: 'hidden',
        }}>
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center top',
                transition: 'transform 0.5s ease',
                transform: hovered ? 'scale(1.06)' : 'scale(1)',
              }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '4rem',
            }}>
              👗
            </div>
          )}

          {/* Badges */}
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {discount > 0 && (
              <span style={{
                background: '#111111', color: 'white',
                fontSize: '0.62rem', fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '0.2rem 0.5rem',
              }}>
                {discount}% OFF
              </span>
            )}
            {product.featured && (
              <span style={{
                background: '#C9A227', color: '#111111',
                fontSize: '0.62rem', fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '0.2rem 0.5rem',
              }}>
                Featured
              </span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <span style={{
                background: 'white', color: '#ef4444',
                fontSize: '0.62rem', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                padding: '0.2rem 0.5rem',
                border: '1px solid #ef4444',
              }}>
                Only {product.stock} left
              </span>
            )}
          </div>

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(255,255,255,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontSize: '0.72rem', fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#111', border: '1px solid #111', padding: '0.5rem 1rem',
              }}>
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick add — visible on hover */}
          {product.stock > 0 && hovered && (
            <button
              id={`add-to-cart-${product.id}`}
              onClick={handleAddToCart}
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: added ? '#C9A227' : '#111111',
                color: added ? '#111111' : 'white',
                border: 'none', padding: '0.85rem',
                fontSize: '0.72rem', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {added ? '✓ Added to Cart' : '+ Add to Cart'}
            </button>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '1rem 1rem 1.25rem' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>
            {product.category}
          </div>

          <h3 style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#111111',
            marginBottom: '0.5rem',
            lineHeight: 1.4,
          }}>
            {product.name}
          </h3>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <span style={{ color: '#C9A227', fontSize: '0.75rem', letterSpacing: '-0.05em' }}>
              {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#888' }}>
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111111' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span style={{ fontSize: '0.85rem', color: '#aaa', textDecoration: 'line-through' }}>
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
