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
  console.log(result);
  return result;
}

getUsageHistory(
  {
    _id: "34fe69c3-0e7a-4ee4-b00a-7729aebc9c8e",
    createdAt: "2023-01-04T16:19:41.431Z",
    userId: "87921a89-322e-4ce6-9e8b-edf9278cd7a8",
  },
  "87921a89-322e-4ce6-9e8b-edf9278cd7a8"
);
