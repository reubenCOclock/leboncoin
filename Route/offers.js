const express = require("express");
const router = express.Router();

const getProducts = req => {
  let filteredObject = {};
  if (req.query.minPrice) {
    filteredObject.price = {};
    filteredObject.price.$gte = req.query.minPrice;
  }

  if (req.query.maxPrice) {
    if (!filteredObject.price) {
      filteredObject.price = {};
    }

    filteredObject.price.$lte = req.query.maxPrice;
  }

  if (req.query.title) {
    filteredObject.title = {};
    filteredObject.title = new RegExp(req.query.title, "i");
  }

  return filteredObject;
};

router.post("/products/filter", async (req, res) => {
  try {
    const Announce = require("../Model/Announce");
    let filteredObject = getProducts(req);
    console.log(filteredObject);
    const filteredAnnounces = Announce.find(filteredObject);
    //res.json(filteredAnnounces);
    if (req.query.sortDate) {
      filteredAnnounces.sort({ create: req.query.sortDate });
    }

    if (req.query.sortPrice) {
      filteredAnnounces.sort({ price: req.query.sortPrice });
    }

    if (req.query.page) {
      let skipAmount = 4;
      filteredAnnounces
        .skip(skipAmount * (req.query.page - 1))
        .limit(skipAmount);
    }

    const finishedAnnounces = await filteredAnnounces;
    res.json(finishedAnnounces);
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/products/all", async (req, res) => {
  const Announce = require("../Model/Announce");
  const announces = await Announce.find().populate("poster");

  let tab = [];

  for (let i = 0; i < announces.length; i++) {
    if (announces[i].poster) {
      tab.push({
        _id: announces[i]._id,
        title: announces[i].title,
        description: announces[i].description,
        price: announces[i].price,
        creator: {
          account: {
            username: announces[i].poster.account.username,
            phone: announces[i].poster.account.phone
          },
          _id: announces[i]._id
        },
        created: announces[i].create
      });
    }
  }

  res.json({
    count: announces.length,
    offers: tab
  });

  //console.log(announces);
});

router.post("/findAnnounce/:id", async (req, res) => {
  const Announce = require("../Model/Announce");
  const announce = await Announce.find({ _id: req.params.id }).populate(
    "poster"
  );
  res.json(announce);
});

module.exports = router;
