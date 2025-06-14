const { default: mongoose, Schema } = require("mongoose");

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },

});
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
