const fastify = require("fastify")({ logger: true });
const homeCrontroller = require("../controllers/homecCrontroller");

async function routes(fastify, options) {
  fastify.get("/blogrecive", homeCrontroller.blogrecive);
  fastify.post("/Adminpost", homeCrontroller.Adminpost);
  fastify.post("/uploadProfileImage", homeCrontroller.uploadProfileImage);
  fastify.post("/sendId:_id", homeCrontroller.sendId);
  fastify.get("/postview:_id", homeCrontroller.postview);
  fastify.post("/admifinder", homeCrontroller.admifinder);
  fastify.post("/subscribe", homeCrontroller.subscribe);
  // fastify.get("/UserpostViews/:_id", homeCrontroller.UserpostViews);
}

module.exports = routes;
