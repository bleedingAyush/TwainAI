import React, { useState } from "react";
import "./styles/auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useGetUsersQuery } from "../../services/api";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Google from "../../assets/google.svg";
import Toast from "../../libs/Toast";
import { toast } from "react-toastify";
import { getAuthorisationURLWithQueryParamsAndSetState } from "supertokens-web-js/recipe/thirdpartyemailpassword";
import { emailPasswordSignIn } from "supertokens-web-js/recipe/thirdpartyemailpassword";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const handleSubmit = async (values) => {
    const { email, password } = values;
    if (email.length !== 0 && password.length !== 0) {
      startLoading();
      const userDetails = {
        email: email.trim(),
        password: password.trim(),
      };
      try {
        let data = await emailPasswordSignIn({
          formFields: [
            {
              id: "email",
              value: userDetails.email,
            },
            {
              id: "password",
              value: userDetails.password,
            },
          ],
        });
        stopLoading();
        if (data?.status != "OK") {
          return toast.warning("Email or Password is incorrect");
        }
        navigate("/");
      } catch {
        stopLoading();
      }
    }
  };

  async function googleSignInClicked() {
    const authURL = process.env.REACT_APP_GOOGLE_AUTH_URL;
    console.log({ authURL });
    try {
      const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
        providerId: "google",
        // This is where google should redirect the user back after login or error.
        // This URL goes on the google dashboard as well.
        authorisationURL: `${authURL}`,
      });

      /*
      Example value of authUrl: https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&access_type=offline&include_granted_scopes=true&response_type=code&client_id=1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com&state=5a489996a28cafc83ddff&redirect_uri=https%3A%2F%2Fsupertokens.io%2Fdev%2Foauth%2Fredirect-to-app&flowName=GeneralOAuthFlow
      */

      // we redirect the user to google for auth.
      window.location.assign(authUrl);
    } catch (err) {
      if (err.isSuperTokensGeneralError === true) {
        // this may be a custom error message sent from the API by you.
        window.alert(err.message);
      } else {
        console.log("err", err);
        window.alert("Oops! Something went wrong.");
      }
    }
  }

  const authSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Must contain 8 Characters, and 1 number")
      .matches(/\d/, "Must contain 8 Characters, and 1 number"),
  });

  return (
    <>
      <div className="auth-container">
        <div className="logo-container">
          <img src={require("../../assets/logo.jpg")} alt="" className="logo" />
          <span className="title">Welcome</span>
        </div>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={authSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values);
          }}
        >
          <Form>
            <Field name="email">
              {(value) => {
                return (
                  <>
                    <div className="input-block">
                      <input
                        type="text"
                        name="email"
                        id="input-text"
                        required
                        onChange={value.field.onChange}
                        value={value.field.value.email}
                      />
                      <span className="placeholder">Email</span>
                    </div>
                  </>
                );
              }}
            </Field>
            <ErrorMessage name="email">
              {(msg) => <div style={{ color: "red" }}>{msg}</div>}
            </ErrorMessage>
            <Field name="password">
              {(value) => {
                return (
                  <>
                    <div className="input-block">
                      <input
                        type="password"
                        name="password"
                        id="input-text"
                        required
                        onChange={value.field.onChange}
                        value={value.field.value.password}
                      />
                      <span className="placeholder">Password</span>
                    </div>
                  </>
                );
              }}
            </Field>
            <ErrorMessage name="password">
              {(msg) => <div style={{ color: "red" }}>{msg}</div>}
            </ErrorMessage>
            <div className="auth-nav">
              <span>Don't have an account</span>
              <Link to={"/signup"} className="link text">
                Sign Up
              </Link>
            </div>
            <button type="submit" className="submit-btn">
              {isLoading ? <span>Signing In</span> : <span>Sign In</span>}
            </button>
          </Form>
        </Formik>
        <Link to={"/auth/reset-password"} className="link black">
          Forgot your password
        </Link>
        <span className="or_text">OR</span>
        <button className="social-btn" onClick={googleSignInClicked}>
          <img src={Google} alt="" className="social-logo" />
          <span>Continue with Google</span>
        </button>
        <div style={{ marginTop: "0.5rem" }}>
          <span>Our </span>
          <Link className="link text" to="/privacy-policy">
            Privacy Policy{" "}
          </Link>
          <span>and </span>
          <Link className="link text" to="/terms-of-use">
            Terms of Use
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignIn;
{
  /* <form action="" className="form" onSubmit={handleSubmit}>
<div className="input-container">
  <input
    type="email"
    value={values.email}
    onChange={handleChange}
    placeholder="Email"
    name="email"
  />
  <input
    type="password"
    value={values.password}
    onChange={handleChange}
    placeholder="Password"
    name="password"
  />
</div>
<button className="submit-btn" disabled={isLoading}>
  {isLoading ? <span>Signing in...</span> : <span>Sign In</span>}
</button>
</form> */
}
