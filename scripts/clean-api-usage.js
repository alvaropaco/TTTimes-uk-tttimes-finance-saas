const mongoose = require('mongoose');

async function cleanApiUsage() {
  try {
    const MONGODB_URI = 'mongodb+srv://dev:dgMgV0vXvGpsDV2W@cluster0.0gddo44.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const MONGODB_DB_NAME = 'tttimes-finance';
    
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