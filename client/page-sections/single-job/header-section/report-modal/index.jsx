import React from "react";

import * as yup from "yup";
import Image from "next/image";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";

import Modal from "components/modal";
import Input from "components/input";
import Button from "components/button";
import TextArea from "components/textarea";

import fb from "public/assets/icons/fb.svg";
import cross from "public/assets/icons/close.svg";
import insta from "public/assets/icons/insta.svg";
import linkdln from "public/assets/icons/linkedin.svg";
import clip from "public/assets/icons/attach-file.svg";

import { convertBase64 } from "utils/helper";
import { addReportAJob } from "api-services/candidate";
import createNotification from "common/create-notification";

import style from "./report.module.scss";

const ReportModal = ({ reportModal, setReportModal }) => {
  const router = useRouter();
  const { user } = useSelector((state) => state.app);

  const {
    watch,
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      if (user?.type === "candidate") {
        const evidenceName = data?.evidence?.[0]?.name;

        if (!data?.evidence?.includes?.("https") && data?.evidence?.[0]) {
          data.evidence = await convertBase64(data.evidence[0]);
        } else {
          delete data.evidence;
        }

        const formData = {
          ...data,
          evidenceName,
          jobId: router?.query?.id,
          candidateId: user?.candidateId,
        };
        const res = await addReportAJob({ formData });
        if (res) {
          reset();
          setReportModal(false);
        }
      } else {
        createNotification("error", "Only Candidates can report a Job!");
        setReportModal(false);
      }
    } catch (error) {
      createNotification("error", "Failing to report a Job!");
    }
  };

  return (
    <Modal
      cancelImg={cross}
      open={reportModal}
      title={"Report this Job"}
      titleClass={style.titleClass}
      className={style.reportModal}
      handleClose={() => {
        setReportModal(false);
        reset();
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <h4 className={style.label}>Reason for Reporting</h4>

          <div className={style.btnFlex}>
            {buttonOptions?.map((btn) => {
              const activeOption = watch("reason") === btn;
              return (
                <Button
                  title={btn}
                  type="button"
                  handleClick={() => setValue("reason", btn)}
                  className={activeOption ? style.activeBtn : style.optionButton}
                />
              );
            })}
          </div>
          {errors?.reason?.message && (
            <span className={style.errorMessage}>{errors?.reason?.message}</span>
          )}
          <TextArea
            register={register}
            name={"description"}
            className={style.input}
            displayCharCount={false}
            label={"Detailed Description"}
            errorMessage={errors?.description?.message}
            placeholder={"Please provide detailed information"}
          />
          <div className={style.evidenceWrapper}>
            <Input
              icon={clip}
              type={"file"}
              isEvidence={true}
              name={"evidence"}
              id={"evidence_id"}
              register={register}
              iconClass={style.iconClass}
              label={"Evidence (if any)"}
              className={style.evidenceInput}
              placeholder={"Attach Evidence"}
              errorMessage={errors?.evidence?.message}
              onClick={() => document.getElementById("evidence_id").click()}
              accept={
                "image/png, image/jpeg, image/jpg, video/mp4, video/x-m4v, video/quicktime, video/*"
              }
            />
          </div>
          <div className={style.footer}>
            <div className={style.contactDiv}>
              <p>Contact us on</p>
              <div style={{ gap: "10px", marginTop: "8px" }}>
                <a
                  target="_blank"
                  style={{ paddingRight: "10px" }}
                  href={"https://www.facebook.com/Yehaww-100714195979410"}
                >
                  <Image src={fb} width={20} height={20} />
                </a>
                <a
                  target="_blank"
                  style={{ paddingRight: "10px" }}
                  href={"https://www.instagram.com/yehaww_com/"}
                >
                  <Image src={insta} width={20} height={20} />
                </a>
                <a
                  target="_blank"
                  style={{ paddingRight: "10px" }}
                  href={"https://www.linkedin.com/company/yehaww/"}
                >
                  <Image src={linkdln} width={20} height={20} />
                </a>
              </div>
            </div>
            <Button
              type="submit"
              title={"Submit"}
              isLoading={isSubmitting}
              loaderClass={style.loaderClass}
              className={`${style.activeBtn} ${style.submitBtn}`}
            />
          </div>
        </>
      </form>
    </Modal>
  );
};

export default ReportModal;

const schema = yup.object().shape({
  reason: yup.string().required("Reason is required"),
  description: yup.string().required("Description is required"),
  evidence: yup
    .mixed()
    .optional()
    .test("fileSize", "Evidence size should not exceed 5MB", (file) => {
      return file[0] ? file[0]?.size <= 5000000 : true;
    }),
});

const buttonOptions = [
  "Fake Job Posting",
  "Scam/Fraudulent",
  "Difficult to use",
  "Misleading Information",
  "Offensive Content",
  "Duplicate Posting",
  "Others",
];
