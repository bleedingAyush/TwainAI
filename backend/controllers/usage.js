const getUsage = require("../services/getUsage");

const usage = async (req, res, next) => {
  try {
    const userId = req.session.getUserId();
    const data = await getUsage(userId);
    res.status(200).json(data);
  } catch (err) {
    next(new Error(err));
  }
};

module.exports = usage;
