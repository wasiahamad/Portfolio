import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

// Create default admin user if not exists
export const seedAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL_SEED });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      const admin = new Admin({
        name: process.env.ADMIN_NAME || 'Md Wasi Ahmad',
        email: process.env.ADMIN_EMAIL_SEED || 'mdwasia98@gmail.com',
        password: hashedPassword
      });
      
      await admin.save();
      console.log('✅ Default admin user created successfully');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Name: ${admin.name}`);
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  }
};
