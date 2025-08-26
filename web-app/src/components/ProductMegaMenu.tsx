import React from 'react';
import { productCategories } from '../categoryData';
import ProductCategoryCard from './ProductCategoryCard';

interface ProductMegaMenuProps {
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ProductMegaMenu: React.FC<ProductMegaMenuProps> = ({ onClose, onMouseEnter, onMouseLeave }) => {
  return (
    <div 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-slate-200 animate-fade-in-up" 
      style={{ animationDuration: '200ms' }}
    >
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-x-6 gap-y-8">
          {productCategories.map(category => (
            <div key={category.name} onClick={onClose}>
                <ProductCategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductMegaMenu;
