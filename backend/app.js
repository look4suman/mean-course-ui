const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./model/post');
const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb+srv://look4suman:s28yNCfqN5FlZ3py@cluster0-avum5.mongodb.net/test?retryWrites=true")
  .then(() => {
    console.log('connected to mongo db');
  })
  .catch(() => {
    console.log('connection to mongo failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(result => {
    res.status(201).json({
      postId: result._id,
      message: 'post added successfully'
    });
  });

});

app.get("/api/posts", (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'posts fetched successfully',
      posts: documents
    });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then(result => {
    console.log(result);
  });
  res.status(200).json({
    message: 'posts deleted successfully'
  });
});

module.exports = app;
