/* eslint-disable @next/next/no-img-element */
import RankSection from "./rank-section";
import Loading from "components/loading";
import Container from "components/container";
import CommentSection from "./comment-section";

import { useReferenceHelper } from "./helper";

import style from "./reference.module.scss";
import HeaderComponent from "components/header-compo";
import BorderForm from "components/border-form";

const ReferenceSection = () => {
  const {
    errors,
    control,
    loading,
    register,
    onSubmit,
    verified,
    handleSubmit,
    referenceData,
    loadingSubmit,
    handleNotVerified,
  } = useReferenceHelper();

  return (
    <>
      {loading ? (
        <Loading pageLoader={true} />
      ) : (
        <>
          <HeaderComponent heading={"Reference"} />
          <Container>
            <BorderForm title={verified ? "Verified Reference" : "Reference Confirmation"}>
              <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
                <RankSection control={control} referenceData={referenceData} verified={verified} />
                <CommentSection
                  errors={errors}
                  register={register}
                  loadingSubmit={loadingSubmit}
                  handleNotVerified={handleNotVerified}
                />
              </form>
            </BorderForm>
          </Container>
        </>
      )}
    </>
  );
};

export default ReferenceSection;
