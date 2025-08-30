// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../hooks/useCart';
// import { useCustomerAuth } from '../hooks/useCustomerAuth';
// import Button from '../components/ui/Button';
// import Input from '../components/ui/Input';
// import MapInput from '../components/MapInput';
// import { Address, CartItem } from '../types';
// import { SpinnerIcon, CreditCardIcon } from '../components/icons';
// import { API_URL } from '../api/config';
// import Card from '../components/ui/Card';

// const CheckoutPage: React.FC = () => {
//   const { cartItems, cartTotal, clearCart } = useCart();
//   const { customer } = useCustomerAuth();
//   const navigate = useNavigate();

//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [paymentMethod, setPaymentMethod] = useState<'Card' | 'COD'>('Card');
//   const [address, setAddress] = useState<Address>({
//     fullName: customer?.name || '',
//     street: '',
//     city: '',
//     state: '',
//     zip: '',
//     country: 'India',
//     phone: customer?.phone || '',
//     location: null,
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     setAddress(prev => ({ ...prev, [id]: value }));
//   };

//   const handleMapAddressSelect = (details: { address: string; city: string; zip: string; lat: number; lng: number; }) => {
//     setAddress(prev => ({
//         ...prev,
//         street: details.address || prev.street,
//         city: details.city || prev.city,
//         zip: details.zip || prev.zip,
//         location: { lat: details.lat, lng: details.lng }
//     }));
//   };

//   const placeOrder = async (orderPayload: any) => {
//     const token = localStorage.getItem('customer-token');
//     if (!token) {
//         throw new Error("You are not logged in.");
//     }

//     const response = await fetch(`${API_URL}/api/orders`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(orderPayload),
//     });

//     if (!response.ok) {
//         let errorMessage = 'Failed to place order. Please try again.';
//         try {
//             const errorData = await response.json();
//             errorMessage = errorData.message || errorMessage;
//         } catch {
//              const errorText = await response.text();
//              errorMessage = errorText || errorMessage;
//         }
//         throw new Error(errorMessage);
//     }
//     return response.json();
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     const orderPayload = {
//         items: cartItems.map((item: CartItem) => ({
//             productId: item._id,
//             productName: item.name,
//             quantity: item.quantity,
//             price: item.price,
//             subscription: item.selectedSubscription,
//         })),
//         total: cartTotal,
//         address,
//         paymentMethod,
//     };

//     try {
//         if (paymentMethod === 'COD') {
//             const newOrderData = await placeOrder(orderPayload);
//             clearCart();
//             navigate(`/order-confirmation`, { state: { orderId: newOrderData.order.id }});
//         } else {
//             // For card payment, we redirect to a simulated payment gateway with order details
//             navigate('/payment-gateway', { state: { order: orderPayload } });
//         }
//     } catch (err) {
//         setError(err instanceof Error ? err.message : 'An unknown error occurred.');
//     } finally {
//         setIsLoading(false);
//     }
//   };

//   return (
//     <div className="bg-slate-50">
//       <div className="container mx-auto px-6 py-12">
//         <h1 className="text-3xl font-bold text-slate-800 mb-8">Checkout</h1>
//         <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2 space-y-6">
//                 <Card>
//                     <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                         <Input id="fullName" label="Full Name" value={address.fullName} onChange={handleInputChange} required />
//                         <Input id="phone" label="Phone" type="tel" value={address.phone} onChange={handleInputChange} required />
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                         <Input id="street" label="Street Address" value={address.street} onChange={handleInputChange} required containerClassName="md:col-span-3"/>
//                         <Input id="city" label="City" value={address.city} onChange={handleInputChange} required />
//                         <Input id="state" label="State" value={address.state} onChange={handleInputChange} required />
//                         <Input id="zip" label="ZIP Code" value={address.zip} onChange={handleInputChange} required />
//                     </div>
//                     <div>
//                         <MapInput onLocationSelect={handleMapAddressSelect} />
//                     </div>
//                 </Card>

//                 <Card>
//                     <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
//                     <div className="space-y-4">
//                         <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${paymentMethod === 'Card' ? 'border-brand-primary bg-indigo-50' : 'border-slate-300'}`}>
//                             <input type="radio" name="paymentMethod" value="Card" checked={paymentMethod === 'Card'} onChange={() => setPaymentMethod('Card')} className="hidden" />
//                             <CreditCardIcon className="w-6 h-6 mr-4 text-slate-600"/>
//                             <div>
//                                 <p className="font-semibold">Credit/Debit Card</p>
//                                 <p className="text-sm text-slate-500">Pay securely with your card.</p>
//                             </div>
//                         </label>
//                          <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${paymentMethod === 'COD' ? 'border-brand-primary bg-indigo-50' : 'border-slate-300'}`}>
//                             <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="hidden" />
//                             <span className="text-2xl mr-4">💵</span>
//                              <div>
//                                 <p className="font-semibold">Cash on Delivery (COD)</p>
//                                 <p className="text-sm text-slate-500">Pay in cash when your order is delivered.</p>
//                             </div>
//                         </label>
//                     </div>
//                 </Card>
//             </div>

//             <div className="lg:col-span-1">
//                 <Card className="sticky top-28">
//                 <h2 className="text-xl font-semibold border-b pb-4 mb-4">Order Summary</h2>
//                 <ul className="space-y-2 mb-4">
//                     {cartItems.map(item => (
//                         <li key={item.cartId} className="flex justify-between text-sm">
//                             <div className="flex-1 pr-2">
//                                 <span className="text-slate-600 ">{item.name} x {item.quantity}</span>
//                                 {item.selectedSubscription && <span className="text-brand-primary text-xs block">({item.selectedSubscription})</span>}
//                             </div>
//                             <span className="text-slate-800">₹{(item.price * item.quantity).toFixed(2)}</span>
//                         </li>
//                     ))}
//                 </ul>
//                 <div className="border-t pt-4 space-y-2">
//                      <div className="flex justify-between">
//                         <span className="font-semibold">Subtotal</span>
//                         <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                         <span className="text-slate-500">Shipping</span>
//                         <span className="text-slate-500">Free</span>
//                     </div>
//                      <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
//                         <span>Total</span>
//                         <span>₹{cartTotal.toFixed(2)}</span>
//                     </div>
//                 </div>
//                  {error && <p className="mt-4 text-sm text-center text-red-600">{error}</p>}
//                 <Button type="submit" className="w-full mt-6" disabled={isLoading || cartItems.length === 0}>
//                     {isLoading ? <SpinnerIcon /> : paymentMethod === 'COD' ? 'Place Order' : 'Proceed to Payment'}
//                 </Button>
//                 </Card>
//             </div>
//             </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;

////////////////Inventory Page/////////////////////

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useCustomerAuth } from "../hooks/useCustomerAuth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import MapInput from "../components/MapInput";
import { Address, CartItem } from "../types";
import { SpinnerIcon, CreditCardIcon } from "../components/icons";
import { API_URL } from "../api/config";
import Card from "../components/ui/Card";

