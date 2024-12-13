import React, { useEffect } from "react";
import moment from "moment";

import Modal from "components/modal";
import Input from "components/input";
import Select from "components/select";
import Button from "components/button";
import TextArea from "components/textarea";
import Checkbox from "components/checkbox";
import DatePicker from "components/datepicker";

import { level_of_operation, useAddExperience } from "./helper";

import style from "./add-experience.module.scss";
import cross from "public/assets/icons/cancel.svg";
import upIcon from "public/assets/icons/upIcon.svg";
import downIcon from "public/assets/icons/downIcon.svg";

const AddExperience = ({
  open,
  append,
  setValue,
  errorsRef,
  submitRef,
  handleClose,
  setExperiences,
  watchExperience,
  setExperienceWatch,
  onSubmitExperience,
  updateExperienceData,
  setUpdateExperienceData,
  experiencesFieldsLength,
}) => {
  const { register, onSubmit, handleSubmit, control, errors, watch, reset, experienceInitial } =
    useAddExperience({
      append,
      handleClose,
      setExperiences,
      watchExperience,
      onSubmitExperience,
      updateExperienceData,
      setUpdateExperienceData,
    });

  const stillEmployed = watch("stillEmployed");

  useEffect(() => {
    submitRef.current = handleSubmit(onSubmit);
    let dataExists = false;
    Object.keys(watch()).forEach((x) => {
      const key = watch(x);
      if (key && key !== null) {
        dataExists = true;
      }
    });
    dataExists ? setExperienceWatch(true) : setExperienceWatch(false);
  }, [watch()]);

  useEffect(() => {
    errorsRef.current = errors;
  }, [errors]);

  return (
    <Modal
      open={open}
      cancelImg={cross}
      title={"Add Experience"}
      handleClose={handleClose}
      titleClass={style.titleClass}
      className={style.modalContainer}
    >
      <form onSubmit={handleSubmit(onSubmit)} id="experiences">
        {!watchExperience(`experience.noPreviousExperience`) && (
          <>
            <div className={style.gridTwo}>
              <Input
                star="*"
                label={"Position"}
                name={"positionRole"}
                register={register}
                placeholder={"Position / Role Name"}
                errorMessage={errors?.positionRole?.message}
              />
              <Input
                star="*"
                label={"Company Name"}
                name={"nameOfCompany"}
                register={register}
                placeholder={"Name of Rider, Farm or Company"}
                errorMessage={errors?.nameOfCompany?.message}
              />
              <Select
                star="*"
                label={"Level of operation"}
                name={"levelOfOperation"}
                register={register}
                errorMessage={errors?.levelOfOperation?.message}
              >
                <option value={""}> - - Please select an option - - </option>
                {level_of_operation.map((ele) => (
                  <option value={ele} key={ele}>
                    {ele}
                  </option>
                ))}
              </Select>
              <div className={style.grid}>
                <Input
                  star="*"
                  label={"Company Size"}
                  name={"sizeOfCompany"}
                  type={"number"}
                  register={register}
                  placeholder="0"
                  upIcon={upIcon}
                  downIcon={downIcon}
                  errorMessage={errors?.sizeOfCompany?.message}
                />
                <Input
                  star="*"
                  label={"No. of horses"}
                  name={"numberOfHorses"}
                  type={"number"}
                  register={register}
                  placeholder="0"
                  upIcon={upIcon}
                  downIcon={downIcon}
                  errorMessage={errors?.numberOfHorses?.message}
                />
              </div>
              <DatePicker
                star="*"
                label={"Start date"}
                control={control}
                name={"startDate"}
                maxDate={watch("endDate") || moment().toDate()}
                id={"1"}
                errorMessage={errors?.startDate?.message}
              />
              <div style={{ position: "relative", paddingBottom: "10px" }}>
                <DatePicker
                  star="*"
                  label={"End Date"}
                  name={"endDate"}
                  value={stillEmployed && ""}
                  id={"2"}
                  disabled={stillEmployed}
                  control={control}
                  minDate={watch("startDate") || null}
                  maxDate={moment().toDate()}
                  errorMessage={errors?.endDate?.message}
                />
                <div style={{ position: "absolute", top: "0", right: "0" }}>
                  <Checkbox label={"On Going"} name={"stillEmployed"} register={register} />
                </div>
              </div>
            </div>
            <TextArea
              star="*"
              label={"Description"}
              name={"description"}
              placeholder={"Write about your experience here (Max 300 Words)"}
              register={register}
              errorMessage={errors?.description?.message}
              displayCharCount={false}
            />
          </>
        )}
        <div style={{ padding: "10px 0" }}>
          {!experiencesFieldsLength && (
            <Checkbox
              label={"No Previous Job Experience"}
              name={`experience.noPreviousExperience`}
              checked={watchExperience(`experience.noPreviousExperience`)}
              handleChange={(e) => setValue("experience.noPreviousExperience", e.target.checked)}
              errorMessage={errors?.experience?.noPreviousExperience?.message}
            />
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          {!watchExperience(`experience.noPreviousExperience`) && (
            <Button
              className={style.btnCancel}
              type="submit"
              form="experiences"
              title={"Cancel"}
              handleClick={() => {
                handleClose(false);
                reset(experienceInitial);
                setUpdateExperienceData(false);
              }}
            />
          )}
          {!watchExperience(`experience.noPreviousExperience`) && (
            <Button
              className={style.btnAdd}
              type="submit"
              form="experiences"
              title={Object.keys(updateExperienceData).length ? "Update" : "Save"}
            />
          )}
        </div>
        {updateExperienceData !== false && watchExperience(`experience.noPreviousExperience`) && (
          <Button
            title={"cancel"}
            type={"button"}
            handleClick={() => {
              handleClose(false);
              reset(experienceInitial);
              setUpdateExperienceData(false);
            }}
            className={style.formBtnCancel}
          />
        )}
      </form>
    </Modal>
  );
};

export default AddExperience;
