import React from "react";
import Image from "next/image";

import Input from "components/input";
import Button from "components/button";
import DatePicker from "components/datepicker";
import { useAddCertification } from "./helper";
import BorderForm from "components/border-form";
import docu from "public/assets/imgs/document-preview.webp";
import docc from "public/assets/imgs/document-preview.webp";

import style from "./addCertificate.module.scss";

const AddCertification = ({
  submitRef,
  resetForm,
  isLoading,
  setListArr,
  setResetData,
  setIsLoading,
  isSubmitting,
  setDisableSave,
  watchCertificates,
  updateCertification,
  onSubmitCertificates,
  setUpdateCertification,
}) => {
  const { register, handleCancel, handleSubmit, submit, control, errors, watch } =
    useAddCertification({
      submitRef,
      resetForm,
      setListArr,
      setResetData,
      setIsLoading,
      setDisableSave,
      watchCertificates,
      updateCertification,
      onSubmitCertificates,
      setUpdateCertification,
    });

  const isUpdate = Object.keys(updateCertification).length;

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <BorderForm
          title={isUpdate ? "Update Diploma or Certificate" : "Add Diploma or Certificate"}
          className={style.borderForm}
        >
          <div className={style.formWrapper}>
            <p className={style.note}>Please could you provide evidence of your certifications.</p>
            <div className={style.gridTwo}>
              <Input
                star="*"
                name="title"
                register={register}
                label="Certificate Title"
                errorMessage={errors?.title?.message}
              />
              <Input
                star="*"
                name="issuedBy"
                label="Issued by"
                register={register}
                errorMessage={errors?.issuedBy?.message}
              />
              <DatePicker
                id="3"
                star="*"
                name="issueDate"
                control={control}
                label="Date Issued"
                errorMessage={errors?.issueDate?.message}
              />
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <Input
                  star="*"
                  type="file"
                  name="file"
                  label="File"
                  register={register}
                  className={style.input}
                  accept="application/pdf"
                  errorMessage={errors?.file?.message}
                />
                {watch("url") ? (
                  <a href={updateCertification.url} target={"_blank"} className={style.file}>
                    <div className={style.file}>
                      <Image src={docu} alt="document" />
                    </div>
                  </a>
                ) : watch("file")?.length ? (
                  <div className={style.file}>
                    <Image src={docc} alt="document" />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <Button
              type={"submit"}
              className={style.btnAddCertification}
              isLoading={isSubmitting || isLoading}
              loaderClass={style.addCertificationLoaderClass}
              title={isUpdate ? "Update Certificate" : "Add New Certificate"}
            />
            {isUpdate ? (
              <Button
                type="button"
                title="Cancel"
                handleClick={handleCancel}
                className={style.formBtnCancel}
              />
            ) : (
              ""
            )}
          </div>
        </BorderForm>
      </form>
    </>
  );
};

export default AddCertification;
