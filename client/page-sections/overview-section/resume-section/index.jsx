import React from "react";
import Image from "next/image";
import Link from "next/link";

import Button from "components/button";
import Input from "components/input";

import { useResume } from "./helper";

import doc from "public/assets/imgs/document-preview.webp";
import style from "./resume.module.scss";

const ResumeSection = () => {
  const { handleSubmit, register, submit, deleteResume, resData, isLoading, errors } = useResume();

  return (
    <div className={style.form_container}>
      <h5 className={style.heading}>CV | Resume</h5>
      <p className={style.referenceNote}>
        To update your CV simply upload a new document and this will replace the existing CV,
        alternatively delete the existing one using the button below.
      </p>
      <form onSubmit={handleSubmit(submit)}>
        <Input
          type={"file"}
          name={"file"}
          register={register}
          errorMessage={errors?.file?.message}
          label={"Update CV"}
          className={style.uploadInput}
          accept="application/pdf"
        />
        <p className={style.referenceNote1}>File size limit is 3MB. File must be in PDF format.</p>
        {resData.resume && (
          <div className={style.docPreview}>
            <Link href={resData.resume}>
              <a target={"_blank"} download>
                <div className={style.img}>
                  <Image src={doc} width={85} height={85} alt="file icon" />
                </div>
              </a>
            </Link>
            <Button
              title={"Delete"}
              type={"button"}
              handleClick={deleteResume}
              className={style.btnDelete}
            />
          </div>
        )}
        <div className={style.buttonWrapper}>
          <Button
            title={"Save"}
            type={"submit"}
            className={style.btnSave}
            loaderClass={style.loaderClass}
            isLoading={isLoading}
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

export default ResumeSection;
