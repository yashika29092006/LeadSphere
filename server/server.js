import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRouter from './routers/authRouter.js';
import leadRouter from './routers/leadRouter.js';
import contactRouter from './routers/contactRouter.js';
import accountRouter from './routers/accountRouter.js';
import dealRouter from './routers/dealRouter.js';
import activityRouter from './routers/activityRouter.js';
import User from './models/User.js';

//Environment variables load
dotenv.config();

// Connect Database
await connectDB();

// Create server
const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));

// Mount routers
app.use('/api/auth', authRouter);
app.use('/api/leads', leadRouter);
app.use('/api/contacts', contactRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/deals', dealRouter);
app.use('/api/activities', activityRouter);

// Simple default route
// Test route
app.get('/', (req, res) => res.send('CRM Complete API Running...'));

const PORT = process.env.PORT || 5000;

const seedAdmin = async () => {
  try {
    const userCount = await User.countDocuments();
    console.log(`Checking 'users' collection. Current count: ${userCount}`);

    if (userCount === 0) {
      console.log('--- SEEDING INITIAL USERS ---');

      // 1. Super Admin
      const admin = await User.create({
        name: 'Super Admin',
        email: 'admin@test.com',
        password: 'adminpassword',
        role: 'Admin'
      });
      console.log('Admin User Created: admin@test.com / adminpassword');

      // 2. Manager
      await User.create({
        name: 'Kamalesh',
        email: 'kamalesh@gmail.com',
        password: 'password123',
        role: 'Manager'
      });
      console.log('Manager User Created: kamalesh@gmail.com / password123');

      // 3. Sales Rep
      await User.create({
        name: 'Sales Person',
        email: 'sales@test.com',
        password: 'password123',
        role: 'Sales Rep'
      });
      console.log('Sales Rep Created: sales@test.com / password123');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Seeding error:', error);
  }
};
// Server start
app.listen(PORT, async () => {
  await seedAdmin();
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
