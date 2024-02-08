const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-central-1" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getUserSubscriptionData = async (userId) => {
  const params = {
    TableName: "user_subscription",
    Key: {
      userId,
    },
  };

  const data = await dynamoDb.get(params).promise();
  return data;
};

module.exports = { getUserSubscriptionData };
