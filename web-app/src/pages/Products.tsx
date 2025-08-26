import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table, { ColumnDefinition } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { DownloadIcon, SpinnerIcon, SearchIcon } from '../components/icons';
import { Product, Category } from '../types';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import ActionMenu from '../components/ui/ActionMenu';
import { API_URL } from '../api/config';
import { downloadCSV } from '../utils/csv';
import Input from '../components/ui/Input';
import BulkUploadModal from '../components/BulkUploadModal';

// This page displays a list of all products and allows for management actions.
const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch(`${API_URL}/api/products`),
        fetch(`${API_URL}/api/categories`),
      ]);

      if (!productsResponse.ok) throw new Error('Failed to fetch products');
      if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
      
      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();
      
      setProducts(productsData);
      setCategories(categoriesData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const getToken = () => localStorage.getItem('admin-token');

  const handleAddProduct = async (productData: any) => {
    const token = getToken();
    if (!token) {
        throw new Error("Authentication error. Please log in again.");
    }
    const response = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
        let errorMessage = 'Failed to add product.';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
            const errorText = await response.text();
            errorMessage = errorText.slice(0, 200) || errorMessage;
        }
        throw new Error(errorMessage);
    }
    setIsAddModalOpen(false);
    fetchProductsAndCategories(); // Refetch products to show the new one
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    
    const token = getToken();
    if (!token) {
        setError("Authentication error. Please log in again.");
        return;
    }

    try {
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        let errorMessage = 'Failed to delete product.';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
            const errorText = await response.text();
            errorMessage = errorText.slice(0, 200) || errorMessage;
        }
        throw new Error(errorMessage);
      }
      fetchProductsAndCategories(); // Refetch products after deletion
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete product.');
    }
  };

  const handleUpdateProduct = async (productData: any) => {
    if (!selectedProduct) return;

    const token = getToken();
    if (!token) {
        throw new Error("Authentication error. Please log in again.");
    }

    const response = await fetch(`${API_URL}/api/products/${selectedProduct._id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData),
    });
     if (!response.ok) {
        let errorMessage = 'Failed to update product.';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
            const errorText = await response.text();
            errorMessage = errorText.slice(0, 200) || errorMessage;
        }
        throw new Error(errorMessage);
    }
    setIsEditModalOpen(false);
    fetchProductsAndCategories();
  };

  const handleExport = () => {
    const dataToExport = filteredProducts.flatMap(p => 
        p.variations.map(v => ({
            productName: p.name,
            category: p.category,
            variationName: v.name,
            price: v.price,
            mrp: v.mrp,
            stock: v.stock
        }))
    );
    downloadCSV(dataToExport, `products_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => categoryFilter === 'all' || product.category === categoryFilter)
      .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, categoryFilter, searchTerm]);

  const columns: ColumnDefinition<Product>[] = [
    {
      accessor: 'name',
      header: 'Product',
      cell: (item) => (
        <div className="flex items-center">
          <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-md object-cover mr-4" />
          <div>
            <div className="font-medium text-slate-800">{item.name}</div>
            <div className="text-sm text-slate-500">{item.category}</div>
          </div>
        </div>
      ),
    },
    {
      accessor: 'variations' as any,
      header: 'Price',
      cell: (item) => item.variations.length > 0 ? `From ₹${item.variations[0].price.toFixed(2)}` : 'N/A',
    },
    {
      accessor: 'totalStock',
      header: 'Total Stock',
    },
    {
      accessor: 'status',
      header: 'Status',
      cell: (item) => (
        <Badge color={item.status === 'In Stock' ? 'green' : item.status === 'Low Stock' ? 'yellow' : 'red'}>
          {item.status}
        </Badge>
      )
    },
    {
      accessor: '_id',
      header: 'Actions',
      cell: (item) => (
         <ActionMenu
            actions={[
                { label: 'Edit', onClick: () => handleOpenEditModal(item) },
                { label: 'Delete', onClick: () => handleDeleteProduct(item._id), isDanger: true },
            ]}
        />
      ),
    },
  ];

  const renderContent = () => {
    if (loading && products.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <SpinnerIcon className="h-8 w-8 text-brand-primary" />
        </div>
      );
    }
    if (error) {
      return <div className="text-red-500 text-center p-8">Error: {error}</div>;
    }
    return <Table data={filteredProducts} columns={columns} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Products</h1>
        <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setIsBulkUploadModalOpen(true)}>Bulk Upload</Button>
            <Button variant="secondary" onClick={handleExport} disabled={filteredProducts.length === 0} className="flex items-center gap-2">
                <DownloadIcon className="h-4 w-4" />
                Export CSV
            </Button>
            <Button onClick={handleOpenAddModal}>Add Product</Button>
        </div>
      </div>
      <Card>
        <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 items-center">
            <div className="relative flex-grow min-w-[250px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-slate-400" />
                </div>
                <Input 
                    placeholder="Search by product name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>
            <div className="flex-grow min-w-[200px]">
                 <select
                    id="category-filter"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-slate-900"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
            </div>
        </div>
        {renderContent()}
      </Card>
      <AddProductModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
        categories={categories}
      />
      {selectedProduct && (
          <EditProductModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onUpdateProduct={handleUpdateProduct}
            product={selectedProduct}
            categories={categories}
          />
      )}
      <BulkUploadModal
        isOpen={isBulkUploadModalOpen}
        onClose={() => setIsBulkUploadModalOpen(false)}
        onComplete={fetchProductsAndCategories}
      />
    </div>
  );
};

export default Products;