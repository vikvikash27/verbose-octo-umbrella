// import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
// import { CartItem, Product, ProductVariation } from '../types';

// interface CartContextType {
//   cartItems: CartItem[];
//   addToCart: (product: Product, variation: ProductVariation, quantity?: number, subscription?: string) => void;
//   removeFromCart: (cartId: string) => void;
//   updateQuantity: (cartId: string, quantity: number) => void;
//   clearCart: () => void;
//   cartCount: number;
//   cartTotal: number;
//   isCartLoading: boolean;
// }

// const CART_STORAGE_KEY = 'easyorganic_cart_web';

// export const CartContext = createContext<CartContextType | undefined>(undefined);

// interface CartProviderProps {
//   children: ReactNode;
// }

// export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [isCartLoading, setIsCartLoading] = useState(true);

//   useEffect(() => {
//     const loadCartFromStorage = () => {
//       try {
//         const storedCart = localStorage.getItem(CART_STORAGE_KEY);
//         if (storedCart !== null) {
//           setCartItems(JSON.parse(storedCart));
//         }
//       } catch (error) {
//         console.error("Failed to load cart from localStorage", error);
//       } finally {
//         setIsCartLoading(false);
//       }
//     };
//     loadCartFromStorage();
//   }, []);

//   useEffect(() => {
//     const saveCartToStorage = () => {
//       try {
//         localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
//       } catch (error) {
//         console.error("Failed to save cart to localStorage", error);
//       }
//     };
//     if (!isCartLoading) {
//       saveCartToStorage();
//     }
//   }, [cartItems, isCartLoading]);

//   const addToCart = useCallback((product: Product, variation: ProductVariation, quantity = 1, subscription?: string) => {
//     setCartItems(prevItems => {
//       // Create a unique ID for the cart item based on product, variation, and subscription
//       const cartId = product._id + `_${variation.name}` + (subscription ? `_${subscription}` : '_onetime');
//       const existingItem = prevItems.find(item => item.cartId === cartId);

//       if (existingItem) {
//         // If the same product with the same subscription exists, just increase the quantity
//         return prevItems.map(item =>
//           item.cartId === cartId
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       }

//       // Otherwise, add it as a new, unique item in the cart
//       const newCartItem: CartItem = {
//         ...product,
//         quantity,
//         cartId,
//         selectedSubscription: subscription,
//         price: variation.price, // Set the price from the selected variation
//       };

//       return [...prevItems, newCartItem];
//     });
//   }, []);

//   const removeFromCart = useCallback((cartId: string) => {
//     setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
//   }, []);

//   const updateQuantity = useCallback((cartId: string, quantity: number) => {
//     // Ensure quantity is a valid number. If not (e.g., from an empty input), treat it as 0.
//     const newQuantity = isNaN(quantity) ? 0 : quantity;

//     if (newQuantity <= 0) {
//       removeFromCart(cartId);
//       return;
//     }
//     setCartItems(prevItems =>
//       prevItems.map(item =>
//         item.cartId === cartId ? { ...item, quantity: newQuantity } : item
//       )
//     );
//   }, [removeFromCart]);

//   const clearCart = useCallback(() => {
//     setCartItems([]);
//     try {
//       localStorage.removeItem(CART_STORAGE_KEY);
//     } catch (error) {
//       console.error("Failed to clear cart from localStorage", error);
//     }
//   }, []);

//   const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
//   const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

//   const value = {
//     cartItems,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     cartCount,
//     cartTotal,
//     isCartLoading
//   };

//   return (
//     <CartContext.Provider value={value}>
//       {children}
//     </CartContext.Provider>
//   );
// };

///////////////////Stock Inventory Augmentation//////////////////////
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { CartItem, Product, ProductVariation } from "../types";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    product: Product,
    variation: ProductVariation,
    quantity?: number,
    subscription?: string
  ) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartLoading: boolean;
}

const CART_STORAGE_KEY = "easyorganic_cart_web";

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);

  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (storedCart !== null) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Failed to load cart from localStorage", error);
      } finally {
        setIsCartLoading(false);
      }
    };
    loadCartFromStorage();
  }, []);

  useEffect(() => {
    const saveCartToStorage = () => {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error("Failed to save cart to localStorage", error);
      }
    };
    if (!isCartLoading) {
      saveCartToStorage();
    }
  }, [cartItems, isCartLoading]);

  const addToCart = useCallback(
    (
      product: Product,
      variation: ProductVariation,
      quantity = 1,
      subscription?: string
    ) => {
      setCartItems((prevItems) => {
        // Create a unique ID for the cart item based on product, variation, and subscription
        const cartId =
          product._id +
          `_${variation.name}` +
          (subscription ? `_${subscription}` : "_onetime");
        const existingItem = prevItems.find((item) => item.cartId === cartId);

        if (existingItem) {
          // If the same product with the same subscription exists, just increase the quantity
          return prevItems.map((item) =>
            item.cartId === cartId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        // Otherwise, add it as a new, unique item in the cart
        const newCartItem: CartItem = {
          ...product,
          quantity,
          cartId,
          selectedSubscription: subscription,
          price: variation.price, // Set the price from the selected variation
          selectedVariationName: variation.name, // Store the variation name
        };

        return [...prevItems, newCartItem];
      });
    },
    []
  );

  const removeFromCart = useCallback((cartId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartId !== cartId)
    );
  }, []);

  const updateQuantity = useCallback(
    (cartId: string, quantity: number) => {
      // Ensure quantity is a valid number. If not (e.g., from an empty input), treat it as 0.
      const newQuantity = isNaN(quantity) ? 0 : quantity;

      if (newQuantity <= 0) {
        removeFromCart(cartId);
        return;
      }
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.cartId === cartId ? { ...item, quantity: newQuantity } : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear cart from localStorage", error);
    }
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    isCartLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
