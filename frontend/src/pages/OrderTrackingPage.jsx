import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  MapPin,
  ArrowLeft
} from 'lucide-react';
import { ordersAPI } from '../services/api';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const initialNumber = orderId || searchParams.get('number') || '';
  const [orderNumberInput, setOrderNumberInput] = useState(initialNumber);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrder = async (numberToFetch) => {
    if (!numberToFetch.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const res = await ordersAPI.getOrder(numberToFetch.trim());
      if (res.data?.data) {
        setOrder(res.data.data);
      }
    } catch (err) {
      setError('Consignment reference not found in telemetry registry');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialNumber) {
      fetchOrder(initialNumber);
    }
  }, [initialNumber]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrder(orderNumberInput);
  };

  // Milestone mapping
  const steps = [
    { key: 'PENDING', label: 'Order Placed', desc: 'Validated on ledger' },
    { key: 'PROCESSING', label: 'Assembled', desc: 'Precision packaged at hub' },
    { key: 'SHIPPED', label: 'Airborne Freight', desc: 'Handled by global express carrier' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'White-glove handover complete' },
  ];

  const getStepStatus = (stepKey, currentStatus) => {
    const orderLevels = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentIdx = orderLevels.indexOf(currentStatus);
    const stepIdx = orderLevels.indexOf(stepKey);
    if (currentIdx > stepIdx) return 'completed';
    if (currentIdx === stepIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      <div className="border-b border-border/60 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent-cyan font-heading">
            Freight Telemetry
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mt-1">
            Consignment Tracking
          </h1>
        </div>
        <Link to="/orders" className="text-xs text-secondary hover:text-white flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> All Orders
        </Link>
      </div>

      {/* Order Search Box */}
      <form onSubmit={handleSearch} className="p-4 rounded-2xl glass-card flex gap-3">
        <div className="relative flex-1">
          <Package className="w-4 h-4 text-secondary/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Enter Order Reference (e.g. NOV-20261106-9481)..."
            value={orderNumberInput}
            onChange={(e) => setOrderNumberInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-accent-purple"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-accent-purple text-white text-xs font-semibold hover:bg-accent-purple/90 transition-all flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>Locate</span>
        </button>
      </form>

      {loading && (
        <div className="py-20 text-center text-xs text-secondary flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
          Querying global carrier telemetry...
        </div>
      )}

      {error && (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
          {error}
        </div>
      )}

      {order && (
        <div className="space-y-8 animate-fadeIn">
          {/* Order Header Summary */}
          <div className="p-6 rounded-3xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-cyan">
                Consignment Ledger ID
              </span>
              <h2 className="font-mono font-bold text-xl text-white">{order.order_number}</h2>
              <p className="text-xs text-secondary">
                Payment Status: <strong className="text-emerald-400">{order.payment_status}</strong>
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-secondary">Captured Investment</span>
              <p className="font-heading font-extrabold text-2xl text-gradient">
                ₹{order.total_amount?.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="p-8 rounded-3xl glass-card space-y-8">
            <h3 className="font-heading font-bold text-base text-white">Live Milestone Stepper</h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              {steps.map((st, i) => {
                const status = getStepStatus(st.key, order.order_status);
                const isCompleted = status === 'completed';
                const isCurrent = status === 'current';

                return (
                  <div key={i} className="flex flex-col items-center text-center space-y-2 relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                          : isCurrent
                          ? 'bg-accent-purple text-white shadow-neon-purple ring-4 ring-accent-purple/30'
                          : 'bg-card border border-border text-secondary'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                    </div>
                    <div>
                      <p className={`font-heading font-bold text-xs ${isCurrent ? 'text-accent-cyan' : 'text-white'}`}>
                        {st.label}
                      </p>
                      <p className="text-[10px] text-secondary mt-0.5 leading-snug">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Snapshot & Timeline Logs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Address */}
            <div className="p-6 rounded-2xl bg-card border border-border space-y-3 text-xs">
              <h4 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent-cyan" /> Delivery Destination
              </h4>
              <p className="text-white font-medium">{order.shipping_address?.full_name}</p>
              <p className="text-secondary">{order.shipping_address?.street}</p>
              <p className="text-secondary">
                {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.postal_code}
              </p>
              <p className="text-secondary">Phone: {order.shipping_address?.phone}</p>
            </div>

            {/* Carrier Logistics */}
            <div className="p-6 rounded-2xl bg-card border border-border space-y-3 text-xs">
              <h4 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-accent-purple" /> Carrier Protocol
              </h4>
              <p className="text-secondary">Carrier: <strong className="text-white">NOVA Transatlantic Aerospace Cargo</strong></p>
              <p className="text-secondary">Signature Verification: <strong className="text-emerald-400">Armed & Required</strong></p>
              <p className="text-secondary">
                Tracking Updated: {new Date(order.updated_at || order.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
