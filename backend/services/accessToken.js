const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-central-1" });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const retrieveAccessToken = async () => {
  const params = {
    TableName: "twain_app_config",
    Key: {
      config: "paypal",
    },
  };
  const data = await dynamoDB.get(params).promise();
  return data?.Item?.access_token;
};

const addAccessToken = async (token) => {
  const date = new Date().toISOString();
  const params = {
    TableName: "twain_app_config",
    Key: {
      config: "paypal",
    },
    UpdateExpression: "SET access_token = :accessToken, createdAt = :date",
    ExpressionAttributeValues: {
      ":accessToken": `${token}`,
      ":date": `${date}`,
    },
    ReturnValues: "ALL_NEW",
  };
  await dynamoDB.update(params).promise();
};

module.exports = { retrieveAccessToken, addAccessToken };
