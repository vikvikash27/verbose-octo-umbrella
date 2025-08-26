

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import Button from './ui/Button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (product.variations && product.variations.length > 0) {
      addToCart(product, product.variations[0]);
    }
  };
  
  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <div onClick={handleCardClick} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer group flex flex-col">
        <div className="overflow-hidden">
            <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold text-slate-800 truncate flex-grow">{product.name}</h3>
            <p className="text-sm text-slate-500">{product.category}</p>
            <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold text-slate-900">₹{product.variations[0]?.price.toFixed(2)}</span>
                <Button
                    onClick={handleAddToCart}
                    disabled={product.totalStock === 0}
                    size="sm"
                    variant="primary"
                >
                    {product.totalStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
            </div>
        </div>
    </div>
  );
};

export default ProductCard;
