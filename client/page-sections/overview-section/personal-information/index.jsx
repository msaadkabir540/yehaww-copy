import React, { Fragment, useState } from "react";
import moment from "moment";
import Link from "next/link";

import Input from "components/input";
import Badge from "components/badge";
import Button from "components/button";
import Select from "components/select";
import Checkbox from "components/checkbox";
import DatePicker from "components/datepicker";
import BorderForm from "components/border-form";
import PhonePicker from "components/phone-input";
import MultiSelect from "components/multi-select";
import SearchSelect from "components/search-select";
import MultiSelectGrouped from "components/multi-select-grouped";

import { languages, disciplines, country_list, visaOptions } from "utils/arrayHelper";
import { usePersonalInfo } from "./helper";

import style from "./personal-information.module.scss";
import { useSelector } from "react-redux";

const PersonalInformationSection = () => {
  const {
    watch,
    fields,
    errors,
    submit,
    control,
    resData,
    register,
    setValue,
    isLoading,
    clearErrors,
    handleSubmit,
    customHeight,
    verifyLoading,
    isAddPassport,
    groupedOptions,
    languageFields,
    handleAddPassport,
    handleAddLanguage,
    handleRemoveLanguage,
    handleVerifyPartnerEmail,
    handleCancelVerification,
  } = usePersonalInfo();

  const jobAlertError = errors?.personalInfo?.desiredPosition?.jobAlerts?.message;

  return (
    <form
      className={style.formWrapper}
      onSubmit={(e) => {
        clearErrors();
        handleSubmit(submit)(e);
      }}
    >
      <div className={style.mainWraper}>
        <h5 className={style.heading}>Contact Details</h5>
        <div className={style.grid}>
          <Input
            star="*"
            label={"First Name"}
            name={"personalInfo.contactDetail.firstName"}
            register={register}
            errorMessage={errors?.personalInfo?.contactDetail?.firstName?.message}
          />
          <Input
            star="*"
            label={"Last Name"}
            name={"personalInfo.contactDetail.lastName"}
            register={register}
            errorMessage={errors?.personalInfo?.contactDetail?.lastName?.message}
          />
          <Input
            star="*"
            label={"Email"}
            register={register}
            name={"personalInfo.contactDetail.email"}
            errorMessage={errors?.personalInfo?.contactDetail?.email?.message}
          />
          <PhonePicker
            name={"personalInfo.contactDetail.phoneNumber"}
            label={"Phone Number"}
            errorMessage={errors?.personalInfo?.contactDetail?.phoneNumber?.message}
            control={control}
          />
        </div>
      </div>

      <div className={style.mainWraper}>
        <h5 className={style.heading}>Desired Position</h5>
        <p className={style.desiredSub}>
          Please select two different positions you are looking for
        </p>
        <div className={style.grid}>
          <div>
            <MultiSelectGrouped
              star="*"
              label={"First Choice"}
              name={"personalInfo.desiredPosition.firstChoice"}
              options={groupedOptions}
              onChange={(e) => {
                setValue("personalInfo.desiredPosition.firstChoice", e.value);
                clearErrors("personalInfo.desiredPosition.firstChoice");
              }}
              watch={watch}
              isMulti={false}
              errorMessage={errors?.personalInfo?.desiredPosition?.firstChoice?.message}
              customStyle={{
                marginTop: "5px",
                border: "1px solid #C0C0C0",
              }}
            />
          </div>
          <div>
            <MultiSelectGrouped
              star="*"
              label={"Second Choice"}
              name={"personalInfo.desiredPosition.secondChoice"}
              options={groupedOptions}
              onChange={(e) => {
                setValue("personalInfo.desiredPosition.secondChoice", e.value);
                clearErrors("personalInfo.desiredPosition.secondChoice");
              }}
              watch={watch}
              isMulti={false}
              errorMessage={errors?.personalInfo?.desiredPosition?.secondChoice?.message}
              customStyle={{
                marginTop: "5px",
                border: "1px solid #C0C0C0",
              }}
            />
          </div>
        </div>
      </div>

      <div className={style.mainWraper}>
        <h5
          className={style.heading}
          style={{
            color: jobAlertError ? "#f24e4e" : "",
          }}
        >
          Job Alert
        </h5>
        <div className={style.grid}>
          <div>
            <MultiSelectGrouped
              label={"Position"}
              name={"personalInfo.desiredPosition.jobAlerts.positions"}
              options={groupedOptions}
              onChange={(e) => {
                setValue("personalInfo.desiredPosition.jobAlerts.positions", [
                  ...e.map((ele) => ele.value),
                ]);
                clearErrors("personalInfo.desiredPosition.jobAlerts.positions");
                clearErrors("personalInfo.desiredPosition.jobAlerts");
              }}
              watch={watch}
              errorMessage={
                jobAlertError ||
                errors?.personalInfo?.desiredPosition?.jobAlerts?.positions?.message
              }
              customStyle={{
                marginTop: "5px",
                border: "1px solid #C0C0C0",
                height: "100% !important",
                minHeight: "43px !important",
              }}
            />
            <p className={style.positionText}>
              Fill out what you’re interested in, get notified when position is available
            </p>
          </div>
          <div>
            <MultiSelect
              label={"Location"}
              name={"personalInfo.desiredPosition.jobAlerts.locations"}
              options={country_list}
              onChange={(e) => {
                setValue("personalInfo.desiredPosition.jobAlerts.locations", [
                  ...e.map((ele) => ele.value),
                ]);
                clearErrors("personalInfo.desiredPosition.jobAlerts.locations");
                clearErrors("personalInfo.desiredPosition.jobAlerts");
              }}
              watch={watch}
              errorMessage={
                jobAlertError ||
                errors?.personalInfo?.desiredPosition?.jobAlerts?.locations?.message
              }
              customStyle={{
                ...customHeight,
              }}
            />
          </div>

          <div>
            <MultiSelect
              label={"Employment Type"}
              name={"personalInfo.desiredPosition.jobAlerts.employmentTypes"}
              options={employmentTypes}
              onChange={(e) => {
                setValue("personalInfo.desiredPosition.jobAlerts.employmentTypes", [
                  ...e.map((ele) => ele.value),
                ]);
                clearErrors("personalInfo.desiredPosition.jobAlerts.employmentTypes");
                clearErrors("personalInfo.desiredPosition.jobAlerts");
              }}
              watch={watch}
              errorMessage={
                jobAlertError ||
                errors?.personalInfo?.desiredPosition?.jobAlerts?.employmentTypes?.message
              }
              customStyle={{
                ...customHeight,
              }}
            />
          </div>
          <div>
            <MultiSelect
              label={"Disciplines"}
              name={"personalInfo.desiredPosition.disciplines"}
              options={disciplines}
              onChange={(e) => {
                setValue("personalInfo.desiredPosition.disciplines", [
                  ...e.map((ele) => ele.value),
                ]);
                clearErrors("personalInfo.desiredPosition.disciplines");
              }}
              watch={watch}
              errorMessage={
                jobAlertError || errors?.personalInfo?.desiredPosition?.disciplines?.message
              }
              customStyle={{
                ...customHeight,
              }}
            />
          </div>
        </div>
      </div>

      <div className={style.mainWraper}>
        <h5 className={style.heading}>Personal Information</h5>
        <div className={style.grid}>
          <Select
            star="*"
            label={"Gender"}
            register={register}
            name={`personalInfo.personalInformation.gender`}
            errorMessage={errors?.personalInfo?.personalInformation?.gender?.message}
          >
            <option value={""}> - - Please select an option - - </option>
            <option value={"Male"}>Male</option>
            <option value={"Female"}>Female</option>
          </Select>
          <div>
            <MultiSelect
              star="*"
              label={"Nationality"}
              name={"personalInfo.personalInformation.nationality"}
              options={country_list}
              setValue={setValue}
              clearErrors={clearErrors}
              watch={watch}
              errorMessage={errors?.personalInfo?.personalInformation?.nationality?.message}
              customStyle={{
                ...customHeight,
              }}
            />
          </div>
          <div>
            <DatePicker
              star="*"
              control={control}
              id={"1"}
              label={"Date of Birth"}
              maxDate={moment().toDate()}
              name={`personalInfo.personalInformation.dateOfBirth`}
              errorMessage={errors?.personalInfo?.personalInformation?.dateOfBirth?.message}
            />
          </div>
          {personalInformationArr?.map(({ label, name, option, star }, index) => (
            <div key={index}>
              <Select
                star={star}
                label={label}
                register={register}
                name={`personalInfo.personalInformation[${name}]`}
                errorMessage={errors?.personalInfo?.personalInformation?.[name]?.message}
              >
                <option value={""}> - - Please select an option - - </option>
                {option?.map((ele) => (
                  <option value={ele} key={ele}>
                    {ele}
                  </option>
                ))}
              </Select>
            </div>
          ))}
        </div>
        <div className={style.innerFlex}>
          <div className={style.grid} style={{ margin: "0px", marginTop: "10px" }}>
            {languageFields?.map((ele, index) => (
              <Fragment key={index}>
                <SearchSelect
                  label="Language"
                  options={languages}
                  setValue={setValue}
                  register={register}
                  placeholder="Language"
                  clearErrors={clearErrors}
                  name={`personalInfo.languages[${index}].name`}
                  defaultValue={watch(`personalInfo.languages[${index}].name`)}
                  errorMessage={
                    errors?.personalInfo?.languages?.[index]?.name?.message ||
                    errors?.personalInfo?.languages?.[1]?.message
                  }
                />
                <Select
                  star="*"
                  label="Level"
                  register={register}
                  name={`personalInfo.languages[${index}].fluency`}
                  errorMessage={errors?.personalInfo?.languages?.[index]?.fluency?.message}
                >
                  <option> - - Please select an option - - </option>
                  {languageFluency.map((ele) => (
                    <option value={ele} key={ele}>
                      {ele}
                    </option>
                  ))}
                </Select>
              </Fragment>
            ))}
          </div>
          <p
            className={style.positionText}
            style={{ position: "absolute", top: "100%", margin: "20px 0px" }}
          >
            Please select at least one language you speak and how fluent you are in that language
          </p>
          <Button
            title={"Remove Language"}
            type={"button"}
            handleClick={handleRemoveLanguage}
            className={style.btnClass}
          />
          <Button
            title={"Add Language"}
            type={"button"}
            handleClick={handleAddLanguage}
            className={style.btnClass}
          />
        </div>
      </div>

      <div className={style.mainWraper} style={{ marginTop: "70px" }}>
        <h5 className={style.heading}>Passport & Visa Information</h5>

        <div className={style.innerFlex} style={{ margin: "20px 0px" }}>
          <div className={style.grid} style={{ margin: "0px" }}>
            {fields?.map((ele, index) => (
              <Fragment key={ele.id}>
                <SearchSelect
                  label={"Issuing Country"}
                  name={`personalInfo.passportVisaInformation.passports[${index}].issuerCountry`}
                  errorMessage={
                    errors?.personalInfo?.passportVisaInformation?.passports?.[index]?.issuerCountry
                      ?.message
                  }
                  register={register}
                  defaultValue={watch(
                    `personalInfo.passportVisaInformation.passports[${index}].issuerCountry`
                  )}
                  setValue={setValue}
                  placeholder="Country"
                  options={country_list}
                  clearErrors={clearErrors}
                />
                <DatePicker
                  star="*"
                  control={control}
                  id={index}
                  name={`personalInfo.passportVisaInformation.passports[${index}].expiry`}
                  label={"Passport Expiration Date"}
                  errorMessage={
                    errors?.personalInfo?.passportVisaInformation?.passports?.[index]?.expiry
                      ?.message
                  }
                />
              </Fragment>
            ))}
          </div>
          <Button
            title={isAddPassport ? "Add second passport" : "Remove passport"}
            type={"button"}
            handleClick={handleAddPassport}
            className={style.btnClass}
          />
        </div>
        {fields.length === 4 && <p className={style.errorMsg}>You can add only 4 passports.</p>}

        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label className={style.label}>Visa</label>
            <p className={style.positionText} style={{ marginLeft: "5px" }}>
              (Please select any visas you currently hold)
            </p>
            <label className={style.errorMessage}>
              {errors?.personalInfo?.passportVisaInformation?.visa?.message}
            </label>
          </div>
          <div>
            <div className={style.visa_sec}>
              {visaOptions.map((ele, index) => (
                <Checkbox
                  key={index}
                  label={ele}
                  register={register}
                  value={ele}
                  name={`personalInfo.passportVisaInformation.visa`}
                  className={style.check}
                  errorMessage={errors?.personalInfo?.passportVisaInformation?.visa?.message}
                />
              ))}
            </div>
            <div style={{ marginTop: "10px" }}>
              {watch(`personalInfo.passportVisaInformation.visa`)?.includes?.("Other Visa") && (
                <Input
                  name={"personalInfo.passportVisaInformation.otherVisa"}
                  register={register}
                  errorMessage={errors?.personalInfo?.passportVisaInformation?.otherVisa?.message}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={style.mainWraper} style={{ marginTop: "25px" }}>
        <h5 className={style.heading}>Team Status</h5>
        <div className={style.grid}>
          <Select
            star="*"
            label={"Marital Status"}
            errorMessage={errors?.personalInfo?.teamStatus?.maritalStatus?.message}
            register={register}
            name={"personalInfo.teamStatus.maritalStatus"}
          >
            <option value={""}> - - Please select an option - - </option>
            <option value={"Single"}>Single</option>
            <option value={"Married"}>Married</option>
            <option value={"Divorced"}>Divorced</option>
            <option value={"In a Relationship"}>In a Relationship</option>
          </Select>
          <div>
            <Select
              label={"Looking For Work as a Couple"}
              errorMessage={errors?.personalInfo?.teamStatus?.lookingForWorkAsCouple?.message}
              register={register}
              name={"personalInfo.teamStatus.lookingForWorkAsCouple"}
              errorClass={style.positionInitial}
            >
              <option value={""}> - - Please select an option - - </option>
              <option value={"Ideally"}>Ideally</option>
              <option value={"Yes"}>Yes</option>
              <option value={"No"}>No</option>
            </Select>
            <p className={style.positionText1} style={{ marginTop: "15px" }}>
              Is there more than one of you looking for work together?
            </p>
          </div>
          {!resData?.personalInfo?.teamStatus?.partnerEmail &&
            watch("personalInfo.teamStatus.lookingForWorkAsCouple") === "Yes" &&
            !watch("personalInfo.teamStatus.requestedPartnerVerification") && (
              <div className={style.innerFlex}>
                <Input
                  register={register}
                  errorClass={style.error}
                  label={"Partner's E-mail"}
                  className={style.pMailInput}
                  name={"personalInfo.teamStatus.partnerEmail"}
                  errorMessage={errors?.personalInfo?.teamStatus?.partnerEmail?.message}
                />
                {!watch("personalInfo.teamStatus.requestedPartnerVerification") && (
                  <div>
                    <Button
                      type={"button"}
                      title={"Verify Email"}
                      className={style.btnClass}
                      handleClick={handleVerifyPartnerEmail}
                      isLoading={verifyLoading}
                      loaderClass={style.verifyLoader}
                    />
                  </div>
                )}
              </div>
            )}
        </div>
        {(resData?.personalInfo?.teamStatus?.partnerEmail ||
          watch("personalInfo.teamStatus.requestedPartnerVerification")) && (
          <div className={style.partneredEmail}>
            <div className={style.partnerLabelContainer}>
              <label className={style.label}>Your partner</label>
              {watch("personalInfo.teamStatus.requestedPartnerVerification") && (
                <Badge title={"PENDING"} className={style.badgeDanger} />
              )}
              {resData?.personalInfo?.teamStatus?.partnerEmail && (
                <Badge title={"VERIFIED"} className={style.verifiedBadge} />
              )}
            </div>
            <div className={style.mailContainer}>
              <label className={style.label}>
                {resData?.personalInfo?.teamStatus?.partnerEmail ||
                  watch("personalInfo.teamStatus.requestedPartnerVerification")}
              </label>
              <Button
                type={"button"}
                title={"Cancel Link"}
                className={style.btnClass}
                handleClick={handleCancelVerification}
              />
            </div>
          </div>
        )}
      </div>

      <div className={style.buttonWrapper}>
        <Button
          title={"Save"}
          type={"submit"}
          isLoading={isLoading}
          className={style.btnSave}
          loaderClass={style.loaderClass}
        />
        <Link href={"/profile-overview/profile"}>
          <a>
            <Button className={style.btnCancel} title="Cancel" />
          </a>
        </Link>
      </div>
    </form>
  );
};

export default PersonalInformationSection;

const employmentTypes = [
  "Any",
  "Permanent Position",
  "Seasonal",
  "Temporary",
  "Freelance",
  "Volunteer",
];
const languageFluency = ["Basic", "Intermediate", "Advanced", "Fluent"];

const personalInformationArr = [
  {
    label: "Smoker",
    name: "smoker",
    option: ["Yes", "No", "Prefer not to say"],
  },
  {
    label: "Visible Tattoos",
    name: "visibleTattoos",
    option: ["Yes", "No", "Prefer not to say"],
  },
  {
    label: "Are You Looking For Live In Position",
    name: "lookingForLiveInPosition",
    option: ["Yes", "No"],
    star: "*",
  },
];
