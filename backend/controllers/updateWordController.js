const {
  checkIfItemExists,
} = require("../services/word_table/checkIfItemExists");
const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-central-1" });
const docClient = new AWS.DynamoDB.DocumentClient();
const { v4 } = require("uuid");
const ThirdPartyEmailPassword = require("supertokens-node/recipe/thirdpartyemailpassword");

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

const saveNoOfWords = async (userId, words) => {
  const date = formatDate();

  const createParams = {
    userId,
    _id: v4(),
    createdAt: date,
    no_of_words: words,
  };
  const data = await docClient
    .put({
      TableName: "no_of_words_table",
      Item: createParams,
    })
    .promise();
  return data;
};

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
  return await docClient.update(params).promise();
};

const updateWordController = async (req, res, next) => {
  const { email, words } = req.body;
  if (!email || !words) {
    return res.status(400).json({ message: "Please provider email and words" });
  }
  try {
    const data = await ThirdPartyEmailPassword.getUsersByEmail(email);
    if (data?.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }
    const [user] = data;
    const userId = user.id;
    const item = await checkIfItemExists(userId);
    if (item?.Count == 0) {
      await saveNoOfWords(userId, words);
    } else {
      const _id = item.Items[0]?._id;
      let createdAt = item.Items[0]?.createdAt;
      await updateNoOfWords(_id, words, createdAt);
    }
    res.json({ status: "ok", userId });
  } catch (err) {
    next(new Error(err));
  }
};

module.exports = { updateWordController };
