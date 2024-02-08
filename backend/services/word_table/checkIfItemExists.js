const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-central-1" });
const docClient = new AWS.DynamoDB.DocumentClient();

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

const checkIfItemExists = async (userId) => {
  const tableName = "no_of_words_table";
  const todaysDate = formatDate();

  // Set the table name and secondary index name
  const params = {
    TableName: tableName,
    IndexName: "userId-createdAt-index",
    KeyConditionExpression: "userId = :user_id AND createdAt = :createdAt",
    ExpressionAttributeValues: {
      ":user_id": userId,
      ":createdAt": todaysDate,
    },
  };

  // Query the table using the secondary index
  return await docClient.query(params).promise();
};

module.exports = { checkIfItemExists };
