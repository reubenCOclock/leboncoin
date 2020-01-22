const express = require("express");
const app = express();
const formidableMiddleware = require("express-formidable");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/leboncoin", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(formidableMiddleware());
const announceRoute = require("./Route/announce");
const userRoute = require("./Route/user");

app.use(announceRoute);
app.use(userRoute);

app.listen(3000, () => {
  console.log("server running");
});
