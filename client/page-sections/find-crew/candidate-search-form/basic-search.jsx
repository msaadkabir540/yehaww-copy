import React from "react";

import BorderForm from "components/border-form";
import Checkbox from "components/checkbox";
import MultiSelect from "components/multi-select";
import Select from "components/select";

import { availability, country_list, languages, visaOptions } from "utils/arrayHelper";

import style from "./search-form.module.scss";

const CandidateBasicSearchForm = ({ errors, setValue, register, clearErrors }) => {
  return (
    <>
      <BorderForm title={"Basic Search"} className={style.borderForm}>
        <p className={style.para}>Please tell us about them</p>

        <div className={style.gridClass}>
          <Select
            label={"Gender"}
            register={register}
            name={`gender`}
            errorMessage={errors?.gender?.message}
          >
            <option value={"All"}> Either</option>
            <option value={"Male"}>Male</option>
            <option value={"Female"}>Female</option>
          </Select>
          <div>
            <MultiSelect
              label={"Language"}
              name={"languages"}
              options={languages}
              setValue={setValue}
              clearErrors={clearErrors}
              errorMessage={errors?.languages?.message}
              customStyle={{
                "&:hover": { border: "1px solid #C0C0C0", cursor: "pointer" },
                border: "1px solid #C0C0C0",
                marginTop: "5px",
              }}
            />
          </div>
          <div>
            <MultiSelect
              label={"Nationality"}
              name={"nationalities"}
              options={country_list}
              setValue={setValue}
              clearErrors={clearErrors}
              errorMessage={errors?.nationalities?.message}
              customStyle={{
                "&:hover": { border: "1px solid #C0C0C0", cursor: "pointer" },
                border: "1px solid #C0C0C0",
                marginTop: "5px",
              }}
            />
          </div>
          <Select
            label="Availability"
            className={style.select}
            register={register}
            name={"availability"}
            errorMessage={errors?.availability?.message}
          >
            <option value="">- - - - Please select an option - - - -</option>
            {availability?.map((ele) => (
              <option key={ele} value={ele}>
                {ele}
              </option>
            ))}
          </Select>
          <Select
            register={register}
            label="Candidate Currently Based"
            name={"currentlyBased"}
            className={style.select}
            errorMessage={errors?.currentlyBased?.message}
          >
            <option value="">- - - - Please select an option - - - -</option>
            {country_list?.map((ele) => (
              <option key={ele} value={ele}>
                {ele}
              </option>
            ))}
          </Select>
          <Select
            label={"Professional Candidate Experience"}
            name={`professionalExperience`}
            register={register}
            errorMessage={errors?.professionalExperience?.message}
          >
            <option value={""}>Not Applicable</option>
            {durations?.map((ele) => (
              <option value={ele} key={ele}>
                {ele}
              </option>
            ))}
          </Select>
        </div>
        <div className={style.marginClass}>
          <Select
            label={"Are you Looking for a Team/Couple?"}
            name={`teamCouple`}
            register={register}
            errorMessage={errors?.teamCouple?.message}
          >
            <option value={""}>Not Applicable</option>
            {team?.map((ele, index) => (
              <option value={ele === "Don't mind" ? "" : ele} key={ele}>
                {ele}
              </option>
            ))}
          </Select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginBottom: "20px" }}>
          <label className={style.label}>Visa</label>
          <label className={style.errorMessage}>
            {errors?.passportVisaInformation?.visa?.message}
          </label>
          <div className={style.gridClass} style={{ marginTop: "20px" }}>
            {visaOptions.map((ele, index) => (
              <div key={index}>
                <Checkbox
                  label={ele}
                  register={register}
                  value={ele}
                  name="visas"
                  errorMessage={errors?.visas?.message}
                />
              </div>
            ))}
          </div>
        </div>
      </BorderForm>
    </>
  );
};

export default CandidateBasicSearchForm;

const languageFluency = ["Basic", "Intermediate", "Advanced", "Fluent"];

const durations = [
  "0 - 6 months",
  "6 months - 1 year",
  "1 - 2 years",
  "2 - 5 years",
  "5+ years",
  "10+ years",
];
const team = ["Don't mind", "Yes", "No"];
