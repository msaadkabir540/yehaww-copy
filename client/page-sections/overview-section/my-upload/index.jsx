import React from "react";
import Link from "next/link";

import Input from "components/input";
import Button from "components/button";
import BorderForm from "components/border-form";

import { uploadFileInput, useMyUpload } from "./helper";

import style from "./upload.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";

const UploadSection = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    setPreview,
    submit,
    setValue,
    resData,
    deleteUpload,
    isLoading,
    errors,
    preview,
    imageWatch,
  } = useMyUpload();

  return (
    <div className={style.form_container}>
      <form onSubmit={handleSubmit(submit)}>
        <div className={style.formWrapper}>
          <p className={style.referenceNote}>
            Depending on your Internet connection,{" "}
            <span className={style.boldText}>
              uploading images & documents may take some time - please be patient!
            </span>
          </p>
          <p className={style.referenceNote}>
            If you are experiencing difficulties, we recommend you upload one file at a time,
            starting with your main photo .webp. To edit your main photo please visit{" "}
            <Link href={"https://picresize.com/"} className={style.linkTag}>
              <a className={style.linkTag}>picresize.com</a>
            </Link>
          </p>
          <p className={style.referenceNote}>
            Still struggling to upload your files?{" "}
            <Link href={"/contact-us"} className={style.linkTag}>
              <a className={style.linkTag}>Click here</a>
            </Link>
          </p>
          <p className={style.referenceNote}>
            <span className={style.boldText}>Please note: </span>
            File size limit is 3MB. Main photo must be in .webp format only. All other uploads must
            be in either .doc, .pdf or .webp format.
          </p>
          <div className={style.innerWrapper}>
            {uploadFileInput.map(({ title, label, inputName, accept, infoText }, index) => (
              <BorderForm title={title} key={index} className={style.borderForm}>
                <Input
                  type={"file"}
                  label={label}
                  name={inputName}
                  register={register}
                  errorMessage={errors[inputName]?.message}
                  className={style.uploadInput}
                  accept={accept}
                  infoText={infoText}
                />
                {resData?.uploads && resData?.uploads[inputName] ? (
                  <div className={style.docPreview}>
                    <a href={resData?.uploads[inputName]} target={"_blank"} download>
                      <Image
                        src={
                          inputName === "partnerCV" ||
                          inputName === "video" ||
                          inputName === "additionalFiles"
                            ? { preview }
                            : resData?.uploads[inputName]
                        }
                        width={85}
                        height={85}
                        alt="file icon"
                      />
                    </a>
                    <Button
                      title={"Delete"}
                      type={"button"}
                      handleClick={() => deleteUpload(resData?.uploads[inputName])}
                      className={style.btnDelete}
                    />
                  </div>
                ) : (
                  preview &&
                  inputName === "mainPhoto" && (
                    <div className={style.docPreview}>
                      <a href={preview} target={"_blank"} download>
                        <Image
                          src={inputName === "mainPhoto" ? preview : { preview }}
                          width={85}
                          height={85}
                          alt="file icon"
                        />
                      </a>
                      <Button
                        title={"Delete"}
                        type={"button"}
                        handleClick={() => {
                          setPreview();
                          setValue("mainPhoto", "");
                        }}
                        className={style.btnDelete}
                      />
                    </div>
                  )
                )}
              </BorderForm>
            ))}
          </div>
        </div>
        <div className={style.buttonWrapper}>
          <Button
            title={"Save"}
            type={"submit"}
            isLoading={isLoading}
            className={style.btnSave}
            loaderClass={style.loaderClass}
          />
          <a>
            <Button
              className={style.btnCancel}
              title="Cancel"
              handleClick={() => router.push("/profile-overview/profile")}
            />
          </a>
        </div>
      </form>
    </div>
  );
};

export default UploadSection;
