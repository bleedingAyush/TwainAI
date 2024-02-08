const EmailPassword = require("supertokens-node/recipe/emailpassword");
const ThirdPartyEmailPassword = require("supertokens-node/recipe/thirdpartyemailpassword");
const UserMetadata = require("supertokens-node/recipe/usermetadata");
const {
  updateEmailOrPassword,
} = require("supertokens-node/recipe/thirdpartyemailpassword");
const {
  isEmailVerified,
} = require("supertokens-node/recipe/emailverification");
const getUsage = require("../services/getUsage");
const {
  getUserSubscriptionData,
} = require("../services/getUserSubscriptionData");
const getSubscriptionUsage = require("../services/getSubscriptionUsage");

function kFormatter(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "K"
    : Math.sign(num) * Math.abs(num);
}

const getUserData = async (req, res, next) => {
  const userId = req?.session?.getUserId();

  try {
    const [metadataResult, isVerified, userInfo, userSubscriptionData] =
      await Promise.all([
        UserMetadata.getUserMetadata(userId),
        isEmailVerified(userId),
        ThirdPartyEmailPassword.getUserById(userId),
        getUserSubscriptionData(userId),
      ]);
    let status = userSubscriptionData?.Item?.subscription_status;
    let roles = status == "ACTIVE" ? ["premiumUser"] : [];
    let start_time = userSubscriptionData?.Item?.start_time;
    const usageData = await getSubscriptionUsage(userId, start_time);
    const { metadata } = metadataResult;
    let no_of_words = 0;
    usageData.map((item) => (no_of_words += item?.no_of_words));

    const data = {
      ...userInfo,
      roles: roles,
      metadata,
      isEmailVerified: isVerified,
      no_of_words: kFormatter(no_of_words),
    };

    res.status(200).json(data);
  } catch (err) {
    next(new Error(err));
    console.log(err);
  }
};

module.exports = {
  getUserData,
};
