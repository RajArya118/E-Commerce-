import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Cpu,
  Layers,
  Zap,
  Star,
  ChevronRight,
  TrendingUp,
  Percent,
  Compass,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Hero3DCanvas from '../components/Hero3DCanvas';
import ProductCard from '../components/ProductCard';
import { productsAPI, categoriesAPI, reviewsAPI } from '../services/api';
import { useUI } from '../context/UIContext';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setIsAiOpen } = useUI();

  // Special offer countdown timer (e.g. 48h drops)
  const [timeLeft, setTimeLeft] = useState({ hours: 42, minutes: 18, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [featRes, trendRes, catRes] = await Promise.all([
          productsAPI.getFeatured(4),
          productsAPI.getTrending(4),
          categoriesAPI.getCategories(),
        ]);

        if (featRes.data?.data) setFeaturedProducts(featRes.data.data);
        if (trendRes.data?.data) setTrendingProducts(trendRes.data.data);
        if (catRes.data?.data) setCategories(catRes.data.data);

        // Fetch sample reviews
        if (featRes.data?.data?.[0]) {
          const revRes = await reviewsAPI.getReviews(featRes.data.data[0].id);
          if (revRes.data?.data) setReviews(revRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="relative overflow-hidden bg-background">
      {/* SECTION 2 — HERO EXPERIENCE */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Radial Neon Halos */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/80 border border-border text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
              <span className="text-secondary">NOVA 2.0 Architectural Edition</span>
              <span className="text-accent-purple">· International Launch</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tighter leading-[1.05] text-white">
              THE FUTURE OF <br />
              <span className="text-gradient">SHOPPING.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-secondary max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Discover extraordinary products. Experience a smarter way to shop. Precision-engineered titanium hardware, aerospace wearables, and autonomous AI concierge guidance.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/shop"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-black font-semibold text-sm flex items-center justify-center gap-2.5 transition-all hover:scale-105 shadow-neon-purple/40"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setIsAiOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-card hover:bg-white/10 text-white border border-border font-medium text-sm flex items-center justify-center gap-2.5 transition-all"
              >
                <Sparkles className="w-4 h-4 text-accent-cyan" />
                <span>DISCOVER NOVA AI</span>
              </button>
            </div>

            {/* Telemetry Stats */}
            <div className="pt-8 border-t border-border/60 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="font-heading font-bold text-xl sm:text-2xl text-white">60 FPS</p>
                <p className="text-[11px] text-secondary">Fluid Inertia</p>
              </div>
              <div>
                <p className="font-heading font-bold text-xl sm:text-2xl text-accent-cyan">&lt;100ms</p>
                <p className="text-[11px] text-secondary">Async API</p>
              </div>
              <div>
                <p className="font-heading font-bold text-xl sm:text-2xl text-accent-purple">100%</p>
                <p className="text-[11px] text-secondary">Cryptographic Auth</p>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Holographic Canvas */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[460px] flex items-center justify-center">
              <Hero3DCanvas />
              {/* Floating Holographic Hardware Pill */}
              <div className="absolute -bottom-4 right-4 glass-card px-4 py-3 rounded-2xl flex items-center gap-3 animate-float">
                <div className="p-2 rounded-xl bg-accent-purple/20 text-accent-purple">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Quantum Core X1</p>
                  <p className="text-[10px] text-secondary">Aerospace Titanium Diaphragm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — FEATURED COLLECTION */}
      <section className="py-24 border-t border-border/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent-cyan font-heading">
                Curated Selection
              </span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white tracking-tight mt-1">
                Featured Flagships
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-semibold text-secondary hover:text-white flex items-center gap-1.5 transition-colors group"
            >
              <span>View complete catalog</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — TRENDING DROPS */}
      <section className="py-24 bg-secondary-bg border-t border-border/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-14">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent-purple/20 text-accent-purple">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent-purple font-heading">
                  High Demand
                </span>
                <h2 className="font-heading font-bold text-3xl text-white tracking-tight">
                  Trending Innovations
                </h2>
              </div>
            </div>
            <Link
              to="/shop?sort_by=popular"
              className="hidden sm:flex text-xs font-semibold text-secondary hover:text-white items-center gap-1.5"
            >
              Explore Trending <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — CATEGORIES */}
      <section className="py-24 border-t border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-cyan font-heading">
              Disciplines & Domains
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Six Luxury Arenas
            </h2>
            <p className="text-sm text-secondary font-light">
              From quantum wearables to magnetic levitation acoustics, explore each bespoke discipline.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="group relative rounded-2xl glass-card overflow-hidden aspect-[4/3] flex flex-col justify-end p-6 transition-all duration-500 hover:border-accent-purple/60"
              >
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 filter brightness-50 group-hover:brightness-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent" />
                <div className="relative z-10 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent-cyan">Domain</span>
                  <h3 className="font-heading font-bold text-xl text-white group-hover:text-accent-cyan transition-colors flex items-center justify-between">
                    <span>{cat.name}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-xs text-secondary/90 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — IMMERSIVE STORYTELLING (SeaCat & ICON Inspired) */}
      <section className="py-28 bg-[#040406] border-t border-border/80 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-accent-purple/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-purple font-heading flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent-cyan" />
              Aerospace Materiality & Ergonomics
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              BEYOND FORM. <br />
              <span className="text-gradient">PURE KINETIC LUXURY.</span>
            </h2>
            <p className="text-secondary text-sm sm:text-base leading-relaxed font-light">
              Every NOVA artifact undergoes cryogenic stress testing, precision CNC 5-axis milling, and neural acoustic calibration. We unite forged Damascus titanium, surgical sapphire crystal, and graphene weave to sculpt hardware that defies obsolescence.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-card border border-border">
                <p className="font-heading font-bold text-xl text-white">Grade 5</p>
                <p className="text-xs text-secondary mt-0.5">Forged Titanium Alloy</p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border">
                <p className="font-heading font-bold text-xl text-accent-cyan">0.02%</p>
                <p className="text-xs text-secondary mt-0.5">Harmonic Distortion</p>
              </div>
            </div>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-cyan hover:text-white transition-colors"
              >
                <span>Read the NOVA Design Manifesto</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-border/80 shadow-2xl glass-card aspect-video">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
                alt="NOVA Eclipse Teardown"
                className="w-full h-full object-cover filter contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30 pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 glass-panel p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white font-heading">NOVA Eclipse X-1 Teardown Stage</p>
                  <p className="text-[10px] text-secondary">Acoustic chamber with laser-sintered dampening</p>
                </div>
                <Link
                  to="/product/nova-eclipse-x-1"
                  className="px-3 py-1.5 rounded-lg bg-accent-purple text-white text-xs font-semibold shadow-neon-purple/30"
                >
                  Inspect
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — SPECIAL OFFERS (Real Campaign Data & Live Countdown) */}
      <section className="py-20 border-t border-border/80 relative bg-gradient-to-b from-secondary-bg to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-8 sm:p-12 border border-accent-purple/30 bg-card overflow-hidden shadow-2xl">
            {/* Background cyber accent */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-accent-purple/20 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/20 border border-accent-purple/40 text-accent-purple text-xs font-semibold">
                  <Percent className="w-3.5 h-3.5" />
                  <span>Limited Drop Campaign</span>
                </div>
                <h3 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
                  Unlock 15% Off Your Inaugural Order
                </h3>
                <p className="text-secondary text-xs sm:text-sm max-w-lg leading-relaxed">
                  Apply promo code <strong className="text-accent-cyan font-mono">NOVALUXURY</strong> during checkout for orders above ₹10,000. Includes complimentary worldwide express concierge delivery.
                </p>

                {/* Countdown Timer */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-secondary mr-2">
                    <Clock className="w-4 h-4 text-accent-cyan" />
                    <span>Offer Expires in:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-2 rounded-xl bg-background border border-border text-center">
                      <span className="font-heading font-bold text-sm text-white">{timeLeft.hours}</span>
                      <span className="block text-[9px] text-secondary">HRS</span>
                    </div>
                    <span className="text-secondary font-bold">:</span>
                    <div className="px-3 py-2 rounded-xl bg-background border border-border text-center">
                      <span className="font-heading font-bold text-sm text-white">{timeLeft.minutes}</span>
                      <span className="block text-[9px] text-secondary">MIN</span>
                    </div>
                    <span className="text-secondary font-bold">:</span>
                    <div className="px-3 py-2 rounded-xl bg-background border border-border text-center">
                      <span className="font-heading font-bold text-sm text-accent-cyan">{timeLeft.seconds}</span>
                      <span className="block text-[9px] text-secondary">SEC</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-3">
                <Link
                  to="/shop"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-neon-purple/40 hover:scale-105 transition-all"
                >
                  <span>Redeem NOVALUXURY</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[11px] text-secondary/60">Automated signature validation at checkout</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — CUSTOMER REVIEWS */}
      {reviews.length > 0 && (
        <section className="py-24 border-t border-border/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-accent-cyan font-heading">
                Client Testimonials
              </span>
              <h2 className="font-heading font-bold text-3xl text-white">
                Verified Global Impressions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-6 rounded-2xl glass-card space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                    </span>
                  </div>
                  <h4 className="font-heading font-semibold text-base text-white">"{rev.title}"</h4>
                  <p className="text-xs sm:text-sm text-secondary leading-relaxed font-light">
                    {rev.comment}
                  </p>
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-secondary">
                    <span className="font-semibold text-white">{rev.user_name}</span>
                    <span>Transatlantic Collector</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
