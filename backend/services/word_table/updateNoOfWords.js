const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-central-1" });
const docClient = new AWS.DynamoDB.DocumentClient();

const updateNoOfWords = async (_id, no_of_words, createdAt) => {
  const tableName = "no_of_words_table";
  const primaryKey = "_id";

  const updateExpression = "ADD no_of_words :incr";
  const attributeValues = {
    ":incr": no_of_words,
  };
  // Define the primary key value

  // Construct the update params
  const params = {
    TableName: tableName,
    Key: {
      [primaryKey]: _id,
      createdAt,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: attributeValues,
    ReturnValues: "UPDATED_NEW",
  };

  // Update the item in the table
  return docClient.update(params).promise();
};

module.exports = { updateNoOfWords };
