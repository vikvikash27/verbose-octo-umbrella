const User = require('../models/User');
const Product = require('../models/Product');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
    try {
        // Check if there are any users
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            console.log('No users found, seeding admin user...');
            
            // Create admin user
            await User.create({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password', // Will be hashed by pre-save hook
                role: 'admin',
                avatar: 'https://i.pravatar.cc/150?u=admin@example.com'
            });

             // Create customer user
             await User.create({
                name: 'Jane Doe',
                email: 'customer@example.com',
                password: 'password', // Will be hashed by pre-save hook
                role: 'customer',
                avatar: 'https://i.pravatar.cc/150?u=customer@example.com'
            });

            console.log('Admin and Customer users created.');
        }

        // Check if there are any products
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            console.log('No products found, seeding products...');
            const products = [
                { 
                    name: 'Wildflower Honey', 
                    category: 'Honey', 
                    price: 280, 
                    mrp: 300,
                    unit: '500g',
                    stock: 150, 
                    imageUrl: 'https://picsum.photos/seed/honey1/400', 
                    description: 'A delightful and aromatic honey sourced from a variety of wildflowers.\nPerfect for tea, toast, or baking.\nNaturally rich in antioxidants.', 
                    fssai: '10012011000001',
                    offer: 'Save ₹20',
                    tags: ['Natural', 'Raw'],
                    subscriptionOptions: ['One Time', 'Weekly', 'Alternate'],
                    seller: 'Beekeeper Co.',
                    shelfLife: '24 months'
                },
                { 
                    name: 'Acacia Honey', 
                    category: 'Honey', 
                    price: 350, 
                    mrp: 350,
                    unit: '500g',
                    stock: 45, 
                    imageUrl: 'https://picsum.photos/seed/honey2/400', 
                    description: 'Light and clear with a mild, sweet flavor.\nAcacia honey is a versatile favorite that resists crystallization.', 
                    fssai: '10012011000002',
                    tags: ['Organic', 'Pure'],
                    subscriptionOptions: ['One Time', 'Weekly'],
                    seller: 'Himalayan Organics',
                    shelfLife: '24 months'
                },
                { 
                    name: 'Manuka Honey', 
                    category: 'Honey', 
                    price: 950, 
                    mrp: 1050,
                    unit: '250g',
                    stock: 8, 
                    imageUrl: 'https://picsum.photos/seed/honey3/400', 
                    description: 'Known for its unique antibacterial properties.\nRich, earthy honey from New Zealand.\nA premium wellness product.', 
                    fssai: '10012011000003',
                    offer: '10% OFF',
                    tags: ['Imported', 'Wellness'],
                    subscriptionOptions: ['One Time'],
                    seller: 'NZ Honey Co.',
                    shelfLife: '36 months'
                },
                { 
                    name: 'Organic Ghee', 
                    category: 'Dairy', 
                    price: 650, 
                    mrp: 650,
                    unit: '1L',
                    stock: 0, 
                    imageUrl: 'https://picsum.photos/seed/ghee/400', 
                    description: 'Clarified butter made from the milk of grass-fed cows.\nLactose-free, high-heat cooking oil with a nutty flavor.', 
                    fssai: '10012011000004',
                    tags: ['Organic', 'Grass-fed'],
                    subscriptionOptions: ['Daily', 'Alternate', 'One Time', 'Weekly'],
                    seller: 'EasyOrganic Farms',
                    shelfLife: '9 months'
                },
                { 
                    name: 'Whole Wheat Flour', 
                    category: 'Grains', 
                    price: 110, 
                    mrp: 125,
                    unit: '2kg',
                    stock: 200, 
                    imageUrl: 'https://picsum.photos/seed/flour/400', 
                    description: 'Stone-ground from whole organic wheat berries.\nRich in fiber and perfect for rustic breads and rotis.', 
                    fssai: '10012011000005',
                    offer: 'Combo Offer Available',
                    tags: ['Staple', 'Organic'],
                    subscriptionOptions: ['One Time', 'Weekly'],
                    seller: 'Local Millers',
                    shelfLife: '3 months'
                },
            ];
            await Product.insertMany(products);
            console.log('Products seeded.');
        }

    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

module.exports = seedDatabase;