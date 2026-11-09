import mongoose from 'mongoose';
import Table from '../models/Table.js'; // ⚠️ UPDATE THIS PATH

// ⚠️ CHANGE THIS: Your actual MongoDB connection string
const MONGO_URI = 'mongodb+srv://Hamza:jTJYMu1QduAKR0Jy@cluster0.1z0s2ou.mongodb.net/RestaurantMS'; 

const tables = [
  // --- 2-Person Tables ---
  { tableNumber: 'T01', capacity: 2, isActive: true },
  { tableNumber: 'T02', capacity: 2, isActive: true },
  { tableNumber: 'T03', capacity: 2, isActive: true },
  { tableNumber: 'T04', capacity: 2, isActive: false }, // Out of service for repair
  
  // --- 4-Person Tables ---
  { tableNumber: 'T05', capacity: 4, isActive: true },
  { tableNumber: 'T06', capacity: 4, isActive: true },
  { tableNumber: 'T07', capacity: 4, isActive: true },
  { tableNumber: 'T08', capacity: 4, isActive: true },
  { tableNumber: 'T09', capacity: 4, isActive: true },
  
  // --- 6-Person Tables ---
  { tableNumber: 'T10', capacity: 6, isActive: true },
  { tableNumber: 'T11', capacity: 6, isActive: true },
  { tableNumber: 'T12', capacity: 6, isActive: true },
  
  // --- 8-Person / Large Group Tables ---
  { tableNumber: 'T13', capacity: 8, isActive: true },
  { tableNumber: 'T14', capacity: 8, isActive: true },
  { tableNumber: 'T15', capacity: 8, isActive: false } // Reserved for VIP/Events
];

const seedTables = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Insert the tables
    await Table.insertMany(tables);
    
    console.log(`🚀 ${tables.length} Tables seeded successfully!`);
    console.log('--------------------------------------------------');
    tables.forEach(t => {
      const status = t.isActive ? '🟢 Active  ' : '🔴 Inactive';
      console.log(`Table: ${t.tableNumber.padEnd(5)} | Capacity: ${t.capacity.toString().padEnd(2)} | ${status}`);
    });
    console.log('--------------------------------------------------');

  } catch (error) {
    console.error('❌ Error seeding tables:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedTables();