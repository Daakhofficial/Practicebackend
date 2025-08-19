const { default: mongoose, Schema } = require("mongoose");
const paymentSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    user_email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    payment_method:{
        type: String,
        required:true,
    },
    payment_Ac_no:{
        type:String,
        required:true
    },
    Upi_no:{
        type:String,
        required:true,
    },
    payment_token: {
        type: String,
        required: true,
    },
    withdraw_ammount: {
        type: Number,
        required: true,
    },
    payment_month: {
        type: Date,
        required: true,
    },
    verification: {
        type: Boolean,
        default: false,
        required: true,
    },
    agreeTerms: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },


})
const Paymentdata = mongoose.model("Payment",paymentSchema)
module.exports= Paymentdata