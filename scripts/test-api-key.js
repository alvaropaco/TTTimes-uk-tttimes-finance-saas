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

async function testApiKeyValidation() {
  try {
    const MONGODB_URI = 'mongodb+srv://dev:dgMgV0vXvGpsDV2W@cluster0.0gddo44.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const MONGODB_DB_NAME = 'tttimes-finance';
    
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
    console.log('Connected to MongoDB');
    
    // Test the API key we're trying to use
    const testApiKey = 'ttf_rrk5kmfro1sepohjtswkww';
    console.log('Testing API key:', testApiKey);
    
    const user = await User.findOne({ apiKey: testApiKey });
    console.log('Found user:', user ? 'YES' : 'NO');
    
    if (user) {
      console.log('User details:', {
        email: user.email,
        apiKey: user.apiKey,
        plan: user.plan
      });
    }
    
    // List all users with their API keys
    const allUsers = await User.find({}, { email: 1, apiKey: 1 });
    console.log('\nAll users and their API keys:');
    allUsers.forEach(u => {
      console.log(`${u.email}: ${u.apiKey}`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

testApiKeyValidation();