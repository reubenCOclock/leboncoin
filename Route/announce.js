const express = require("express");
const app = express();
const router = express.Router();

const isAuthentificated = require("../Middleware/authentification");

const Announce = require("../Model/Announce");
const User = require("../Model/User");

router.post("/announce", isAuthentificated, async (req, res) => {
  const newAnnounce = new Announce({
    title: req.fields.title,
    description: req.fields.description,
    price: req.fields.price,
    poster: req.user._id,
    create: new Date()
  });

  await newAnnounce.save();

  const populatedAnnounce = await Announce.findOne({
    _id: newAnnounce._id
  }).populate("poster");
  //console.log(populatedAnnounce);

  res.json({
    _id: populatedAnnounce._id,
    title: populatedAnnounce.title,
    description: populatedAnnounce.description,
    price: populatedAnnounce.price,
    createdAt: populatedAnnounce.create,
    creator: {
      account: {
        username: populatedAnnounce.poster.account.username
      },
      _id: populatedAnnounce._id
    }
  });
});

module.exports = router;
