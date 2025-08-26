import React, { useState, useEffect, useRef } from 'react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import { ImageIcon, SpinnerIcon } from './icons';
import { API_URL } from '../api/config';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setName('');
      setImageUrl('');
      setImagePreview(null);
      setError('');
      setSuccessMessage('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageUrl(base64String);
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imageUrl) {
      setError('Please provide a category name and upload an image.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');
    try {
      const token = localStorage.getItem('admin-token');
      if (!token) throw new Error("Authentication error. Please log in again.");

      const response = await fetch(`${API_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, imageUrl }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to add category.';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
            const errorText = await response.text();
            errorMessage = errorText.slice(0, 200) || errorMessage;
        }
        throw new Error(errorMessage);
      }

      setSuccessMessage(`Category "${name}" added successfully!`);
      // Reset form for another entry
      setName('');
      setImageUrl('');
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Close modal after a delay
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Category"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Close</Button>
          <Button type="submit" form="add-category-form" disabled={isSubmitting}>
            {isSubmitting ? <SpinnerIcon /> : 'Add Category'}
          </Button>
        </>
      }
    >
      <form id="add-category-form" onSubmit={handleSubmit} className="space-y-6">
        <Input
          name="name"
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g., Fresh Vegetables"
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category Image</label>
          <div className="mt-1 flex items-center gap-4">
            <div className="w-24 h-24 bg-slate-100 rounded-md flex items-center justify-center border">
              {imagePreview ? <img src={imagePreview} alt="Category preview" className="h-full w-full object-cover rounded-md" /> : <ImageIcon className="h-12 w-12 text-slate-400" />}
            </div>
            <div className="flex-grow">
              <input id="category-image-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/png, image/jpeg" ref={fileInputRef} />
              <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>{imagePreview ? 'Change Image' : 'Upload Image'}</Button>
              <p className="text-xs text-slate-500 mt-2">PNG or JPG up to 5MB.</p>
            </div>
          </div>
        </div>
        {error && <p className="text-sm text-center text-red-600">{error}</p>}
        {successMessage && <p className="text-sm text-center text-green-600">{successMessage}</p>}
      </form>
    </Modal>
  );
};

export default AddCategoryModal;
