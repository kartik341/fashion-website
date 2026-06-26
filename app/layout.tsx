import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Lunivya — Premium Fashion',
    template: '%s | Lunivya',
  },
  description:
    'Timeless clothing designed for comfort, confidence, and everyday style. Discover pieces that fit your lifestyle and express your individuality.',
  keywords: ['fashion', 'clothing', 'style', 'premium', 'apparel', 'Lunivya'],
  openGraph: {
    title: 'Lunivya — Premium Fashion',
    description: 'Timeless clothing designed for comfort, confidence, and everyday style.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFFFFF', color: '#111111' }}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
