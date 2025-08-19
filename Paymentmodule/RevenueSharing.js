const { default: mongoose, Schema } = require("mongoose");
const RevenueShare = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    user_email: {
        type: String,
        required: true,
    },
    revenue_month: {
        type: String,
        required: true,
    },
    money:{
        type:Number,
        required:true,
    },
    createdAt: { type: Date, default: Date.now },


})
const revenueshare = mongoose.model("revenueShare",RevenueShare)
module.exports=revenueshare