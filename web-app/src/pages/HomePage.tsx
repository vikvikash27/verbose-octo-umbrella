
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { SpinnerIcon } from '../components/icons';
import PromoBanner from '../components/PromoBanner';
import NewLaunches from '../components/NewLaunches';
import { API_URL } from '../api/config';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <SpinnerIcon className="h-10 w-10 text-brand-primary" />
        </div>
      );
    }
    if (error) {
      return <p className="text-center text-red-500">{error}</p>;
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <PromoBanner />
      <NewLaunches />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">Our Products</h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default HomePage;
