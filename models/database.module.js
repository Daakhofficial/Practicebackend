const { default: mongoose, Schema } = require("mongoose");

const userSchema = new Schema({
  _id:{
    type:String
  },
  email: { type: String, required: true, unique: true },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  conformPassword: {
    type: String,
    required: true,
    minlength: 6
  },

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
  verified: { type: Boolean, default: false },
  agreeTerms: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  profileImage: { type: String, default: "" },
  token: { type: String, default: "" },

});
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
