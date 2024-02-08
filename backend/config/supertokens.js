const supertokens = require("supertokens-node");
const Session = require("supertokens-node/recipe/session");
const Dashboard = require("supertokens-node/recipe/dashboard");
const UserRoles = require("supertokens-node/recipe/userroles");
const ThirdPartyEmailPassword = require("supertokens-node/recipe/thirdpartyemailpassword");
let { Google, Github, Facebook } = ThirdPartyEmailPassword;
const UserMetadata = require("supertokens-node/recipe/usermetadata");
const EmailVerification = require("supertokens-node/recipe/emailverification");

const initializeSuperToken = () => {
  supertokens.init({
    framework: "express",
    supertokens: {
      connectionURI: `${process.env.SUPERTOKENS_CONNECT_URL}`,
      apiKey: `${process.env.SUPERTOKENS_API_KEY}`,
    },
    appInfo: {
      // learn more about this on https://supertokens.com/docs/session/appinfo
      appName: "TwinAI",
      apiDomain: `${process.env.API_DOMAIN}`,
      websiteDomain: `${process.env.WEBSITE_DOMAIN}`,
      apiBasePath: "/auth", // note this
      apiGatewayPath: "/dev",
    },
    recipeList: [
      UserMetadata.init(),
      ThirdPartyEmailPassword.init({
        providers: [
          Google({
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            clientId: process.env.GOOGLE_CLIENT_ID,
          }),
        ],
      }),
      Session.init(), // initializes session features
      UserRoles.init(),
      Dashboard.init({
        apiKey: `${process.env.DASHBOARD_API_KEY}`, // give a custom api key for domain
      }),
      EmailVerification.init({
        mode: "OPTIONAL",
      }),
    ],
    isInServerlessEnv: true,
  });
};

module.exports = initializeSuperToken;
