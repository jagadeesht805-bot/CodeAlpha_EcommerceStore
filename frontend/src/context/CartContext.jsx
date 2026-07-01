import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from localStorage on load
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Update localStorage when cartItems changes
  const saveCartToStorage = (items) => {
    setCartItems(items);
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  // Add to cart
  const addToCart = (product, qty = 1) => {
    const existItem = cartItems.find((x) => x._id === product._id);

    if (existItem) {
      const updatedItems = cartItems.map((x) =>
        x._id === product._id
          ? { ...x, qty: Math.min(x.countInStock, existItem.qty + qty) }
          : x
      );
      saveCartToStorage(updatedItems);
    } else {
      saveCartToStorage([...cartItems, { ...product, qty }]);
    }
  };

  // Remove from cart
  const removeFromCart = (id) => {
    const updatedItems = cartItems.filter((x) => x._id !== id);
    saveCartToStorage(updatedItems);
  };

  // Update quantity directly
  const updateQty = (id, qty) => {
    const updatedItems = cartItems.map((x) =>
      x._id === id ? { ...x, qty: Math.max(1, Math.min(x.countInStock, qty)) } : x
    );
    saveCartToStorage(updatedItems);
  };

  // Clear cart
  const clearCart = () => {
    saveCartToStorage([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartTotal,
        cartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
