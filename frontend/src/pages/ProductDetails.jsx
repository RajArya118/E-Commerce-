import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  Shield,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Send,
  MessageSquare
} from 'lucide-react';
import { productsAPI, reviewsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { showToast } = useUI();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await productsAPI.getProductDetails(slug);
        if (res.data?.data) {
          const prod = res.data.data;
          setProduct(prod);
          setActiveImage(0);

          // Initialize variants
          if (prod.variants && prod.variants.length > 0) {
            const initialVariants = {};
            prod.variants.forEach((v) => {
              if (v.options && v.options.length > 0) {
                initialVariants[v.name] = v.options[0];
              }
            });
            setSelectedVariant(initialVariants);
          }

          // Fetch reviews
          const revRes = await reviewsAPI.getReviews(prod.id);
          if (revRes.data?.data) setReviews(revRes.data.data);

          // Fetch related
          const relRes = await productsAPI.getProducts({
            category: prod.category_slug,
            limit: 4,
          });
          if (relRes.data?.data) {
            setRelatedProducts(relRes.data.data.products.filter((p) => p.id !== prod.id));
          }
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 text-secondary text-xs">
        <div className="w-8 h-8 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
        <span>Loading hardware architecture...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="font-heading font-bold text-2xl text-white">Product Not Found</h2>
        <p className="text-secondary text-xs max-w-sm">
          The requested luxury model does not exist or has been retired from the active catalogue.
        </p>
        <Link
          to="/shop"
          className="px-6 py-2.5 rounded-xl bg-accent-purple text-white text-xs font-semibold"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const images = product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80'];
  const price = product.discount_price || product.price;
  const originalPrice = product.discount_price ? product.price : null;
  const discountPct = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const inStock = product.stock_quantity > 0;

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedVariant);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to submit a verified buyer review', 'error');
      return;
    }
    if (!newTitle.trim() || !newComment.trim()) {
      showToast('Please fill out title and comment', 'error');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await reviewsAPI.submitReview(product.id, {
        rating: newRating,
        title: newTitle,
        comment: newComment,
      });
      if (res.data?.data) {
        setReviews([res.data.data, ...reviews]);
        setNewTitle('');
        setNewComment('');
        showToast('Review submitted successfully!', 'success');
      }
    } catch (err) {
      showToast('Failed to post review. Please try again.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-secondary">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-white transition-colors">Catalog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl overflow-hidden glass-card aspect-square bg-[#0a0a0f] border border-border flex items-center justify-center">
            <img
              src={images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-500"
            />
            {discountPct > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold bg-accent-cyan text-black rounded-full shadow-lg">
                Save {discountPct}%
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all ${
                isFavorited
                  ? 'bg-accent-purple text-white shadow-neon-purple'
                  : 'bg-black/50 text-secondary hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden glass-card border transition-all shrink-0 ${
                    activeImage === idx
                      ? 'border-accent-purple ring-2 ring-accent-purple/50'
                      : 'border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Pricing, Specs & Buy Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-cyan font-heading">
                {product.brand} · SKU: {product.SKU}
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="flex items-center gap-0.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-white">{product.average_rating}</span>
                </div>
                <span className="text-secondary/60">({product.review_count} verified reviews)</span>
              </div>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-secondary font-light leading-relaxed">
              {product.short_description || product.description}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-card border border-border flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-heading font-extrabold text-3xl text-gradient">
                  ₹{price.toLocaleString('en-IN')}
                </span>
                {originalPrice && (
                  <span className="text-sm text-secondary/60 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-secondary mt-1">Inclusive of all duties, import customs & GST</p>
            </div>

            <div className="text-right">
              {inStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  In Stock ({product.stock_quantity})
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Variant Selectors */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4 pt-2">
              {product.variants.map((v, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                    {v.name}: <span className="text-white font-bold">{selectedVariant[v.name]}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {v.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => setSelectedVariant({ ...selectedVariant, [v.name]: opt })}
                        className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                          selectedVariant[v.name] === opt
                            ? 'bg-accent-purple text-white shadow-neon-purple/40 border border-accent-purple'
                            : 'bg-card border border-border text-secondary hover:text-white'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity Stepper & Add to Cart */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-xl bg-card p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-secondary hover:text-white"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-semibold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  className="p-2 text-secondary hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                disabled={!inStock}
                onClick={handleAddToCart}
                className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-black font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-40 shadow-neon-purple/40 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{inStock ? 'Add to Cart' : 'Sold Out'}</span>
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/60 text-center text-[11px] text-secondary">
            <div className="p-2.5 rounded-xl bg-card/60">
              <Truck className="w-4 h-4 mx-auto mb-1 text-accent-cyan" />
              <span>Complimentary Freight</span>
            </div>
            <div className="p-2.5 rounded-xl bg-card/60">
              <Shield className="w-4 h-4 mx-auto mb-1 text-accent-purple" />
              <span>2-Year Warranty</span>
            </div>
            <div className="p-2.5 rounded-xl bg-card/60">
              <RotateCcw className="w-4 h-4 mx-auto mb-1 text-accent-cyan" />
              <span>30-Day White Glove Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="p-8 rounded-3xl glass-card space-y-6">
          <h3 className="font-heading font-bold text-xl text-white">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, val], i) => (
              <div key={i} className="flex justify-between p-3.5 rounded-xl bg-background border border-border text-xs">
                <span className="text-secondary font-medium">{key}</span>
                <span className="text-white font-semibold text-right">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Reviews & Submission */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-2xl text-white">Verified Client Reviews</h3>
            <p className="text-xs text-secondary mt-1">Authentic experiences from international owners</p>
          </div>
        </div>

        {/* Review Form */}
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <h4 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-accent-cyan" /> Leave Your Assessment
          </h4>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary">Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setNewRating(star)}
                    className={`w-5 h-5 cursor-pointer transition-colors ${
                      star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-secondary/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="Headline / Summary (e.g. 'Acoustic transcendence')"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs text-white placeholder-secondary/50 focus:outline-none focus:border-accent-purple"
            />

            <textarea
              rows="3"
              placeholder="Detailed commentary on build craftsmanship, acoustic timbre, or ergonomic satisfaction..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs text-white placeholder-secondary/50 focus:outline-none focus:border-accent-purple resize-none"
            />

            <button
              type="submit"
              disabled={submittingReview}
              className="px-6 py-2.5 rounded-xl bg-accent-purple hover:bg-accent-purple/90 text-white text-xs font-semibold flex items-center gap-2 shadow-neon-purple/30 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingReview ? 'Submitting...' : 'Submit Assessment'}</span>
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="p-5 rounded-2xl bg-card border border-border space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(r.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] text-emerald-400 font-medium">Verified Buyer</span>
              </div>
              <h5 className="font-heading font-semibold text-sm text-white">"{r.title}"</h5>
              <p className="text-xs text-secondary leading-relaxed">{r.comment}</p>
              <p className="text-[10px] text-secondary/60 pt-2 border-t border-border/40">
                By {r.user_name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-border">
          <h3 className="font-heading font-bold text-2xl text-white">Complementary Innovations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
