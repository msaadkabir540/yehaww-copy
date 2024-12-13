/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import Button from "components/button";
import TextArea from "components/textarea";
import BorderForm from "components/border-form";

import { isOnlyWords } from "utils/helper";
import { useProfile } from "../../../page-sections/overview-section/profile/helper";

import { getJob, updateInterestedJob } from "api-services/employer";

import style from "./interested.module.scss";

const InterestedDetails = ({ jobData, setJobData }) => {
  const router = useRouter();
  const { user } = useSelector((state) => state.app);
  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const { userData } = useProfile();

  const onSubmit = async (data) => {
    if (data?.coverLetter?.trim().length === 0) {
      setError("coverLetter", { type: "custom", message: "Cover Letter is required" });
    } else {
      clearErrors("coverLetter");
      const isNumberEmailExist = isOnlyWords({ str: data?.coverLetter });
      if (isNumberEmailExist) {
        clearErrors("coverLetter");
        router.query?.id &&
          (await updateInterestedJob({
            body: { jobId: router.query.id, interested: true, coverLetter: data.coverLetter },
          }));
        await getJob({ id: router?.query?.id, setJobData });
      } else {
        setError("coverLetter", { type: "custom", message: "Email and Number not allowed" });
      }
    }
  };

  return (
    <div>
      {jobData?.interested ? (
        <BorderForm title={"Interest Confirmed"} className={style.borderForm}>
          <div className={style.right}>
            <p>
              Thanks. Now you've applied the employer will be able to see your profile and select
              their preferred candidate. There have currently been {jobData?.appliedCandidates}{" "}
              applicant(s) for this position.
            </p>
          </div>
        </BorderForm>
      ) : (
        user.type !== "employer" &&
        !jobData?.jobFilledStatus && (
          <>
            {user.type === "candidate" ? (
              <BorderForm title="Interested?" className={style.borderForm}>
                <form className={style.rightDiv} onSubmit={handleSubmit(onSubmit)}>
                  <p>To apply for this position simply select the I'm Interested button below.</p>
                  <p>Phone number email is not allowed to type below.</p>
                  <TextArea
                    name={"coverLetter"}
                    register={register}
                    placeholder={
                      "Please provide a cover letter here if you wish e.g. why do you think you're suitable for this role?"
                    }
                    errorMessage={errors?.coverLetter?.message}
                    displayCharCount={false}
                  />
                  <Button
                    title="I'm Interested"
                    type="submit"
                    isLoading={isSubmitting}
                    loaderClass={style.loading}
                  />
                </form>
              </BorderForm>
            ) : (
              <BorderForm title="Interested?" className={style.borderForm}>
                <div className={style.rightDiv}>
                  <p>Applying for this position is really simple, but you need to login first...</p>
                  <Link href="/login">
                    <a>
                      <Button title="Login to Apply" />
                    </a>
                  </Link>
                </div>
              </BorderForm>
            )}
          </>
        )
      )}
    </div>
  );
};

export default InterestedDetails;
