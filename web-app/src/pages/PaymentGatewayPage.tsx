import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { CreditCardIcon, SpinnerIcon } from '../components/icons';
import { API_URL } from '../api/config';

const PaymentGatewayPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { clearCart } = useCart();
    
    // The order details are passed from the checkout page
    const orderPayload = location.state?.order;

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '4242 4242 4242 4242', // Test card number
        expiryDate: '12/26',
        cvv: '123',
        cardHolderName: orderPayload?.address?.fullName || '',
    });

    // If there's no order data, the user shouldn't be here. Redirect them.
    useEffect(() => {
      if (!orderPayload) {
        navigate('/checkout');
      }
    }, [orderPayload, navigate]);

    if (!orderPayload) {
        return null;
    }
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setCardDetails(prev => ({...prev, [id]: value}));
    }

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('customer-token');
            if (!token) {
                throw new Error('Authentication error. Please log in again.');
            }
            
            // Simulate a payment processing delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            const paymentPayload = { cardDetails, orderPayload };

            const response = await fetch(`${API_URL}/api/payments/process`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(paymentPayload),
            });

            if (!response.ok) {
                let errorMessage = 'Server Error';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    // If parsing JSON fails, stick with the default.
                }
                throw new Error(errorMessage);
            }
            
            const newOrderData = await response.json();
            clearCart();
            navigate(`/order-confirmation`, { state: { orderId: newOrderData.order.id }});
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-[70vh] flex items-center justify-center py-12">
            <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Complete Your Payment</h1>
                    <p className="text-slate-500">Securely enter your card details</p>
                    <p className="text-xl font-bold text-brand-primary mt-2">Amount: ₹{orderPayload.total.toFixed(2)}</p>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <Input 
                        label="Card Number"
                        id="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleInputChange}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                       <Input 
                            label="Expiry Date (MM/YY)"
                            id="expiryDate"
                            value={cardDetails.expiryDate}
                            onChange={handleInputChange}
                            required
                        />
                         <Input 
                            label="CVV"
                            id="cvv"
                            value={cardDetails.cvv}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                     <Input 
                        label="Card Holder Name"
                        id="cardHolderName"
                        value={cardDetails.cardHolderName}
                        onChange={handleInputChange}
                        required
                    />

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <div className="pt-4">
                        <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <SpinnerIcon />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <CreditCardIcon />
                                    <span>Pay Now</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentGatewayPage;