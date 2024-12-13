/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";

import Button from "components/button";
import TextArea from "components/textarea";
import Container from "components/container";

import style from "./comment.module.scss";
import BorderForm from "components/border-form";

const CommentSection = ({ errors, register, handleNotVerified, loadingSubmit }) => {
  const { pathname } = useRouter();
  const verified = pathname === "/verified-reference";

  return (
    <>
      <h1 className={style.form_container}>Comments</h1>
      <BorderForm
        className={style.borderForm}
        title={verified ? "Candidate Performance:" : "Please Rank This Candidate Performance: "}
      >
        <div style={{ paddingTop: "20px" }}>
          <TextArea
            name={"comment"}
            register={register}
            placeholder="Write here"
            disabled={verified}
            errorMessage={errors?.comment?.message}
            displayCharCount={false}
          />
        </div>
      </BorderForm>
      {!verified && (
        <div className={style.innerFlex}>
          <Button title="Confirm" type="submit" isLoading={loadingSubmit === "Confirm"} />
          <Button
            title="Decline"
            className={style.btn}
            handleClick={handleNotVerified}
            isLoading={loadingSubmit === "Decline"}
          />
        </div>
      )}
    </>
  );
};

export default CommentSection;
