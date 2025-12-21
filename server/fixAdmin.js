import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

async function fixAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete all admins
    const deleted = await Admin.deleteMany({});
    console.log('🗑️  Deleted', deleted.deletedCount, 'admin(s)');

    // Create fresh admin with .env password
    const password = process.env.ADMIN_PASSWORD;
    console.log('📝 Using password from .env:', password);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL_SEED,
      password: hashedPassword
    });

    console.log('✅ Admin created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('👤 Name:', admin.name);
    console.log('🔑 Password:', password);

    // Verify password works
    const testAdmin = await Admin.findOne({ email: admin.email });
    const isValid = await bcrypt.compare(password, testAdmin.password);
    console.log('🔐 Password test:', isValid ? '✅ WORKS' : '❌ FAILED');

    if (isValid) {
      console.log('\n✅ YOU CAN NOW LOGIN WITH:');
      console.log('   Email:', admin.email);
      console.log('   Password:', password);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAdmin();
