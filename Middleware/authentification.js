const User = require("../Model/User");

const isAuthentificated = async (req, res, next) => {
  const user = await User.findOne({
    token: req.headers.authorization.replace("Bearer ", "")
  });

  if (!user) {
    res.json({ message: "user unauthorized" });
  } else {
    req.user = user;
    next();
  }
};

module.exports = isAuthentificated;
