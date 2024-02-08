const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-central-1" });
const docClient = new AWS.DynamoDB.DocumentClient();
const { v4 } = require("uuid");
const {
  getUserSubscriptionData,
} = require("../services/getUserSubscriptionData");
const getSubscriptionUsage = require("../services/getSubscriptionUsage");
const openai = require("../config/openai");
const { updateNoOfWords } = require("../services/word_table/updateNoOfWords");
const { saveNoOfWords } = require("../services/word_table/saveNoOfWords");
const { saveText } = require("../services/saveText");
const {
  checkIfItemExists,
} = require("../services/word_table/checkIfItemExists");
// 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
function removeNewLine(text) {
  return text.replace(/\n/g, "");
}

function removeWhiteSpace(text) {
  return text?.replace(/ +/g, " ");
}

function getWordsInText(text) {
  return text?.split(" ").length;
}

function calculateText(text, no_of_words, limit) {
  if (text.length == 0) {
    return text;
  }
  // Replace newline characters with empty string
  const removed_newline = removeNewLine(text);

  // Replace multiple spaces with a single space
  let removed_whitespace = removeWhiteSpace(removed_newline);
  let text_words = getWordsInText(removed_whitespace);
  let total_words = no_of_words + text_words;
  if (total_words >= limit) {
    let diff = total_words - limit;
    let text_arr = removed_whitespace.split(" ");
    let new_arr = text_arr.slice(0, -diff);
    return new_arr.join(" ");
  } else {
    return text;
  }
}

function getPlanWordsLimit(plan_name) {
  const word_plans = [
    "10000",
    "20000",
    "30000",
    "40000",
    "50000",
    "60000",
    "70000",
    "80000",
    "90000",
    "100000",
  ];
  const words = plan_name.split(/\b/);
  const wordsLimit = words.find((item) => word_plans.includes(item));
  return wordsLimit;
}

const generateText = async (req, res, next) => {
  // const userId = req?.session?.getUserId();
  const userId = "c8ca508a-f181-40e9-9006-3d1cddca6a85";
  const { textValue } = req.body;
  if (!textValue || textValue?.length == 0) {
    return res.status(400).json({ erro: "Please give a prompt text" });
  }

  try {
    const subscription_data = await getUserSubscriptionData(userId);
    const start_time = subscription_data?.Item?.start_time;
    const usageData = await getSubscriptionUsage(userId, start_time);
    const plan_name = subscription_data.Item?.plan_name;
    const word_limit = getPlanWordsLimit(plan_name);
    let words_generated = 0;
    usageData.map((item) => (words_generated += item?.no_of_words));

    if (words_generated >= parseInt(word_limit)) {
      const message =
        "Limit reached. Please upgrade to premium to generate more text.";
      return res.json({ message });
    }

    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `${textValue}`,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log("after erspnsoe", response);
    let [data] = response.data?.choices;

    let calculatedText = calculateText(
      data?.text,
      words_generated,
      parseInt(word_limit)
    );

    if (data?.text?.length != 0) {
      await saveText(userId, textValue, data?.text);
      const item = await checkIfItemExists(userId);
      if (item?.Count == 0) {
        await saveNoOfWords(userId, textValue, data?.text);
      } else {
        const _id = item.Items[0]?._id;
        const removed_newline = removeNewLine(calculatedText);
        let removed_whitespace = removeWhiteSpace(removed_newline);
        let words_generated = getWordsInText(removed_whitespace);
        let createdAt = item.Items[0]?.createdAt;
        await updateNoOfWords(_id, words_generated, createdAt);
      }
    }

    data = {
      text: calculatedText,
      ...data,
    };

    res.json(data);
  } catch (err) {
    console.log("err", err);
    next(new Error(err));
  }
};

module.exports = {
  generateText,
};
