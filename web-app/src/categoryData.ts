export interface ProductCategory {
  name: string;
  imageUrl: string;
  link: string;
}

// Using placeholder images. In a real application, these would be actual product category images.
export const productCategories: ProductCategory[] = [
    { name: 'Milk & Coconut Water', imageUrl: 'https://i.imgur.com/gOa27aZ.png', link: '/products/category/milk-coconut-water' },
    { name: 'Fresh Vegetables', imageUrl: 'https://i.imgur.com/y8i5W2V.png', link: '/products/category/fresh-vegetables' },
    { name: 'Fresh Fruits', imageUrl: 'https://i.imgur.com/1m3T2r1.png', link: '/products/category/fresh-fruits' },
    { name: 'Milk Products', imageUrl: 'https://i.imgur.com/qLIIs86.png', link: '/products/category/milk-products' },
    { name: 'Ghee & Oils', imageUrl: 'https://i.imgur.com/1I43TzV.png', link: '/products/category/ghee-oils' },
    { name: 'Country Specials', imageUrl: 'https://i.imgur.com/r9fJmwt.png', link: '/products/category/country-specials' },
    { name: 'Eggs', imageUrl: 'https://i.imgur.com/9lDqD2I.png', link: '/products/category/eggs' },
    { name: 'Pulses (Chemical-free)', imageUrl: 'https://i.imgur.com/i9a5nfl.png', link: '/products/category/pulses' },
    { name: 'Dry Fruits & Seeds', imageUrl: 'https://i.imgur.com/pNZt4aD.png', link: '/products/category/dry-fruits' },
    { name: 'Breads', imageUrl: 'https://i.imgur.com/oB7r0tJ.png', link: '/products/category/breads' },
    { name: 'Cereals & Millets', imageUrl: 'https://i.imgur.com/tHqg3Nf.png', link: '/products/category/cereals-millets' },
    { name: 'Salt & Sugar', imageUrl: 'https://i.imgur.com/nI4pLJL.png', link: '/products/category/salt-sugar' },
    { name: 'Natural Spices', imageUrl: 'https://i.imgur.com/L1NQRNB.png', link: '/products/category/natural-spices' },
    { name: 'Atta & Rice', imageUrl: 'https://i.imgur.com/3q1yL9n.png', link: '/products/category/atta-rice' },
    { name: 'Makhana', imageUrl: 'https://i.imgur.com/J3x6Z4M.png', link: '/products/category/makhana' },
    { name: 'Pooja Essentials', imageUrl: 'https://i.imgur.com/4qQ1t2h.png', link: '/products/category/pooja-essentials' },
    { name: 'Snacks & Beverages', imageUrl: 'https://i.imgur.com/dAmqZfR.png', link: '/products/category/snacks-beverages' },
    { name: 'Offers', imageUrl: 'https://i.imgur.com/KzXbWfT.png', link: '/products/offers' },
];
