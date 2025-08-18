const userModel = require("../models/database.module");
const subsemail = require("../models/subscribe.module");
const userimg = require("../models/imageupload.mpodule");
const qullpost = require("../models/Quill.module");
const { default: mongoose } = require("mongoose");
const multer = require("multer");
const path = require("path");
const cheerio = require("cheerio");
const { v4: uuidv4 } = require("uuid");
uuidv4();
const rdid = uuidv4();
const nodemailer = require("nodemailer");
const stopwords = new Set([
  "the", "is", "and", "a", "to", "in", "of", "for", "on", "with", "at", "by",
  "from", "this", "that", "it", "an", "be", "or", "as", "are", "was", "were",
  "has", "have", "had", "but", "not", "so", "we", "you", "i", "my", "our"
]);
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

    const sendid = await qullpost.find({ _id: _id }).select("_id title content createdAt cetagory aurthor views"); // Await the result

    reply.code(200).send({ sendid }); // This is now JSON-serializable
  } catch (err) {
    console.error(err);
    reply.code(500).send({ error: "Internal Server Error" });
  }
}
async function blogs(req, reply) {
  const posts = await qullpost.find().select("_id title content createdAt cetagory aurthor views").sort({ createdAt: -1 });
  reply.send(posts);
}
async function crousal(req, reply) {
  const posts = await qullpost.find({crousal:"1"}).select("_id title content createdAt cetagory aurthor views").sort({ createdAt: -1 });
  reply.send(posts);
}
async function techpage(req, reply) {
  const posts = await qullpost.find({cetagory:"Technology"}).select("_id title content createdAt cetagory aurthor views").sort({ createdAt: -1 });
  reply.send(posts);
}
async function Healthpage(req, reply) {
  const posts = await qullpost.find({cetagory:"Health"}).select("_id title content createdAt cetagory aurthor views").sort({ createdAt: -1 });
  reply.send(posts);
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
  const { email, title, content, cetagory,crousal } = req.body;
  // console.log(title)
  try {
    const newPost = new qullpost({ title, content, aurthor: email,cetagory,crousal });
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
async function autotag(req, res) {
  try {
    const posts = await qullpost.find({}, { title: 1}).lean();

    if (!posts.length) {
      return res.json({ tags: [] });
    }

    const wordCounts = {};

    // Extract words from title & content
    posts.forEach(post => {
      const text = `${post.title} ${post.content}`;
      const words = text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "") // remove punctuation
        .split(/\s+/);

      words.forEach(word => {
        if (!stopwords.has(word) && word.length > 2) {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      });
    });

    // Sort by frequency
    const sortedWords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word);

    // Randomize and limit to 10 tags
    const shuffled = sortedWords.sort(() => Math.random() - 0.5);

    res.send({ tags: shuffled.slice(0, 10) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate tags" });
  }
}
async function serchqery(req, res) {
  try {
    const query = req.query.q?.toLowerCase();
    console.log("Search query:", query);

    if (!query) {
      return res.json([]);
    }

    // Get matching posts
    const results = await qullpost.find(
      {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { content: { $regex: query, $options: "i" } }
        ]
      },
      { _id: 1, title: 1, content: 1 } // get content too so we can extract image
    ).lean();

    // Process results to extract first image src
    const processedResults = results.map(post => {
      let imageUrl = null;

      if (post.content) {
        const $ = cheerio.load(post.content);
        imageUrl = $("img").first().attr("src") || null;
      }

      return {
        _id: post._id,
        title: post.title,
        image: imageUrl
      };
    });

    res.send(processedResults);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }

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
  blogs,
  autotag,
  serchqery,
  crousal,
  techpage,
  Healthpage,
  // imageuploads,
  // upload
};
