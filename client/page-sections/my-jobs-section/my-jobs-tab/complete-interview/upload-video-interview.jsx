import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import Input from "components/input";
import Button from "components/button";

import { uploadInterviewVideo } from "api-services/candidate";

import style from "./complete.module.scss";

const UploadVideoInterview = ({ getInterviewHandler }) => {
  const router = useRouter();
  const {
    reset,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({});

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("video", data.video[0]);
    formData.append("jobId", router.query.jobId);
    await uploadInterviewVideo({ data: formData });
    await getInterviewHandler();
  };

  return (
    <>
      <div className={style.mainClass}>
        <h6 className={style.uploadHeading}>Upload a Video Interview</h6>
        <p className={style.para}>
          Please record a short professional video (less than 3 minutes) using a mobile device or
          webcam to answer the questions provided.
        </p>
        <p className={style.para}>
          For top tips creating an video interview,please see <span>here</span> Good luck!
        </p>
        <p className={style.para}>
          Please note the video may takes a few minutes to upload,depending on the size.
        </p>
        <p className={style.para}>Take,record or upload video</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            type={"file"}
            name="video"
            register={register}
            className={style.uploadInput}
            accept="video/mp4,video/x-m4v,video/*"
          />
          <div className={style.btn}>
            <Button
              type="submit"
              title={"Upload Video"}
              isLoading={isSubmitting}
              styles={{ maxWidth: 130 }}
            />
            <Button
              title={"Remove Video"}
              handleClick={() => reset()}
              type="button"
              styles={{ maxWidth: 137 }}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default UploadVideoInterview;
