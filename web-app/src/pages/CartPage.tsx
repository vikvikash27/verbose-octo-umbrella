

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import Button from '../components/ui/Button';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-md">
          <p className="text-xl text-slate-600">Your cart is empty.</p>
          <Link to="/">
            <Button className="mt-6">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <ul className="divide-y divide-slate-200">
              {cartItems.map(item => (
                <li key={item.cartId} className="flex items-center py-4">
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-md object-cover" />
                  <div className="ml-4 flex-grow">
                    <h3 className="font-semibold text-slate-800">{item.name}</h3>
                    {item.selectedSubscription && (
                        <p className="text-xs text-brand-primary font-medium bg-indigo-100 px-2 py-0.5 rounded-full inline-block mt-1">
                            {item.selectedSubscription}
                        </p>
                    )}
                    <p className="text-sm text-slate-500 mt-1">₹{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.cartId, parseInt(e.target.value))}
                      className="w-16 text-center border border-slate-300 rounded-md py-1"
                      min="1"
                    />
                    <button onClick={() => removeFromCart(item.cartId)} className="text-red-500 hover:text-red-700 font-medium text-sm">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
             <div className="mt-4 text-right">
                <Button variant="danger" onClick={clearCart}>Clear Cart</Button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold border-b pb-4 mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
             <div className="flex justify-between mb-4">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-4">
              <span>Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <Link to="/checkout">
              <Button className="w-full mt-6">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;