const userModel = require("../models/database.module");
const posts = require("../models/Quill.module")
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
    const { _id, username, firstName,profileImage } = user[0];
    // const userdata = JSON.stringify(user)
    // console.log(user)
    if (user.length > 0) {
        reply.send({ success: true,message: "User dashboard data retrieved successfully", user: {_id,username,firstName,profileImage} });
    } else {
        reply.code(404).send({ message: "User not found" });
    }
}
async function userpost(req, reply) {
    const { email } = req.body;
    const userPosts = await posts.find({ aurthor: email }).select("_id title content createdAt cetagory aurthor views");
    const { _id,title } = userPosts[0];
    if (!_id) {
        return reply.code(404).send({ message: "User not found" });
    }
    if (!userPosts) {
        return reply.code(404).send({ message: "No posts found for this user" });
    }
    reply.send(userPosts);
}
async function deltelpost (req,reply){
    const { postId } = req.params;
    
    try {
        const deletedPost = await posts.findByIdAndDelete(postId);
        
        if (!deletedPost) {
            return reply.code(404).send({ message: "Post not found" });
        }
         
        reply.send({ success:true,message: "Post deleted successfully" });
    } catch (error) {
        reply.code(500).send({ message: "Error deleting post", error: error.message });
    }
}
module.exports = {
    authverification,
    userdashboard,
    userpost,
    deltelpost,
}