const CheckoutPage: React.FC = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { customer } = useCustomerAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Card" | "COD">("Card");
  const [address, setAddress] = useState<Address>({
    fullName: customer?.name || "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    phone: customer?.phone || "",
    location: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAddress((prev) => ({ ...prev, [id]: value }));
  };

  const handleMapAddressSelect = (details: {
    address: string;
    city: string;
    zip: string;
    lat: number;
    lng: number;
  }) => {
    setAddress((prev) => ({
      ...prev,
      street: details.address || prev.street,
      city: details.city || prev.city,
      zip: details.zip || prev.zip,
      location: { lat: details.lat, lng: details.lng },
    }));
  };

  const placeOrder = async (orderPayload: any) => {
    const token = localStorage.getItem("customer-token");
    if (!token) {
      throw new Error("You are not logged in.");
    }

    const response = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      let errorMessage = "Failed to place order. Please try again.";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const orderPayload = {
      items: cartItems.map((item: CartItem) => ({
        productId: item._id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        subscription: item.selectedSubscription,
        variationName: item.selectedVariationName,
      })),
      total: cartTotal,
      address,
      paymentMethod,
    };

    try {
      if (paymentMethod === "COD") {
        const newOrderData = await placeOrder(orderPayload);
        clearCart();
        navigate(`/order-confirmation`, {
          state: { orderId: newOrderData.order.id },
        });
      } else {
        // For card payment, we redirect to a simulated payment gateway with order details
        navigate("/payment-gateway", { state: { order: orderPayload } });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Checkout</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    id="fullName"
                    label="Full Name"
                    value={address.fullName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    id="phone"
                    label="Phone"
                    type="tel"
                    value={address.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Input
                    id="street"
                    label="Street Address"
                    value={address.street}
                    onChange={handleInputChange}
                    required
                    containerClassName="md:col-span-3"
                  />
                  <Input
                    id="city"
                    label="City"
                    value={address.city}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    id="state"
                    label="State"
                    value={address.state}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    id="zip"
                    label="ZIP Code"
                    value={address.zip}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <MapInput onLocationSelect={handleMapAddressSelect} />
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="space-y-4">
                  <label
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${
                      paymentMethod === "Card"
                        ? "border-brand-primary bg-indigo-50"
                        : "border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Card"
                      checked={paymentMethod === "Card"}
                      onChange={() => setPaymentMethod("Card")}
                      className="hidden"
                    />
                    <CreditCardIcon className="w-6 h-6 mr-4 text-slate-600" />
                    <div>
                      <p className="font-semibold">Credit/Debit Card</p>
                      <p className="text-sm text-slate-500">
                        Pay securely with your card.
                      </p>
                    </div>
                  </label>
                  <label
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${
                      paymentMethod === "COD"
                        ? "border-brand-primary bg-indigo-50"
                        : "border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="hidden"
                    />
                    <span className="text-2xl mr-4">💵</span>
                    <div>
                      <p className="font-semibold">Cash on Delivery (COD)</p>
                      <p className="text-sm text-slate-500">
                        Pay in cash when your order is delivered.
                      </p>
                    </div>
                  </label>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-28">
                <h2 className="text-xl font-semibold border-b pb-4 mb-4">
                  Order Summary
                </h2>
                <ul className="space-y-2 mb-4">
                  {cartItems.map((item) => (
                    <li
                      key={item.cartId}
                      className="flex justify-between text-sm"
                    >
                      <div className="flex-1 pr-2">
                        <span className="text-slate-600 ">
                          {item.name} ({item.selectedVariationName}) x{" "}
                          {item.quantity}
                        </span>
                        {item.selectedSubscription && (
                          <span className="text-brand-primary text-xs block">
                            ({item.selectedSubscription})
                          </span>
                        )}
                      </div>
                      <span className="text-slate-800">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Subtotal</span>
                    <span className="font-semibold">
                      ₹{cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Shipping</span>
                    <span className="text-slate-500">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                    <span>Total</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                {error && (
                  <p className="mt-4 text-sm text-center text-red-600">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={isLoading || cartItems.length === 0}
                >
                  {isLoading ? (
                    <SpinnerIcon />
                  ) : paymentMethod === "COD" ? (
                    "Place Order"
                  ) : (
                    "Proceed to Payment"
                  )}
                </Button>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
