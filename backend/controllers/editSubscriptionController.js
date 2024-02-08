const { cancelUserSubscription } = require("../paypal/cancelUserSubscription");
const { planDetails } = require("../paypal/getPlanDetails");
const { upgradeSubscription } = require("../paypal/upgradeSubscription");
const { verifyPayPalSubscription } = require("../paypal/verifySubscription");
const {
  getUserSubscriptionData,
} = require("../services/getUserSubscriptionData");

function monthsCompleted(currentDate, startDate) {
  const monthsDiff =
    (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
    (currentDate.getMonth() - startDate.getMonth());

  if (currentDate >= startDate) {
    return monthsDiff;
  } else if (currentDate.getDate() < startDate.getDate()) {
    return monthsDiff - 1;
  } else {
    return monthsDiff;
  }
}

const calculateProrationFees = (oldPlanData, newPlanData, start_time) => {
  const oldPlanPricingScheme = oldPlanData?.pricing_scheme;
  const newPlanPricingScheme = newPlanData?.pricing_scheme;
  const oldPlanFrequency = oldPlanData?.frequency;
  const newPlanFrequency = newPlanData?.frequency;
  if (
    newPlanFrequency?.interval_unit == "YEAR" &&
    oldPlanFrequency?.interval_unit == "YEAR"
  ) {
    const { fixed_price: oldPlanFixedPrice } = oldPlanPricingScheme;
    const { fixed_price: newPlanFixedPrice } = newPlanPricingScheme;
    const startDate = new Date("2022-10-29T16:51:55Z");
    const currentDate = new Date();
    let monthsBetween = monthsCompleted(currentDate, startDate);
    if (startDate.getDate() > currentDate.getDate()) {
      monthsBetween = monthsBetween - 1;
    }
    if (
      monthsBetween > 0 &&
      monthsBetween < 12 &&
      +newPlanFixedPrice.value > +oldPlanFixedPrice.value
    ) {
      const monthlyPrice = +oldPlanFixedPrice.value / 12;
      const totalAmount = monthsBetween * monthlyPrice;
      const left_amount = +oldPlanFixedPrice.value - totalAmount;
      const amount_deducted = +newPlanFixedPrice.value - left_amount;
      return amount_deducted.toFixed(1);
    }
  }

  return 0;
};

const editSubscriptionController = async (req, res, next) => {
  const userId = req.session.getUserId();
  // const { new_plan_id } = req.body;
  // P-5EG8391116107911PMOU3HPY
  const new_plan_id = "P-5EG8391116107911PMOU3HPY";
  try {
    // retrieve user subscription data from database
    const subscription_data = await getUserSubscriptionData(userId);
    const subscription_id = subscription_data?.Item?.subscription_id;
    if (subscription_id) {
      // verify user subscription from paypal servers.
      const { isActive, plan_id, start_time } = await verifyPayPalSubscription(
        subscription_id
      );

      if (isActive) {
        const [oldPlanData, newPlanData] = await Promise.all([
          planDetails(plan_id),
          planDetails(new_plan_id),
        ]);

        const total = calculateProrationFees(
          oldPlanData,
          newPlanData,
          start_time
        );
        console.log("total", total);
        // await cancelUserSubscription(plan_id);
        // await upgradeSubscription(subscription_id, total);
      } else {
        return res
          .status(400)
          .json({ status: "Subscription has been cancelled" });
      }
    }
    console.log("userData", subscription_data);
    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.log("err", err);
    res.json(err);
  }
};

module.exports = { editSubscriptionController };
