import React from "react";
import Link from "next/link";

import Select from "components/select";
import Button from "components/button";
import BorderForm from "components/border-form";

import { qualificationSkillForm, useQualificationSkills } from "./helper";

import style from "./qualification.module.scss";

const QualificationSection = () => {
  const { register, handleSubmit, submit, isLoading } = useQualificationSkills();

  return (
    <div className={style.form_container}>
      <form onSubmit={handleSubmit(submit)}>
        {qualificationSkillForm.map(({ title, field }) => (
          <BorderForm title={title} key={title} className={style.borderForm}>
            <div className={style.gridTwo}>
              {field?.map(({ label, option, name }) => (
                <Select label={label} key={name} name={name} register={register}>
                  {option?.map((ele) => (
                    <option value={ele} key={ele}>
                      {ele}
                    </option>
                  ))}
                </Select>
              ))}
            </div>
          </BorderForm>
        ))}
        <div className={style.buttonWrapper}>
          <Button
            title={"Save"}
            type={"submit"}
            isLoading={isLoading}
            loaderClass={style.loaderClass}
            className={style.btnSave}
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

export default QualificationSection;
