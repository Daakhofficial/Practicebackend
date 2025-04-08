const fastify = require("fastify")({
  logger: true,
});
const cors = require("@fastify/cors");
require("dotenv").config();
const mongoose = require("mongoose");
fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST"],
});






fastify.register(require("@fastify/formbody"));
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const homerouter = require("./routes/homeRoutes");
fastify.register(homerouter, { prefix: "/api/v1" });

const auth = require("./controllers/auTh");
fastify.addHook("preHandler", auth);
mongoose
  .connect(process.env.MONGODB_URL, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

fastify.listen({ port: 4000, host: HOST }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("server listening on " + address);
});
