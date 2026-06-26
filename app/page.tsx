import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

export default async function HomePage() {
  const allProducts = getProducts();
  const featured = allProducts.filter((p) => p.featured).slice(0, 3);
  const remaining = allProducts.filter((p) => !p.featured).slice(0, 3);

  return (
    <div style={{ background: '#FFFFFF', color: '#111111' }}>

      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className="hero-section" style={{
        minHeight: '92vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        overflow: 'hidden',
      }}>
        {/* Left — Text */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '5rem 3rem 5rem 4rem',
          background: '#FFFFFF',
        }}>
          <div className="animate-fade-in" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2rem',
          }}>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase' as const,
              color: '#C9A227',
              borderBottom: '1px solid #C9A227',
              paddingBottom: '1px',
            }}>
              New Season — Primavera 2026
            </span>
          </div>

          <h1 className="animate-fade-in delay-100" style={{
            fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            marginBottom: '2rem',
            textTransform: 'uppercase' as const,
            fontFamily: 'Georgia, serif',
            color: '#111111',
          }}>
            Nothing<br />
            Stops You.<br />
            <span style={{ color: '#C9A227' }}>Everything</span><br />
            You Need.
          </h1>

          <p className="animate-fade-in delay-200" style={{
            fontSize: '0.95rem',
            color: '#666666',
            lineHeight: 1.8,
            marginBottom: '2.5rem',
            maxWidth: 380,
            letterSpacing: '0.02em',
          }}>
            At Lunivya, we create timeless clothing designed for comfort, confidence, and everyday style. Discover pieces that fit your lifestyle.
          </p>

          <div className="animate-fade-in delay-300" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' as const }}>
            <Link href="/products" className="btn-primary" style={{ padding: '0.875rem 2.5rem' }}>
              Shop Collection
            </Link>
            <Link href="/products?featured=true" className="btn-secondary" style={{ padding: '0.875rem 2.5rem' }}>
              Lookbook
            </Link>
          </div>

          {/* Stats */}
          <div className="animate-fade-in delay-400" style={{
            display: 'flex',
            gap: '2rem',
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(0,0,0,0.08)',
            flexWrap: 'wrap' as const,
          }}>
            {[
              { num: '10K+', label: 'Happy Customers' },
              { num: '4.8★', label: 'Avg Rating' },
              { num: '100%', label: 'Authentic' },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>{s.num}</div>
                <div style={{ fontSize: '0.72rem', color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Image grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 0,
          background: '#F5F4F0',
        }}>
          <div style={{ position: 'relative', overflow: 'hidden', gridRow: 'span 2' }}>
            <Image
              src="/images/hero1.jpg"
              alt="Lunivya editorial fashion"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
            />
          </div>
          <div style={{ position: 'relative', overflow: 'hidden', background: '#111111' }}>
            <Image
              src="/images/blazer.jpg"
              alt="Lunivya blazer"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center', mixBlendMode: 'luminosity', opacity: 0.85 }}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
              padding: '1rem', color: 'white',
            }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase' as const }}>New In</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: 2 }}>Linen Blazer</div>
            </div>
          </div>
          <div style={{ position: 'relative', overflow: 'hidden', background: '#F5F4F0' }}>
            <Image
              src="/images/dress.jpg"
              alt="Lunivya silk dress"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
              padding: '1rem', color: 'white',
            }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase' as const }}>Bestseller</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: 2 }}>Silk Midi</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BRAND TAGLINE
      ══════════════════════════════════════ */}
      <section style={{
        background: '#F5F4F0',
        padding: '5rem 2rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
            fontWeight: 400,
            lineHeight: 1.7,
            letterSpacing: '0.04em',
            color: '#333333',
            fontStyle: 'italic',
            fontFamily: 'Georgia, serif',
            marginBottom: '2rem',
          }}>
            &ldquo;At Lunivya, we create timeless clothing designed for comfort, confidence, and everyday style. Discover pieces that fit your lifestyle and express your individuality.&rdquo;
          </p>
          <Link href="/products" className="tagline-link" style={{
            display: 'inline-block',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            color: '#111111',
            textDecoration: 'none',
            borderBottom: '1px solid #111111',
            paddingBottom: '2px',
          }}>
            Shop Now →
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRIMAVERA COLLECTION BANNER
      ══════════════════════════════════════ */}
      <section style={{ position: 'relative', height: '70vh', overflow: 'hidden', minHeight: 480 }}>
        <Image
          src="/images/primavera.jpg"
          alt="Primavera Collection"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 4rem',
          maxWidth: 600,
        }}>
          <div style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            color: '#C9A227',
            marginBottom: '1rem',
          }}>
            Exclusive Collection
          </div>
          <h2 style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            fontFamily: 'Georgia, serif',
            color: '#FFFFFF',
            marginBottom: '1rem',
          }}>
            PRIMA-<br />VERA
          </h2>
          <p style={{
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.8)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            marginBottom: '2rem',
            fontWeight: 500,
          }}>
            A new collection designed for your everyday
          </p>
          <Link href="/products" className="primavera-cta" style={{
            display: 'inline-block',
            background: 'white',
            color: '#111111',
            padding: '0.75rem 2rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            textDecoration: 'none',
            width: 'fit-content',
          }}>
            Explore Collection →
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED PRODUCTS — LÁMINA
      ══════════════════════════════════════ */}
      <section style={{ padding: '6rem 0', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '3rem',
            flexWrap: 'wrap' as const,
            gap: '1rem',
          }}>
            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#C9A227', marginBottom: '0.5rem' }}>
                Featured Pieces
              </div>
              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 900,
                letterSpacing: '-0.01em',
                textTransform: 'uppercase' as const,
                fontFamily: 'Georgia, serif',
                color: '#111111',
                lineHeight: 1.05,
              }}>
                LÁMINA
              </h2>
            </div>
            <Link href="/products" className="section-link">
              View All →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {featured.map((product, i) => (
              <div key={product.id} className={`animate-fade-in delay-${(i % 3) * 100 + 100}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BOLD CTA — BLACK SECTION
      ══════════════════════════════════════ */}
      <section style={{
        background: '#111111',
        padding: '7rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 60, height: 2, background: '#C9A227',
        }} />
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            color: '#C9A227',
            marginBottom: '2rem',
          }}>
            Our Promise
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            textTransform: 'uppercase' as const,
            fontFamily: 'Georgia, serif',
            color: '#FFFFFF',
            marginBottom: '2rem',
            letterSpacing: '-0.01em',
          }}>
            Discover Premium Apparel Designed for Comfort, Elegance, and Individuality
          </h2>
          <p style={{
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.8,
            marginBottom: '3rem',
            maxWidth: 560,
            margin: '0 auto 3rem',
          }}>
            Experience the premium taste of Lunivya. Visit our collection for pieces crafted with intention — for those who lead with style.
          </p>
          <Link href="/products" className="cta-gold-btn" style={{
            display: 'inline-block',
            background: '#C9A227',
            color: '#111111',
            padding: '1rem 3rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            textDecoration: 'none',
          }}>
            Shop Premium →
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MORE PRODUCTS — SPILZE
      ══════════════════════════════════════ */}
      <section style={{ padding: '6rem 0', background: '#F5F4F0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '3rem',
            flexWrap: 'wrap' as const,
            gap: '1rem',
          }}>
            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#C9A227', marginBottom: '0.5rem' }}>
                New Arrivals
              </div>
              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 900,
                letterSpacing: '-0.01em',
                textTransform: 'uppercase' as const,
                fontFamily: 'Georgia, serif',
                color: '#111111',
                lineHeight: 1.05,
              }}>
                SPILZE
              </h2>
            </div>
            <Link href="/products" className="section-link">
              View All →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {remaining.map((product, i) => (
              <div key={product.id} className={`animate-fade-in delay-${(i % 3) * 100 + 100}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          EXPERIENCE SECTION
      ══════════════════════════════════════ */}
      <section className="experience-section" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '55vh',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', minHeight: 400 }}>
          <Image
            src="/images/hero2.jpg"
            alt="Lunivya experience"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>
        <div style={{
          background: '#111111',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '4rem 3.5rem',
          color: '#FFFFFF',
        }}>
          <div style={{
            fontSize: '0.68rem', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase' as const,
            color: '#C9A227', marginBottom: '1.5rem',
          }}>
            The Lunivya Experience
          </div>
          <h3 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontWeight: 900, lineHeight: 1.1,
            textTransform: 'uppercase' as const,
            fontFamily: 'Georgia, serif',
            marginBottom: '1.5rem',
            letterSpacing: '-0.01em',
          }}>
            Premium Taste.<br />Every Day.
          </h3>
          <p style={{
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.8, marginBottom: '2.5rem',
            maxWidth: 380,
          }}>
            Each garment is crafted with intention — using sustainable materials and ethical production for the discerning individual.
          </p>
          <Link href="/products" className="gold-outline-btn" style={{
            display: 'inline-block',
            border: '1px solid #C9A227',
            color: '#C9A227',
            padding: '0.75rem 2rem',
            fontSize: '0.72rem', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase' as const,
            textDecoration: 'none', width: 'fit-content',
          }}>
            Our Story →
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CATEGORIES STRIP
      ══════════════════════════════════════ */}
      <section style={{ background: '#FFFFFF', padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C9A227', marginBottom: '0.75rem' }}>
              Find Your Style
            </div>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
              fontWeight: 900, textTransform: 'uppercase' as const,
              fontFamily: 'Georgia, serif', letterSpacing: '0.02em',
            }}>
              Shop by Category
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            border: '1px solid rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}>
            {[
              { label: 'Dresses', icon: '👗', href: '/products?category=Fashion' },
              { label: 'Outerwear', icon: '🧥', href: '/products?category=Fashion' },
              { label: 'Trousers', icon: '👖', href: '/products?category=Fashion' },
              { label: 'New In', icon: '✨', href: '/products?sort=newest' },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                id={`category-${cat.label.toLowerCase()}`}
                className="cat-card"
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div style={{
                  padding: '2.5rem 1rem',
                  textAlign: 'center',
                  borderRight: '1px solid rgba(0,0,0,0.08)',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{cat.icon}</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>{cat.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All hover effects via CSS — no JS event handlers in Server Component */}
      <style>{`
        .hero-section { }
        @media (max-width: 768px) {
          .hero-section { grid-template-columns: 1fr !important; min-height: auto !important; }
          .hero-section > div:last-child { height: 50vw; min-height: 300px; }
          .experience-section { grid-template-columns: 1fr !important; }
          .experience-section > div:first-child { min-height: 300px; }
        }

        .cat-card { transition: all 0.2s ease; }
        .cat-card:hover > div { background: #111111 !important; color: white !important; }
        .cat-card:hover > div > div:last-child { color: white !important; }

        .section-link {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #111111;
          text-decoration: none;
          border-bottom: 1px solid #111111;
          padding-bottom: 2px;
          transition: opacity 0.2s;
        }
        .section-link:hover { opacity: 0.5; }

        .tagline-link:hover { opacity: 0.6; }

        .primavera-cta { transition: all 0.2s ease; }
        .primavera-cta:hover { background: #C9A227 !important; color: #111 !important; }

        .cta-gold-btn { transition: all 0.2s ease; }
        .cta-gold-btn:hover { background: #FFFFFF !important; color: #111111 !important; }

        .gold-outline-btn { transition: all 0.2s ease; }
        .gold-outline-btn:hover { background: #C9A227 !important; color: #111 !important; }
      `}</style>
    </div>
  );
}
