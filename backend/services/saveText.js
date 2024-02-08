const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-central-1" });
const docClient = new AWS.DynamoDB.DocumentClient();
const { v4 } = require("uuid");

const saveText = async (userId, prompt, result) => {
  const date = new Date().toISOString();

  const createParams = {
    userId,
    _id: v4(),
    createdAt: date,
    prompt,
    result,
  };
  const data = await docClient
    .put({
      TableName: "prompt-text",
      Item: createParams,
    })
    .promise();
  return data;
};
module.exports = { saveText };
