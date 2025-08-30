import React, { useState, useEffect } from "react";
import { Category } from "../types";
import { API_URL } from "../api/config";
import ProductCategoryCard from "./ProductCategoryCard";

interface ProductMegaMenuProps {
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ProductMegaMenu: React.FC<ProductMegaMenuProps> = ({
  onClose,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/categories`);
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-slate-200 animate-fade-in-up"
      style={{ animationDuration: "200ms" }}
    >
      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center text-slate-500 py-4">
            Loading categories...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-x-6 gap-y-8">
            {categories.map((category) => (
              <div key={category._id} onClick={onClose}>
                <ProductCategoryCard category={category} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductMegaMenu;
