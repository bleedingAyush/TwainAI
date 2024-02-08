const UserRoles = require("supertokens-node/recipe/userroles");

async function getRolesForUser(userId) {
  if (!userId) return [];
  const response = await UserRoles.getRolesForUser(userId);
  const roles = response.roles;
  return roles;
}

module.exports = getRolesForUser;
