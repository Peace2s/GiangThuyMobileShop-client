import React, { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedColor = '') => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.id === product.id && item.selectedColor === selectedColor
      );

      if (existingItem) {
        const updatedItems = prevItems.map(item =>
          item.id === product.id && item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        message.success('Đã cập nhật số lượng trong giỏ hàng');
        return updatedItems;
      } else {
        message.success('Đã thêm sản phẩm vào giỏ hàng');
        return [...prevItems, { ...product, quantity, selectedColor }];
      }
    });
  };

  const removeFromCart = (productId, selectedColor) => {
    setCartItems(prevItems => 
      prevItems.filter(item => !(item.id === productId && item.selectedColor === selectedColor))
    );
    message.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const updateQuantity = (productId, selectedColor, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId && item.selectedColor === selectedColor
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    message.success('Đã xóa toàn bộ giỏ hàng');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discount_price || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 