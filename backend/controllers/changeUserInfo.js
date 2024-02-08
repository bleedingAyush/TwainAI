const UserMetadata = require("supertokens-node/recipe/usermetadata");
const { changeEmailOrPassword } = require("../services/changeEmailOrPassword");

const changeUserInfo = async (req, res, next) => {
  const { first_name, last_name, email } = req.body;
  const userId = req.session?.getUserId();
  try {
    const emailUpdate = email
      ? await changeEmailOrPassword(userId, email)
      : null;
    if (
      emailUpdate?.message &&
      emailUpdate?.message !==
        "Cannot update email or password of a user who signed up using third party login."
    ) {
      throw new Error(emailUpdate);
    }

    const metaData = await UserMetadata.updateUserMetadata(userId, {
      first_name,
      last_name,
    });

    const data = {
      emailUpdateStatus: email
        ? emailUpdate?.status ?? emailUpdate?.message
        : null,
      metaDataStatus: metaData?.status,
    };

    res.status(200).json(data);
  } catch (err) {
    console.log("err", err);
    next(new Error(err));
  }
};

module.exports = changeUserInfo;
