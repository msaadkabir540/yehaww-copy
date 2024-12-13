import React, { useState } from "react";
import Link from "next/link";

import Input from "components/input";
import Button from "components/button";

import { useChangePassword } from "./helper";

import style from "./change-password.module.scss";

const ChangePassword = () => {
  const { handleSubmit, onSubmit, errors, loading, register } = useChangePassword();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassVisible, setConfirmPassVisible] = useState(false);

  return (
    <div className={style.form_container}>
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          star="*"
          register={register}
          name={"newPassword"}
          label={"New Password"}
          className={style.newPassword}
          errorClass={style.errorMessage}
          errorMessage={errors?.newPassword?.message}
          type={passwordVisible ? "text" : "password"}
          onClick={() => setPasswordVisible(!passwordVisible)}
          icon={`/assets/icons/eye-${passwordVisible ? "show" : "hide"}.svg`}
        />
        <div style={{ marginTop: "20px" }}>
          <Input
            star="*"
            register={register}
            name={"confirmNewPassword"}
            className={style.newPassword}
            label={"Confirm New Password"}
            errorClass={style.errorMessage}
            type={confirmPassVisible ? "text" : "password"}
            errorMessage={errors?.confirmNewPassword?.message}
            onClick={() => setConfirmPassVisible(!confirmPassVisible)}
            icon={`/assets/icons/eye-${confirmPassVisible ? "show" : "hide"}.svg`}
          />
        </div>
        <div className={style.buttonWrapper}>
          <Button
            type={"submit"}
            isLoading={loading}
            title={"Change Password"}
            className={style.btnSave}
            loaderClass={style.loaderClass}
          />
          <Link href={"/profile-overview/profile"}>
            <a>
              <Button className={style.btnCancel} title="Cancel" />
            </a>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
