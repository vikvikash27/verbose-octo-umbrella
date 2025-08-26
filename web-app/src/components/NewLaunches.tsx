import React from 'react';
import NewLaunchCard, { NewLaunchProduct } from './NewLaunchCard';
import Button from './ui/Button';

// Data based on the user's provided image
const newLaunchProducts: NewLaunchProduct[] = [
  { 
    id: 'nl-001', 
    name: 'Dark Chocolate 55% With Nuts', 
    spec: '17gm', 
    price: '₹63', 
    imageUrl: 'https://picsum.photos/seed/darkchoco/200' 
  },
  { 
    id: 'nl-002', 
    name: 'Pure Honey | Nmr Farm Honey', 
    spec: '450gm', 
    price: '₹245 - ₹250', 
    imageUrl: 'https://picsum.photos/seed/farmhoney/200' 
  },
  { 
    id: 'nl-003', 
    name: 'Roasted Chana (Bengal Gram) - Masala', 
    spec: '100gm', 
    price: '₹51', 
    imageUrl: 'https://picsum.photos/seed/roastedchana/200'
  },
  { 
    id: 'nl-004', 
    name: 'High Protein Milk', 
    spec: '425ml', 
    price: '₹51', 
    imageUrl: 'https://picsum.photos/seed/highpromilk/200' 
  },
  { 
    id: 'nl-005', 
    name: 'Oat Milk | Oat Beverage', 
    spec: '400ml', 
    price: '₹50', 
    imageUrl: 'https://picsum.photos/seed/oatbeverage/200' 
  },
  { 
    id: 'nl-006', 
    name: 'Tomato Soup', 
    spec: '30gm', 
    price: '₹48', 
    imageUrl: 'https://picsum.photos/seed/tomsoup/200'
  },
];

const NewLaunches: React.FC = () => {
  return (
    <section className="bg-emerald-50 py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">New Launches</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {newLaunchProducts.map(product => (
            <NewLaunchCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
            <Button variant="success" size="lg">Available on App</Button>
        </div>
      </div>
    </section>
  );
};

export default NewLaunches;
