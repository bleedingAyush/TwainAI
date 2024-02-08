const { getPayPalAccessToken } = require("./paypalApi");
const axios = require("axios");
const {
  retrieveAccessToken,
  addAccessToken,
} = require("../services/accessToken");

const verify_request = async (token, subscription_id) => {
  const paypal_url = process.env.PAYPAL_URL;
  const options = {
    method: "GET",
    url: `${paypal_url}/v1/billing/subscriptions/${subscription_id}`,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };
  const { data = {} } = await axios(options);

  const {
    subscriber: { email_address } = {},
    billing_info = {},
    status,
    plan_id,
    start_time,
  } = data;
  console.log("user sub data", data);

  const cycle_executions = billing_info?.cycle_executions;
  const regular_cycle = cycle_executions.find((item) => item.sequence == 2);
  const next_billing_time = billing_info.next_billing_time;
  return {
    isActive: status === "ACTIVE",
    next_billing_time,
    plan_id,
    start_time,
  };
};

const verifyPayPalSubscription = async (subscription_id) => {
  // const token = await getPayPalAccessToken();

  try {
    const token = await retrieveAccessToken();
    const data = await verify_request(token, subscription_id);
    return data;
  } catch (error) {
    const errorMessage = error?.message;
    console.log("errror", error);
    if (errorMessage == "Request failed with status code 401") {
      console.log("planDetails error", errorMessage);
      const paypal_access_token = await getPayPalAccessToken();
      await addAccessToken(paypal_access_token);
      const data = await verify_request(paypal_access_token, subscription_id);
      return data;
    } else if (typeof errorMessage == "string") {
      throw new Error(error);
    }
  }
};

module.exports = {
  verifyPayPalSubscription,
};
