const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const logger = require('./src/utils/logger');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('Connected to MongoDB for seeding...');


    const existingAdmin = await User.findOne({ email: 'admin@taskmanager.com' });

    if (existingAdmin) {
      logger.info('Admin user already exists. Skipping seed.');
      process.exit(0);
    }


    const admin = await User.create({
      name: 'Admin',
      email: 'admin@taskmanager.com',
      password: 'admin123',
      role: 'admin',
    });

    logger.info(`Admin user created successfully!`);
    logger.info(`Email: admin@taskmanager.com`);
    logger.info(`Password: admin123`);
    logger.info(`Role: ${admin.role}`);

    process.exit(0);
  } catch (error) {
    logger.error(`Seed error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
