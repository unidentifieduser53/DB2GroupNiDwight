const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true // stored as a bcrypt hash, never plain text
    },
    birthday: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      enum: ['female', 'male', 'custom'],
      required: true
    }
  },
  {
    timestamps: true // adds createdAt / updatedAt automatically
  }
);

module.exports = mongoose.model('User', UserSchema);
