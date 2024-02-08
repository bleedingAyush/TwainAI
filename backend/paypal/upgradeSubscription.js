// P-5EG8391116107911PMOU3HPY (Annual plan 10000words)
// P-2UC72818E3350322AMOUTTDQ (Annual plan 10000words)
// P-9CN60378UY228784SMOTSSLA (Monthly plan 10000)

const upgradeSubscription = async (id, total) => {
  const plan =
    total != 0
      ? {
          billing_cycles: [
            {
              sequence: 2,
              pricing_scheme: {
                fixed_price: {
                  currency_code: "USD",
                  value: `${total}`,
                },
              },
            },
          ],
        }
      : {};
  // const response = await fetch(
  //   `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${id}`,
  //   {
  //     body: JSON.stringify({
  //       plan_id: "P-5EG8391116107911PMOU3HPY",
  //     }),
  //     headers: {
  //       Authorization: `Bearer A21AAKDYI7Xi8y4kb3VMbh9Et7AfuiYFsObm-_2iUYgvKRA6NDdq5pkJnfwAnBmmT5Q0cPWaKP9J53-2GGlYLBQEYvYQnBPSw`,
  //       "Content-Type": "application/json",
  //     },
  //     method: "PATCH",
  //   }
  // );
  // const status = response.status;
  // console.log("status", { status });
  // const data = await response.json();
  // console.log("data", data);
  return null;
};
// plan,

// upgradeSubscription("I-AHE3G7NGR59C");
module.exports = { upgradeSubscription };
