const userModel = require("../models/database.module");
const posts = require("../models/Quill.module")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer");



const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER || "youyoursocialapp@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "oyqt pgqf remz wdrr",
    },
});
async function authverification(req, reply) {
    const { token, email } = req.body;
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
async function userdashboard(req, reply) {
    const { email } = req.body;
    const user = await userModel.find({ email: email });
    if (!user) {
        return reply.code(404).send({ message: "User not found" });
    }
    const { _id, username, firstName, profileImage } = user[0];
    // const userdata = JSON.stringify(user)
    // console.log(user)
    if (user.length > 0) {
        reply.send({ success: true, message: "User dashboard data retrieved successfully", user: { _id, username, firstName, profileImage } });
    } else {
        reply.code(404).send({ message: "User not found" });
    }
}
async function userpost(req, reply) {
    const { email } = req.body;
    const userPosts = await posts.find({ aurthor: email }).select("_id title content createdAt cetagory aurthor views");
    const { _id, title } = userPosts[0];
    if (!_id) {
        return reply.code(404).send({ message: "User not found" });
    }
    if (!userPosts) {
        return reply.code(404).send({ message: "No posts found for this user" });
    }
    reply.send(userPosts);
}
async function deltelpost(req, reply) {
    const { postId } = req.params;

    try {
        const deletedPost = await posts.findByIdAndDelete(postId);

        if (!deletedPost) {
            return reply.code(404).send({ message: "Post not found" });
        }

        reply.send({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        reply.code(500).send({ message: "Error deleting post", error: error.message });
    }
}
async function forgotpassword(req, res) {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        // Create a JWT token (valid for 15 minutes)
        const token = jwt.sign({ id: user._id }, "SECRET_KEY", { expiresIn: "15m" });

        const resetLink = `http://localhost:3000/reset-password/${user._id}/${token}`;

        // Send Email
        await transporter.sendMail({
            from: '"Support" <yourgmail@gmail.com>',
            to: email,
            subject: "Password Reset",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
        });

        res.send({ success: true, message: "Reset link sent to your email" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}
async function resetpassword(req, res) {
    try {
        const { id, token, password } = req.body; // expecting all in body

        // Verify token
        jwt.verify(token, "SECRET_KEY", async (err, decoded) => {
            if (err) return res.status(400).send({ message: "Invalid or expired token" });

            // Hash new password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Update user
            await userModel.findByIdAndUpdate(id, { password: hashedPassword });

            res.send({ success: true, message: "Password reset successful" });
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}
async function viewscounter(req, res) {
    const { email } = req.body;
    // console.log(email)

    // Find all posts for this email
    const userPosts = await posts.find({aurthor:email}).select("views");
    // console.log(userPosts)

    // Count how many posts
    const postCount = userPosts.length;

    // Sum all views
    const totalViews = userPosts.reduce((sum, post) => sum + (post.views || 0), 0);

    res.send({
        message: "User post stats retrieved successfully",
        postCount,
        totalViews
    });

}
module.exports = {
    authverification,
    userdashboard,
    userpost,
    deltelpost,
    forgotpassword,
    resetpassword,
    viewscounter,
}