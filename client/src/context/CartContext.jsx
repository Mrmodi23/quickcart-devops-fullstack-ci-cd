import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      return { success: false, needAuth: true, message: 'Please login to add items to cart' };
    }
    try {
      const res = await api.post('/cart', { productId, quantity });
      setCart(res.data.data);
      return { success: true };
    } catch (err) {
      console.error('Error adding to cart:', err);
      return { success: false, message: err.response?.data?.message || 'Error adding to cart' };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        return await removeFromCart(productId);
      }
      const res = await api.put(`/cart/${productId}`, { quantity });
      setCart(res.data.data);
      return { success: true };
    } catch (err) {
      console.error('Error updating cart:', err);
      return { success: false, message: err.response?.data?.message || 'Error updating cart' };
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

  const getItemQuantity = (productId) => {
    const item = cart?.items?.find((i) => (i.product?._id || i.product) === productId);
    return item ? item.quantity : 0;
  };

  const getCartTotal = () => {
    return cart?.items?.reduce((total, item) => {
      const price = item.product?.discountPrice > 0 ? item.product.discountPrice : item.product?.price;
      return total + (price * item.quantity);
    }, 0) || 0;
  };

  const getCartSavings = () => {
    return cart?.items?.reduce((total, item) => {
      if (item.product?.discountPrice > 0 && item.product?.price > item.product?.discountPrice) {
        return total + ((item.product.price - item.product.discountPrice) * item.quantity);
      }
      return total;
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
      getItemQuantity,
      getCartTotal,
      getCartSavings,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    }}>
      {children}
    </CartContext.Provider>
  );
};
