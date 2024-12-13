import { useRef } from "react";
import Link from "next/link";

import CertificationList from "./certification-list";
import AddCertification from "./add-certificates";
import BorderForm from "components/border-form";
import Button from "components/button";
import Select from "components/select";

import { educationList, useCertification } from "./helper";

import style from "./certificate.module.scss";

const CertificationSection = () => {
  const {
    watch,
    errors,
    submit,
    listArr,
    register,
    setIsSave,
    isLoading,
    resetData,
    handleEdit,
    setListArr,
    clearErrors,
    disableSave,
    setIsLoading,
    setResetData,
    handleSubmit,
    isSubmitting,
    setDisableSave,
    updateCertification,
    setUpdateCertification,
  } = useCertification();

  const submitRef = useRef();

  return (
    <div className={style.form_container}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!disableSave) {
            clearErrors();
            handleSubmit(submit)(e);
          } else {
            submitRef.current();
          }
        }}
        id={"mainForm"}
      >
        <BorderForm
          title={"Education"}
          className={`${style.borderForm} ${errors?.education?.message ? style.education : ""}`}
          titleClass={`${errors?.education?.message ? style.errorMessage : ""}`}
        >
          <div className={style.formInputWrapper}>
            <Select
              star="*"
              name={"education"}
              label="Degree"
              register={register}
              errorMessage={errors?.education?.message}
            >
              <option value={""}>Select Education</option>
              {educationList?.map((ele) => (
                <option value={ele} key={ele}>
                  {ele}
                </option>
              ))}
            </Select>
          </div>
        </BorderForm>
      </form>
      <AddCertification
        submitRef={submitRef}
        isLoading={isLoading}
        resetForm={resetData}
        setListArr={setListArr}
        watchCertificates={watch}
        setIsLoading={setIsLoading}
        setResetData={setResetData}
        isSubmitting={isSubmitting}
        onSubmitCertificates={submit}
        setDisableSave={setDisableSave}
        updateCertification={updateCertification}
        setUpdateCertification={setUpdateCertification}
      />
      {listArr.length > 0 && (
        <CertificationList listArr={listArr} setListArr={setListArr} handleEdit={handleEdit} />
      )}
      <div className={style.buttonWrapper}>
        <Button
          title={"Save"}
          type={"submit"}
          form={"mainForm"}
          // disabled={disableSave}
          className={style.btnSave}
          loaderClass={style.loaderClass}
          handleClick={() => setIsSave(true)}
          isLoading={isLoading || isSubmitting}
        />
        <Link href={"/profile-overview/profile"}>
          <a>
            <Button className={style.btnCancel} title="Cancel" />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default CertificationSection;
