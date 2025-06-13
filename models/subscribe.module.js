const { default: mongoose, Schema } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
  },
  postdate: {
    type: Date,
    default: Date.now,
  },

});
const usersub = mongoose.model("subscribe", userSchema);
module.exports = usersub;
