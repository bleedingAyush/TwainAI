import "./App.css";
import { useEffect, useState } from "react";
import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import PrivateRoute from "./routes/PrivateRoute";
import Home from "./pages/Home/Home";
import Settings from "./pages/Settings";

import Checkout from "./pages/NewSubscription/Checkout";
import ThirdPartyEmailPassword from "supertokens-web-js/recipe/thirdpartyemailpassword";
import GoogleAuth from "./components/GoogleAuth";
import ResetPassword from "./components/ResetPassword";
import Toast from "./libs/Toast";
import NewSubscription from "./pages/NewSubscription";
import EmailVerification from "supertokens-web-js/recipe/emailverification";
import VerifyEmail from "./components/VerifyEmail";
import Usage from "./pages/usage";
import ContactSales from "./pages/NewSubscription/ContactSales";
import PrivacyPolicy from "./pages/Policy/Privacy.js";
import Terms from "./pages/Policy/Terms";
import Overview from "./pages/overview";

const BASE_URL = process.env.REACT_APP_API_URL;

SuperTokens.init({
  appInfo: {
    appName: "Todo-list",
    apiDomain: `${BASE_URL}`,
    apiBasePath: "/dev/auth",
  },
  recipeList: [
    Session.init(),
    ThirdPartyEmailPassword.init(),
    EmailVerification.init({
      mode: "OPTIONAL",
    }),
  ],
});

function App() {
  const [isLoggedIn, setIsLoading] = useState(true);

  async function getUserInfo() {
    if (await Session.doesSessionExist()) {
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  if (isLoggedIn) {
    return null;
  }

  return (
    <>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/terms-of-use" element={<Terms />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

            <Route path="/auth/callback/google" element={<GoogleAuth />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/verify-email" element={<VerifyEmail />} />
            <Route path="/overview" element={<Overview />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />}>
                <Route path="" element={<Navigate to="home" />} />
                <Route path="/home" element={<Settings />} />
                <Route path="/usage" element={<Usage />} />
                <Route path="/contact-sales" element={<ContactSales />} />
                <Route path="/subscription" element={<NewSubscription />}>
                  <Route path=":price" element={<Checkout />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
      <Toast />
    </>
  );
}

export default App;
