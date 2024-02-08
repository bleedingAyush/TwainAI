const UserRoles = require("supertokens-node/recipe/userroles");
const addRolesAndPermissionsToSession = require("./addRolesAndPermissionsToSession");

async function addRoleToUser(userId) {
  const response = await UserRoles.addRoleToUser(userId, "premiumUser");
  console.log("response add role", response);
  console.log("", response.didUserAlreadyHaveRole);
  if (response.status === "UNKNOWN_ROLE_ERROR") {
    // No such role exists
    return;
  }

  if (response.didUserAlreadyHaveRole === true) {
    // The user already had the role
  } else {
    await addRolesAndPermissionsToSession();
  }
  return response;
}
module.exports = addRoleToUser;
