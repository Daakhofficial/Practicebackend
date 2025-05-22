const { default: mongoose, Schema } = require("mongoose");

const userSchema1 = new Schema({
  uuid: {
    type: String,
  },
  File: {
    type: String,
  },
  postdate: {
    type: Date,
    default: Date.now,
  },
  _ide:{
    type: String,
  }
});
const userimg = mongoose.model("imgs", userSchema1);
module.exports = userimg;
