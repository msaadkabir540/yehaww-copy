/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Input from "components/input";
import Select from "components/select";
import AuthButton from "page-sections/sign-up/auth-button";
import Checkbox from "components/checkbox";
import TextArea from "components/textarea";
import Container from "components/container";

import { signUp } from "api-services/auth";
import { entities, telCodes } from "helpers/signup-employer-helper";

import style from "./employeeFormSignUp.module.scss";
import HeaderComponent from "components/header-compo";
import PhonePicker from "components/phone-input";

export async function getServerSideProps(context) {
  const referral = context.query["referral-code"] || null;
  return {
    props: {
      referral,
    },
  };
}

const EmployeeForm = ({ referral }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      terms: false,
      newsLetter: false,
    },
  });

  const onSubmit = async (data) => {
    data.type = "employer";
    data.email = data.email ? data.email.toLowerCase() : "";
    data.signUpReferral === "" && delete data.signUpReferral;
    await signUp({ data, router, dispatch, setError });
  };

  useEffect(() => {
    const signUpReferral = router?.query["referral-code"];
    setValue("signUpReferral", signUpReferral);
  }, [router]);
  const metaDescription = useMemo(() => {
    if (referral) {
      return `You can Avail Discounts on the Subscription Plans with referral code: ${referral}!`;
    }
    return "You can Avail Discounts on the Subscription Plans!";
  }, [referral]);
  return (
    <>
      <Head>
        <title>Sign Up - Yehaww</title>
        <meta name="description" content={metaDescription} />
        <link rel="icon" href="\assets\imgs\logo.webp" />
      </Head>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <div className={style.loginMain}>
          <HeaderComponent heading="Sign Up" />
          <Container>
            <div className={style.form_container}>
              <p className={style.para}>
                Already a member? Login to your Yehaww account{" "}
                <Link href="/login">
                  <span>here</span>
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
                    name="forename"
                    label={"Name"}
                    register={register}
                    errorMessage={errors?.forename?.message}
                  />

                  <Input
                    star="*"
                    placeholder={"Surname"}
                    type="text"
                    label="Surname"
                    name="surname"
                    register={register}
                    errorMessage={errors?.surname?.message}
                  />
                  <Select
                    star="*"
                    label={"Are u a.."}
                    name="entity"
                    className={style.field}
                    register={register}
                    errorMessage={errors?.entity?.message}
                  >
                    <option value="">Please select</option>
                    {entities?.map((ele) => (
                      <option key={ele} value={ele}>
                        {ele}
                      </option>
                    ))}
                  </Select>

                  <Input
                    star="*"
                    type="text"
                    label="Company Name"
                    name="companyName"
                    className={style.field}
                    register={register}
                    errorMessage={errors?.companyName?.message}
                  />
                  <PhonePicker
                    star="*"
                    name={"telephone"}
                    label={"Phone Number"}
                    errorMessage={errors?.telephone?.message}
                    control={control}
                  />
                  <Input
                    star="*"
                    label={"Email Address"}
                    type="email"
                    name="email"
                    className={style.field}
                    register={register}
                    errorMessage={errors?.email?.message}
                  />
                  <Input
                    star="*"
                    label="Password"
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    className={style.field}
                    register={register}
                    errorMessage={errors?.password?.message}
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    icon={`/assets/icons/eye-${passwordVisible ? "show" : "hide"}.svg`}
                  />
                  <Input
                    type="text"
                    register={register}
                    name="signUpReferral"
                    label="Referral Code"
                    className={style.field}
                    placeholder={"Enter Referral Code"}
                    errorMessage={errors?.signUpReferral?.message}
                  />
                </div>
                <div style={{ marginTop: "20px" }}>
                  <TextArea
                    star="*"
                    label="Business Address"
                    name="businessAddress"
                    className={style.field}
                    register={register}
                    errorMessage={errors?.businessAddress?.message}
                    displayCharCount={false}
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
                      {`Tick here to receive our marketing e-shot newsletter. You'll
                  get all the latest industry news and offers from Yehaww. You
                  can unsubscribe from this at any time`}
                    </p>
                  </div>
                </div>
                <AuthButton {...{ isSubmitting, router, dispatch, setError, type: "employer" }} />
              </form>
            </div>
          </Container>
        </div>
      </GoogleOAuthProvider>
    </>
  );
};

export default EmployeeForm;
