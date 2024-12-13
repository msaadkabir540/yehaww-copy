import Image from "next/image";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import Modal from "components/modal";
import Button from "components/button";
import TextArea from "components/textarea";

import { isOnlyWords } from "utils/helper";

import crossIcon from "public/assets/icons/cross-black.svg";

import style from "./index.module.scss";

const InterestedModal = ({ open, setOpen, handleInterested, loader }) => {
  const {
    reset,
    setError,
    register,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const coverLetter = data.coverLetter;
    if (coverLetter?.trim().length === 0) {
      setError("coverLetter", { type: "custom", message: "Cover Letter is required" });
    } else {
      const isNumberEmailExist = isOnlyWords({ str: data?.coverLetter });
      if (isNumberEmailExist) {
        clearErrors("coverLetter");
        handleInterested(open, true, coverLetter);
      } else {
        setError("coverLetter", { type: "custom", message: "Email and Number not allowed" });
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    reset();
  }, [open]);

  return (
    <>
      <Modal open={open} handleClose={handleClose}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ marginBottom: "20px" }}>Interested?</h2>
          <div className={style.img}>
            <Image src={crossIcon} width={20} alt="cross" onClick={handleClose} />
          </div>
        </div>
        <form className={style.rightDiv} onSubmit={handleSubmit(onSubmit)}>
          <p>To apply for this position simply select the I'm Interested button below.</p>
          <p>Phone number email is not allowed to type below.</p>
          <TextArea
            register={register}
            name={"coverLetter"}
            displayCharCount={false}
            errorMessage={errors?.coverLetter?.message}
            placeholder={
              "Please provide a cover letter here if you wish e.g. why do you think you're suitable for this role?"
            }
          />
          <Button type="submit" title="I'm Interested" isLoading={loader} />
        </form>
      </Modal>
    </>
  );
};

export default InterestedModal;
