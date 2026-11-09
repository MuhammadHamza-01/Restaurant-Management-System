import mongoose from 'mongoose';
import Category from '../models/Category.js'; // ⚠️ UPDATE THIS PATH to point to your Category model

// ⚠️ CHANGE THIS: Your actual MongoDB connection string
const MONGO_URI = 'mongodb+srv://Hamza:jTJYMu1QduAKR0Jy@cluster0.1z0s2ou.mongodb.net/RestaurantMS'; 

const categories = [
  {
    name: 'Appetizers & Starters',
    description: 'Small dishes to start your meal, including fries, wings, and mozzarella sticks.',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Burgers & Sandwiches',
    description: 'Juicy beef, chicken, and veggie burgers served with our signature sauces.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Pizza & Pasta',
    description: 'Hand-tossed pizzas and authentic Italian pasta cooked to perfection.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Main Courses',
    description: 'Hearty meals featuring steaks, grilled chicken, and signature house dishes.',
    image: 'https://images.unsplash.com/photo-1544025162-81103e76b5b5?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Seafood',
    description: 'Fresh catches from the sea, including salmon, shrimp, and fish fillets.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Salads & Healthy Bowls',
    description: 'Crisp greens, fresh vegetables, and protein-packed bowls for a light meal.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Desserts',
    description: 'Sweet treats to finish your meal, including cakes, ice cream, and pastries.',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Beverages & Drinks',
    description: 'Refreshing sodas, fresh juices, iced teas, and specialty coffees.',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Breakfast',
    description: 'Start your day right with pancakes, omelettes, and toast.',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Soups',
    description: 'Warm and comforting soups, perfect for a cold day.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Sides',
    description: 'Perfect accompaniments like garlic bread, onion rings, and mashed potatoes.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Kids Menu',
    description: 'Smaller portions and kid-friendly favorites like mac & cheese and mini pizzas.',
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=800&auto=format&fit=crop'
  }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Optional: Clear existing categories to avoid duplicate key errors
    // await Category.deleteMany({});
    // console.log('🗑️  Cleared existing categories');

    // Insert the new categories
    await Category.insertMany(categories);
    
    console.log(`🚀 ${categories.length} Categories seeded successfully!`);
    categories.forEach(cat => console.log(`- ${cat.name}`));

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedCategories();