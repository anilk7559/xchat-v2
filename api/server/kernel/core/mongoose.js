const mongoose = require('mongoose');

const MONGOOSE_RECONNECT_MS = 1000;

async function reconnect() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.info(`Successfully connected to MongoDB Atlas`);
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err);
    console.info(`Attempting to reconnect in ${MONGOOSE_RECONNECT_MS} ms`);
    setTimeout(() => {
      reconnect();
    }, MONGOOSE_RECONNECT_MS);
  }
}

exports.core = async () => {
  mongoose.connection.on('connected', () => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`Mongoose connected to ${process.env.MONGO_URI}`);
    }
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.info('Mongoose disconnected');
  });

  await reconnect();

  return mongoose;
};
