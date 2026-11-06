import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showToast } = useUI();

  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const res = await wishlistAPI.getWishlist();
      if (res.data && res.data.data) {
        setWishlist(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load wishlist', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (product) => {
    if (!user) {
      showToast('Please sign in to save items to your wishlist', 'info');
      return;
    }
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      showToast('Removed from wishlist', 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast('Added to wishlist', 'success');
    }

    try {
      await wishlistAPI.toggleWishlist(product.id);
    } catch (err) {
      // rollback if failed
      fetchWishlist();
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((p) => p.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        toggleWishlist,
        isInWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
