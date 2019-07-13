"use strict";

const mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  express = require("express"),
  app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

// *** MONGOOSE ***
mongoose.connect("mongodb://localhost:27017/restful_blog_app_2", {
  useNewUrlParser: true
});

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  date: { type: Date, default: Date.now }
});

const Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "Demo Blog Post",
//   image:
//     "https://images.unsplash.com/photo-1507306681221-aa9ccb9d1c18?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
//   body: "This is the first blog post of many, I hope."
// });

// *** ROUTES ***
app.get("/", function(req, res) {
  res.redirect("/blogs");
});

// INDEX
app.get("/blogs", function(req, res) {
  Blog.find({}, function(err, allBlogs) {
    if (err) {
      console.log("Error: " + err);
    } else {
      res.render("index", { blogs: allBlogs });
    }
  });
});

// NEW
app.get("/blogs/new", function(req, res) {
  res.render("new");
});

// CREATE
app.post("/blogs", function(req, res) {
  Blog.create(req.body.blog, function(err, newBlog) {
    if (err) {
      console.log("Error: " + err);
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
});

// SHOW
app.get("/blogs/:id", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      console.log("Error: " + err);
      res.redirect("/blogs");
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
});

// EDIT
app.get("/blogs/:id/edit", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      console.log("Error: " + err);
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

// UPDATE
app.put("/blogs/:id", function(req, res) {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(
    err,
    updatedBlog
  ) {
    if (err) {
      console.log("Error: " + err);
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// DELETE
app.delete("/blogs/:id", function(req, res) {
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log("Error: " + err);
      res.redirect("/blogs/" + req.params.id);
    } else {
      res.redirect("/blogs");
    }
  });
});

// *** LISTEN ***
app.listen(5000, function() {
  console.log("Server started...");
});
