/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

import ActivePostFilter from "./filter-section";
import CandidatesTab from "./candidates-tabs";
import Container from "components/container";

import useFindResult from "helpers/find-candidate-helper";

import style from "styles/find-result.module.scss";
import { useSelector } from "react-redux";

const ActivePostResult = () => {
  const {
    page,
    reset,
    token,
    router,
    review,
    active,
    setPage,
    setValue,
    pageSize,
    onSubmit,
    register,
    watch,
    setReview,
    getValues,
    setActive,
    candidates,
    checkBoxArr,
    clearErrors,
    handleSubmit,
    getCandidates,
    candidateType,
    initialFilters,
    setCandidateType,
    multiSelectFilters,
    errors,
  } = useFindResult({ appliedCandidates: true });

  const [tabActive, setTabActive] = useState(0);
  const { user } = useSelector((state) => state.app);

  return (
    <>
      <Head>
        <title>Candidates - Yehaww</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="\assets\imgs\logo.webp" />
      </Head>
      <div className={style.mainWrapper} style={{ minHeight: "auto" }}>
        {/* errorMessage */}

        {user?.subscriptionStatus && user?.subscriptionStatus !== "active" && (
          <div className={style.infoWrapper}>
            <p className={style.form_title}>
              {" "}
              <FontAwesomeIcon className={style.icon6} icon={faLock} width={15} height={15} />
              Subscribe to the Yehaww Connect account.
            </p>
            <p className={style.sub_title}>
              Get your subscription today and get access to unlimited contact details of all the
              talented people in our data base.
              <br />
              For more details about our subscription options{" "}
              <Link href="/subscription"> Click Here</Link>
            </p>
          </div>
        )}
        {/* filter-section */}
        <ActivePostFilter
          reset={reset}
          router={router}
          review={review}
          setValue={setValue}
          onSubmit={onSubmit}
          register={register}
          setReview={setReview}
          getValues={getValues}
          checkBoxArr={checkBoxArr}
          handleSubmit={handleSubmit}
          watch={watch}
          initialFilters={initialFilters}
          multiSelectFilters={multiSelectFilters}
          clearErrors={clearErrors}
          errors={errors}
        />
        <CandidatesTab
          page={page}
          token={token}
          active={active}
          setPage={setPage}
          pageSize={pageSize}
          tabActive={tabActive}
          setActive={setActive}
          candidates={candidates}
          setTabActive={setTabActive}
          getCandidates={getCandidates}
          candidateType={candidateType}
          setCandidateType={setCandidateType}
        />
      </div>
    </>
  );
};

export default ActivePostResult;
