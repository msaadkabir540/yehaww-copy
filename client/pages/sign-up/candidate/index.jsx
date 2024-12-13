/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Input from "components/input";
import AuthButton from "page-sections/sign-up/auth-button";
import Checkbox from "components/checkbox";
import Container from "components/container";

import { signUp } from "api-services/auth";

import style from "./candidateFormSignUp.module.scss";
import HeaderComponent from "components/header-compo";

const CandidateForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      terms: false,
      newsLetter: false,
    },
  });

  const onSubmit = async (data) => {
    data.type = "candidate";
    data.email = data.email ? data.email.toLowerCase() : "";
    await signUp({ data, router, dispatch, setError });
  };

  return (
    <div>
      <Head>
        <title>Sign Up - Yehaww</title>
        <meta
          name="description"
          content="Sign Up with our candidate account and get hired at your dream job!"
        />
        <link rel="icon" href="\assets\imgs\logo.webp" />
      </Head>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <div className={style.mainHeight}>
          <HeaderComponent heading={"Sign Up"} />
          <Container>
            <div className={style.form_container}>
              <p className={style.para}>
                Already a member? Login to your Yehaww account
                <Link href="/login">
                  <span> here</span>
                </Link>
              </p>
              <form
                onSubmit={(e) => {
                  clearErrors();
                  handleSubmit(onSubmit)(e);
                }}
              >
                <div className={style.name_field}>
                  <Input
                    star="*"
                    placeholder={"Forename"}
                    type="text"
                    label="Name"
                    name="forename"
                    register={register}
                    errorMessage={errors?.forename?.message}
                  />
                  <Input
                    star="*"
                    placeholder={"Surname"}
                    type="text"
                    label={"Surname"}
                    name="surname"
                    register={register}
                    errorMessage={errors?.surname?.message}
                  />
                  <Input
                    star="*"
                    label={"Email Address"}
                    type="email"
                    name="email"
                    register={register}
                    errorMessage={errors?.email?.message}
                  />
                  <Input
                    star="*"
                    label={"Password"}
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    register={register}
                    errorMessage={errors?.password?.message}
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    icon={`/assets/icons/eye-${passwordVisible ? "show" : "hide"}.svg`}
                  />
                </div>
                <div className={style.checkboxDiv}>
                  <div className={style.checkbox}>
                    <Checkbox
                      handleChange={(e) => {
                        setValue("terms", e.target.checked);
                        clearErrors("terms");
                      }}
                      errorMessage={errors?.terms?.message}
                    />
                    <p>
                      I agree to the
                      <Link href="/terms-privacy">
                        <span>Terms & Conditions</span>
                      </Link>
                      and have read the
                      <Link href={"/privacy-policy"}>
                        <span>Privacy Policy</span>
                      </Link>
                    </p>
                  </div>
                  <div className={style.checkbox}>
                    <Checkbox
                      handleChange={(e) => {
                        setValue("newsLetter", e.target.checked);
                        clearErrors("newsLetter");
                      }}
                      errorMessage={errors?.newsLetter?.message}
                    />
                    <p>
                      Tick here to receive our marketing e-shot newsletter. You'll get all the
                      latest industry news and offers from Yehaww. You can unsubscribe from this at
                      any time
                    </p>
                  </div>
                </div>
                <AuthButton {...{ isSubmitting, router, dispatch, setError, type: "candidate" }} />
              </form>
            </div>
          </Container>
        </div>
      </GoogleOAuthProvider>
    </div>
  );
};

export default CandidateForm;
