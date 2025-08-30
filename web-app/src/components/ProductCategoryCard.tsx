// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ProductCategory } from '../categoryData';

// interface ProductCategoryCardProps {
//   category: ProductCategory;
// }

// const ProductCategoryCard: React.FC<ProductCategoryCardProps> = ({ category }) => {
//   return (
//     <Link to={category.link} className="group flex flex-col items-center text-center gap-3 transition-transform duration-200 hover:-translate-y-1">
//       <div className="w-24 h-24 rounded-full bg-slate-100 p-1 flex items-center justify-center overflow-hidden border-2 border-slate-200 group-hover:border-emerald-300 transition-all duration-300">
//         <img
//           src={category.imageUrl}
//           alt={category.name}
//           className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
//         />
//       </div>
//       <span className="text-sm font-medium text-slate-700 group-hover:text-brand-primary h-10 flex items-start justify-center">
//         {category.name}
//       </span>
//     </Link>
//   );
// };

// export default ProductCategoryCard;

////////////////////Data for Product in Public Side fetch from server//////////////////////
import React from "react";
import { Link } from "react-router-dom";
import { Category } from "../types";

interface ProductCategoryCardProps {
  category: Category;
}

const ProductCategoryCard: React.FC<ProductCategoryCardProps> = ({
  category,
}) => {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group flex flex-col items-center text-center gap-3 transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="w-24 h-24 rounded-full bg-slate-100 p-1 flex items-center justify-center overflow-hidden border-2 border-slate-200 group-hover:border-emerald-300 transition-all duration-300">
        <img
          src={category.imageUrl}
          alt={category.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <span className="text-sm font-medium text-slate-700 group-hover:text-brand-primary h-10 flex items-start justify-center">
        {category.name}
      </span>
    </Link>
  );
};

export default ProductCategoryCard;
