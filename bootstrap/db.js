import mongoose from 'mongoose';
require('../models');

export function db() {
  mongoose.Promise = require('bluebird');

  const dbPromise = mongoose.connect('mongodb://127.0.0.1:27017/groupie', {
    useMongoClient: true
  });

  return dbPromise;
}
