const {
  updateEmailOrPassword,
} = require("supertokens-node/recipe/thirdpartyemailpassword");

const changeEmailOrPassword = async (userId, email) => {
  try {
    return await updateEmailOrPassword({
      userId,
      email,
    });
  } catch (err) {
    return err;
  }
};

module.exports = { changeEmailOrPassword };
