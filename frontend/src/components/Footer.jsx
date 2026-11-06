import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  Shield,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { newsletterAPI } from '../services/api';
import { useUI } from '../context/UIContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const { showToast } = useUI();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    try {
      setStatus('loading');
      const res = await newsletterAPI.subscribe({ email, source: 'footer_newsletter' });
      setStatus('success');
      setEmail('');
      showToast('Subscribed to NOVA Drops & Innovations!', 'success');
    } catch (err) {
      setStatus('error');
      showToast('Subscription failed. Please try again.', 'error');
    }
  };

  return (
    <footer className="bg-secondary-bg border-t border-border relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-accent-purple/10 to-transparent blur-3xl pointer-events-none" />

      {/* Trust Badges Strip */}
      <div className="border-b border-border/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-card border border-border text-accent-cyan">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Global Express Freight</p>
              <p className="text-[11px] text-secondary">Free delivery on orders over ₹2,000</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-card border border-border text-accent-purple">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Cryptographic Security</p>
              <p className="text-[11px] text-secondary">Razorpay 256-bit encrypted checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-card border border-border text-accent-cyan">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">30-Day White Glove Returns</p>
              <p className="text-[11px] text-secondary">Unconditional satisfaction guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-card border border-border text-accent-purple">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">AI Concierge Powered</p>
              <p className="text-[11px] text-secondary">24/7 intelligent styling & guidance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Brand & Newsletter */}
        <div className="md:col-span-5 space-y-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-purple to-accent-cyan p-[1.5px]">
              <div className="w-full h-full bg-secondary-bg rounded-[10px] flex items-center justify-center">
                <span className="font-heading font-extrabold text-lg text-white">N</span>
              </div>
            </div>
            <span className="font-heading font-bold text-xl text-white">
              NOVA<span className="text-accent-cyan font-light">STORE</span>
            </span>
          </Link>
          <p className="text-secondary text-sm leading-relaxed max-w-sm">
            Beyond shopping. Experience innovation. Curating the world’s most extraordinary luxury technology, acoustic masterpieces, and wearable intelligence.
          </p>

          {/* Working Newsletter Subscription */}
          <div className="pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
              Join the NOVA Inner Circle
            </p>
            <form onSubmit={handleSubscribe} className="relative max-w-md">
              <input
                type="email"
                placeholder="Enter your private email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-white placeholder-secondary/60 focus:outline-none focus:border-accent-purple pr-12 transition-all"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                aria-label="Subscribe to newsletter"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-gradient-to-r from-accent-purple to-accent-cyan text-black rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                {status === 'loading' ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
            <p className="text-[11px] text-secondary/60 mt-2 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Zero spam. Unsubscribe anytime with one click.
            </p>
          </div>
        </div>

        {/* Catalog Categories */}
        <div className="md:col-span-2 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-white font-heading">Innovations</p>
          <ul className="space-y-2.5 text-sm text-secondary">
            <li>
              <Link to="/shop?category=technology" className="hover:text-white transition-colors">
                Quantum Tech
              </Link>
            </li>
            <li>
              <Link to="/shop?category=electronics" className="hover:text-white transition-colors">
                Spatial Audio
              </Link>
            </li>
            <li>
              <Link to="/shop?category=fashion" className="hover:text-white transition-colors">
                Graphene Wear
              </Link>
            </li>
            <li>
              <Link to="/shop?category=accessories" className="hover:text-white transition-colors">
                Timepieces
              </Link>
            </li>
            <li>
              <Link to="/shop?category=home-products" className="hover:text-white transition-colors">
                Levitating Decor
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Services */}
        <div className="md:col-span-2 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-white font-heading">Client Services</p>
          <ul className="space-y-2.5 text-sm text-secondary">
            <li>
              <Link to="/track-order" className="hover:text-white transition-colors">
                Track Consignment
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-white transition-colors">
                Order History
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-colors">
                Concierge Desk
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-white transition-colors">
                Account Terminal
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-white transition-colors">
                Curated Wishlist
              </Link>
            </li>
          </ul>
        </div>

        {/* Corporate & Legal */}
        <div className="md:col-span-3 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-white font-heading">Heritage & Legal</p>
          <ul className="space-y-2.5 text-sm text-secondary">
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                The NOVA Manifesto
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Disclosure
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Engagement
              </Link>
            </li>
            <li>
              <Link to="/admin" className="text-accent-cyan/80 hover:text-accent-cyan transition-colors flex items-center gap-1">
                Admin Terminal <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="border-t border-border/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary">
          <p>© 2026 NOVA STORE. All rights reserved. Precision Engineered for Global Luxury.</p>
          <div className="flex items-center gap-6">
            <span className="text-white/40">Powered by FastAPI & React 19</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
