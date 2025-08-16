const {default:mongoose,Schema}=require("mongoose");   
const sendOtpSchema = new Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '5m' } // OTP expires after 5 minutes
}) 
const OtpModel = mongoose.model("Otp", sendOtpSchema);
module.exports = OtpModel;