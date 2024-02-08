const express = require("express");
const router = express.Router();
const {
  verifySession,
} = require("supertokens-node/recipe/session/framework/express");
const { generateText } = require("../controllers/textProcessing");
const {
  activateSubscription,
  cancelSubscription,
  planDetailsController,
} = require("../controllers/subscription");
const { getUserData } = require("../controllers/user");
const { createPremiumRole } = require("../controllers/roles");

const usage = require("../controllers/usage");
const usageHistory = require("../controllers/usageHistory");
const changeUserInfo = require("../controllers/changeUserInfo");
const { verifyPayPalSubscription } = require("../paypal/verifySubscription");
const {
  cancelSubscriptionController,
} = require("../controllers/cancelSubscriptionController");

const {
  contactSalesController,
} = require("../controllers/contactSalesController");
const { default: axios } = require("axios");
const { retrieveAccessToken } = require("../services/accessToken");
const { updateWordController } = require("../controllers/updateWordController");

router.route("/testUrl").get(verifySession(), async (req, res, next) => {
  try {
    const { todo } = req.body;
    const userId = req.session?.getUserId();

    res.json({ userId });
  } catch (err) {
    next(new Error(err.message));
  }
});

router.route("/test").get(async (req, res) => {
  const paypal_url = process.env.PAYPAL_URL;

  res.status(200).json({ data: "OK bro", paypal_url });
});
router.route("/generateText").post(generateText);

router.route("/createrole").post(createPremiumRole);

router.route("/history").get(verifySession(), usageHistory);

router.route("/usage").get(verifySession(), usage);

router
  .route("/subscription/cancel")
  .post(verifySession(), cancelSubscriptionController);

router.route("/subscription/activated").post(activateSubscription);

router.route("/subscription/cancelled").post(cancelSubscription);

router.route("/get-user-data").get(verifySession(), getUserData);

router.route("/change-user-info").post(verifySession(), changeUserInfo);

router
  .route("/subscription/plan-details")
  .get(verifySession(), planDetailsController);

router.route("/contact-sales").post(verifySession(), contactSalesController);

router.route("/update-words").post(updateWordController);

router.route("/create-plan").post(async (req, res, next) => {
  const { name, price, interval_unit } = req.body;
  console.log(name, price, interval_unit);
  try {
    const token = await retrieveAccessToken();
    const data = await axios({
      method: "post",
      url: "https://api-m.paypal.com/v1/billing/plans",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {
        product_id: "PROD-58J77694CV679991M",
        name: name,
        status: "ACTIVE",
        billing_cycles: [
          {
            frequency: {
              interval_unit: "WEEK",
              interval_count: 1,
            },
            tenure_type: "TRIAL",
            sequence: 1,
            total_cycles: 1,
            pricing_scheme: {
              fixed_price: {
                value: 0,
                currency_code: "USD",
              },
            },
          },
          {
            frequency: {
              interval_unit: interval_unit,
              interval_count: 1,
            },
            tenure_type: "REGULAR",
            sequence: 2,
            total_cycles: 0,
            pricing_scheme: {
              fixed_price: {
                value: price,
                currency_code: "USD",
              },
            },
          },
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          payment_failure_threshold: 1,
        },
      },
    });
    res.json(data);
  } catch (err) {
    res.json(err);
    console.log(err);
  }
});

module.exports = router;
