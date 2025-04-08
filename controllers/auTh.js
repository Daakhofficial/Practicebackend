require("dotenv").config();
const acceskey = process.env.ACCESS_KEY;

async function auth(req, reply) {
    const token = req.headers['access-key'];
    if (req.method === "POST") {
        return;
    }
    if (!token || token !== acceskey) {
        return reply.code(401).send({ message: "Unauthorized" });
    }
    return; // Ensure function stops execution after sending a response
}

module.exports = auth;
