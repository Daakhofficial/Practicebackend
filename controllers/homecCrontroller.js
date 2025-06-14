const userModel = require("../models/database.module");
const subsemail = require("../models/subscribe.module");
const userimg = require("../models/imageupload.mpodule");
const qullpost = require("../models/Quill.module");
const { default: mongoose } = require("mongoose");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
uuidv4();
const rdid = uuidv4();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "daakhofficial@gmail.com",
    pass: "rqvv rcko gnhy ccoe",
  },
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({
  storage,
  // limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  // fileFilter
});

async function blogrecive(req, reply) {
  // reply.send({ message: "hi" });
  const recive = await userModel.find({});
  if (recive) {
    reply.code(200).send(recive);
    // console.log("hii");
  }
}
async function Adminpost(req, reply) {
  const {
    values: { Title, description, Aurthor, imglink },
  } = req.body;

  const senddata = new userModel({
    Title,
    description,
    Aurthor,
    File: imglink,
  });
  await senddata.save();
  reply.code(200).send("hii");
  // console.log("blog saved");
}

async function uploadProfileImage(req, reply) {
  const parts = req.parts();
  let fileBuffer = null;
  let fileType = null;

  for await (const part of parts) {
    if (part.type === "file") {
      fileType = part.mimetype;
      const chunks = [];
      for await (const chunk of part.file) {
        chunks.push(chunk);
      }
      fileBuffer = Buffer.concat(chunks);
    }
  }

  if (!fileBuffer) {
    return reply.code(400).send({ message: "Missing image or email" });
  }

  const base64Image = `data:${fileType};base64,${fileBuffer.toString(
    "base64"
  )}`;

  // console.log(rdid)
  const user = await new userimg(
    //  {_id:id},
    { File: base64Image }
    // { new: true }
  );
  await user.save();
  reply.code(200).send({ user });

  if (!user) {
    return reply.code(404).send({ message: "img  not Uploaded" });
  }
}

async function sendId(req, reply) {
  try {
    const { _id } = req.params;
    // console.log(_id);

    const sendid = await qullpost.find({ _id: _id }); // Await the result

    reply.code(200).send({ sendid }); // This is now JSON-serializable
  } catch (err) {
    console.error(err);
    reply.code(500).send({ error: "Internal Server Error" });
  }
}
async function subscribe(req, reply) {
  try {
    const { email } = req.body;
    // console.log(_id);

    const sendsub = await new subsemail({ email: email }); // Await the result
    await sendsub.save();
    await transporter.sendMail({
      from: "daakhofficial@gmail.com",
      to: email,
      subject: "Feedback",
      text: "Thanks For Give Feedback",
    });
  } catch (err) {
    console.error(err);
    reply.code(500).send({ error: "Internal Server Error" });
  }
}

async function admifinder(req, reply) {
  const { gituser } = req.body;
  // console.log(gituser);
  // const adFinder = userModel.find({gituser})
}
async function postview(req, reply) {
  const getUserIP = (req) => {
    return (
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress
    );
  };
  // console.log("User IP:", getUserIP(req));
  try {
    const ip = getUserIP(req);
    const post = await qullpost.findById(req.params._id);

    if (!post) return reply.status(404).send({ message: "Post not found" });

    // If IP not already in list, add and increment view
    if (!post.viewedIPs.includes(ip)) {
      post.views += 1;
      post.viewedIPs.push(ip);
      await post.save();
    }

    reply.send({ views: post.views });
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
}
async function blogpost(req, reply) {
  const { title, content,email  } = req.body;
  // console.log(title)
  try {
    const newPost = new qullpost({ title, content,aurthor:email });
    await newPost.save();
    reply.code(201).send({ message: 'Post saved successfully' });
  } catch (err) {
    reply.code(500).send({ error: 'Failed to save post' });
  }
}
async function blogpostview(req, reply) {
  const posts = await qullpost.find().sort({ createdAt: -1 });
  reply.send(posts);
}

module.exports = {
  blogrecive,
  Adminpost,
  uploadProfileImage,
  sendId,
  admifinder,
  postview,
  subscribe,
  blogpost,
  blogpostview,
  // imageuploads,
  // upload
};
