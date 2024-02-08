const {
  UserRoleClaim,
  PermissionClaim,
} = require("supertokens-node/recipe/userroles");
const { SessionContainer } = require("supertokens-node/recipe/session");
const Session = require("supertokens-node/recipe/session");

async function addRolesAndPermissionsToSession(session) {
  // we add the user's roles to the user's session
  await Session.fetchAndSetClaim(UserRoleClaim);

  // we add the permissions of a user to the user's session
  await Session.fetchAndSetClaim(PermissionClaim);
}

module.exports = addRolesAndPermissionsToSession;
