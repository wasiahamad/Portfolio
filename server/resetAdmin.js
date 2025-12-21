import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing admin
    await Admin.deleteMany({});
    console.log('🗑️  Deleted all existing admins');

    // Create fresh admin with password from .env
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const admin = new Admin({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL_SEED,
      password: hashedPassword
    });

    await admin.save();
    console.log('✅ Fresh admin created:');
    console.log('   Email:', admin.email);
    console.log('   Name:', admin.name);
    console.log('   Password:', process.env.ADMIN_PASSWORD);

    // Test login
    const testAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL_SEED });
    const isValid = await bcrypt.compare(process.env.ADMIN_PASSWORD, testAdmin.password);
    console.log('🔐 Password verification test:', isValid ? '✅ SUCCESS' : '❌ FAILED');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetAdmin();
