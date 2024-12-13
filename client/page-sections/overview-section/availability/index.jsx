import React from "react";
import Link from "next/link";

import Button from "components/button";
import Select from "components/select";
import Input from "components/input";

import { availability, country_list } from "utils/arrayHelper";
import { useAvailability } from "./helper";

import style from "./availability.module.scss";

const AvailabilitySection = () => {
  const { register, handleSubmit, errors, isLoading, onSubmit } = useAvailability();

  return (
    <div className={style.form_container}>
      <h5 className={style.heading}>Availability</h5>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={style.formWrapper}>
          <Select
            star="*"
            label="Availability"
            register={register}
            name={"availabilityInfo.availability"}
            errorMessage={errors?.availabilityInfo?.availability?.message}
          >
            <option value="">- - - - Please select an option - - - -</option>
            {availability?.map((ele) => (
              <option key={ele} value={ele}>
                {ele}
              </option>
            ))}
          </Select>
          <Select
            star="*"
            register={register}
            label="Current Country"
            name={"availabilityInfo.currentCountry"}
            className={style.select}
            errorMessage={errors?.availabilityInfo?.currentCountry?.message}
          >
            <option value="">- - - - Please select an option - - - -</option>
            {country_list?.map((ele) => (
              <option key={ele} value={ele}>
                {ele}
              </option>
            ))}
          </Select>
        </div>
        <Input
          star="*"
          label={"Current City"}
          name={"availabilityInfo.currentLocation"}
          register={register}
          errorMessage={errors?.availabilityInfo?.currentLocation?.message}
        />
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
    </div>
  );
};

export default AvailabilitySection;
