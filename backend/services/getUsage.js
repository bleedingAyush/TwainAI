const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-central-1" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getUsage = async (userId) => {
  const tableName = "no_of_words_table";

  // Set the start and end times for the past 30 days
  const endTime = new Date();
  const startTime = new Date();
  endTime.setDate(endTime.getDate() - 30);

  // Set up the Query parameters
  const params = {
    TableName: tableName,
    IndexName: "userId-createdAt-index",
    KeyConditionExpression: `userId = :user_id AND createdAt BETWEEN :end_time AND :start_time`,
    ExpressionAttributeValues: {
      ":start_time": startTime.toISOString(),
      ":end_time": endTime.toISOString(),
      ":user_id": userId,
    },
  };
  // Query the items from the past 30 days for the specified user
  let data = await dynamoDb.query(params).promise();
  return data.Items;
};

module.exports = getUsage;
