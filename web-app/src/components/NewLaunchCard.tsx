
import React from 'react';
import { Link } from 'react-router-dom';

export interface NewLaunchProduct {
  id: string;
  name: string;
  spec: string;
  price: string;
  imageUrl: string;
}

interface NewLaunchCardProps {
  product: NewLaunchProduct;
}

const NewLaunchCard: React.FC<NewLaunchCardProps> = ({ product }) => {
  return (
    <Link to={`/products/${product.id}`} className="block group">
      <div className="bg-white rounded-2xl p-4 text-center transition-shadow duration-300 hover:shadow-lg h-full flex flex-col">
        <div className="flex-grow flex items-center justify-center mb-4 min-h-[144px]">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="max-h-36 object-contain group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        <div className="flex-shrink-0">
          <h3 className="text-sm font-semibold text-slate-800 leading-tight h-10 flex items-center justify-center">{product.name}</h3>
          <p className="text-xs text-slate-500 mt-1">{product.spec}</p>
          <p className="text-base font-bold text-slate-900 mt-2">{product.price}</p>
        </div>
      </div>
    </Link>
  );
};

export default NewLaunchCard;
