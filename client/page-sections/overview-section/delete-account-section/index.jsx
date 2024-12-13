import React from "react";
import Link from "next/link";

import Input from "components/input";
import Button from "components/button";

import { useDeleteAccount } from "./helper";

import style from "./delete-profile.module.scss";
import DeleteActivePost from "page-sections/find-crew/active-post-form/delete-active-post";

const DeleteProfile = () => {
  const {
    errors,
    success,
    loading,
    register,
    onSubmit,
    deleteModal,
    handleDelete,
    handleSubmit,
    setDeleteModal,
    passwordVisible,
    setPasswordVisible,
  } = useDeleteAccount();

  return (
    <div className={style.form_container}>
      <h1>Are you sure you wish to delete your profile?</h1>
      <p className={style.content}>
        This will permanently delete all information linked with your account including any uploaded
        files and job applications. If you are sure you would like to proceed, please enter your
        password and click "Yes" to delete your profile. Otherwise, click "No" to return to your
        profile.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          star="*"
          name={"password"}
          register={register}
          placeholder={"password"}
          className={style.newPassword}
          errorMessage={errors?.password?.message}
          type={passwordVisible ? "text" : "password"}
          onClick={() => setPasswordVisible(!passwordVisible)}
          icon={`/assets/icons/eye-${passwordVisible ? "show" : "hide"}.svg`}
        />
        <div className={style.buttonWrapper}>
          <Button
            title={"Yes"}
            type={"submit"}
            isLoading={success}
            className={style.btnSave}
            loaderClass={style.loaderClass}
          />
          <Link href={"/profile-overview/profile"}>
            <a>
              <Button className={style.btnCancel} type={"button"} title={"No"} />
            </a>
          </Link>
        </div>
      </form>

      <DeleteActivePost
        loading={loading}
        delModal={deleteModal}
        setDelModal={setDeleteModal}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default DeleteProfile;
