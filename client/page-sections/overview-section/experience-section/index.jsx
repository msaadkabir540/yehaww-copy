import React, { useRef } from "react";
import Image from "next/image";

import BorderForm from "components/border-form";
import AddExperience from "./add-experience";
import Select from "components/select";
import Button from "components/button";

import { useExperience } from "./helper";

import style from "./experience.module.scss";
import delIcon from "public/assets/table-del.svg";
import editIcon from "public/assets/table-edit.svg";
import noExperience from "public/assets/icons/noExperience.svg";
import Tabs from "components/tabs";
import LevelExperience from "./level-experience";

const ExperienceSection = () => {
  const {
    append,
    remove,
    watch,
    errors,
    register,
    setValue,
    onSubmit,
    modalOpen,
    durations,
    clearErrors,
    isSubmitting,
    setModalOpen,
    handleSubmit,
    setSubmitBtn,
    setExperiences,
    experienceWatch,
    experienceTypes,
    experiencesFields,
    calculateDuration,
    setExperienceWatch,
    updateExperienceData,
    experienceLevelFields,
    experienceLevelOptions,
    setUpdateExperienceData,
    generalExperienceFields,
  } = useExperience();
  const submitRef = useRef();
  const errorsRef = useRef();

  return (
    <div className={style.form_container}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!experienceWatch) {
            clearErrors();
            handleSubmit(onSubmit)(e);
          } else {
            submitRef.current();
          }
        }}
        id={"mainForm"}
      >
        <div className={style.addExperience}>
          <BorderForm
            button
            btnDiv={style.btnDiv}
            btnClass={style.btnClass}
            className={style.borderForm}
            title={"Detailed Experience"}
            titleClass={style.titleClass}
            handleClick={() => setModalOpen(true)}
          >
            {experiencesFields?.length > 0 ? (
              <div className={style.tableWidth}>
                <div className={style.widthClass}>
                  <div className={style.tableHead}>
                    <p style={{ flexBasis: "350px" }}>Start Date - End Date</p>
                    <p style={{ flexBasis: "200px" }}>Company Name</p>
                    <p style={{ flexBasis: "100px" }}>Size</p>
                    <p style={{ flexBasis: "200px" }}>Total Horses</p>
                    <p style={{ flexBasis: "100px" }}>Level</p>
                    <p style={{ flexBasis: "150px" }}>Position</p>
                    <p style={{ flexBasis: "350px" }}>Description</p>
                    <p style={{ flexBasis: "150px" }}>Action</p>
                  </div>
                  <div className={style.tableBody}>
                    {experiencesFields?.map((experience, index) => {
                      const {
                        _id,
                        endDate,
                        duration,
                        startDate,
                        description,
                        positionRole,
                        nameOfCompany,
                        sizeOfCompany,
                        numberOfHorses,
                        levelOfOperation,
                      } = calculateDuration(experience);

                      return (
                        <>
                          <div className={style.tableRow} key={index}>
                            <p style={{ flexBasis: "350px" }}>{`${startDate} - ${
                              endDate ? endDate : "Present"
                            } ${duration}`}</p>
                            <p style={{ flexBasis: "200px" }}>{nameOfCompany}</p>
                            <p style={{ flexBasis: "100px" }}>{sizeOfCompany}</p>
                            <p style={{ flexBasis: "200px" }}>{numberOfHorses}</p>
                            <p style={{ flexBasis: "100px" }}>{levelOfOperation}</p>
                            <p style={{ flexBasis: "150px" }}>{positionRole}</p>
                            <p style={{ flexBasis: "350px" }}>{description}</p>
                            <p style={{ flexBasis: "150px" }}>
                              {" "}
                              <div className={style.btnWrapper}>
                                <div className={style.img}>
                                  <Image
                                    src={editIcon}
                                    alt="editIcon"
                                    onClick={() => {
                                      remove(index);
                                      setModalOpen(true);
                                      setUpdateExperienceData(experiencesFields[index]);
                                    }}
                                  />
                                </div>
                                <div className={style.img}>
                                  <Image
                                    src={delIcon}
                                    alt="delIcon"
                                    onClick={() => {
                                      remove(index);
                                    }}
                                  />
                                </div>
                              </div>
                            </p>
                          </div>

                          {/* Mobile Screen Data */}

                          <div className={style.table} key={index}>
                            <p style={{ fontSize: "14px", fontWeight: "400", marginBottom: "5px" }}>
                              {positionRole}
                            </p>
                            <p style={{ color: "#B29E85", fontSize: "16px", marginBottom: "5px" }}>
                              {nameOfCompany}
                            </p>
                            <div
                              style={{ fontSize: "12px", fontWeight: "400", marginBottom: "5px" }}
                            >
                              <span>{sizeOfCompany} Employees</span> |{" "}
                              <span>{numberOfHorses} Horses</span> | <span>{levelOfOperation}</span>
                            </div>
                            <p
                              style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                marginBottom: "5px",
                                fontStyle: "italic",
                              }}
                            >{`${startDate} - ${endDate ? endDate : "Present"} ${duration}`}</p>
                            <p style={{ fontSize: "12px", fontWeight: "400", marginBottom: "5px" }}>
                              {description}
                            </p>
                            <p style={{ flexBasis: "150px" }}>
                              {" "}
                              <div className={style.btnWrapper}>
                                <div className={style.img}>
                                  <Image
                                    src={editIcon}
                                    alt="editIcon"
                                    onClick={() => {
                                      remove(index);
                                      setModalOpen(true);
                                      setUpdateExperienceData(experiencesFields[index]);
                                    }}
                                  />
                                </div>
                                <div className={style.img}>
                                  <Image
                                    src={delIcon}
                                    alt="delIcon"
                                    onClick={() => {
                                      remove(index);
                                    }}
                                  />
                                </div>
                              </div>
                            </p>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className={style.noExperience}>
                <Image src={noExperience} alt="" />
                <p>No Experience Added</p>
              </div>
            )}
          </BorderForm>
        </div>
        <div className={style.addExperience}>
          <BorderForm
            btnDiv={style.btnDiv}
            className={style.borderForm}
            title={"General Experience"}
            titleClass={style.titleClass}
          >
            <div className={style.gridTwo}>
              <Tabs
                star="*"
                setValue={setValue}
                title="Professional Equine Experience"
                name={"experience.professionalEquineExperience.duration"}
                duration={watch("experience.professionalEquineExperience.duration")}
                errorMessage={errors?.experience?.professionalEquineExperience?.duration?.message}
              />
              {generalExperienceFields?.map(({ name, duration }, index) => {
                return (
                  <div key={index}>
                    <Tabs
                      title={name}
                      watch={watch}
                      setValue={setValue}
                      duration={duration}
                      name={`experience.generalExperience.${index}.duration`}
                    />
                  </div>
                );
              })}
            </div>
          </BorderForm>
        </div>
        <div className={style.addExperience}>
          <BorderForm
            btnDiv={style.btnDiv}
            className={style.borderForm}
            title={"Experience Level"}
            titleClass={style.titleClass}
          >
            <div className={style.gridFour}>
              {experienceLevelFields?.map(({ name, experienceLevel, experienceType }, index) => {
                return (
                  <div key={index}>
                    <LevelExperience
                      title={name}
                      setValue={setValue}
                      register={register}
                      type={experienceType}
                      expLevel={experienceLevel}
                      typeName={`experience.experienceLevel.${index}.experienceType`}
                      levelName={`experience.experienceLevel.${index}.experienceLevel`}
                    />
                  </div>
                );
              })}
            </div>
          </BorderForm>
        </div>
      </form>
      <AddExperience
        append={append}
        open={modalOpen}
        setValue={setValue}
        errorsRef={errorsRef}
        submitRef={submitRef}
        watchExperience={watch}
        handleClose={setModalOpen}
        setSubmitBtn={setSubmitBtn}
        onSubmitExperience={onSubmit}
        setExperiences={setExperiences}
        setExperienceWatch={setExperienceWatch}
        updateExperienceData={updateExperienceData}
        setUpdateExperienceData={setUpdateExperienceData}
        experiencesFieldsLength={experiencesFields.length}
      />
      <Button
        type={"submit"}
        title={"submit"}
        form={"mainForm"}
        isLoading={isSubmitting}
        handleClick={() => setSubmitBtn(true)}
      />
    </div>
  );
};

export default ExperienceSection;
