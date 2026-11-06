import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveAllToCart = () => {
    wishlist.forEach((item) => {
      addToCart(item.id, 1);
    });
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <div className="border-b border-border/60 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent-cyan font-heading">
            Personal Collection
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mt-1">
            Saved Wishlist ({wishlist.length})
          </h1>
        </div>

        {wishlist.length > 0 && (
          <button
            onClick={handleMoveAllToCart}
            className="px-5 py-2.5 rounded-xl bg-accent-purple text-white text-xs font-semibold hover:bg-accent-purple/90 transition-all shadow-neon-purple/30 flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Move All to Cart
          </button>
        )}
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center glass-card p-12 rounded-3xl space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto text-secondary">
            <Heart className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="font-heading font-bold text-lg text-white">Your Wishlist is Empty</h3>
          <p className="text-xs text-secondary leading-relaxed font-light">
            Tap the heart icon on any product in our catalogue to curate your personal acquisition wishlist.
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
