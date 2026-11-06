import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Sparkles, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const images = product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'];
  const primaryImg = images[0];
  const secondaryImg = images.length > 1 ? images[1] : primaryImg;

  const price = product.discount_price || product.price;
  const originalPrice = product.discount_price ? product.price : null;
  const discountPct = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;

    setIsAdding(true);
    await addToCart(product.id, 1);
    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative rounded-2xl glass-card overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-neon-purple/20">
      {/* Top Media Container */}
      <Link to={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-[#0a0a0f]">
        {/* Primary Image */}
        <img
          src={primaryImg}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105 group-hover:opacity-0"
        />
        {/* Secondary Hover Image */}
        <img
          src={secondaryImg}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-100"
        />

        {/* Ambient Top Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-black/40 pointer-events-none" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.trending && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-accent-purple/90 text-white backdrop-blur-md rounded-full shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-accent-cyan" /> Trending
            </span>
          )}
          {discountPct > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-accent-cyan/90 text-black backdrop-blur-md rounded-full">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Wishlist Heart Action */}
        <button
          onClick={handleWishlistClick}
          aria-label="Save to Wishlist"
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 ${
            isFavorited
              ? 'bg-accent-purple text-white shadow-neon-purple'
              : 'bg-black/40 text-secondary hover:text-white hover:bg-black/70'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
      </Link>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-xs text-secondary mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-accent-cyan/90">
              {product.brand || 'NOVA'}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-white font-medium">{product.average_rating || 5.0}</span>
              <span className="text-secondary/60">({product.review_count || 0})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug}`} className="block group-hover:text-accent-cyan transition-colors">
            <h3 className="font-heading font-semibold text-base text-white tracking-tight line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Subtitle / Short Description */}
          <p className="text-xs text-secondary line-clamp-2 mt-1 leading-relaxed">
            {product.short_description || product.description}
          </p>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-bold text-lg text-white">
                ₹{price.toLocaleString('en-IN')}
              </span>
              {originalPrice && (
                <span className="text-xs text-secondary/60 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-[10px] text-emerald-400 font-medium">In Stock & Ready to Dispatch</p>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            aria-label="Add to Cart"
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              justAdded
                ? 'bg-emerald-500 text-black'
                : 'bg-card hover:bg-accent-purple text-white border border-border hover:border-accent-purple shadow-sm hover:shadow-neon-purple/40'
            }`}
          >
            {isAdding ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : justAdded ? (
              <>
                <Check className="w-4 h-4" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-accent-cyan" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
