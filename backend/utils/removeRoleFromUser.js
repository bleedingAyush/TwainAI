const UserRoles = require("supertokens-node/recipe/userroles");
const addRolesAndPermissionsToSession = require("./addRolesAndPermissionsToSession");

async function removeRoleFromUser(userId) {
  const response = await UserRoles.removeUserRole(userId, "premiumUser");
  console.log("response remove role", response);

  console.log(response.didUserAlreadyHaveRole);
  if (response.status === "UNKNOWN_ROLE_ERROR") {
    // No such role exists
    return;
  }

  if (response.didUserHaveRole === false) {
    // The user already had the role
  } else {
    await addRolesAndPermissionsToSession();
  }
  return response;
}
// removeRoleFromUser("87921a89-322e-4ce6-9e8b-edf9278cd7a8");
module.exports = removeRoleFromUser;
