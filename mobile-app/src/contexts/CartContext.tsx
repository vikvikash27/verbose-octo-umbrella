import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Product } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartLoading: boolean;
}

const CART_STORAGE_KEY = 'easyorganic_cart_mobile';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);

  useEffect(() => {
    const loadCartFromStorage = async () => {
      try {
        const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (storedCart !== null) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Failed to load cart from storage", error);
      } finally {
        setIsCartLoading(false);
      }
    };
    loadCartFromStorage();
  }, []);

  useEffect(() => {
    const saveCartToStorage = async () => {
      try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error("Failed to save cart to storage", error);
      }
    };
    if (!isCartLoading) {
      saveCartToStorage();
    }
  }, [cartItems, isCartLoading]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item => item.id === productId ? { ...item, quantity } : item)
    );
  }, [removeFromCart]);
  
  const clearCart = useCallback(async () => {
    setCartItems([]);
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear cart from storage", error);
    }
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const value = { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, isCartLoading };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
