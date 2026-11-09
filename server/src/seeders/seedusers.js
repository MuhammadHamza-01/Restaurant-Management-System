import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI; 

// ⚠️ 2. CHANGE THIS: Path to your User model
import User from '../models/User.js';

// The common password for all 10 users
const commonPassword = 'Hamza123'; 

const dummyUsers = [
  { name: 'Hamza Admin', email: 'hamzadev2003@gmail.com', role: 'admin' },
  { name: 'Sara Staff', email: 'staff1@example.com', role: 'staff' },
  { name: 'Usman Staff', email: 'staff2@example.com', role: 'staff' },
  { name: 'Omar chef', email: 'chef3@example.com', role: 'chef' },
  { name: 'Fatima Staff', email: 'staff3@example.com', role: 'staff' },
  { name: 'Bilal Customer', email: 'customer1@example.com', role: 'customer' },
  { name: 'Ayesha Customer', email: 'customer2@example.com', role: 'customer' },
  { name: 'Zain chef', email: 'chef@example.com', role: 'chef' },
  { name: 'Mariam Customer', email: 'customer4@example.com', role: 'customer' },
  { name: 'Omar chef', email: 'chef2@example.com', role: 'chef' }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Hash the password ONCE (since they all share the same password, this is faster)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(commonPassword, salt);

    // Map through all 10 users and attach the hashed password
    const usersWithPasswords = dummyUsers.map(user => ({
      ...user,
      password: hashedPassword,
    }));

    // Insert all 10 users into the database
    await User.insertMany(usersWithPasswords);
    
    console.log('🚀 10 Dummy users added successfully!');
    console.log('--------------------------------------------------');
    dummyUsers.forEach(u => {
      console.log(`Email: ${u.email.padEnd(25)} | Role: ${u.role.padEnd(10)}`);
    });
    console.log('--------------------------------------------------');
    console.log(`🔑 Password for ALL users: ${commonPassword}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedDatabase();