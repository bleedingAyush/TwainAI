const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-central-1" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const addSubscription = async (
  userId,
  subscription_id,
  plan_id,
  status,
  plan_name,
  start_time
) => {
  const date = new Date().toISOString();
  const params = {
    userId,
    subscription_id,
    plan_id,
    subscription_status: status,
    plan_name,
    start_time,
    createdAt: date,
    updatedAt: date,
  };
  await dynamoDb
    .put({
      TableName: "user_subscription",
      Item: params,
    })
    .promise();
};

module.exports = { addSubscription };
