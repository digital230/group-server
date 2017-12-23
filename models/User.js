import mongoose from 'mongoose';
import Random from '@mobylogix/node-random';

const Schema = mongoose.Schema;

var User = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      type: Object,
    },
    'profile.imagUrl': {
      type: String,
    },
  }, { timestamps: true },
);

// methods here

export default mongoose.model('User', User);

/**
 * Created by asveloper on 10/4/17.
 */
