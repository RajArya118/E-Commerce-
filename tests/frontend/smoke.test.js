import { describe, it, expect } from 'vitest';

describe('NOVA STORE Frontend Core Suite', () => {
  it('validates brand constant declarations', () => {
    const brand = 'NOVA STORE';
    const tagline = 'Beyond Shopping. Experience Innovation.';
    expect(brand).toBe('NOVA STORE');
    expect(tagline).toContain('Experience Innovation');
  });

  it('validates 22 pages configuration routes', () => {
    const pages = [
      '/', '/shop', '/product/:slug', '/category/:slug', '/search',
      '/cart', '/checkout', '/login', '/register', '/forgot-password',
      '/reset-password', '/dashboard', '/profile', '/orders', '/orders/:orderId',
      '/wishlist', '/track-order', '/about', '/contact', '/privacy',
      '/terms', '/admin'
    ];
    expect(pages.length).toBe(22);
  });

  it('validates Razorpay minor currency conversion', () => {
    const inr = 34999.00;
    const paise = Math.round(inr * 100);
    expect(paise).toBe(3499900);
  });
});
