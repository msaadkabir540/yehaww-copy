import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { resetPasswordModal } from "api-services/auth";
import createNotification from "common/create-notification";
import Button from "components/button";
import Input from "components/input";
import Modal from "components/modal";

import crossIcon from "public/assets/icons/cross-black.svg";
import style from "./index.module.scss";
import Image from "next/image";

const ResetPasswordModal = ({ resetModal, setResetModal }) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const {
    reset,
    register,
    setError,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm();

  const [passwordVisible, setPasswordVisible] = useState(false);

  const onSubmit = async ({ password, confirmPassword }) => {
    const token = router?.query?.token;
    if (token) {
      try {
        const decodedToken = jwt.decode(token);
        if (decodedToken.exp < Date.now() / 1000) {
          setResetModal(false);
          createNotification("error", "Session Expired");
          return;
        } else if (password === confirmPassword) {
          setIsLoading(true);
          resetPasswordModal({
            body: { password, token: router?.query?.token, email: router?.query?.email },
            setError,
            setResetModal,
          });
          setIsLoading(false);
        } else {
          setError("confirmPassword", { message: "Password and Confirm Password Must Be Same" });
        }
      } catch (error) {
        console.log(error);
        return;
      }
    }
  };

  const handleClose = () => {
    setResetModal(false);
  };

  useEffect(() => {
    reset({ password: "", confirmPassword: "" });
  }, []);

  return (
    <Modal open={resetModal} handleClose={handleClose}>
      <div className={style.resetModalMain}>
        <div className={style.resetModalHeader}>
          <h5>Reset Password</h5>
          <div className={style.img}>
            <Image src={crossIcon} width={20} alt="cross" onClick={handleClose} />
          </div>
        </div>
        <div className={style.resetModalBody}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              star="*"
              name="password"
              register={register}
              label="Enter Password"
              className={style.email}
              errorClass={style.errorMessage}
              type={passwordVisible === "reset" ? "text" : "password"}
              errorMessage={errors?.confirmPassword?.message || errors?.password?.message}
              icon={`/assets/icons/eye-${passwordVisible === "reset" ? "show" : "hide"}.svg`}
              onClick={() => setPasswordVisible(passwordVisible === "reset" ? false : "reset")}
            />
            <Input
              star="*"
              label="Confirm Password"
              name="confirmPassword"
              className={style.email}
              register={register}
              errorClass={style.errorMessage}
              errorMessage={errors?.confirmPassword?.message}
              type={passwordVisible === "confirm" ? "text" : "password"}
              onClick={() => setPasswordVisible(passwordVisible === "confirm" ? false : "confirm")}
              icon={`/assets/icons/eye-${passwordVisible === "confirm" ? "show" : "hide"}.svg`}
            />
            <div className={style.submitDiv}>
              <Button
                type="submit"
                isLoading={isLoading}
                title="Reset Password"
                className={style.button}
                loaderClass={style.btnLoader}
              />
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ResetPasswordModal;
