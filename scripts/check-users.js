const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: String,
  email: String,
  name: String,
  apiKey: String,
  plan: String,
  createdAt: Date
});

const User = mongoose.model('User', userSchema);

async function checkUsers() {
  try {
    // Carrega variáveis de ambiente
require('dotenv').config({ path: '../.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'tttimes-finance';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI não encontrada nas variáveis de ambiente');
  process.exit(1);
}

await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
    console.log('Connected to MongoDB');
    
    const users = await User.find({}).limit(5);
    console.log('Found users:', users.length);
    
    if (users.length > 0) {
      console.log('Sample user API key:', users[0].apiKey);
      console.log('User plan:', users[0].plan);
      console.log('User email:', users[0].email);
    } else {
      console.log('No users found. Creating a test user...');
      
      // Generate a simple API key
      const apiKey = 'ttf_test_' + Math.random().toString(36).substring(2, 15);
      
      const testUser = new User({
        clerkId: 'test_clerk_id',
        email: 'test@example.com',
        name: 'Test User',
        apiKey: apiKey,
        plan: 'free',
        createdAt: new Date()
      });
      
      await testUser.save();
      console.log('Created test user with API key:', apiKey);
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsers();