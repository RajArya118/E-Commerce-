import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useUI } from './UIContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    discount_amount: 0,
    shipping_fee: 0,
    tax_amount: 0,
    total: 0,
    total_items: 0,
    coupon_code: null,
  });
  const [loading, setLoading] = useState(false);
  const { showToast, setIsCartOpen } = useUI();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await cartAPI.getCart();
      if (res.data && res.data.data) {
        setCart(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1, variant = null) => {
    try {
      const res = await cartAPI.addItem({
        product_id: productId,
        quantity,
        variant,
      });
      if (res.data && res.data.data) {
        setCart(res.data.data);
        showToast('Item added to your shopping cart', 'success');
        setIsCartOpen(true);
      }
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to add item to cart';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await cartAPI.updateItem(itemId, { quantity });
      if (res.data && res.data.data) {
        setCart(res.data.data);
      }
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to update quantity';
      showToast(msg, 'error');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await cartAPI.removeItem(itemId);
      if (res.data && res.data.data) {
        setCart(res.data.data);
        showToast('Item removed from cart', 'info');
      }
    } catch (err) {
      showToast('Failed to remove item', 'error');
    }
  };

  const applyCoupon = async (code) => {
    try {
      const res = await cartAPI.applyCoupon(code);
      if (res.data && res.data.data) {
        setCart(res.data.data);
        showToast(`Promo coupon '${code.toUpperCase()}' applied!`, 'success');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Invalid promotional coupon code';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const totalItemsCount = cart.items ? cart.items.reduce((acc, it) => acc + (it.quantity || 1), 0) : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        totalItemsCount,
        addToCart,
        updateQuantity,
        removeItem,
        applyCoupon,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
