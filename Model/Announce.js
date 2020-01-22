const mongoose = require("mongoose");

const Announce = mongoose.model("Announce", {
  title: {
    type: String
  },
  description: {
    type: String
  },
  price: {
    type: Number
  },
  create: {
    type: Date
  },
  poster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = Announce;
