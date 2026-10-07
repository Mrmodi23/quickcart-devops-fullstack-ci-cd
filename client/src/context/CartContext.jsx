import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [user]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cart');
      setCart(res.data.data || { items: [] });
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      alert("Please login to add items to cart");
      return { success: false };
    }
    try {
      const res = await api.post('/cart', { productId, quantity });
      setCart(res.data.data);
      return { success: true };
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert(err.response?.data?.message || 'Error adding to cart');
      return { success: false, message: err.response?.data?.message };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await api.put(`/cart/${productId}`, { quantity });
      setCart(res.data.data);
      return { success: true };
    } catch (err) {
      console.error('Error updating cart:', err);
      alert(err.response?.data?.message || 'Error updating cart');
      return { success: false };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/${productId}`);
      setCart(res.data.data);
      return { success: true };
    } catch (err) {
      console.error('Error removing from cart:', err);
      return { success: false };
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete('/cart');
      setCart(res.data.data);
      return { success: true };
    } catch (err) {
      console.error('Error clearing cart:', err);
      return { success: false };
    }
  };

  const getCartCount = () => {
    return cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const getCartTotal = () => {
    return cart?.items?.reduce((total, item) => {
      const price = item.product?.discountPrice > 0 ? item.product.discountPrice : item.product?.price;
      return total + (price * item.quantity);
    }, 0) || 0;
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      loading, 
      fetchCart, 
      addToCart, 
      updateQuantity, 
      removeFromCart,
      clearCart,
      getCartCount,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
