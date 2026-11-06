import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useUI } from '../context/UIContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const { wishlist } = useWishlist();
  const { setIsAiOpen, setIsSearchOpen, setIsCartOpen } = useUI();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/80 py-3 shadow-2xl'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-purple to-accent-cyan p-[1.5px] transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full bg-secondary-bg rounded-[10px] flex items-center justify-center">
                  <span className="font-heading font-extrabold text-xl tracking-tighter text-white">N</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xl tracking-wider text-white">
                  NOVA<span className="text-accent-cyan font-light">STORE</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-secondary font-medium -mt-1 hidden sm:block">
                  Beyond Shopping
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-white ${
                  location.pathname === '/' ? 'text-accent-cyan' : 'text-secondary'
                }`}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className={`text-sm font-medium transition-colors hover:text-white ${
                  location.pathname === '/shop' ? 'text-accent-cyan' : 'text-secondary'
                }`}
              >
                Shop
              </Link>
              <Link
                to="/shop?category=technology"
                className="text-sm font-medium text-secondary hover:text-white transition-colors"
              >
                Technology
              </Link>
              <Link
                to="/shop?category=electronics"
                className="text-sm font-medium text-secondary hover:text-white transition-colors"
              >
                Electronics
              </Link>
              <Link
                to="/about"
                className={`text-sm font-medium transition-colors hover:text-white ${
                  location.pathname === '/about' ? 'text-accent-cyan' : 'text-secondary'
                }`}
              >
                About
              </Link>

              {/* AI Concierge Trigger Pill */}
              <button
                onClick={() => setIsAiOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/30 text-accent-purple hover:bg-accent-purple/20 transition-all text-xs font-semibold shadow-neon-purple/20"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-accent-cyan" />
                <span>Ask NOVA AI</span>
              </button>
            </nav>

            {/* Actions (Search, Wishlist, User, Cart) */}
            <div className="flex items-center gap-4">
              {/* Spotlight Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search Catalog"
                className="p-2 text-secondary hover:text-white transition-colors rounded-lg hover:bg-card/50"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="relative p-2 text-secondary hover:text-white transition-colors rounded-lg hover:bg-card/50"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-accent-purple text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Toggle */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping Cart"
                className="relative p-2 text-secondary hover:text-white transition-colors rounded-lg hover:bg-card/50"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-accent-cyan text-black text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* User Account / Admin Link */}
              {user ? (
                <div className="relative group">
                  <Link
                    to={isAdmin ? '/admin' : '/dashboard'}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-border bg-card/60 hover:border-accent-purple/50 transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center text-white font-bold text-xs">
                      {user.full_name?.charAt(0) || 'U'}
                    </div>
                    {isAdmin && (
                      <span className="hidden lg:inline text-[11px] font-semibold text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded-full border border-accent-cyan/20">
                        Admin
                      </span>
                    )}
                  </Link>

                  {/* Quick Dropdown on hover */}
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-secondary-bg/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-2 border-b border-border/60">
                      <p className="text-xs font-semibold text-white truncate">{user.full_name}</p>
                      <p className="text-[10px] text-secondary truncate">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-accent-cyan hover:bg-card/80 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Command Center
                      </Link>
                    )}
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-secondary hover:text-white hover:bg-card/80 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-secondary hover:text-white hover:bg-card/80 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      My Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-card/80 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-card hover:bg-white/10 border border-border rounded-xl transition-all"
                >
                  <User className="w-4 h-4 text-accent-cyan" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-secondary hover:text-white"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-background/95 backdrop-blur-2xl pt-24 px-6 md:hidden flex flex-col justify-between pb-8 animate-fadeIn">
          <div className="space-y-6">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAiOpen(true);
              }}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-accent-purple/10 border border-accent-purple/40 text-accent-purple"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-accent-cyan" />
                <span className="font-medium text-sm">NOVA AI Shopping Assistant</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-lg font-heading font-medium text-white py-2 border-b border-border/40">
                Home
              </Link>
              <Link to="/shop" className="text-lg font-heading font-medium text-white py-2 border-b border-border/40">
                All Products Catalog
              </Link>
              <Link to="/shop?category=technology" className="text-lg font-heading font-medium text-white py-2 border-b border-border/40">
                Technology
              </Link>
              <Link to="/shop?category=electronics" className="text-lg font-heading font-medium text-white py-2 border-b border-border/40">
                Electronics
              </Link>
              <Link to="/about" className="text-lg font-heading font-medium text-white py-2 border-b border-border/40">
                About NOVA
              </Link>
              <Link to="/contact" className="text-lg font-heading font-medium text-white py-2 border-b border-border/40">
                Support Concierge
              </Link>
            </nav>
          </div>

          <div className="pt-6 border-t border-border">
            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{user.full_name}</p>
                  <p className="text-xs text-secondary">{user.email}</p>
                </div>
                <button onClick={logout} className="text-xs text-red-400 font-medium">
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  className="py-3 text-center text-sm font-medium text-white bg-card border border-border rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="py-3 text-center text-sm font-medium text-black bg-gradient-to-r from-accent-purple to-accent-cyan rounded-xl font-semibold"
                >
                  Join NOVA
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
