import mongoose from 'mongoose';
import MenuItem from '../models/MenuItem.js'; // ⚠️ UPDATE THIS PATH
import Category from '../models/Category.js'; // ⚠️ UPDATE THIS PATH

// ⚠️ CHANGE THIS: Your actual MongoDB connection string
const MONGO_URI = 'mongodb+srv://Hamza:jTJYMu1QduAKR0Jy@cluster0.1z0s2ou.mongodb.net/RestaurantMS'; 

const seedMenu = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // 1. Fetch all categories from the database
    const categories = await Category.find({});
    if (categories.length === 0) {
      throw new Error('No categories found! Please run seedCategories.js first.');
    }

    // Helper function to find a category ID by its name
    const getCatId = (name) => {
      const cat = categories.find(c => c.name.toLowerCase().includes(name.toLowerCase()));
      if (!cat) throw new Error(`Category "${name}" not found.`);
      return cat._id;
    };

    // 2. Define the menu items
    const menuItems = [
      // --- Appetizers & Starters ---
      {
        name: 'Mozzarella Sticks',
        description: 'Deep-fried, golden brown, and served with marinara sauce.',
        category: getCatId('Appetizers'),
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Buffalo Chicken Wings',
        description: 'Spicy, crispy wings tossed in buffalo sauce, served with ranch.',
        category: getCatId('Appetizers'),
        price: 9.49,
        image: 'https://images.unsplash.com/photo-1524114664604-cd8133cd67ae?q=80&w=800&auto=format&fit=crop'
      },

      // --- Burgers & Sandwiches ---
      {
        name: 'Classic Cheeseburger',
        description: 'Beef patty, melted cheddar, lettuce, tomato, and house sauce.',
        category: getCatId('Burgers'),
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Crispy Chicken Sandwich',
        description: 'Buttermilk fried chicken breast, pickles, and spicy mayo.',
        category: getCatId('Burgers'),
        price: 11.50,
        image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=800&auto=format&fit=crop'
      },

      // --- Pizza & Pasta ---
      {
        name: 'Margherita Pizza',
        description: 'Classic delight with 100% real mozzarella, fresh tomatoes, and basil.',
        category: getCatId('Pizza'),
        price: 14.00,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Chicken Alfredo Pasta',
        description: 'Fettuccine pasta tossed in a rich, creamy Alfredo sauce with grilled chicken.',
        category: getCatId('Pizza'),
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1626844131082-256783844137?q=80&w=800&auto=format&fit=crop'
      },

      // --- Main Courses ---
      {
        name: 'Grilled Ribeye Steak',
        description: '12oz ribeye cooked to your liking, served with garlic mashed potatoes.',
        category: getCatId('Main Courses'),
        price: 28.99,
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop'
      },

      // --- Seafood ---
      {
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon served with lemon butter sauce and asparagus.',
        category: getCatId('Seafood'),
        price: 22.50,
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop'
      },

      // --- Desserts ---
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm, rich chocolate cake with a gooey center, served with vanilla ice cream.',
        category: getCatId('Desserts'),
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'New York Cheesecake',
        description: 'Classic creamy cheesecake with a graham cracker crust and strawberry topping.',
        category: getCatId('Desserts'),
        price: 6.50,
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop'
      },

      // --- Beverages ---
      {
        name: 'Fresh Lemonade',
        description: 'House-made lemonade with fresh squeezed lemons and a hint of mint.',
        category: getCatId('Beverages'),
        price: 3.50,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop'
      }
    ];

    // 3. Insert the menu items
    await MenuItem.insertMany(menuItems);
    console.log(`🚀 ${menuItems.length} Menu Items seeded successfully!`);
    
    menuItems.forEach(item => console.log(`- ${item.name} ($${item.price})`));

  } catch (error) {
    console.error('❌ Error seeding menu:', error.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedMenu();