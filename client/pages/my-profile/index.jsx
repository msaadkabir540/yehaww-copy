import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import Input from "components/input";
import Button from "components/button";
import TextArea from "components/textarea";
import Container from "components/container";
import PhonePicker from "components/phone-input";
import EmailAlert from "page-sections/my-profile/email-alert";
import DeleteAccount from "page-sections/my-profile/delete-account";
import ChangePassword from "page-sections/my-profile/change-password";
import ShortListCandidate from "page-sections/my-profile/shortlist-candidate";

import { convertBase64 } from "utils/helper";
import { getUserByToken } from "api-services/auth";
import { updateEmployerPersonalDetails } from "api-services/employer";

import style from "styles/my-profile.module.scss";
import Image from "next/image";
import BorderForm from "components/border-form";
import BreadCrumb from "components/bread-crumb";
import HeaderComponent from "components/header-compo";

const MyProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.app);

  const [alert, setAlert] = useState();
  const [shortList, setShortList] = useState();
  const [showPic, setShowPic] = useState(false);
  const [emailError, setEmailError] = useState("");

  const {
    watch,
    reset,
    control,
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const effect = async () => {
    axios.defaults.headers.Authorization = localStorage.getItem("token") || token;
    await getUserByToken({ router, dispatch });
  };

  useEffect(() => {
    effect();
  }, []);

  useEffect(() => {
    setAlert(user?.employer?.emailAlerts);
    setShortList(user?.employer?.shortListedCandidates);
    if (user.employer?.personalDetails) {
      user?.employer?.personalDetails?.profilePicture && setShowPic(true);
      reset({
        firstName: user?.employer?.personalDetails?.firstName,
        lastName: user?.employer?.personalDetails?.lastName,
        email: user?.employer?.personalDetails?.email,
        companyName: user?.employer?.personalDetails?.companyName,
        businessAddress: user?.employer?.personalDetails?.businessAddress,
        phoneNumber: user?.employer?.personalDetails?.phoneNumber,
        profilePicture: user?.employer?.personalDetails?.profilePicture,
      });
    }
  }, [user]);

  const onSubmitPersonalInformation = async (data) => {
    if (!data?.profilePicture?.includes?.("https") && data?.profilePicture?.[0]) {
      data.profilePicture = await convertBase64(data.profilePicture[0]);
    } else {
      if (!showPic) {
        data.profilePicture = "";
      } else {
        delete data.profilePicture;
      }
    }

    !data.phoneNumber && delete data.phoneNumber;

    const res = await updateEmployerPersonalDetails({
      personalDetails: { ...data },
      setError,
    });
    if (res) {
      await getUserByToken({ dispatch, router });
    }
  };

  useEffect(() => {
    if (watch("email") === "") {
      setEmailError("Email is not allowed to be empty");
    } else {
      setEmailError("");
    }
  }, [watch("email")]);

  return (
    <>
      <Head>
        <title>My Profile - Yehaww</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="\assets\imgs\logo.webp" />
      </Head>
      <div
        style={{
          minHeight: "calc(100vh - 206px)",
        }}
      >
        <HeaderComponent heading={"My Profile"} />
        <Container>
          <BreadCrumb data={navLinks} className={style.headingDiv} />
        </Container>
        <Container>
          <BorderForm title="Personal Details">
            <form
              onSubmit={(e) => {
                clearErrors();
                handleSubmit(onSubmitPersonalInformation)(e);
              }}
            >
              <div className={style.grid}>
                <Input
                  star="*"
                  type="text"
                  name="firstName"
                  register={register}
                  label={"First Name"}
                  placeholder={"Forename"}
                  errorMessage={errors?.personalDetails?.firstName?.message}
                />
                <Input
                  star="*"
                  type="text"
                  name="lastName"
                  label={"Last Name"}
                  register={register}
                  placeholder={"Surname"}
                  errorMessage={errors?.personalDetails?.lastName?.message}
                />
                <PhonePicker
                  control={control}
                  name={"phoneNumber"}
                  label={"Phone Number"}
                  errorMessage={errors?.personalDetails?.phoneNumber?.message}
                />
                <Input
                  star="*"
                  type="email"
                  name="email"
                  label="Email"
                  register={register}
                  placeholder={"Email"}
                  errorMessage={emailError || errors?.personalDetails?.email?.message}
                />
                <div className={style.profile}>
                  <Input
                    type={"file"}
                    register={register}
                    name={"profilePicture"}
                    label={"Profile Picture"}
                    accept="image/png, image/jpeg, image/jpg"
                    errorMessage={errors?.personalDetails?.profilePicture?.message}
                  />
                  {user?.employer?.personalDetails?.profilePicture && showPic && (
                    <>
                      <div style={{ marginTop: "20px" }}>
                        <Image
                          width={150}
                          height={150}
                          alt="profile-pic"
                          className={style.profilePic}
                          src={user?.employer?.personalDetails?.profilePicture}
                        />
                      </div>
                      <div style={{ marginTop: "10px" }}>
                        <Button
                          title="Delete Picture"
                          className={style.deleteBtn}
                          disabled={emailError ? true : false}
                          handleClick={() => setShowPic(false)}
                        />
                      </div>
                    </>
                  )}
                </div>
                <TextArea
                  star="*"
                  register={register}
                  name="businessAddress"
                  label="Business Address"
                  placeholder={"Write text here"}
                  errorMessage={errors?.personalDetails?.businessAddress?.message}
                  displayCharCount={false}
                />
              </div>
              <Input
                star="*"
                name="companyName"
                register={register}
                label="Company Name"
                className={style.field}
                placeholder={"Company Name"}
                errorMessage={errors?.personalDetails?.companyName?.message}
              />
              <Button
                title="Save"
                type={"submit"}
                className={style.btn}
                isLoading={isSubmitting}
                disabled={emailError ? true : false}
              />
            </form>
            <ChangePassword />
            <EmailAlert alert={alert} setAlert={setAlert} />
            <ShortListCandidate shortList={shortList} setShortList={setShortList} />
            <DeleteAccount />
          </BorderForm>
        </Container>
      </div>
    </>
  );
};

export default MyProfile;

const navLinks = [{ title: "Profile", path: "/profile-overview/profile", show: true }];
