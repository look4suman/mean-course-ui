const express = require("express");
const router = express.Router();
const Post = require("../model/post");
const checkauth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

router.post("/", checkauth, extractFile, (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
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
});

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

router.put("/:id", checkauth, extractFile, (req, res, next) => {
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
    imagePath: imagePath,
    creator: req.userData.userId
  });

  Post.updateOne(
    {
      _id: req.params.id,
      creator: req.userData.userId
    },
    post
  ).then(result => {
    console.log(result);
    if (result.nModified > 0) {
      res.status(200).json({
        message: "post updated successfully"
      });
    } else {
      res.status(401).json({
        message: "Not authorized"
      });
    }
  });
});

router.delete("/:id", checkauth, (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId
  }).then(result => {
    console.log(result);
    if (result.deletedCount > 0) {
      res.status(200).json({
        message: "post deleted successfully"
      });
    } else {
      res.status(401).json({
        message: "Not authorized"
      });
    }
  });
});

module.exports = router;
