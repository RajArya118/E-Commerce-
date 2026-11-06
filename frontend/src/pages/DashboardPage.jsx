import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { useWishlist } from '../context/WishlistContext';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const { wishlist } = useWishlist();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const res = await ordersAPI.getMyOrders();
        if (res.data?.data) {
          setRecentOrders(res.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load dashboard orders', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl glass-card flex flex-col md:flex-row md:items-center justify-between gap-6 border border-border">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent-purple to-accent-cyan p-[2px]">
            <div className="w-full h-full bg-secondary-bg rounded-[14px] flex items-center justify-center font-heading font-extrabold text-2xl text-white">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                Client Hub: {user?.full_name}
              </h1>
              {isAdmin && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded-full border border-accent-cyan/20">
                  Administrator
                </span>
              )}
            </div>
            <p className="text-xs text-secondary mt-1">{user?.email} · Concierge Priority Tier</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="px-5 py-2.5 rounded-xl bg-card hover:bg-white/10 border border-border text-white text-xs font-semibold transition-all"
          >
            Manage Profile
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="px-5 py-2.5 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-xs font-semibold hover:bg-accent-cyan/20 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" /> Admin Console
            </Link>
          )}
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/orders" className="p-6 rounded-2xl glass-card group transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-secondary font-medium">Historical Consignments</span>
            <div className="p-2 rounded-xl bg-accent-purple/20 text-accent-purple">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-bold text-2xl text-white group-hover:text-accent-cyan transition-colors">
            {recentOrders.length} Orders
          </p>
          <span className="text-[11px] text-accent-cyan flex items-center gap-1 mt-2">
            View fulfillment timelines <ChevronRight className="w-3 h-3" />
          </span>
        </Link>

        <Link to="/wishlist" className="p-6 rounded-2xl glass-card group transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-secondary font-medium">Curated Wishlist</span>
            <div className="p-2 rounded-xl bg-accent-cyan/20 text-accent-cyan">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-bold text-2xl text-white group-hover:text-accent-cyan transition-colors">
            {wishlist.length} Items
          </p>
          <span className="text-[11px] text-accent-cyan flex items-center gap-1 mt-2">
            Manage saved hardware <ChevronRight className="w-3 h-3" />
          </span>
        </Link>

        <Link to="/profile" className="p-6 rounded-2xl glass-card group transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-secondary font-medium">Default Delivery Destination</span>
            <div className="p-2 rounded-xl bg-card text-secondary">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-bold text-sm text-white truncate group-hover:text-accent-cyan transition-colors">
            {user?.addresses?.[0]?.street || 'Bengaluru Headquarters'}
          </p>
          <span className="text-[11px] text-secondary/60 mt-2 block">
            {user?.addresses?.[0]?.city || 'India'}
          </span>
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-xl text-white">Recent Consignments</h2>
          <Link to="/orders" className="text-xs text-accent-cyan hover:underline flex items-center gap-1">
            <span>All Orders</span> <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-2xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
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
                  <p className="text-xs text-secondary">
                    {new Date(ord.created_at).toLocaleDateString()} · {ord.items?.length || 0} line items
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-border/40 pt-3 sm:pt-0">
                  <span className="font-heading font-bold text-base text-white">
                    ₹{ord.total_amount?.toLocaleString('en-IN')}
                  </span>
                  <Link
                    to={`/orders/${ord.order_number}`}
                    className="px-4 py-2 rounded-xl bg-card hover:bg-white/10 text-white text-xs font-semibold border border-border"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl glass-card text-center space-y-3">
            <p className="text-xs text-secondary">No recent consignments on record.</p>
            <Link to="/shop" className="text-xs font-semibold text-accent-cyan underline">
              Browse technological hardware catalogue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
