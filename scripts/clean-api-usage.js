const mongoose = require('mongoose');

async function cleanApiUsage() {
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
    
    // Drop the entire apiusages collection to remove old indexes
    try {
      await mongoose.connection.db.collection('apiusages').drop();
      console.log('Dropped apiusages collection');
    } catch (error) {
      console.log('Collection might not exist:', error.message);
    }
    
    console.log('ApiUsage collection cleaned successfully');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

cleanApiUsage();