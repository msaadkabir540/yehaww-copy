import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";

import NewSearch from "./new-search";
import Input from "components/input";
import Button from "components/button";
import Container from "components/container";
import BorderForm from "components/border-form";
import CandidateBasicSearchForm from "./basic-search";
import MultiSelectGrouped from "components/multi-select-grouped";

import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setCandidateSearch } from "store";

import { newPositionArr1 } from "utils/arrayHelper";

import helpIcon from "public/assets/help.svg";
import style from "./search-form.module.scss";

const CandidateSearchForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { handleSubmit, setValue, register, errors, clearErrors, watch } = useForm();

  const [groupedOptions, setGroupedOptions] = useState([]);

  const onSubmit = async (data) => {
    const position = data?.position;

    if (position) {
      data.position = position?.split(" (")?.[0];
      data.category = position?.split(" (")?.[1]?.replace(")", "");
    }
    await dispatch(setCandidateSearch(data));
    router.push({
      pathname: "/find-candidate/results",
      query: {
        employerSearch: true,
      },
    });
  };

  useEffect(() => {
    const categories = newPositionArr1.filter((x) => x.includes("+"));
    const positions = newPositionArr1.filter((x) => !x.includes("+"));
    const groupedOptionsArr = categories.map((category) => {
      const currentCategory = category.replace("+", "");
      return {
        label: currentCategory,
        options: positions
          .filter((position) => position.includes(currentCategory))
          .map((x) => {
            const value = `${x.split("-")[0]} (${x.split("-")[1]})`;
            return { label: x.split("-")[0], value, value };
          }),
      };
    });
    setGroupedOptions(groupedOptionsArr);
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <BorderForm className={style.borderForm} title={"About the Position"}>
          <div className={style.img}>
            <Image src={helpIcon} alt="help_icon" />
            <div className={style.newSearch}>
              <NewSearch />
            </div>
          </div>
          <p className={style.para}>
            Please tell us about the type of candidate you require.
            <span>
              Please note: This is not compulsory if you are searching for a specific candidate
            </span>
          </p>
          <MultiSelectGrouped
            label="Job Title"
            placeholder="Position"
            name="position"
            options={groupedOptions}
            onChange={(e) => {
              setValue("position", e.value);
            }}
            watch={watch}
            isMulti={false}
            customStyle={{
              "&:hover": { border: "1px solid #C0C0C0", cursor: "pointer" },
              border: "1px solid #C0C0C0",
              marginTop: "5px",
            }}
          />
        </BorderForm>
        <BorderForm className={style.borderForm} title={"Specific Candidate"}>
          <p className={style.para}>
            Are you searching for a Specific Candidate? If so, simply enter their name or email
            below and click "Search Now" at the bottom of this page.
          </p>
          <div className={style.gridClass}>
            <Input
              star="*"
              label="First Name"
              name={"firstName"}
              register={register}
              errorMessage={errors?.firstName?.message}
            />
            <Input
              star="*"
              label="Last Name"
              name={"lastName"}
              register={register}
              errorMessage={errors?.lastName?.message}
            />
          </div>
          <div className={style.marginClass}>
            <Input
              star="*"
              label={"Email"}
              register={register}
              name={"email"}
              errorMessage={errors?.email?.message}
            />
          </div>
        </BorderForm>
        <CandidateBasicSearchForm
          errors={errors}
          register={register}
          setValue={setValue}
          clearErrors={clearErrors}
        />
        <Button title={"Submit"} />
      </form>
    </>
  );
};

export default CandidateSearchForm;
