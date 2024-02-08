const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-central-1" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function getUsageHistory(lastEvaluatedKey, userId) {
  const params = {
    TableName: "prompt-text",
    Limit: 20,
    IndexName: "userId-createdAt-index",
    ExclusiveStartKey: lastEvaluatedKey,
    ScanIndexForward: false,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };

  const result = await dynamoDb.query(params).promise();

  return result;
}

module.exports = { getUsageHistory };
