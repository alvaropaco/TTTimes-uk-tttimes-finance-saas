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