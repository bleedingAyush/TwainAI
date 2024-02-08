const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-central-1" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();

function resetTime(time) {
  let [year, month, day] = time.slice(0, 10).split("-");
  return `${year}-${month}-${day}`;
}

const getSubscriptionUsage = async (userId, subscription_start_time) => {
  const tableName = "no_of_words_table";

  const subscription_time = new Date(subscription_start_time);
  const today = new Date();
  const isYearEqual = subscription_time.getFullYear() == today.getFullYear();
  const isMonthEqual = subscription_time.getMonth() == today.getMonth();
  const isDayEqual = subscription_time.getDate() == today.getDate();

  if (
    (isYearEqual && isMonthEqual && isDayEqual) ||
    subscription_time.getDate() == today.getDate()
  ) {
    subscription_time.setFullYear(today.getFullYear());
    subscription_time.setMonth(today.getMonth());
    const r_time = new Date(resetTime(subscription_time.toISOString()));
    subscription_time.setTime(r_time);
  } else if (subscription_time.getDate() < today.getDate()) {
    subscription_time.setFullYear(today.getFullYear());
    subscription_time.setMonth(today.getMonth());
  } else {
    subscription_time.setFullYear(today.getFullYear());
    subscription_time.setMonth(today.getMonth() - 1);
  }

  console.log({ subscription_time, today });
  const params = {
    TableName: tableName,
    IndexName: "userId-createdAt-index",
    KeyConditionExpression: `userId = :user_id AND createdAt BETWEEN :start_time AND :end_time`,
    ExpressionAttributeValues: {
      ":start_time": subscription_time.toISOString(),
      ":end_time": today.toISOString(),
      ":user_id": userId,
    },
  };

  // Query the items from the past 30 days for the specified user
  let data = await dynamoDb.query(params).promise();
  console.log("subscription usage data", data);
  return data.Items;
};

module.exports = getSubscriptionUsage;
