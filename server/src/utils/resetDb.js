const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/../../.env' });

const resetDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hourlee');
    console.log('[Reset DB] Connected to MongoDB');
    
    await mongoose.connection.db.dropDatabase();
    console.log('[Reset DB] Database dropped successfully.');
    process.exit(0);
  } catch (error) {
    console.error('[Reset DB Error]', error);
    process.exit(1);
  }
};

resetDatabase();
