


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product, ProductVariation } from '../types';
import { useCart } from '../hooks/useCart';
import { SpinnerIcon } from '../components/icons';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { API_URL } from '../api/config';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSubscription, setSelectedSubscription] = useState('One Time');
  const [selectedVariationIndex, setSelectedVariationIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
        // Set default subscription if available
        if (data.subscriptionOptions && data.subscriptionOptions.length > 0) {
            const defaultSub = data.subscriptionOptions.includes('One Time') ? 'One Time' : data.subscriptionOptions[0];
            setSelectedSubscription(defaultSub);
        }
        setSelectedVariationIndex(0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const selectedVariation = product?.variations[selectedVariationIndex];
  
  const handleAddToCart = () => {
      if (!product || !selectedVariation) return;
      addToCart(product, selectedVariation, quantity, selectedSubscription);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <SpinnerIcon className="h-10 w-10 text-brand-primary" />
      </div>
    );
  }

  if (error || !product || !selectedVariation) {
    return <p className="text-center text-red-500 py-20">{error || 'Product could not be loaded.'}</p>;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="sticky top-28">
          <img src={product.imageUrl} alt={product.name} className="w-full h-auto rounded-lg shadow-lg" />
        </div>
        <div>
          <p className="text-md text-slate-500">{product.category}</p>
          <h1 className="text-4xl font-bold text-slate-800 mt-1">{product.name}</h1>
          
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {product.tags.map(tag => <Badge key={tag} color="blue">{tag}</Badge>)}
            </div>
          )}

          <div className="my-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand-primary">₹{selectedVariation.price.toFixed(2)}</span>
            {selectedVariation.mrp > selectedVariation.price && (
                <span className="text-lg text-slate-500 line-through">₹{selectedVariation.mrp.toFixed(2)}</span>
            )}
            <span className="text-sm text-slate-500">/ {selectedVariation.name}</span>
            {product.offer && <Badge color="green">{product.offer}</Badge>}
          </div>
          
          <div className="text-slate-600 leading-relaxed mb-6">
            <ul className="list-disc list-inside space-y-1">
              {product.description?.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i}>{line}</li>)}
            </ul>
          </div>

          {product.variations.length > 1 && (
            <div className="mb-6">
                <h3 className="font-semibold text-slate-700 mb-3">Choose Variation</h3>
                <div role="radiogroup" className="flex flex-wrap gap-2">
                    {product.variations.map((v, index) => (
                        <label key={v.name} className="cursor-pointer">
                            <input
                                type="radio"
                                name="variation"
                                value={index}
                                checked={selectedVariationIndex === index}
                                onChange={() => setSelectedVariationIndex(index)}
                                className="sr-only"
                            />
                            <div className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                selectedVariationIndex === index
                                ? 'bg-brand-primary text-white border-brand-primary'
                                : 'bg-white border-slate-300 text-slate-600 hover:border-brand-primary'
                            }`}>
                                {v.name}
                            </div>
                        </label>
                    ))}
                </div>
            </div>
          )}

          {product.subscriptionOptions && product.subscriptionOptions.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-700 mb-3">Choose Subscription</h3>
              <div role="radiogroup" className="flex flex-wrap gap-2">
                {product.subscriptionOptions.map(opt => (
                  <label key={opt} className="cursor-pointer">
                    <input 
                      type="radio" 
                      name="subscription"
                      value={opt}
                      checked={selectedSubscription === opt}
                      onChange={() => setSelectedSubscription(opt)}
                      className="sr-only" // Hide the actual radio button
                    />
                    <div className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      selectedSubscription === opt
                        ? 'bg-brand-secondary text-white border-brand-secondary'
                        : 'bg-white border-slate-300 text-slate-600 hover:border-brand-secondary'
                    }`}>
                      {opt}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-6 flex items-center gap-4 bg-slate-50 p-4 rounded-lg">
             <input 
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                min="1"
             />
            <Button onClick={handleAddToCart} size="lg" disabled={selectedVariation.stock === 0} className="flex-grow">
               {selectedVariation.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
          
          <div className="mt-8 border-t pt-6">
            <h3 className="font-semibold text-slate-800 mb-4">Product Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-700">
                {product.seller && <div><strong className="text-slate-500">Seller:</strong> {product.seller}</div>}
                {product.shelfLife && <div><strong className="text-slate-500">Shelf Life:</strong> {product.shelfLife}</div>}
                {product.fssai && <div className="sm:col-span-2"><strong className="text-slate-500">FSSAI License No:</strong> {product.fssai}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
