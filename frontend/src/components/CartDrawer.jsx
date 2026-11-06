import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen } = useUI();
  const { cart, updateQuantity, removeItem, applyCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);

  if (!isCartOpen) return null;

  const handleApply = async (e) => {
    e.preventDefault();
    if (!couponInput) return;
    setApplying(true);
    await applyCoupon(couponInput.trim());
    setApplying(false);
  };

  const freeShippingThreshold = 2000;
  const currentSubtotal = cart.subtotal || 0;
  const progressPct = Math.min((currentSubtotal / freeShippingThreshold) * 100, 100);
  const remainingForFree = Math.max(freeShippingThreshold - currentSubtotal, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-fadeIn"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-secondary-bg/95 backdrop-blur-2xl border-l border-border flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-card border border-border text-accent-cyan">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg text-white">Your Cart</h2>
                <p className="text-xs text-secondary">{cart.total_items || 0} items selected</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-secondary hover:text-white rounded-lg hover:bg-card transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Tier Bar */}
          <div className="px-6 py-3 bg-card/60 border-b border-border text-xs">
            {remainingForFree > 0 ? (
              <p className="text-secondary mb-1.5 flex items-center justify-between">
                <span>Add <strong className="text-accent-cyan">₹{remainingForFree.toLocaleString('en-IN')}</strong> for complimentary delivery</span>
                <span className="font-semibold">{Math.round(progressPct)}%</span>
              </p>
            ) : (
              <p className="text-emerald-400 font-semibold mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> You've unlocked Complimentary Express Delivery!
              </p>
            )}
            <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan transition-all duration-500 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.items && cart.items.length > 0 ? (
              cart.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-card border border-border flex gap-4 items-center group transition-all hover:border-border/80"
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover bg-background shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={() => setIsCartOpen(false)}
                      className="font-heading font-semibold text-sm text-white hover:text-accent-cyan transition-colors truncate block"
                    >
                      {item.name}
                    </Link>
                    {item.variant && (
                      <p className="text-[11px] text-secondary truncate">
                        {Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(', ')}
                      </p>
                    )}
                    <p className="font-heading font-bold text-xs text-white mt-1">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-border rounded-lg bg-background">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 text-secondary hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-secondary hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-secondary/60 hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-bold text-sm text-white">
                      ₹{item.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center text-secondary mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="font-heading font-bold text-base text-white">Your Cart is Empty</h3>
                <p className="text-xs text-secondary mt-1 max-w-xs">
                  Explore our curated collection of extraordinary hardware and lifestyle technology.
                </p>
                <Link
                  to="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-accent-purple text-white text-xs font-semibold hover:bg-accent-purple/90 transition-all shadow-neon-purple/40"
                >
                  Discover Catalog
                </Link>
              </div>
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {cart.items && cart.items.length > 0 && (
            <div className="p-6 border-t border-border bg-card/60 space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApply} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. NOVALUXURY)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-xl text-xs text-white placeholder-secondary/50 focus:outline-none focus:border-accent-purple uppercase tracking-wider"
                  />
                </div>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-4 py-2 bg-card hover:bg-white/10 text-white border border-border rounded-xl text-xs font-semibold transition-all"
                >
                  {applying ? 'Applying...' : 'Apply'}
                </button>
              </form>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-secondary">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">₹{cart.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                {cart.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({cart.coupon_code})</span>
                    <span>-₹{cart.discount_amount?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Freight</span>
                  <span className="text-white font-medium">
                    {cart.shipping_fee === 0 ? 'FREE' : `₹${cart.shipping_fee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (5% GST)</span>
                  <span className="text-white font-medium">₹{cart.tax_amount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between text-base font-bold text-white font-heading">
                  <span>Total Amount</span>
                  <span className="text-gradient">₹{cart.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-black font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-neon-purple/40"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
