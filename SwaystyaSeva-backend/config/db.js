const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/swastyaseva_hms';
  let attempt = 0;
  const maxAttempts = 5;

  while (attempt < maxAttempts) {
    try {
      attempt++;
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
      console.log(`✅ MongoDB connected: ${uri.replace(/\/\/.*@/, '//***@')}`);
      return;
    } catch (err) {
      console.error(`❌ Initial MongoDB connection failed: ${err.message}`);
      if (attempt < maxAttempts) {
        const delay = attempt * 4000;
        console.log(`Retrying in ${delay/1000}s... (attempt ${attempt + 1}/${maxAttempts})`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  console.error('❌ Could not connect to MongoDB after all attempts. Exiting.');
  process.exit(1);
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting reconnect...');
});
mongoose.connection.on('error', err => {
  console.error('❌ MongoDB connection error:', err.message);
});

module.exports = connectDB;
