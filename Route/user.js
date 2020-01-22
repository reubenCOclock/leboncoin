const express = require("express");
const router = express.Router();

const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const randomString = uid2(16);

const User = require("../Model/User");

router.post("/signup", async (req, res) => {
  const salt = uid2(16);
  const token = uid2(64);
  const hashedPassword = SHA256(req.fields.password + salt).toString(encBase64);

  const searchUser = await User.findOne({ email: req.fields.email });
  console.log(searchUser);

  if (!searchUser) {
    const newUser = new User({
      hash: hashedPassword,
      email: req.fields.email,
      salt: salt,
      token: token,
      account: {
        username: req.fields.username,
        phone: req.fields.phone
      }
    });

    await newUser.save();

    res.json({
      _id: newUser._id,
      token: newUser.token,
      account: newUser.account
    });
  } else {
    res.json({ message: "no user found" });
  }
});

router.post("/signin", async (req, res) => {
  const email = req.fields.email;
  const password = req.fields.password;

  const user = await User.findOne({ email: req.fields.email });

  if (user) {
    if (
      user.hash === SHA256(req.fields.password + user.salt).toString(encBase64)
    ) {
      res.json({
        _id: user._id,
        token: user.token,
        account: user.account
      });
    }
  }
});

module.exports = router;
