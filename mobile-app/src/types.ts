// This file centralizes all TypeScript type definitions for the mobile application.

// Defines the structure for a logged-in customer.
export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  avatar?: string;
}

// Defines the structure for a product in the catalog.
export interface Product {
  id: string;
  name:string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  imageUrl: string;
  description?: string;
  fssai?: string;
}

// Defines a product when it's in the shopping cart, including quantity.
export interface CartItem extends Product {
  quantity: number;
}

// Defines an item within an order.
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

// Defines a single event in the order's history timeline
export interface StatusEvent {
    status: OrderStatus;
    timestamp: string;
    notes?: string;
}

// Defines the structure for a customer order with tracking details.
export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  orderTimestamp: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  paymentMethod: 'Card' | 'COD';
  transactionId: string;
  address?: Address;
  statusHistory: StatusEvent[];
}

// Defines the structure for a shipping address.
export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  location?: {
    lat: number;
    lng: number;
  } | null;
}