const fastify = require("fastify")({ logger: true });
const homeCrontroller = require("../controllers/homecCrontroller");
const useraccescrontroller = require("../controllers/useraccesCrontroller");
const accesauth = require("../accesauth/accesAuth");

async function routes(fastify, options) {
  fastify.get("/blogrecive", homeCrontroller.blogrecive);
  // fastify.post("/register", homeCrontroller.register);
  fastify.get("/search", homeCrontroller.serchqery);
  fastify.get("/blogs", homeCrontroller.blogs);
  fastify.get("/crousal", homeCrontroller.crousal);
  fastify.get("/Healthpage", homeCrontroller.Healthpage);
  fastify.get("/techpage", homeCrontroller.techpage);
  fastify.post("/Adminpost", homeCrontroller.Adminpost);
  fastify.post("/uploadProfileImage", homeCrontroller.uploadProfileImage);
  fastify.get("/autotag", homeCrontroller.autotag);
  fastify.post("/sendId:_id", homeCrontroller.sendId);
  fastify.get("/postview:_id", homeCrontroller.postview);
  fastify.get("/blogpostview", homeCrontroller.blogpostview);
  fastify.post("/admifinder", homeCrontroller.admifinder);
  fastify.post("/subscribe", homeCrontroller.subscribe);
  fastify.post("/blogpost", homeCrontroller.blogpost);
  fastify.post("/sendotp", useraccescrontroller.sendotp);
  fastify.post("/verifyOtp", useraccescrontroller.verifyOtp);
  fastify.post("/verifyuser", useraccescrontroller.verifyuser);
  fastify.post("/register", useraccescrontroller.register);
  fastify.post("/verifylogin", useraccescrontroller.verifylogin);
  fastify.post("/verify-login-otp", useraccescrontroller.verifyloginotp);
  fastify.post("/verify-otp", useraccescrontroller.verifysign);
  fastify.post("/authenticate",useraccescrontroller.authverification);
  // fastify.get("/UserpostViews/:_id", homeCrontroller.UserpostViews);
}

module.exports = routes;
