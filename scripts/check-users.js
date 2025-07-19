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
    const MONGODB_URI = 'mongodb+srv://dev:dgMgV0vXvGpsDV2W@cluster0.0gddo44.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const MONGODB_DB_NAME = 'tttimes-finance';
    
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