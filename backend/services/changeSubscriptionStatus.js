const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-central-1" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();

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
