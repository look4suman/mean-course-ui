const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postRoutes = require("./route/posts");
const userRoutes = require("./route/user");

const app = express();

mongoose
  .connect(
    "mongodb+srv://look4suman:s28yNCfqN5FlZ3py@cluster0-avum5.mongodb.net/test?retryWrites=true"
  )
  .then(() => {
    console.log("connected to mongo db");
  })
  .catch(() => {
    console.log("connection to mongo failed");
  });

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,PUT,DELETE,OPTIONS"
  );
  next();
});

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
