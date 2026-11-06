import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Search,
  ChevronRight,
  ShieldCheck,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { adminAPI, productsAPI, ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

export default function AdminDashboardPage() {
  const { user, isAdmin } = useAuth();
  const { showToast } = useUI();
  const [activeTab, setActiveTab] = useState('analytics'); // analytics | orders | products | inventory | customers

  // Analytics state
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product Create/Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    brand: 'NOVA',
    category_slug: 'technology',
    price: 49999,
    discount_price: 44999,
    SKU: 'NOV-NEW-099',
    stock_quantity: 25,
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'],
    featured: true,
    trending: true,
  });

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [anRes, ordRes, prodRes, custRes, invRes] = await Promise.all([
        adminAPI.getAnalytics(),
        adminAPI.getOrders(),
        productsAPI.getProducts({ limit: 50 }),
        adminAPI.getCustomers(),
        adminAPI.getInventory(),
      ]);

      if (anRes.data?.data) setAnalytics(anRes.data.data);
      if (ordRes.data?.data?.orders) setOrders(ordRes.data.data.orders);
      if (prodRes.data?.data?.products) setProducts(prodRes.data.data.products);
      if (custRes.data?.data?.customers) setCustomers(custRes.data.data.customers);
      if (invRes.data?.data) setInventory(invRes.data.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
      showToast('Error loading administrative datasets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllAdminData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background pt-32 px-4 text-center space-y-4">
        <h2 className="font-heading font-bold text-2xl text-red-400">Restricted Command Center</h2>
        <p className="text-xs text-secondary max-w-sm mx-auto">
          Administrative privileges required. Please sign in with an authorized executive account.
        </p>
      </div>
    );
  }

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, {
        order_status: newStatus,
        note: `Transitioned by Executive Admin to ${newStatus}`,
      });
      showToast(`Order status updated to ${newStatus}`, 'success');
      loadAllAdminData();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  // Handle Product Save (Create or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProductId) {
        await productsAPI.updateProduct(editingProductId, productForm);
        showToast('Product updated successfully', 'success');
      } else {
        await productsAPI.createProduct(productForm);
        showToast('New product initialized in catalog', 'success');
      }
      setIsProductModalOpen(false);
      setEditingProductId(null);
      loadAllAdminData();
    } catch (err) {
      showToast(err.response?.data?.error?.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Archive this product from active catalogue?')) return;
    try {
      await productsAPI.deleteProduct(id);
      showToast('Product removed from catalog', 'info');
      loadAllAdminData();
    } catch (err) {
      showToast('Failed to delete product', 'error');
    }
  };

  const summary = analytics?.summary || {
    total_revenue: 0,
    total_orders: 0,
    pending_orders: 0,
    total_customers: 0,
    total_products: 0,
    low_stock_count: 0,
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent-cyan font-heading flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Operations Command Center
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mt-1">
            Executive Analytics & Catalog Control
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllAdminData}
            className="p-2.5 rounded-xl bg-card border border-border text-secondary hover:text-white transition-all"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setEditingProductId(null);
              setProductForm({
                name: '',
                slug: 'nova-custom-hardware-' + Date.now().toString().slice(-4),
                short_description: '',
                description: '',
                brand: 'NOVA',
                category_slug: 'technology',
                price: 49999,
                discount_price: 44999,
                SKU: 'NOV-NEW-' + Math.floor(Math.random() * 900 + 100),
                stock_quantity: 30,
                images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'],
                featured: true,
                trending: true,
              });
              setIsProductModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-black font-semibold text-xs flex items-center gap-2 shadow-neon-purple/30"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl glass-card space-y-1">
          <span className="text-[11px] text-secondary">Total Gross</span>
          <p className="font-heading font-extrabold text-lg sm:text-xl text-gradient">
            ₹{summary.total_revenue?.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="p-4 rounded-2xl glass-card space-y-1">
          <span className="text-[11px] text-secondary">Total Orders</span>
          <p className="font-heading font-extrabold text-lg sm:text-xl text-white">
            {summary.total_orders}
          </p>
        </div>
        <div className="p-4 rounded-2xl glass-card space-y-1">
          <span className="text-[11px] text-secondary">Pending Orders</span>
          <p className="font-heading font-extrabold text-lg sm:text-xl text-amber-400">
            {summary.pending_orders}
          </p>
        </div>
        <div className="p-4 rounded-2xl glass-card space-y-1">
          <span className="text-[11px] text-secondary">Active Products</span>
          <p className="font-heading font-extrabold text-lg sm:text-xl text-accent-cyan">
            {summary.total_products}
          </p>
        </div>
        <div className="p-4 rounded-2xl glass-card space-y-1">
          <span className="text-[11px] text-secondary">Registered Clients</span>
          <p className="font-heading font-extrabold text-lg sm:text-xl text-accent-purple">
            {summary.total_customers}
          </p>
        </div>
        <div className="p-4 rounded-2xl glass-card space-y-1">
          <span className="text-[11px] text-secondary">Low Stock Warnings</span>
          <p className="font-heading font-extrabold text-lg sm:text-xl text-red-400">
            {summary.low_stock_count}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { key: 'analytics', label: 'Revenue Analytics' },
          { key: 'orders', label: `Fulfillment Orders (${orders.length})` },
          { key: 'products', label: `Catalog Management (${products.length})` },
          { key: 'inventory', label: 'Inventory & Restock' },
          { key: 'customers', label: `Client Directory (${customers.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-accent-purple text-white shadow-neon-purple/40'
                : 'text-secondary hover:text-white hover:bg-card'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Analytics Charts */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-8 animate-fadeIn">
          {/* Sales Velocity Chart */}
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-white">Monthly Sales Velocity</h3>
                <p className="text-xs text-secondary">Gross revenue aggregation in INR</p>
              </div>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> +28.4% vs last period
              </span>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.sales_chart}>
                  <defs>
                    <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#25252D" />
                  <XAxis dataKey="month" stroke="#A1A1AA" fontSize={11} />
                  <YAxis stroke="#A1A1AA" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0A0A0F',
                      borderColor: '#25252D',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#A855F7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#purpleGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution & Top Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl glass-card space-y-4">
              <h3 className="font-heading font-bold text-base text-white">Category Market Share</h3>
              <div className="space-y-3">
                {analytics.category_performance?.map((cat, i) => (
                  <div key={i} className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white font-medium">{cat.name}</span>
                      <span className="text-secondary">{cat.product_count} models ({cat.share_pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan rounded-full"
                        style={{ width: `${cat.share_pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl glass-card space-y-4">
              <h3 className="font-heading font-bold text-base text-white">Top Rated Hardware</h3>
              <div className="space-y-3">
                {analytics.top_selling_products?.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border text-xs">
                    <div>
                      <p className="font-heading font-semibold text-white">{p.name}</p>
                      <p className="text-[11px] text-secondary">{p.rating}★ · Available: {p.stock} units</p>
                    </div>
                    <span className="font-bold text-white">₹{p.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Orders Fulfillment Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-6 rounded-3xl glass-card overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 text-secondary uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3">Order Number</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Fulfillment Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-card/40 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-white">{ord.order_number}</td>
                    <td className="py-3.5 text-secondary">{ord.customer_name || ord.customer_email}</td>
                    <td className="py-3.5 text-secondary">{new Date(ord.created_at).toLocaleDateString()}</td>
                    <td className="py-3.5 font-bold text-white">₹{ord.total_amount?.toLocaleString('en-IN')}</td>
                    <td className="py-3.5">
                      <span className="text-emerald-400 font-semibold">{ord.payment_status}</span>
                    </td>
                    <td className="py-3.5">
                      <select
                        value={ord.order_status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-background border border-border text-[11px] text-white focus:outline-none"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="py-3.5 text-right">
                      <a
                        href={`/orders/${ord.order_number}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent-cyan hover:underline inline-flex items-center gap-1"
                      >
                        Details <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Products Catalog CRUD */}
      {activeTab === 'products' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-6 rounded-3xl glass-card overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 text-secondary uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">SKU</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Rating</th>
                  <th className="pb-3 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-card/40 transition-colors">
                    <td className="py-3.5 flex items-center gap-3">
                      <img
                        src={p.images?.[0]}
                        alt={p.name}
                        className="w-9 h-9 rounded-lg object-cover bg-background shrink-0"
                      />
                      <span className="font-heading font-semibold text-white truncate max-w-xs">{p.name}</span>
                    </td>
                    <td className="py-3.5 text-secondary capitalize">{p.category_slug}</td>
                    <td className="py-3.5 font-mono text-secondary">{p.SKU}</td>
                    <td className="py-3.5 font-bold text-white">₹{p.price?.toLocaleString('en-IN')}</td>
                    <td className="py-3.5">
                      <span className={p.stock_quantity <= 5 ? 'text-red-400 font-bold' : 'text-white'}>
                        {p.stock_quantity}
                      </span>
                    </td>
                    <td className="py-3.5 text-amber-400">{p.average_rating}★</td>
                    <td className="py-3.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingProductId(p.id);
                          setProductForm({
                            name: p.name,
                            slug: p.slug,
                            short_description: p.short_description || '',
                            description: p.description || '',
                            brand: p.brand || 'NOVA',
                            category_slug: p.category_slug || 'technology',
                            price: p.price,
                            discount_price: p.discount_price || p.price,
                            SKU: p.SKU,
                            stock_quantity: p.stock_quantity,
                            images: p.images || [],
                            featured: p.featured,
                            trending: p.trending,
                          });
                          setIsProductModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-card hover:bg-white/10 text-secondary hover:text-white"
                        title="Edit Product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg bg-card hover:bg-red-500/20 text-secondary hover:text-red-400"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Inventory Restock Monitor */}
      {activeTab === 'inventory' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inventory.map((inv) => (
              <div
                key={inv.id}
                className={`p-4 rounded-2xl border ${
                  inv.status === 'LOW_STOCK'
                    ? 'border-amber-500/40 bg-amber-500/5'
                    : inv.status === 'OUT_OF_STOCK'
                    ? 'border-red-500/40 bg-red-500/5'
                    : 'border-border bg-card'
                } flex items-center justify-between text-xs`}
              >
                <div>
                  <h4 className="font-heading font-semibold text-white">{inv.name}</h4>
                  <p className="font-mono text-secondary text-[11px]">SKU: {inv.sku}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm block text-white">{inv.stock_quantity} units</span>
                  <span
                    className={`text-[10px] font-bold uppercase ${
                      inv.status === 'LOW_STOCK'
                        ? 'text-amber-400'
                        : inv.status === 'OUT_OF_STOCK'
                        ? 'text-red-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Client Directory */}
      {activeTab === 'customers' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-6 rounded-3xl glass-card overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 text-secondary uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3">Client Name</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Registered At</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-card/40 transition-colors">
                    <td className="py-3.5 font-heading font-semibold text-white">{c.full_name}</td>
                    <td className="py-3.5 text-secondary">{c.email}</td>
                    <td className="py-3.5 text-secondary">{c.phone || 'N/A'}</td>
                    <td className="py-3.5 text-secondary">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Active Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Create/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-secondary-bg border border-border rounded-3xl p-6 sm:p-8 space-y-6 glass-panel max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-heading font-bold text-lg text-white">
                {editingProductId ? 'Edit Product Model' : 'Initialize New Catalog Artifact'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-secondary hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-secondary font-medium">Model Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-secondary font-medium">Slug *</label>
                  <input
                    type="text"
                    required
                    value={productForm.slug}
                    onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-white font-mono text-[11px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-secondary font-medium">SKU *</label>
                  <input
                    type="text"
                    required
                    value={productForm.SKU}
                    onChange={(e) => setProductForm({ ...productForm, SKU: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-secondary font-medium">Category</label>
                  <select
                    value={productForm.category_slug}
                    onChange={(e) => setProductForm({ ...productForm, category_slug: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-white"
                  >
                    <option value="technology">Technology</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="accessories">Accessories</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="home-products">Home Products</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-secondary font-medium">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-white font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-secondary font-medium">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock_quantity}
                    onChange={(e) => setProductForm({ ...productForm, stock_quantity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-white font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-secondary font-medium">Short Headline / Subtitle</label>
                <input
                  type="text"
                  value={productForm.short_description}
                  onChange={(e) => setProductForm({ ...productForm, short_description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-secondary font-medium">Description</label>
                <textarea
                  rows="3"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-card border border-border text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-black font-semibold shadow-neon-purple/30"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
