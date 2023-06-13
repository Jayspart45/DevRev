const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const port = 5432;
const app = express();
const bcrypt = require("bcrypt");
app.use(express.urlencoded({ extended: true }));

app.get("/login", (req, res) => {
  fs.readFile("userlogin1.html", function (err, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    return res.end();
  });
});

app.post("/", (req, res) => {
    fs.readFile("flightSearch.html", function (err, data) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      return res.end();
    });
  });
  
app.get("/sign", (req, res) => {
    fs.readFile("signup1.html", function (err, data) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      return res.end();
    });
  });

const url = `mongodb+srv://jay:1357945@cluster0.u2uewqx.mongodb.net/test`;
mongoose.connect(url);
const db = mongoose.connection;

app.use(express.json());

const schema = new mongoose.Schema({
  name: {
    type: String,
  },
  password: {
    type: String,
  },
});
const schema1 = new mongoose.Schema({
    name: {
      type: String,
    },
    email:{
        type: String,
    },
    password: {
      type: String,
    },
  });
  
const flight = mongoose.model("flight", schema);
const flight1 = mongoose.model("flight1", schema1);

// Define the login route
app.post("/login", async (req, res) => {
  // Get the user name and password from the request body
  const username = req.body.username;
  const password = req.body.password;

  // Check if the user name exists in the database
  const user = await flight.findOne({ username });

  // If the user does not exist, return an error message
  if (!user) {
    res.sendStatus(401);
    return;
  }

  // Check if the password matches the password stored in the database
  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log(isPasswordValid);
  // If the passwords do not match, return an error message
  if (!isPasswordValid) {
    res.sendStatus(401);
    return;
  }

  // Log the user in and redirect them to the main application page
  res.cookie("username", username);
  res.redirect("/");
});

//signup
app.post("/sign", async (req, res) => {
    // Get the user name and password from the request body
    const name = req.body.name;
    const password = req.body.password;
  
  // Check if the user name already exists in the database
  const user = await flight.findOne({ name });

  // If the user name already exists, return an error message
  if (user) {
    res.sendStatus(409);
    return;
  }

  // Hash the password using a secure hashing algorithm
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user and save it to the database
  const newUser = new flight({
    name: name,
    password: hashedPassword,
  });

  await newUser.save();

  // Redirect the user to the main application page
  res.redirect("/");
});

app.listen(5432, () => {
  console.log("Server listening on port 5432");
});
  
db.on("open", () => {
  console.log("Mongo connected");
});

app.listen(port, () => {
  console.log("Server Listening on Port http://localhost:" + port);
});