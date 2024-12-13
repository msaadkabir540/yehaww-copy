import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import Input from "components/input";
import Button from "components/button";

import { changePassword } from "api-services/auth";

import style from "./my-profile.module.scss";
import BorderForm from "components/border-form";

const ChangePassword = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    reset,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmitChangePassword = async (data) => {
    changePassword({
      data,
      setLoading,
      router,
      setError,
      reset,
    });
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <>
      <BorderForm title={"Change Password"} className={style.borderForm}>
        <form onSubmit={handleSubmit(onSubmitChangePassword)}>
          <Input
            star="*"
            placeholder={"password"}
            label="New Password"
            type={passwordVisible ? "text" : "password"}
            name="newPassword"
            register={register}
            errorMessage={errors?.newPassword?.message}
            onClick={() => setPasswordVisible(!passwordVisible)}
            icon={`/assets/icons/eye-${passwordVisible ? "show" : "hide"}.svg`}
          />
          <Button
            title="Change Password"
            className={style.btn1}
            type={"submit"}
            isLoading={loading}
          />
        </form>
      </BorderForm>
    </>
  );
};

export default ChangePassword;
