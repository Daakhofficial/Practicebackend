const fastify = require("fastify")({ logger: true });
const homeCrontroller = require("../controllers/homecCrontroller");
const useraccescrontroller = require("../controllers/useraccesCrontroller");

async function routes(fastify, options) {
  fastify.get("/blogrecive", homeCrontroller.blogrecive);
  fastify.post("/Adminpost", homeCrontroller.Adminpost);
  fastify.post("/uploadProfileImage", homeCrontroller.uploadProfileImage);
  fastify.post("/sendId:_id", homeCrontroller.sendId);
  fastify.get("/postview:_id", homeCrontroller.postview);
  fastify.get("/blogpostview", homeCrontroller.blogpostview);
  fastify.post("/admifinder", homeCrontroller.admifinder);
  fastify.post("/subscribe", homeCrontroller.subscribe);
  fastify.post("/blogpost", homeCrontroller.blogpost);
  fastify.post("/sendotp", useraccescrontroller.sendotp);
  fastify.post("/verifyOtp", useraccescrontroller.verifyOtp);
  fastify.post("/verifyuser", useraccescrontroller.verifyuser);
  // fastify.get("/UserpostViews/:_id", homeCrontroller.UserpostViews);
}

module.exports = routes;
