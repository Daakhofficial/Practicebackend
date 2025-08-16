const { default: mongoose, Schema } = require("mongoose");

const userSchema = new Schema({
  title: String,
  content: String,
  aurthor: String,
  cetagory: String,
  crousal: String,
  createdAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  viewedIPs: [String],
});
const qullpost = mongoose.model("qullpost", userSchema);
module.exports = qullpost;
