const UserRoles = require("supertokens-node/recipe/userroles");

const createPremiumRole = async (req, res, next) => {
  try {
    const response = await UserRoles.createNewRoleOrAddPermissions(
      "premiumUser"
    );
    res.json(response);
  } catch (err) {
    console.log("err", err);
  }
};

module.exports = {
  createPremiumRole,
};
