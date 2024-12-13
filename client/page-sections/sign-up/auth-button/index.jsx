import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

import Button from "components/button";

import { socialLogin } from "api-services/auth";

import google from "public/assets/icons/google.svg";
import logos_facebook from "public/assets/icons/logos_facebook.svg";

import style from "./auth-button.module.scss";

const AuthButton = ({ isSubmitting, router, dispatch, setError, type }) => {
  const login = useGoogleLogin({
    onSuccess: async (res) => {
      const data = {
        type,
        code: res?.access_token,
        newsLetter: false,
        accountType: "google",
      };
      await socialLogin({ data, router, dispatch, setError });
    },
    onFailure: (err) => console.error(err),
    prompt: "select_account",
    enable_serial_consent: false,
    use_fedcm_for_prompt: false,
  });

  const fbLogin = async (response) => {
    const data = {
      type,
      newsLetter: false,
      fbUserID: response?.userID,
      code: response.accessToken,
      accountType: "facebook",
    };
    await socialLogin({ data, router, dispatch, setError });
  };

  return (
    <div className={style.btnDiv}>
      <Button title="Sign Up" type="submit" isLoading={isSubmitting} />
      <p style={{ paddingTop: "26px" }}>OR</p>
      <Button
        iconStart={google}
        title="Continue with Google"
        type="button"
        className={style.socialBtn}
        handleClick={login}
      />
      <FacebookLogin
        appId={process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID}
        autoLoad={false}
        callback={fbLogin}
        render={(renderProps) => (
          <Button
            iconStart={logos_facebook}
            title="Continue with Facebook"
            type="button"
            className={style.socialBtn}
            handleClick={renderProps.onClick}
          />
        )}
      />
    </div>
  );
};

export default AuthButton;
