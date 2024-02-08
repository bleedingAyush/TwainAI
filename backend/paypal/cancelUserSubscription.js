const { getPayPalAccessToken } = require("./paypalApi");
const axios = require("axios");
const {
  retrieveAccessToken,
  addAccessToken,
} = require("../services/accessToken");

const cancel_request = async (token, subscription_id) => {
  const paypal_url = process.env.PAYPAL_URL;
  const response = await axios.post(
    `${paypal_url}/v1/billing/subscriptions/${subscription_id}/cancel`,
    {
      reason: "Not satisfied with the service",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.status;
};

const cancelUserSubscription = async (subscription_id) => {
  try {
    const token = await retrieveAccessToken();
    const status = await cancel_request(token, subscription_id);
    return status;
  } catch (error) {
    const errorMessage = error?.message;
    if (errorMessage == "Request failed with status code 401") {
      const paypal_access_token = await getPayPalAccessToken();
      await addAccessToken(paypal_access_token);
      const data = await cancel_request(paypal_access_token, subscription_id);
      return data;
    } else if (typeof errorMessage == "string") {
      throw new Error(error);
    }
  }
};

module.exports = {
  cancelUserSubscription,
};
