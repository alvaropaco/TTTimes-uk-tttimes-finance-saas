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

async function generateApiKeys() {
  try {
    const MONGODB_URI = 'mongodb+srv://dev:dgMgV0vXvGpsDV2W@cluster0.0gddo44.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const MONGODB_DB_NAME = 'tttimes-finance';
    
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
    console.log('Connected to MongoDB');
    
    const usersWithoutApiKey = await User.find({ $or: [{ apiKey: null }, { apiKey: undefined }, { apiKey: '' }] });
    console.log('Users without API key:', usersWithoutApiKey.length);
    
    for (const user of usersWithoutApiKey) {
      const apiKey = 'ttf_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      user.apiKey = apiKey;
      await user.save();
      console.log(`Generated API key for ${user.email}: ${apiKey}`);
    }
    
    // Get a sample API key for testing
    const userWithApiKey = await User.findOne({ apiKey: { $exists: true, $ne: null } });
    if (userWithApiKey) {
      console.log('\nSample API key for testing:', userWithApiKey.apiKey);
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

generateApiKeys();