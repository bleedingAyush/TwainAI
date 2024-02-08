const axios = require("axios");

const getPayPalAccessToken = async () => {
  const paypal_url = process.env.PAYPAL_URL;
  const client_secret = process.env.PAYPAL_CLIENT_SECRET;
  const client_id = process.env.PAYPAL_CLIENT_ID;

  const options = {
    url: `${paypal_url}/v1/oauth2/token`,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": "en_US",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: client_id,
      password: client_secret,
    },
    params: {
      grant_type: "client_credentials",
    },
  };
  const { status, data } = await axios(options);
  return data.access_token;
};
// getPayPalAccessToken();

module.exports = { getPayPalAccessToken };
