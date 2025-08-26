import React from 'react';

// This file centralizes all TypeScript type definitions for the application,
// ensuring consistency and providing a single source of truth for data structures.

// Defines the structure for a logged-in user (can be admin or customer).
// Aligns with the User model in the backend.
export interface User {
  id: string; // Mongoose _id
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'customer';
  phone?: string;
}

export type AdminUser = User;
export type CustomerUser = User;

// Defines the structure for a customer record in the admin panel.
export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  totalSpent: number;
  lastOrder: string;
  phone?: string;
}

// Defines the structure for the detailed customer view.
export interface CustomerDetails extends Customer {
    phone?: string;
    createdAt: string;
    orders: Order[];
}


// Defines the structure for a city in the location selector.
export interface CityInfo {
  name: string;
  icon: React.FC<{className?: string}>;
}

// Defines the structure for a product category.
export interface Category {
  _id: string;
  name: string;
  imageUrl: string;
}

// Defines a single product variation
export interface ProductVariation {
    name: string; // e.g., '500g', '1kg', 'Small'
    price: number;
    mrp: number;
    stock: number;
}

// Defines the structure for a product in the catalog.
// Aligns with the Product model in the backend.
export interface Product {
  _id: string; // Mongoose _id
  name:string;
  category: string;
  variations: ProductVariation[];
  totalStock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  imageUrl: string;
  description?: string;
  fssai?: string;
  offer?: string;
  tags?: string[];
  subscriptionOptions?: string[];
  seller?: string;
  shelfLife?: string;
}

// Defines a product when it's in the shopping cart, including quantity and subscription.
export interface CartItem extends Product {
  cartId: string; // A unique ID for the cart item instance (e.g., product_id + subscription)
  quantity: number;
  selectedSubscription?: string;
  price: number; // Price of the selected variation
}

// Defines an item within an order.
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subscription?: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

// Defines a single event in the order's history timeline
export interface StatusEvent {
    status: OrderStatus;
    timestamp: string;
    notes?: string;
}

// Defines the structure for a customer order with tracking details.
// Aligns with the Order model in the backend.
export interface Order {
  id: string; // Custom, human-readable ID like #A001
  _id: string; // Mongoose _id
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

// --- Reporting Types ---
export interface SalesDataPoint {
  date: string;
  sales: number;
}

export interface TopProductData {
  productId: string;
  productName: string;
  unitsSold: number;
  totalRevenue: number;
  imageUrl: string;
}

export interface CategorySalesData {
  category: string;
  sales: number;
}

export interface ReportData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
  };
  salesOverTime: SalesDataPoint[];
  topSellingProducts: TopProductData[];
  salesByCategory: CategorySalesData[];
}

// --- Admin Activity Log ---
export interface ActivityLog {
    _id: string;
    adminName: string;
    action: string;
    targetType: string;
    targetId: string;
    details: string;
    createdAt: string;
}