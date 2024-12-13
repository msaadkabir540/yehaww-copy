import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";

import Modal from "components/modal";
import Input from "components/input";
import Button from "components/button";

import { forgetPass } from "api-services/auth";

import crossIcon from "public/assets/icons/cross-black.svg";
import style from "./index.module.scss";

const ForgetPasswordModal = ({ forgetModal, setForgetModal }) => {
  const {
    reset,
    register,
    setError,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm();

  const onSubmit = (data) => {
    forgetPass({ data, setError, handleClose });
  };

  const handleClose = () => {
    setForgetModal(false);
  };

  useEffect(() => {
    reset({ email: "" });
  }, [forgetModal]);

  return (
    <>
      <Modal open={forgetModal} handleClose={handleClose}>
        <div className={style.forgetPassModalMain}>
          <div className={style.forgetPassModalHeader}>
            <h5>Forget Password</h5>
            <div className={style.img}>
              <Image src={crossIcon} width={20} alt="cross" onClick={handleClose} />
            </div>
          </div>
          <div className={style.forgetPassModalBody}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                star="*"
                label="Enter Your Email"
                type="text"
                name="email"
                register={register}
                className={style.email}
                errorMessage={errors?.email?.message}
              />
              <div className={style.submitDiv}>
                <Button
                  title="Reset Password"
                  className={style.button}
                  isLoading={isSubmitting}
                  loaderClass={style.btnLoader}
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ForgetPasswordModal;
