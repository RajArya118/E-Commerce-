import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, applyCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplying(true);
    await applyCoupon(couponCode.trim());
    setApplying(false);
  };

  const freeThreshold = 2000;
  const currentSubtotal = cart.subtotal || 0;
  const progressPct = Math.min((currentSubtotal / freeThreshold) * 100, 100);
  const remainingForFree = Math.max(freeThreshold - currentSubtotal, 0);

  return (
    <div className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Title */}
      <div className="border-b border-border/60 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent-cyan font-heading">
            Review Selection
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mt-1">
            Shopping Cart ({cart.total_items || 0})
          </h1>
        </div>
        <Link
          to="/shop"
          className="text-xs font-semibold text-secondary hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      {cart.items && cart.items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Items Table / List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Progress Strip */}
            <div className="p-4 rounded-2xl glass-card text-xs">
              {remainingForFree > 0 ? (
                <p className="text-secondary mb-2 flex justify-between">
                  <span>Add <strong className="text-accent-cyan font-semibold">₹{remainingForFree.toLocaleString('en-IN')}</strong> more for complimentary delivery</span>
                  <span className="font-bold text-white">{Math.round(progressPct)}%</span>
                </p>
              ) : (
                <p className="text-emerald-400 font-semibold mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> You qualify for Complimentary Express Delivery!
                </p>
              )}
              <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan transition-all duration-500 rounded-full"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover bg-background shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/product/${item.slug}`}
                        className="font-heading font-semibold text-sm sm:text-base text-white hover:text-accent-cyan transition-colors truncate block"
                      >
                        {item.name}
                      </Link>
                      {item.variant && (
                        <p className="text-xs text-secondary mt-0.5">
                          {Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(', ')}
                        </p>
                      )}
                      <p className="text-xs font-bold text-white mt-1">
                        ₹{item.price.toLocaleString('en-IN')} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    {/* Stepper */}
                    <div className="flex items-center border border-border rounded-xl bg-background p-1">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1.5 text-secondary hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-secondary hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[90px]">
                      <span className="font-heading font-bold text-base text-white">
                        ₹{item.subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-secondary/60 hover:text-red-400 p-2 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl glass-card space-y-5">
              <h3 className="font-heading font-bold text-lg text-white">Financial Summary</h3>

              {/* Coupon Box */}
              <form onSubmit={handleApply} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    type="text"
                    placeholder="Coupon (e.g. NOVALUXURY)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-xl text-xs text-white uppercase placeholder-secondary/50 focus:outline-none focus:border-accent-purple"
                  />
                </div>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-4 py-2.5 bg-card hover:bg-white/10 text-white border border-border rounded-xl text-xs font-semibold transition-all"
                >
                  {applying ? '...' : 'Apply'}
                </button>
              </form>

              {/* Subtotal Calculations */}
              <div className="space-y-2 text-xs text-secondary border-t border-border/60 pt-4">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="text-white font-medium">₹{cart.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                {cart.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Campaign Discount ({cart.coupon_code})</span>
                    <span>-₹{cart.discount_amount?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Freight Delivery</span>
                  <span className="text-white font-medium">
                    {cart.shipping_fee === 0 ? 'COMPLIMENTARY' : `₹${cart.shipping_fee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (5% GST)</span>
                  <span className="text-white font-medium">₹{cart.tax_amount?.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-3 border-t border-border flex justify-between text-lg font-bold text-white font-heading">
                  <span>Final Investment</span>
                  <span className="text-gradient">₹{cart.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <Link
                to="/checkout"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-neon-purple/40 hover:opacity-95 transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Reassurance */}
            <div className="p-4 rounded-2xl bg-card border border-border space-y-2 text-xs text-secondary">
              <div className="flex items-center gap-2 text-white font-semibold">
                <ShieldCheck className="w-4 h-4 text-accent-cyan" /> Secure Cryptographic Checkout
              </div>
              <p className="text-[11px] leading-relaxed">
                Payments verified with HMAC-SHA256 zero-trust encryption powered by Razorpay.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-24 text-center glass-card p-12 rounded-3xl space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto text-secondary">
            <ShoppingBag className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">Your Cart is Currently Empty</h3>
          <p className="text-xs text-secondary leading-relaxed font-light">
            You haven't selected any items yet. Explore our curated collections of aerospace titanium hardware and acoustic flagships.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="px-6 py-3 rounded-xl bg-accent-purple text-white text-xs font-semibold inline-flex items-center gap-2 shadow-neon-purple/30"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
