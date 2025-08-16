const userModel = require("../models/database.module");
const nodemailer = require("nodemailer");
const otpmodel = require("../models/otp.modle");
const usersub = require("../models/subscribe.module");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || "youyoursocialapp@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "oyqt pgqf remz wdrr",
  },
});

const otpStore = {}; // In-memory store

async function sendotp(req, reply) {
  const { email } = req.body;
  console.log(email)
  console.log(email); // Add this for debugging

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // otpStore[email] = otp;

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
async function register(req, res) {
  const data = req.body
  const bodyString = JSON.stringify(data);
  const { email, username } = JSON.parse(bodyString);
  // const { lastName, firstName, username, password, confirmPassword, agreeTerms } = JSON.parse(bodyString);
  const existingUser = await userModel.find({ email: email });
  if (existingUser.length > 0) {
    return res.status(400).send({ message: "User already exists" });
  }
  if (existingUser.length === 0) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      await transporter.sendMail({
        from: "daakhofficial@gmail.com",
        to: email,
        subject: 'RJT - Sign In OTP',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Rajbongshi Times</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Sign In</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Hello ${username || 'there'}! Thank you for Sign In with Rajbongshi Times.
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Please use the following OTP code to verify your email address:
            </p>
            
            <div style="background: #fff; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #667eea; font-size: 32px; margin: 0; letter-spacing: 5px; font-family: 'Courier New', monospace;">
                ${otp}
              </h1>
            </div>
            
            // <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            //   This OTP code will expire in 10 minutes for security reasons.
            // </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              If you didn't request this verification, please ignore this email.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 12px;">
                © 2024 Website Builder. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
      });


      const newUser = new otpmodel({
        email,
        otp,
        createdAt: new Date(),
      });
      await newUser.save();
      if (newUser) {
        res.status(200).send({ message: "OTP sent successfully" });
        console.log("OTP sent successfully to", email);
      }

    } catch (error) {
      console.error(error);
      res.code(500).send({ message: "Failed to send OTP" });
    }
  }



}
async function verifylogin(req, res) {
  const { email, password } = req.body;
  const genratetoken = Math.floor(100000 + Math.random() * 900000).toString();
  const lastLogin = new Date();
  console.log(email, password);
  const otpData = await userModel.findOne({ email: email, password: password, verified: true });
  if (!otpData) {
    return res.status(400).send({ message: "Invalid OTP or email" });

  }
  if (otpData) {
    res.status(200).send({ success: true, token: genratetoken, email: otpData.email, message: "User verified successfully" });
    const lastloginsaved = await userModel.updateMany(
      { email: email },
      { $set: { lastLogin: lastLogin, token: genratetoken } }

    );
    if (!lastloginsaved) {
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: process.env.ACCESS_KEY,
      });
    }
  } else {
    res.status(400).send({ message: "Invalid OTP or email" });
  }

}
async function verifyloginotp(req, res) {
  const { email, otp } = req.body;
  const otpData = await otpmodel.findOne({ otp, email });
  if (!otpData) {
    return res.status(400).send({ message: "Invalid OTP or email" });
  }
  if (otpData) {
    res.status(200).send({ message: "OTP verified successfully" });
  } else {
    res.status(400).send({ message: "Invalid OTP or email" });
  }
  const currentTime = new Date();
  const lastLogin = currentTime;
  const lastloginsaved = await userModel.findOneAndUpdate(
    { email: email },
    { lastLogin: lastLogin },
    { new: true }
  );
  if (!lastloginsaved) {
    return res.status(404).send({ message: "User not found" });
  }

}
async function verifysign(req, res) {
  const { email, otp, firstName, lastName, username, password, conformPassword, agreeTerms } = req.body;
  console.log(email, otp);
  const otpData = await otpmodel.findOne({ otp, email });
  if (!otpData) {
    return res.status(400).send({ message: "Invalid OTP or email" });
  }
  const currentTime = new Date();
  const otpCreationTime = otpData.createdAt;
  const timeDifference = currentTime - otpCreationTime;
  const otpExpiryTime = 5 * 60 * 1000; // 5 minutes in milliseconds
  if (timeDifference > otpExpiryTime) {
    return res.status(400).send({ message: "OTP has expired" });
  }
  try {
    let user = await userModel.findOne({ email });
    if (!user) {
      user = await userModel.create({
        email,
        firstName,
        lastName,
        username,
        password,
        conformPassword,
        agreeTerms,
        verified: true,
        createdAt: new Date(),
      });
      await transporter.sendMail({
        from: "daakhofficial@gmail.com",
        to: email,
        subject: "RJT - Account Created Successfully",
        html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #28a745 0%, #218838 100%); padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">Rajbongshi Times</h1>
    </div>
    
    <div style="padding: 30px; background: #f9f9f9;">
      <h2 style="color: #333; margin-bottom: 20px;">Welcome ${username || "User"} 🎉</h2>
      
      <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
        Hello ${username || "there"}! Your account has been created successfully with <b>Rajbongshi Times</b>.
      </p>
      
      <div style="background: #fff; border: 2px solid #28a745; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
        <h1 style="color: #28a745; font-size: 24px; margin: 0;">
          ✅ Registration Successful
        </h1>
      </div>

      <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
        You can now log in with your email: <b>${email}</b>.
      </p>

      <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
        If this wasn’t you, please contact our support team immediately.
      </p>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #999; font-size: 12px;">
          © 2024 Rajbongshi Times. All rights reserved.
        </p>
      </div>
    </div>
  </div>
  `,
      });

    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Database error" });
  }
}
async function authverification(req, reply) {
  const { token, email } = req.body;
  console.log(token, email);
  const finduser = await userModel.findOne({
    email: email,
    token: token
  });
  if (finduser) {
    reply.send({ message: "User verified successfully" });
  } else {
    reply.code(400).send({ message: "Invalid token or email" });
  }
}
module.exports = {
  sendotp,
  verifyOtp,
  verifyuser,
  register,
  verifylogin,
  verifysign,
  verifyloginotp,
  authverification,
};
