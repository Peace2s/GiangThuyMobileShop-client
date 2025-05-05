import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/home.service';
import { useAuth } from './AuthContext';
import { message } from 'antd';

const CartContext = createContext();
const CART_STORAGE_KEY = 'shopping_cart';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCartFromServer();
    } else {
      loadCartFromStorage();
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
      } else {
        setCartItems([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      setCartItems([]);
      setLoading(false);
    }
  };

  const fetchCartFromServer = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      if (response.data && response.data.CartItems) {
        setCartItems(response.data.CartItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      message.error('Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productData) => {
    try {
      const response = await cartService.addToCart({
        productId: productData.productId,
        variantId: productData.variantId,
        quantity: productData.quantity
      });

      if (user) {
        await fetchCartFromServer();
      } else {
        setCartItems(prevItems => {
          const existingItem = prevItems.find(
            item => item.productId === productData.productId && item.variantId === productData.variantId
          );

          if (existingItem) {
            return prevItems.map(item =>
              item.productId === productData.productId && item.variantId === productData.variantId
                ? { ...item, quantity: item.quantity + productData.quantity }
                : item
            );
          }

          return [...prevItems, {
            ...response.data.product,
            quantity: productData.quantity
          }];
        });
      }
      message.success('Đã thêm sản phẩm vào giỏ hàng');
    } catch (error) {
      console.error('Error adding to cart:', error);
      message.error(error.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (user) {
        await cartService.removeFromCart(productId);
        await fetchCartFromServer();
      } else {
        setCartItems(prevItems =>
          prevItems.filter(item => item.id !== productId)
        );
      }
      message.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      console.error('Error removing from cart:', error);
      message.error('Không thể xóa sản phẩm khỏi giỏ hàng');
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;

    try {
      if (user) {
        const cartItem = cartItems.find(item => item.id === id);
        if (cartItem) {
          await cartService.updateCartItem(id, quantity);
          await fetchCartFromServer();
        }
      } else {
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === id
              ? { ...item, quantity }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      message.error(error.response?.data?.message || 'Không thể cập nhật số lượng');
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        await cartService.clearCart();
        await fetchCartFromServer();
      } else {
        setCartItems([]);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCartTotal = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => {
      const price = item.discount_price || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext; 