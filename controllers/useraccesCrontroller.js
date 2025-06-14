const userModel = require("../models/database.module");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "daakhofficial@gmail.com",
    pass: "rqvv rcko gnhy ccoe",
  },
});

const otpStore = {}; // In-memory store

async function sendotp(req, reply) {
  const { email } = req.body;
  //   console.log(email)
  console.log(email); // Add this for debugging

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore[email] = otp;

  try {
    await transporter.sendMail({
      from: "daakhofficial@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    });

    reply.send({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    reply.code(500).send({ message: "Failed to send OTP" });
  }
}
async function verifyuser(req, reply) {
  const { email } = req.body;
  // console.log("hii")

  try {
    const user = await userModel.findOne({ email });

    if (user) {
      reply.send({ exists: true });
    } else {
      reply.send({ exists: false });
    }
  } catch (err) {
    reply.code(500).send({ error: "Server error" });
  }
}

// const userModel = require("../models/database.module");

async function verifyOtp(req, reply) {
  const { email, otp } = req.body;

  if (otpStore[email] === otp) {
    delete otpStore[email]; // One-time use

    try {
      let user = await userModel.findOne({ email });

      if (!user) {
        user = await userModel.create({
          email,
          verified: true,
          createdAt: new Date(),
        });
      } else {
        user.verified = true;
        await user.save();
      }

      reply.send({ success: true, message: "OTP verified", user });
    } catch (err) {
      console.error(err);
      reply.code(500).send({ success: false, message: "Database error" });
    }
  } else {
    reply.send({ success: false, message: "Invalid OTP" });
  }
}

module.exports = {
  sendotp,
  verifyOtp,
  verifyuser
};
