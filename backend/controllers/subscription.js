const AWS = require("aws-sdk");
const { planDetails } = require("../paypal/getPlanDetails");
const {
  getUserSubscriptionData,
} = require("../services/getUserSubscriptionData");
const { verifyPayPalSubscription } = require("../paypal/verifySubscription");
const { addSubscription } = require("../services/addSubscription");
AWS.config.update({ region: "eu-central-1" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const activateSubscription = async (req, res, next) => {
  const { event_type, resource } = req.body;
  const subscription_id = resource?.id;
  const plan_id = resource?.plan_id;
  const status = resource?.status;
  const start_time = resource?.start_time;

  const userId = resource?.custom_id;
  if (
    event_type == "BILLING.SUBSCRIPTION.ACTIVATED" &&
    typeof userId == "string"
  ) {
    try {
      const plan_data = await planDetails(plan_id);
      console.log("plan_data", plan_data);
      const { name } = plan_data;
      await addSubscription(
        userId,
        subscription_id,
        plan_id,
        status,
        name,
        start_time
      );
      res.status(200).json({ status: "ok" });
    } catch (error) {
      console.log("err subscription", error);
      next(new Error("something went wrong"));
    }
  }
};

const changeStatus = async (userId, status) => {
  const params = {
    TableName: "user_subscription",
    Key: {
      userId: userId,
    },
    UpdateExpression: "SET subscription_status = :newStatus",
    ExpressionAttributeValues: { ":userId": userId, ":newStatus": `${status}` },
    ReturnValues: "ALL_NEW",
    ConditionExpression: "userId = :userId",
  };
  try {
    const data = await dynamoDb.update(params).promise();
    console.log("change status data", data);
  } catch (err) {
    const code = err.code;
    if (code != "ConditionalCheckFailedException") {
      throw new Error(err);
    }
  }
};

const cancelSubscription = async (req, res, next) => {
  const { event_type, resource } = req.body;
  const userId = resource?.custom_id;
  const status = resource?.status;

  if (
    event_type == "BILLING.SUBSCRIPTION.CANCELLED" &&
    typeof userId == "string"
  ) {
    try {
      await changeStatus(userId, status);
      res.status(200).json({ status: "ok" });
    } catch (err) {
      next(new Error(err));
    }
  }
};

const planDetailsController = async (req, res, next) => {
  const userId = req.session.getUserId();
  try {
    const subscription_data = await getUserSubscriptionData(userId);
    const subscription_id = subscription_data?.Item?.subscription_id;
    const plan_id = subscription_data?.Item?.plan_id;
    if (subscription_id) {
      const [planDetailsData, subscriptionDataPaypal] = await Promise.all([
        planDetails(plan_id),
        verifyPayPalSubscription(subscription_id),
      ]);
      const { name } = planDetailsData;
      const { next_billing_time } = subscriptionDataPaypal;
      res.json({ name, next_billing_time });
    }
  } catch (err) {
    next(new Error(err));
  }
};

module.exports = {
  activateSubscription,
  cancelSubscription,
  planDetailsController,
};
