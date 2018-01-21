import mongoose from 'mongoose';
require('../models');

export function db() {
  mongoose.Promise = require('bluebird');

  const dbPromise = mongoose.connect(process.env.MONGO_URL, {
    useMongoClient: true
  });

  return dbPromise;
}
