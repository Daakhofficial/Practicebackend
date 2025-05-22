const fastify = require("fastify")({ logger: true });
const homeCrontroller = require("../controllers/homecCrontroller");

async function routes(fastify, options) {
  fastify.get("/blogrecive", homeCrontroller.blogrecive);
  fastify.post("/Adminpost", homeCrontroller.Adminpost);
  fastify.post("/uploadProfileImage", homeCrontroller.uploadProfileImage);
  fastify.post("/sendId:_id", homeCrontroller.sendId);
}

module.exports = routes;
