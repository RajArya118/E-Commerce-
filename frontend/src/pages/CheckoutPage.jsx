import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lock,
  Package,
  ShoppingBag
} from 'lucide-react';
import { ordersAPI, paymentsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

export default function CheckoutPage() {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();

  // Shipping Form State
  const defaultAddr = user?.addresses?.[0] || {};
  const [formData, setFormData] = useState({
    fullName: defaultAddr.full_name || user?.full_name || 'Aether Vance',
    email: user?.email || 'customer@novastore.com',
    phone: defaultAddr.phone || user?.phone || '+91-98765-43210',
    street: defaultAddr.street || '42 Sky Tower, Cyber Boulevard',
    city: defaultAddr.city || 'Mumbai',
    state: defaultAddr.state || 'Maharashtra',
    postalCode: defaultAddr.postal_code || '400001',
    country: defaultAddr.country || 'India',
  });

  const [loading, setLoading] = useState(false);
  const [paymentSuccessOrder, setPaymentSuccessOrder] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayWithRazorpay = async (e) => {
    e.preventDefault();
    if (!cart.items || cart.items.length === 0) {
      showToast('Your shopping cart is empty', 'error');
      return;
    }
    if (!formData.fullName || !formData.email || !formData.street || !formData.city || !formData.postalCode) {
      showToast('Please fill out all mandatory shipping fields', 'error');
      return;
    }

    try {
      setLoading(true);

      // 1. Create order on backend (which verifies stock & creates Razorpay order)
      const orderPayload = {
        shipping_address: {
          full_name: formData.fullName,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode,
          country: formData.country,
        },
        coupon_code: cart.coupon_code,
        payment_method: 'razorpay',
      };

      const orderRes = await ordersAPI.createOrder(orderPayload);
      if (!orderRes.data?.data) {
        throw new Error('Failed to create order on server');
      }

      const { order, razorpay } = orderRes.data.data;

      // 2. Open Razorpay Checkout Modal
      if (window.Razorpay) {
        const options = {
          key: razorpay.key_id,
          amount: razorpay.amount,
          currency: razorpay.currency,
          name: 'NOVA STORE',
          description: `Order ${order.order_number}`,
          image: '/favicon.svg',
          order_id: razorpay.order_id,
          handler: async function (response) {
            // 3. Cryptographic HMAC-SHA256 verification on backend
            try {
              const verifyRes = await paymentsAPI.verifyPayment({
                order_id: order.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyRes.data?.data?.verified) {
                setPaymentSuccessOrder(verifyRes.data.data.order || order);
                await refreshCart();
                showToast('Payment verified successfully!', 'success');
              } else {
                showToast('Payment verification failed', 'error');
              }
            } catch (vErr) {
              showToast('Error validating payment signature with server', 'error');
            }
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#A855F7',
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              showToast('Payment window dismissed', 'info');
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          showToast(`Payment failed: ${response.error.description}`, 'error');
          setLoading(false);
        });
        rzp.open();
      } else {
        // Fallback simulated sandbox verification for development
        showToast('Simulating Razorpay Test Gateway verification...', 'info');
        const verifyRes = await paymentsAPI.verifyPayment({
          order_id: order.id,
          razorpay_order_id: razorpay.order_id,
          razorpay_payment_id: 'pay_sandbox_' + Date.now(),
          razorpay_signature: 'mock_sha256_verified_signature',
        });
        if (verifyRes.data?.data?.verified) {
          setPaymentSuccessOrder(verifyRes.data.data.order || order);
          await refreshCart();
          showToast('Sandbox payment verified!', 'success');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message || 'Payment initiation failed';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Confirmation View
  if (paymentSuccessOrder) {
    return (
      <div className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
        <div className="p-8 sm:p-12 rounded-3xl glass-card text-center space-y-6 border border-emerald-500/40">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-heading">
              Payment Verified & Captured
            </span>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
              Order Confirmed: {paymentSuccessOrder.order_number}
            </h1>
            <p className="text-xs sm:text-sm text-secondary max-w-md mx-auto">
              Your order has been cryptographically confirmed and assigned to our luxury fulfillment hub.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border text-left space-y-4 max-w-lg mx-auto text-xs">
            <div className="flex justify-between border-b border-border/60 pb-3">
              <span className="text-secondary">Order Reference</span>
              <span className="font-mono font-bold text-white">{paymentSuccessOrder.order_number}</span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-3">
              <span className="text-secondary">Client Email</span>
              <span className="text-white font-medium">{paymentSuccessOrder.customer_email}</span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-3">
              <span className="text-secondary">Destination</span>
              <span className="text-white font-medium text-right">
                {paymentSuccessOrder.shipping_address?.street}, {paymentSuccessOrder.shipping_address?.city}
              </span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-bold text-white font-heading">
              <span>Amount Captured</span>
              <span className="text-gradient">₹{paymentSuccessOrder.total_amount?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to={`/orders/${paymentSuccessOrder.order_number}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-accent-purple text-white text-xs font-semibold shadow-neon-purple/40"
            >
              Track Consignment Milestones
            </Link>
            <Link
              to="/shop"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-card border border-border text-white text-xs font-semibold hover:bg-white/10"
            >
              Return to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <div className="border-b border-border/60 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-accent-cyan font-heading">
          Zero-Trust Security
        </span>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mt-1">
          Cryptographic Checkout
        </h1>
      </div>

      <form onSubmit={handlePayWithRazorpay} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Customer & Address Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl glass-card space-y-5">
            <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-accent-cyan" /> Shipping Consignment Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-secondary font-medium">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div className="space-y-1">
                <label className="text-secondary font-medium">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div className="space-y-1">
                <label className="text-secondary font-medium">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-secondary font-medium">Street Address / Suite *</label>
                <input
                  type="text"
                  name="street"
                  required
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div className="space-y-1">
                <label className="text-secondary font-medium">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div className="space-y-1">
                <label className="text-secondary font-medium">State / Region *</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div className="space-y-1">
                <label className="text-secondary font-medium">Postal / ZIP Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div className="space-y-1">
                <label className="text-secondary font-medium">Country *</label>
                <input
                  type="text"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-purple"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order Summary & Razorpay Trigger */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl glass-card space-y-5">
            <h3 className="font-heading font-bold text-lg text-white flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs text-secondary font-normal">{cart.items?.length || 0} items</span>
            </h3>

            {/* Line item thumbnails */}
            <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
              {cart.items?.map((it) => (
                <div key={it.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-10 h-10 rounded-lg object-cover bg-background shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{it.name}</p>
                      <p className="text-[10px] text-secondary">Qty: {it.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-white shrink-0">₹{it.subtotal?.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Financials */}
            <div className="space-y-2 text-xs text-secondary border-t border-border/60 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-medium">₹{cart.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              {cart.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Discount ({cart.coupon_code})</span>
                  <span>-₹{cart.discount_amount?.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Freight</span>
                <span className="text-white font-medium">
                  {cart.shipping_fee === 0 ? 'COMPLIMENTARY' : `₹${cart.shipping_fee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5% GST)</span>
                <span className="text-white font-medium">₹{cart.tax_amount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between text-lg font-bold text-white font-heading">
                <span>Final Amount</span>
                <span className="text-gradient">₹{cart.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Pay with Razorpay button */}
            <button
              type="submit"
              disabled={loading || !cart.items || cart.items.length === 0}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-black font-semibold text-sm flex items-center justify-center gap-2.5 shadow-neon-purple/40 hover:opacity-95 disabled:opacity-40 transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Authorize & Pay with Razorpay</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-secondary/60 text-center flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-accent-cyan" /> Razorpay Test Mode with server HMAC signature validation
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
