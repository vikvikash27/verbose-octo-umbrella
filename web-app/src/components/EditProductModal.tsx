import React, { useState, useEffect, useRef } from 'react';
import { Product, Category, ProductVariation } from '../types';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import Textarea from './ui/Textarea';
import { ImageIcon, SpinnerIcon } from './icons';

export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  fssai: string;
  offer: string;
  tags: string; // Comma-separated
  seller: string;
  shelfLife: string;
}

const subscriptionTypes = ['Daily', 'Alternate', 'One Time', 'Weekly'];

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateProduct: (productData: any) => Promise<void>;
  product: Product | null;
  categories: Category[];
}

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, onUpdateProduct, product, categories }) => {
  const [formData, setFormData] = useState<ProductFormData>({ name: '', category: '', description: '', imageUrl: '', fssai: '', offer: '', tags: '', seller: '', shelfLife: '' });
  const [variations, setVariations] = useState<ProductVariation[]>([{ name: '', price: 0, mrp: 0, stock: 0 }]);
  const [subscriptions, setSubscriptions] = useState({ Daily: false, Alternate: false, 'One Time': false, Weekly: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name,
        category: product.category,
        description: product.description || '',
        imageUrl: product.imageUrl,
        fssai: product.fssai || '',
        offer: product.offer || '',
        tags: product.tags?.join(', ') || '',
        seller: product.seller || '',
        shelfLife: product.shelfLife || '',
      });
      setVariations(product.variations.length > 0 ? product.variations : [{ name: '', price: 0, mrp: 0, stock: 0 }]);
      setImagePreview(product.imageUrl);

      const initialSubs = { Daily: false, Alternate: false, 'One Time': false, Weekly: false };
      product.subscriptionOptions?.forEach(opt => {
        if (opt in initialSubs) initialSubs[opt as keyof typeof initialSubs] = true;
      });
      setSubscriptions(initialSubs);
      
      setError('');
      setIsSubmitting(false);
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleVariationChange = (index: number, field: keyof ProductVariation, value: string | number) => {
    const newVariations = [...variations];
    (newVariations[index] as any)[field] = value;
    setVariations(newVariations);
  };

  const addVariation = () => {
    setVariations([...variations, { name: '', price: 0, mrp: 0, stock: 0 }]);
  };

  const removeVariation = (index: number) => {
    if (variations.length > 1) {
      setVariations(variations.filter((_, i) => i !== index));
    }
  };
  
  const handleSubscriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSubscriptions(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            setError('File size must be less than 10MB.');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setFormData(prev => ({ ...prev, imageUrl: base64String }));
            setImagePreview(base64String);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) { setError('Please upload a product image.'); return; }
    if (variations.some(v => !v.name || v.price <= 0 || v.mrp <= 0)) { setError('Please fill all variation fields correctly.'); return; }
    
    setIsSubmitting(true);
    setError('');
    try {
      const selectedSubscriptions = Object.entries(subscriptions)
        .filter(([, checked]) => checked)
        .map(([name]) => name);

       const finalData = {
          ...formData,
          variations: variations.map(v => ({...v, price: Number(v.price), mrp: Number(v.mrp), stock: Number(v.stock)})),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          subscriptionOptions: selectedSubscriptions,
      };
      await onUpdateProduct(finalData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${product?.name}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" form="edit-product-form" disabled={isSubmitting}>
            {isSubmitting ? <SpinnerIcon /> : 'Save Changes'}
          </Button>
        </>
      }
    >
       <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <Input name="name" label="Product Name" value={formData.name} onChange={handleChange} required />
            <div>
              <label htmlFor="category-edit" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select id="category-edit" name="category" value={formData.category} onChange={handleChange} required
                className="block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-slate-900">
                <option value="" disabled>Select a category</option>
                {categories.map(cat => ( <option key={cat._id} value={cat.name}>{cat.name}</option> ))}
              </select>
            </div>
        </div>
        
        <fieldset className="border p-4 rounded-md space-y-4">
          <legend className="text-sm font-medium text-slate-600 px-1">Product Variations</legend>
          {variations.map((v, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end">
              <Input containerClassName="col-span-3" name={`v-name-${index}`} label="Name" placeholder="e.g. 500g" value={v.name} onChange={e => handleVariationChange(index, 'name', e.target.value)} required />
              <Input containerClassName="col-span-3" name={`v-price-${index}`} label="Price (₹)" type="number" value={v.price} onChange={e => handleVariationChange(index, 'price', Number(e.target.value))} required />
              <Input containerClassName="col-span-3" name={`v-mrp-${index}`} label="MRP (₹)" type="number" value={v.mrp} onChange={e => handleVariationChange(index, 'mrp', Number(e.target.value))} required />
              <Input containerClassName="col-span-2" name={`v-stock-${index}`} label="Stock" type="number" value={v.stock} onChange={e => handleVariationChange(index, 'stock', Number(e.target.value))} required />
              <div className="col-span-1">
                <Button type="button" variant="danger" size="sm" className="w-full h-9" onClick={() => removeVariation(index)} disabled={variations.length === 1}>X</Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="secondary" size="sm" onClick={addVariation}>Add Variation</Button>
        </fieldset>
        
        <fieldset className="border p-4 rounded-md">
          <legend className="text-sm font-medium text-slate-600 px-1">Details</legend>
          <div className="grid grid-cols-2 gap-4">
              <Input name="shelfLife" label="Shelf Life" placeholder="e.g., 3 days" value={formData.shelfLife} onChange={handleChange} />
              <Input name="seller" label="Seller" placeholder="e.g., EasyOrganic Farms" value={formData.seller} onChange={handleChange} />
              <Input name="fssai" label="FSSAI License No." value={formData.fssai} onChange={handleChange} />
          </div>
        </fieldset>

        <fieldset className="border p-4 rounded-md">
            <legend className="text-sm font-medium text-slate-600 px-1">Marketing</legend>
            <Input name="offer" label="Offer Text (e.g., Save 10%)" placeholder="e.g., 10% OFF" value={formData.offer} onChange={handleChange} />
            <Input name="tags" label="Tags (comma-separated)" placeholder="e.g., Organic, Fresh" value={formData.tags} onChange={handleChange} containerClassName="mt-4" />
        </fieldset>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Subscription Options</label>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
                {subscriptionTypes.map(sub => (
                    <label key={sub} className="flex items-center gap-2">
                        <input type="checkbox" name={sub} checked={subscriptions[sub as keyof typeof subscriptions]} onChange={handleSubscriptionChange} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"/>
                        <span className="text-sm text-slate-700">{sub}</span>
                    </label>
                ))}
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product Image</label>
            <div className="mt-1 flex items-center gap-4">
                <div className="w-24 h-24 bg-slate-100 rounded-md flex items-center justify-center border">
                    {imagePreview ? <img src={imagePreview} alt="Product preview" className="h-full w-full object-cover rounded-md" /> : <ImageIcon className="h-12 w-12 text-slate-400" />}
                </div>
                <div className="flex-grow">
                    <input id="file-upload-edit" name="file-upload-edit" type="file" className="hidden" onChange={handleImageChange} accept="image/png, image/jpeg, image/gif" ref={fileInputRef}/>
                    <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>{imagePreview ? 'Change Image' : 'Upload Image'}</Button>
                    <p className="text-xs text-slate-500 mt-2">PNG, JPG, GIF up to 10MB.</p>
                </div>
            </div>
        </div>
        
        <div>
          <label htmlFor="description-edit" className="block text-sm font-medium text-slate-700 mb-1">Product Description</label>
          <Textarea id="description-edit" name="description" value={formData.description} onChange={handleChange} rows={4} required placeholder="Use new lines for bullet points" />
        </div>
        
        {error && <p className="mt-2 text-sm text-center text-red-600">{error}</p>}
      </form>
    </Modal>
  );
};

export default EditProductModal;