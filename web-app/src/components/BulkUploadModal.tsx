import React, { useState, useRef } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { SpinnerIcon, DownloadIcon } from './icons';
import { API_URL } from '../api/config';
import { Product } from '../types';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        if (selectedFile.type !== 'text/csv') {
            setError('Please upload a valid CSV file.');
            setFile(null);
        } else {
            setError('');
            setFile(selectedFile);
        }
    }
  };

  const parseCSV = (csvText: string): Omit<Product, '_id' | 'totalStock' | 'status'>[] => {
    const lines = csvText.trim().split('\n');
    const header = lines[0].split(',').map(h => h.trim());
    const productMap = new Map<string, Omit<Product, '_id' | 'totalStock' | 'status'>>();

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: { [key: string]: any } = header.reduce((obj, h, index) => {
            obj[h] = values[index];
            return obj;
        }, {} as { [key: string]: any });
        
        const productName = row.productName;
        if (!productName) continue;

        const variation = {
            name: row.variationName,
            price: parseFloat(row.variationPrice),
            mrp: parseFloat(row.variationMrp),
            stock: parseInt(row.variationStock, 10),
        };
        
        if (productMap.has(productName)) {
            productMap.get(productName)!.variations.push(variation);
        } else {
            productMap.set(productName, {
                name: productName,
                category: row.category,
                description: row.description?.replace(/\\n/g, '\n'),
                tags: row.tags ? row.tags.split(';').map((t: string) => t.trim()) : [],
                subscriptionOptions: row.subscriptionOptions ? row.subscriptionOptions.split(';').map((s: string) => s.trim()) : [],
                variations: [variation],
                imageUrl: row.imageUrl || '',
                seller: row.seller,
                shelfLife: row.shelfLife,
                fssai: row.fssai,
                offer: row.offer,
            });
        }
    }
    return Array.from(productMap.values());
  };


  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    setIsUploading(true);
    setError('');
    setSuccessMessage('');

    try {
      const csvText = await file.text();
      const productsToUpload = parseCSV(csvText);
      
      if(productsToUpload.length === 0) {
          throw new Error("CSV is empty or not formatted correctly.");
      }

      const token = localStorage.getItem('admin-token');
      const response = await fetch(`${API_URL}/api/products/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(productsToUpload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Bulk upload failed.');
      }
      
      setSuccessMessage(`Upload successful! Created: ${result.created}, Updated: ${result.updated}.`);
      onComplete(); // Refresh product list
      setTimeout(onClose, 2000); // Close modal after success
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Upload Products"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isUploading}>Cancel</Button>
          <Button onClick={handleUpload} disabled={isUploading || !file}>
            {isUploading ? <SpinnerIcon /> : 'Upload & Process'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-slate-700">Instructions:</h3>
          <ul className="list-disc list-inside text-sm text-slate-600 mt-2 space-y-1">
            <li>Upload a CSV file with product data.</li>
            <li>Each row represents a single product variation.</li>
            <li>Group variations by using the same `productName` for each row belonging to that product.</li>
            <li>The first row must be the header row with the exact column names.</li>
             <li><a href="/product_template.csv" download className="text-brand-primary hover:underline font-medium">Download Template CSV</a></li>
          </ul>
        </div>
        
        <div>
            <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-brand-primary hover:file:bg-indigo-100"
            />
        </div>
        
        {error && <p className="text-sm text-center text-red-600">{error}</p>}
        {successMessage && <p className="text-sm text-center text-green-600">{successMessage}</p>}
      </div>
    </Modal>
  );
};

export default BulkUploadModal;