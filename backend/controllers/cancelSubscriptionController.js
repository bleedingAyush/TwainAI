const { cancelUserSubscription } = require("../paypal/cancelUserSubscription");
const { getPayPalAccessToken } = require("../paypal/paypalApi");
const { addAccessToken } = require("../services/accessToken");
const {
  getUserSubscriptionData,
} = require("../services/getUserSubscriptionData");

const cancelSubscriptionController = async (req, res, next) => {
  const userId = req.session.getUserId();
  try {
    const subscription_data = await getUserSubscriptionData(userId);
    const subscription_id = subscription_data?.Item?.subscription_id;
    subscription_id ? await cancelUserSubscription(subscription_id) : null;

    res.status(200).json({ status: "ok", subscription_id });
  } catch (err) {
    next(new Error(err));
  }
};

module.exports = { cancelSubscriptionController };
