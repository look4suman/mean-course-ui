const express = require("express");
const router = express.Router();
const multer = require("multer");
const Post = require("../model/post");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const extn = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + extn);
  }
});

router.post(
  "/",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename
    });
    post.save().then(result => {
      console.log("save called");
      res.status(201).json({
        message: "post added successfully",
        post: {
          id: result._id,
          title: result.title,
          content: result.content,
          imagePath: result.imagePath
        }
      });
    });
  }
);

router.get("/", (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: "posts fetched successfully",
      posts: documents
    });
  });
});

router.get("/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.findById(req.params.id).then(post => {
    res.status(200).json(post);
  });
});

router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      _id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });

    Post.updateOne(
      {
        _id: req.params.id
      },
      post
    ).then(result => {
      console.log(result);
      res.status(200).json({
        message: "post updated successfully"
      });
    });
  }
);

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then(result => {
    console.log(result);
  });
  res.status(200).json({
    message: "posts deleted successfully"
  });
});

module.exports = router;
