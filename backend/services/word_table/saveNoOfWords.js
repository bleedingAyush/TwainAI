const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-central-1" });
const docClient = new AWS.DynamoDB.DocumentClient();
const { v4 } = require("uuid");

const formatDate = () => {
  var dateObj = new Date();
  var month = dateObj.getMonth() + 1; // months from 1-12
  var day = dateObj.getDate();
  var year = dateObj.getFullYear();
  // Add leading zeros to the month and day if necessary
  month = month.toString().padStart(2, "0");
  day = day.toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}T00:00:00.000Z`;
  return formattedDate;
};

const saveNoOfWords = async (userId, prompt, result) => {
  const date = formatDate();

  const createParams = {
    userId,
    _id: v4(),
    createdAt: date,
    no_of_words: result.length,
  };
  const data = await docClient
    .put({
      TableName: "no_of_words_table",
      Item: createParams,
    })
    .promise();
  return data;
};

module.exports = { saveNoOfWords };
