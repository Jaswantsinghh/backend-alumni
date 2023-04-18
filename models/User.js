const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  rollNo: String,
  branch: String,
  graduationYear: Number,
  phoneNumber: String,
  address: String,
  country: String,
  pincode: String,
  email: String,
  photos: [String],
  twitterProfileUrl: String,
  instagramProfileUrl: String,
  facebookProfileUrl: String,
  about: String,
  isVerified: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;