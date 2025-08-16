const userModel = require("../models/database.module");

async function authverification(req, reply) {
    const{token,email}=req.body;
    const finduser = await userModel.findOne({
        email:email,
        token:token
    });
    if (finduser) {
        reply.send({ message: "User verified successfully" });
    } else {
        reply.code(400).send({ message: "Invalid token or email" });
    }
}
module.exports = {
    authverification
}