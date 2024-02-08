const {
  retrieveAccessToken,
  addAccessToken,
} = require("../services/accessToken");
const { getPayPalAccessToken } = require("./paypalApi");
const axios = require("axios");

const axiosRequest = async (token, id) => {
  const paypal_url = process.env.PAYPAL_URL;
  const response = await axios({
    method: "GET",
    url: `${paypal_url}/v1/billing/plans/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const { data } = response;

  const { billing_cycles = [], status, name } = data;
  const regular_cycle = billing_cycles.find((item) => item.sequence == 2);
  const { pricing_scheme, frequency } = regular_cycle;

  return {
    isPlanActive: status === "ACTIVE",
    pricing_scheme,
    frequency,
    name,
  };
};

const planDetails = async (id) => {
  try {
    const token = await retrieveAccessToken();
    const data = await axiosRequest(token, id);
    return data;
  } catch (error) {
    const errorMessage = error?.message;

    if (errorMessage == "Request failed with status code 401") {
      const paypal_access_token = await getPayPalAccessToken();

      await addAccessToken(paypal_access_token);

      const data = await axiosRequest(paypal_access_token, id);
      return data;
    } else if (typeof errorMessage == "string") {
      throw new Error(error);
    }
  }
};

// upgradeSubscription("I-AHE3G7NGR59C");
module.exports = { planDetails };
