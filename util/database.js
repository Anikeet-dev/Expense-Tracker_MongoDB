const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_USERNAME_PASSWORD}@cluster1.vfeextj.mongodb.net/expense-tracker?retryWrites=true&w=majority&appName=Cluster1`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;