import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Clock, CheckCircle2, Truck, AlertCircle, ShoppingBag } from 'lucide-react';
import { ordersAPI } from '../services/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const res = await ordersAPI.getMyOrders();
        if (res.data?.data) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <div className="border-b border-border/60 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-accent-cyan font-heading">
          Acquisition History
        </span>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mt-1">
          My Consignments ({orders.length})
        </h1>
      </div>

      {loading ? (
        <div className="py-24 flex items-center justify-center text-xs text-secondary gap-3">
          <div className="w-6 h-6 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
          <span>Retrieving order ledger...</span>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((ord) => (
            <div key={ord.id} className="p-6 rounded-3xl glass-card border border-border space-y-4">
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-white text-sm">{ord.order_number}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        ord.order_status === 'DELIVERED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : ord.order_status === 'SHIPPED'
                          ? 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30'
                          : 'bg-accent-purple/10 text-accent-purple border-accent-purple/30'
                      }`}
                    >
                      {ord.order_status}
                    </span>
                  </div>
                  <p className="text-secondary">
                    Placed on {new Date(ord.created_at).toLocaleDateString()} · Payment: <strong className="text-emerald-400">{ord.payment_status}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-heading font-bold text-base text-white">
                    ₹{ord.total_amount?.toLocaleString('en-IN')}
                  </span>
                  <Link
                    to={`/orders/${ord.order_number}`}
                    className="px-4 py-2 rounded-xl bg-accent-purple/10 hover:bg-accent-purple/20 text-accent-purple border border-accent-purple/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <span>Track Consignment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Items row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {ord.items?.map((it, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-3">
                    <img
                      src={it.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80'}
                      alt={it.name}
                      className="w-12 h-12 rounded-lg object-cover bg-background shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-heading font-semibold text-xs text-white truncate">{it.name}</p>
                      <p className="text-[11px] text-secondary">Qty: {it.quantity} · ₹{it.subtotal?.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center glass-card p-12 rounded-3xl space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto text-secondary">
            <ShoppingBag className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="font-heading font-bold text-lg text-white">No Order Records Found</h3>
          <p className="text-xs text-secondary leading-relaxed font-light">
            You haven't placed an order with NOVA STORE yet.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="px-6 py-2.5 rounded-xl bg-accent-purple text-white text-xs font-semibold inline-flex items-center gap-2 shadow-neon-purple/30"
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
