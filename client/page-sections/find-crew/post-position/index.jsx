import Image from "next/image";
import moment from "moment/moment";

import Input from "components/input";
import Button from "components/button";
import Select from "components/select";
import Loading from "components/loading";
import Checkbox from "components/checkbox";
import TextArea from "components/textarea";
import Container from "components/container";
import DatePicker from "components/datepicker";
import BorderForm from "components/border-form";
import MultiSelect from "components/multi-select";
import SalaryInfoModal from "./salary-info-modal";
import SearchSelect from "components/search-select";
import LocationSelect from "components/select-location";
import MultiSelectGrouped from "components/multi-select-grouped";

import {
  languages,
  currencies,
  visaOptions,
  jobTypeKeys,
  country_list,
  languageFluency,
  employeesExpectation,
} from "utils/arrayHelper";
import { usePostPosition } from "helpers/post-position-helper";

import deleteIcon from "public/assets/delete.png";
import style from "./post.module.scss";

const PostPage = () => {
  const {
    watch,
    errors,
    fields,
    router,
    control,
    preview,
    setValue,
    onSubmit,
    register,
    jobLoader,
    imageWatch,
    draftLoader,
    pageLoading,
    clearErrors,
    handleSubmit,
    homeBaseCity,
    groupedOptions,
    handleLanguage,
    salaryInfoModal,
    setSalaryInfoModal,
    currentlyLocatedCity,
    handleDuplicateAddress,
  } = usePostPosition();

  const companyType = watch("job.companyInfo.companyType");

  return (
    <>
      <div style={{ display: pageLoading ? "" : "none" }}>
        <Loading pageLoader={true} diffHeight={340} />
      </div>
      <div style={{ display: pageLoading ? "none" : "" }}>
        <form
          className={style.positionForm}
          onSubmit={(e) => {
            clearErrors();
            handleSubmit((data) => onSubmit(data, e))(e);
          }}
        >
          <div className={style.gridTwo}>
            <div>
              <MultiSelectGrouped
                star="*"
                label={"Job Title"}
                name="job.jobTitle"
                options={groupedOptions}
                onChange={(e) => {
                  setValue("job.jobTitle", e.value);
                  clearErrors("job.jobTitle");
                }}
                watch={watch}
                isMulti={false}
                errorMessage={errors?.job?.jobTitle?.message}
                customStyle={{
                  "&:hover": { border: "1px solid #C0C0C0", cursor: "pointer" },
                  border: "1px solid #C0C0C0",
                  marginTop: "5px",
                }}
              />
            </div>
            <Select
              star="*"
              register={register}
              label={"Employment Type"}
              name="job.employmentType"
              errorMessage={errors?.job?.employmentType?.message}
            >
              <option value="">Select Employment Type</option>
              {employmentTypes.map((jobs, index) => (
                <option key={index} value={jobs}>
                  {jobs}
                </option>
              ))}
            </Select>
          </div>
          <BorderForm className={style.borderForm} title={"Company Information"}>
            <div className={style.gridTwo}>
              <Select
                star="*"
                label={"Type"}
                register={register}
                name="job.companyInfo.companyType"
                errorMessage={errors?.job?.companyInfo?.companyType?.message}
              >
                <option value="">Select Company Type</option>
                {jobType.map((jobType, index) => (
                  <option key={index} value={jobType}>
                    {jobType}
                  </option>
                ))}
              </Select>
              <Input
                type={"text"}
                register={register}
                label={"Company Name"}
                name="job.companyInfo.companyName"
                errorMessage={errors?.job?.companyInfo?.companyName?.message}
              />
              <Input
                star="*"
                type={"number"}
                numbersOnly={true}
                register={register}
                name="job.companyInfo.companySize"
                label={"Size of the company ( how many employees )"}
                errorMessage={errors?.job?.companyInfo?.companySize?.message}
              />
              <Input
                star="*"
                type={"number"}
                numbersOnly={true}
                register={register}
                label={"Number Of Horses"}
                name="job.companyInfo.numOfHorses"
                errorMessage={errors?.job?.companyInfo?.numOfHorses?.message}
              />
            </div>
            <Select
              star="*"
              register={register}
              label={"Level Of Operation"}
              name="job.companyInfo.levelOfOperation"
              errorMessage={errors?.job?.companyInfo?.levelOfOperation?.message}
            >
              {operation.map((operation, index) => (
                <option key={index} value={operation === "Any" ? "" : operation}>
                  {operation}
                </option>
              ))}
            </Select>
          </BorderForm>
          <BorderForm className={style.borderForm} title={"Position Information"}>
            <h4 className={style.h6}>Home Base</h4>
            <div className={style.gridTwo}>
              <div>
                <SearchSelect
                  label={"Country"}
                  register={register}
                  setValue={setValue}
                  placeholder="Country"
                  options={country_list}
                  clearErrors={clearErrors}
                  name="job.positionInfo.homeBase.country"
                  defaultValue={watch("job.positionInfo.homeBase.country")}
                  errorMessage={errors?.job?.positionInfo?.homeBase?.country?.message}
                />
              </div>
              <div>
                <SearchSelect
                  label={"City"}
                  autocomplete="off"
                  placeholder="City"
                  register={register}
                  setValue={setValue}
                  clearErrors={clearErrors}
                  options={[...new Set(homeBaseCity)]}
                  name="job.positionInfo.homeBase.city"
                  defaultValue={watch("job.positionInfo.homeBase.city")}
                  errorMessage={errors?.job?.positionInfo?.homeBase?.city?.message}
                  disableSplit
                />
              </div>
            </div>
            <Input
              type="text"
              register={register}
              label={"Home Base Address"}
              name="job.positionInfo.homeBase.address"
              errorMessage={errors?.job?.positionInfo?.homeBase?.address?.message}
            />
            <Button
              type={"button"}
              className={style.btn}
              title={"Same as Home Base"}
              handleClick={handleDuplicateAddress}
            />
            <h4 className={style.h6}>Currently Located</h4>
            <div className={style.gridTwo}>
              <div>
                <SearchSelect
                  label={"Country"}
                  register={register}
                  setValue={setValue}
                  placeholder="Country"
                  options={country_list}
                  clearErrors={clearErrors}
                  name="job.positionInfo.currentlyLocated.country"
                  defaultValue={watch("job.positionInfo.currentlyLocated.country")}
                  errorMessage={errors?.job?.positionInfo?.currentlyLocated?.country?.message}
                />
              </div>
              <div>
                <SearchSelect
                  label={"City"}
                  autocomplete="off"
                  placeholder="City"
                  register={register}
                  setValue={setValue}
                  clearErrors={clearErrors}
                  options={[...new Set(currentlyLocatedCity)]}
                  name="job.positionInfo.currentlyLocated.city"
                  defaultValue={watch("job.positionInfo.currentlyLocated.city")}
                  errorMessage={errors?.job?.positionInfo?.currentlyLocated?.city?.message}
                  disableSplit
                />
              </div>
              <div>
                <LocationSelect
                  register={register}
                  setValue={setValue}
                  placeholder="Location"
                  label={"Choose Location"}
                  clearErrors={clearErrors}
                  name="job.positionInfo.location"
                  defaultValue={watch("job.positionInfo.location")}
                  errorMessage={errors?.job?.positionInfo?.location?.name?.message}
                />
              </div>
            </div>
            <h6 className={style.h6}>Competition/Programme</h6>
            <div className={style.gridTwo}>
              <div>
                <MultiSelect
                  watch={watch}
                  label={"Country"}
                  setValue={setValue}
                  options={country_list}
                  clearErrors={clearErrors}
                  name="job.positionInfo.competition.country"
                  errorMessage={errors?.job?.positionInfo?.competition?.country?.message}
                  customStyle={{
                    "&:hover": { border: "1px solid #C0C0C0", cursor: "pointer" },
                    border: "1px solid #C0C0C0",
                    marginTop: "5px",
                    height: "100% !important",
                    minHeight: "43px !important",
                  }}
                />
              </div>
              <Input
                type="text"
                register={register}
                label={"Competition Name"}
                name="job.positionInfo.competition.name"
                errorMessage={errors?.job?.positionInfo?.competition?.name?.message}
              />
            </div>
            <h6 className={style.h6}>Position Details</h6>
            <div className={style.gridTwo} style={{ marginBottom: "0px" }}>
              <div>
                <DatePicker
                  id={"1"}
                  star="*"
                  control={control}
                  label={"Start Date"}
                  minDate={moment().toDate()}
                  name={`job.positionInfo.startDate`}
                  errorMessage={errors?.job?.positionInfo?.startDate?.message}
                />
              </div>
              <div>
                <MultiSelect
                  watch={watch}
                  setValue={setValue}
                  clearErrors={clearErrors}
                  options={employeesExpectation}
                  label={"What Are Employer's Expectations"}
                  name="job.positionInfo.employeeExpectations"
                  errorMessage={errors?.job?.positionInfo?.employeeExpectations?.message}
                  customStyle={{
                    "&:hover": { border: "1px solid #C0C0C0", cursor: "pointer" },
                    border: "1px solid #C0C0C0",
                    marginTop: "5px",
                    height: "100% !important",
                    minHeight: "43px !important",
                  }}
                />
              </div>
            </div>
            <div className={style.salaryBanner}>
              <Image src="/assets/icons/red-warning.svg" alt="warning" width={30} height={30} />
              <p>
                Salary details are required for some location{" "}
                <span onClick={() => setSalaryInfoModal(true)}>more information</span>
              </p>
            </div>
            <div className={style.gridThree}>
              <Select
                label="Currency"
                register={register}
                className={style.select}
                name={"job.positionInfo.currency"}
                errorMessage={errors?.job?.positionInfo?.currency?.message}
              >
                <option value="">Please Select Currency</option>
                {currencies?.map((ele, index) => (
                  <option key={index} value={ele}>
                    {ele}
                  </option>
                ))}
              </Select>
              <Input
                type="text"
                label={"Salary"}
                placeholder="TBC"
                register={register}
                name="job.positionInfo.salary"
                errorMessage={errors?.job?.positionInfo?.salary?.message}
              />
              <Select
                register={register}
                label={"Salary Basis"}
                className={style.language}
                selectClass={style.selectClass}
                name={"job.positionInfo.salaryBasis"}
                errorMessage={errors?.job?.positionInfo?.salaryBasis?.message}
              >
                <option value={""}>Select an Option</option>
                {["Per Month", "Per Day"]?.map((ele) => (
                  <option value={ele} key={ele}>
                    {ele}
                  </option>
                ))}
              </Select>
            </div>
            <div className={style.gridTwo}>
              <Select
                star="*"
                label={"Live In"}
                register={register}
                name={`job.positionInfo.liveIn`}
                errorMessage={errors?.job?.positionInfo?.liveIn?.message}
              >
                <option value="">Please select an option</option>
                {["Yes", "No"].map((fluency, index) => (
                  <option key={index} value={fluency}>
                    {fluency}
                  </option>
                ))}
              </Select>
              <Select
                register={register}
                className={style.language}
                selectClass={style.selectClass}
                label={"About The Position Other Language"}
                name={"job.positionInfo.aboutThePositionOtherLanguage"}
                errorMessage={errors?.job?.positionInfo?.aboutThePositionOtherLanguage?.message}
              >
                <option value={""}>--Select Language--</option>
                {languages?.map((ele) => (
                  <option value={ele} key={ele}>
                    {ele}
                  </option>
                ))}
              </Select>
              <TextArea
                star="*"
                register={register}
                label={"About The Position"}
                name="job.positionInfo.aboutThePosition"
                placeholder={"Please Describe the position in English (mandatory)"}
                errorMessage={errors?.job?.positionInfo?.aboutThePosition?.message}
                displayCharCount={false}
              />
              <TextArea
                label={"About The Position Other Language Text"}
                placeholder={
                  "Please Describe the position in the language of your choice (optional)"
                }
                register={register}
                name="job.positionInfo.aboutThePositionOtherLanguageText"
                errorMessage={errors?.job?.positionInfo?.aboutThePositionOtherLanguageText?.message}
                displayCharCount={false}
              />
            </div>
            <p className={style.positionText}>
              Please add all the additional information about the position in this section. What
              type of candidate are you looking for, for example, a positive person, team player,
              etc?{" "}
              <strong>
                Email addresses, phone numbers, and links to websites are not allowed in this
                section.
              </strong>
            </p>
            <div className={style.imageContainer}>
              <div style={{ width: "100%" }}>
                <Input
                  type={"file"}
                  label={"Image"}
                  register={register}
                  className={style.input}
                  name={"job.positionInfo.image"}
                  accept="image/png, image/jpeg, image/jpg"
                  errorMessage={errors?.job?.positionInfo?.image?.message}
                />
                <div style={{ marginTop: "15px" }}>
                  {imageWatch?.includes?.("http") ? (
                    <a href={imageWatch} target={"_blank"} className={style.file}>
                      <div className={style.uploadedImg}>
                        <Image
                          width={130}
                          height={130}
                          src={imageWatch}
                          alt="watch_image"
                          className={style.uploadedImg}
                        />
                      </div>
                    </a>
                  ) : imageWatch?.length && preview ? (
                    <Image src={preview} alt="Preview" width={100} height={100} />
                  ) : (
                    companyType && (
                      <>
                        <p className={style.para} style={{ marginBottom: "5px" }}>
                          Default Image
                        </p>
                        <div className={style.defaultImg}>
                          <Image
                            width={130}
                            height={130}
                            className={style.defaultImg}
                            src={`/assets/imgs/${jobTypeKeys[companyType]}.webp`}
                          />
                        </div>
                        <p className={style.para} style={{ marginTop: "5px" }}>
                          Upload image to replace the default image.
                        </p>
                      </>
                    )
                  )}
                </div>
              </div>
              {(imageWatch?.includes?.("http") || imageWatch?.length > 0) && (
                <div className={style.btnBtn}>
                  <Button
                    title={"Delete Image"}
                    className={style.deleteBtn}
                    icon={deleteIcon}
                    handleClick={() => {
                      setValue("job.positionInfo.image", "");
                    }}
                  />
                </div>
              )}
            </div>
          </BorderForm>
          <BorderForm className={style.borderForm} title={"Preferred Candidate"}>
            <p className={style.para}>
              Please tell us what you'd like to see from your preferred candidate
            </p>
            <Select
              star="*"
              label={"Gender"}
              register={register}
              name={`job.preferredCandidate.gender`}
              errorMessage={errors?.job?.preferredCandidate?.gender?.message}
            >
              <option value="">Please select an option</option>
              {genderOptions.map((gender, index) => (
                <option key={index} value={gender}>
                  {gender}
                </option>
              ))}
            </Select>
            <div>
              {fields.map((x, index) => (
                <div className={style.gridTwo} style={{ marginBottom: "0px" }} key={index}>
                  <Select
                    star="*"
                    register={register}
                    label={"Language Name"}
                    name={`job.preferredCandidate.languages.${index}.name`}
                    errorMessage={
                      errors?.job?.preferredCandidate?.languages?.[index]?.name?.message
                    }
                  >
                    <option value="">Please select an option</option>
                    {languages.map((language, index) => (
                      <option key={index} value={language}>
                        {language}
                      </option>
                    ))}
                  </Select>
                  <Select
                    star="*"
                    register={register}
                    label={"Language Fluency"}
                    name={`job.preferredCandidate.languages.${index}.fluency`}
                    errorMessage={
                      errors?.job?.preferredCandidate?.languages?.[index]?.fluency?.message
                    }
                  >
                    <option value="">Please select an option</option>
                    {languageFluency.map((fluency, index) => (
                      <option key={index} value={fluency}>
                        {fluency}
                      </option>
                    ))}
                  </Select>
                </div>
              ))}
            </div>
            {fields.length < 3 && (
              <Button
                type={"button"}
                title={"Add Language"}
                handleClick={() => {
                  handleLanguage("add");
                }}
                className={style.btn}
              />
            )}
            {fields.length > 1 && (
              <Button
                type={"button"}
                title={"Remove Language"}
                handleClick={() => {
                  handleLanguage("remove", fields.length - 1);
                }}
                className={style.btn}
              />
            )}
            <div className={style.selectBox1}>
              <MultiSelect
                star="*"
                watch={watch}
                setValue={setValue}
                label={"Nationality"}
                clearErrors={clearErrors}
                options={["Any", ...country_list]}
                name={"job.preferredCandidate.nationality"}
                errorMessage={errors?.job?.preferredCandidate?.nationality?.message}
                customStyle={{
                  "&:hover": { border: "1px solid #C0C0C0", cursor: "pointer" },
                  border: "1px solid #C0C0C0",
                  marginTop: "5px",
                }}
              />
            </div>
            <div className={style.gridTwo}>
              <Select
                star="*"
                register={register}
                label="Availability"
                className={style.select}
                name={"job.preferredCandidate.availability"}
                errorMessage={errors?.job?.preferredCandidate?.availability?.message}
              >
                <option value="">Please select an option</option>
                {availability?.map((ele, index) => (
                  <option key={index} value={ele}>
                    {ele}
                  </option>
                ))}
              </Select>
              <div>
                <MultiSelect
                  star="*"
                  watch={watch}
                  setValue={setValue}
                  clearErrors={clearErrors}
                  options={["Any", ...country_list]}
                  label={"Candidate Currently Based"}
                  name={"job.preferredCandidate.candidateCurrentlyBased"}
                  errorMessage={errors?.job?.preferredCandidate?.candidateCurrentlyBased?.message}
                  customStyle={{
                    "&:hover": { border: "1px solid #C0C0C0", cursor: "pointer" },
                    border: "1px solid #C0C0C0",
                    marginTop: "5px",
                  }}
                />
              </div>
              <Select
                star="*"
                register={register}
                label={"Professional Equine Experience"}
                name={`job.preferredCandidate.professionalExperience`}
                errorMessage={errors?.job?.preferredCandidate?.professionalExperience?.message}
              >
                <option value="">Please select an option</option>
                {durations?.map((ele) => (
                  <option value={ele} key={ele}>
                    {ele}
                  </option>
                ))}
              </Select>
              <Select
                star="*"
                register={register}
                name={`job.preferredCandidate.team`}
                label={"Are you Looking for a Team/Couple?"}
                errorMessage={errors?.job?.preferredCandidate?.team?.message}
              >
                <option value="">Please select an option</option>
                {team?.map((ele) => (
                  <option value={ele} key={ele}>
                    {ele}
                  </option>
                ))}
              </Select>
              <Select
                star="*"
                register={register}
                name={`job.preferredCandidate.bringOwnHorse`}
                label={"Possibility To Bring Your own Horse?"}
                errorMessage={errors?.job?.preferredCandidate?.bringOwnHorse?.message}
              >
                <option value="">Please select an option</option>
                {horseData.map((detail, index) => (
                  <option key={index}>{detail}</option>
                ))}
              </Select>
              <Select
                star="*"
                register={register}
                label={"Possibility To Have Your Own Dog?"}
                name={`job.preferredCandidate.bringOwnDog`}
                errorMessage={errors?.job?.preferredCandidate?.bringOwnDog?.message}
              >
                <option value="">Please select an option</option>
                {dogData.map((detail, index) => (
                  <option key={index}>{detail}</option>
                ))}
              </Select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", margin: "20px 0px" }}>
              <label className={style.label}>Visa *</label>
              <label className={style.errorMessage}>
                {errors?.job?.preferredCandidate?.visa?.message}
              </label>
              <div className={style.gridTwo} style={{ marginTop: "25px" }}>
                {visaOptions.map((ele, index) => (
                  <div key={index}>
                    <Checkbox
                      label={ele}
                      value={ele}
                      register={register}
                      name={`job.preferredCandidate.visa.visaType`}
                      errorMessage={errors?.job?.preferredCandidate?.visa?.visaType?.message}
                    />
                  </div>
                ))}
              </div>
            </div>
          </BorderForm>
          <div className={style.btnSec}>
            <Button
              type="submit"
              btnName="draftButton"
              title={"Save as Draft"}
              isLoading={draftLoader}
              className={style.draftBtn}
            />
            <Button
              isLoading={jobLoader}
              title={router?.query?.edit && !router?.query?.draft ? "Update Post" : "Post Live"}
            />
          </div>
        </form>
      </div>
      <SalaryInfoModal open={salaryInfoModal} setOpen={setSalaryInfoModal} />
    </>
  );
};

export default PostPage;
const genderOptions = ["Male", "Female", "Rather Not Describe"];

const jobType = [
  "Barn",
  "Rider",
  "Owner",
  "Stable Manager",
  "Recruitment Agency",
  "Equestrian Business",
];

const operation = ["Any", "Hobby Barn", "Young Horse Barn", "Amateur Barn", "Professional Barn"];

const horseData = ["Yes", "No"];

const dogData = ["Yes", "No"];

const durations = [
  "0-6 months",
  "6months-1 year",
  "1-2 years",
  "2-5 years",
  "5+ years",
  "10+ years",
];

const team = ["Don't mind", "Yes", "No"];

const availability = ["Immediately", "Within 2 weeks", "2-4 weeks", "4-6 weeks", "6+ weeks"];

const employmentTypes = ["Permanent Position", "Seasonal", "Temporary", "Freelance", "Volunteer"];
