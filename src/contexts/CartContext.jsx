import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { cartService } from '../services/api';
import { useAuth } from './AuthContext';

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

  // Load cart when component mounts or user changes
  useEffect(() => {
    if (user) {
      // Nếu đã đăng nhập, lấy giỏ hàng từ server
      fetchCartFromServer();
    } else {
      // Nếu chưa đăng nhập, lấy giỏ hàng từ localStorage
      loadCartFromStorage();
    }
  }, [user]);

  // Lưu giỏ hàng vào localStorage khi có thay đổi
  useEffect(() => {
    if (!user) {
      // Chỉ lưu vào localStorage khi chưa đăng nhập
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
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
        const cartData = response.data.CartItems.map(item => ({
          id: item.id,
          productId: item.productId,
          name: item.product?.name || '',
          image: item.product?.image || '',
          price: item.price,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          stock_quantity: item.product?.stock_quantity || 0
        }));
        setCartItems(cartData);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1, selectedColor = null) => {
    try {
      if (user) {
        // Nếu đã đăng nhập, gọi API
        await cartService.addToCart({
          productId: product.id,
          quantity,
          selectedColor
        });
        await fetchCartFromServer(); // Refresh cart from server
      } else {
        // Nếu chưa đăng nhập, chỉ cập nhật localStorage
        setCartItems(prevItems => {
          const existingItem = prevItems.find(
            item => item.productId === product.id && item.selectedColor === selectedColor
          );

          if (existingItem) {
            return prevItems.map(item =>
              item.productId === product.id && item.selectedColor === selectedColor
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }

          return [...prevItems, { 
            ...product, 
            productId: product.id, // Lưu cả productId
            quantity, 
            selectedColor 
          }];
        });
      }
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Không thể thêm sản phẩm vào giỏ hàng');
    }
  };

  const removeFromCart = async (productId, selectedColor = null) => {
    try {
      if (user) {
        // Nếu đã đăng nhập, gọi API
        await cartService.removeFromCart(productId);
        await fetchCartFromServer(); // Refresh cart from server
      } else {
        // Nếu chưa đăng nhập, chỉ cập nhật localStorage
        setCartItems(prevItems =>
          prevItems.filter(
            item => !(item.id === productId && item.selectedColor === selectedColor)
          )
        );
      }
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Không thể xóa sản phẩm khỏi giỏ hàng');
    }
  };

  const updateQuantity = async (productId, selectedColor, quantity) => {
    if (quantity < 1) return;

    try {
      if (user) {
        // Nếu đã đăng nhập, gọi API
        await cartService.updateCartItem(productId, quantity);
        await fetchCartFromServer(); // Refresh cart from server
      } else {
        // Nếu chưa đăng nhập, chỉ cập nhật localStorage
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === productId && item.selectedColor === selectedColor
              ? { ...item, quantity }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Không thể cập nhật số lượng');
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        // Nếu đã đăng nhập, gọi API
        await cartService.clearCart();
        await fetchCartFromServer(); // Refresh cart from server
      } else {
        // Nếu chưa đăng nhập, chỉ cập nhật localStorage
        setCartItems([]);
      }
      toast.success('Đã xóa giỏ hàng');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Không thể xóa giỏ hàng');
    }
  };

  // Hàm merge giỏ hàng local vào server khi user đăng nhập
  const mergeCartWithServer = async () => {
    try {
      const localCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
      if (localCart.length > 0) {
        // Đợi một chút để đảm bảo token đã được set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Xóa giỏ hàng hiện tại trên server
        await cartService.clearCart();
        
        // Thêm từng sản phẩm từ giỏ hàng local vào server
        for (const item of localCart) {
          await cartService.addToCart({
            productId: item.productId || item.id,
            quantity: item.quantity,
            selectedColor: item.selectedColor
          });
        }
        
        // Xóa giỏ hàng local
        localStorage.removeItem(CART_STORAGE_KEY);
        
        // Cập nhật lại state từ server
        const response = await cartService.getCart();
        if (response.data && response.data.CartItems) {
          const cartData = response.data.CartItems.map(item => ({
            id: item.id,
            productId: item.productId,
            name: item.product?.name || '',
            image: item.product?.image || '',
            price: item.price,
            quantity: item.quantity,
            selectedColor: item.selectedColor,
            stock_quantity: item.product?.stock_quantity || 0
          }));
          setCartItems(cartData);
        }
      }
    } catch (error) {
      console.error('Error merging cart:', error);
      throw error;
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
    mergeCartWithServer
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext; 