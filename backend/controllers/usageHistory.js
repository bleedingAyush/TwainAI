const { getUsageHistory } = require("../services/getUsageHistory");

const usageHistory = async (req, res, next) => {
  try {
    const { createdAt, userId: lastItemUserId, _id } = req.query;

    let obj = {
      userId: lastItemUserId,
      _id,
      createdAt,
    };
    let lastEvaluatedKey =
      lastItemUserId == "null" || lastItemUserId == "undefined" ? null : obj;
    const userId = req.session.getUserId();
    console.log("la", lastEvaluatedKey, typeof lastEvaluatedKey, userId);

    const data = await getUsageHistory(lastEvaluatedKey, userId);
    res.status(200).json(data);
  } catch (err) {
    next(new Error(err));
  }
};

module.exports = usageHistory;
