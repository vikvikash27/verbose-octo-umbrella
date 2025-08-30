import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Product, Category } from "../types";
import { SpinnerIcon } from "../components/icons";
import { API_URL } from "../api/config";

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchCategoryData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch both category details and products in parallel
        const [categoryResponse, productsResponse] = await Promise.all([
          fetch(`${API_URL}/api/categories/slug/${slug}`),
          fetch(`${API_URL}/api/products?category=${slug}`),
        ]);

        if (!categoryResponse.ok) {
          throw new Error("Category not found");
        }
        const categoryData = await categoryResponse.json();
        setCategory(categoryData);

        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products for this category");
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

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
    if (products.length === 0) {
      return (
        <p className="text-center text-slate-600">
          No products found in this category.
        </p>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">
        {loading ? "Loading..." : category?.name || "Category"}
      </h1>
      <p className="text-slate-500 mb-8">
        Browse all products in the {category?.name.toLowerCase()} category.
      </p>
      {renderContent()}
    </div>
  );
};

export default CategoryPage;
