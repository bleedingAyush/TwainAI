import React, { useState, useEffect } from "react";
import "./styles/Checkout.css";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserData } from "../../redux/userSlice";
import PaypalSubscription from "./PaypalSubscription";

const AnnualPlans = {
  14: "P-2UC72818E3350322AMOUTTDQ",
  24: "P-5EG8391116107911PMOU3HPY",
  28: "P-5WU15147MB408553KMOZH4RQ",
  38: "P-09603209HE270140XMOZH4VQ",
  43: "P-1CG26485PG2119600MOZH4YI",
  48: "P-7CJ566926B372572JMOZH42Y",
  57: "P-98504787068179526MOZH6PI", // 70k
  67: "P-0TT14926MG525554AMOZH6SY", // 80k
  72: "P-81202685XJ0239128MOZH6VY", // 90k
  76: "P-7CR05158D4387911MMOZH6YY", // 100k
};

const MonthlyPlans = {
  1.5: "P-9CN60378UY228784SMOTSSLA",
  2.5: "P-5MG88350XP298700MMOZG3SY",
  3: "P-5N51995387184025LMOZG4WI",
  4: "P-4H051817U6435305BMOZG5BY",
  4.5: "P-5C730946NA0217609MOZG5KY",
  5: "P-9CN19185VM0336157MOZG5WI",
  6: "P-5R1529096M243572LMOZHZMQ",
  7: "P-4KK04306KC006725WMOZH2NQ",
  7.5: "P-84V411893R5739949MOZH2QQ",
  8: "P-13R63713SR023083JMOZH2UA",
};

const Checkout = () => {
  const { price } = useParams();
  const { user } = useSelector(getUserData);
  const [time, setTime] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState(price);
  const location = useLocation();
  const [planId, setPlanId] = useState(null);

  useEffect(() => {
    const time = new URLSearchParams(location.search).get("time");
    setTime(time);
  }, []);

  useEffect(() => {
    if (time == "Annual" && price) {
      const id = AnnualPlans[parseInt(price)];
      setPlanId(id);
    } else if (time == "Monthly" && price) {
      const id = MonthlyPlans[price];
      setPlanId(id);
    }
  }, [time, price]);

  if (!price || !planId) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "90vh",
        alignItems: "center",
        flexDirection: "column",
        gap: "0.3rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0rem",
          position: "relative",
        }}
      >
        <span className="dark-light">{time} Plan</span>
      </div>
      <h1>${calculatedPrice} USD</h1>
      <span className="free-trial-text">1 week free trial</span>
      <span className="dark-light">Cancel Anytime</span>
      <div className="checkout-card">
        <PaypalSubscription planId={planId} userId={user?.id} />

        <span
          className="dark-light"
          style={{
            position: "absolute",
            bottom: "1rem",
            right: "1rem",
            left: "1rem",
            fontSize: "0.85rem",
          }}
        >
          Your subscription will automatically renew. You can cancel at any time
          on the Subscription page of your account or by submitting a support
          request. If you cancel, previous charges will not be refunded.
        </span>
      </div>
    </div>
  );
};

export default Checkout;
