import React from "react";
import Link from "next/link";

import Button from "components/button";
import Select from "components/select";
import TextArea from "components/textarea";
import BorderForm from "components/border-form";

import { useAbout } from "./helper";
import { languages } from "utils/arrayHelper";

import style from "./about.module.scss";

const AboutSection = () => {
  const { isLoading, register, handleSubmit, errors, onSubmit, watch } = useAbout();

  return (
    <div className={style.form_container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className={style.flexClass}>
            <h5 className={style.heading}>About Me</h5>
          </div>
          <div className={style.gridTwo}>
            <TextArea
              star="*"
              register={register}
              className={style.flex}
              name={"aboutMe.about"}
              placeholder="Mandatory"
              watch={watch("aboutMe.about")}
              labelCount={"Maximum 250 words"}
              label="Write about yourself in English"
              errorMessage={errors?.aboutMe?.about?.message}
            />
            <div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <label className={style.label}>
                  Write about yourself in the language of your choice (optional)
                </label>
                <div className={style.selectContainer}>
                  <Select
                    name={"aboutMe.aboutMeAnother.language"}
                    register={register}
                    selectClass={style.selectClass}
                    errorMessage={errors?.aboutMe?.aboutMeAnother?.language?.message}
                  >
                    <option value={""}>--Select Language--</option>
                    {languages?.map((ele) => (
                      <option value={ele} key={ele}>
                        {ele}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <TextArea
                register={register}
                placeholder="Optional"
                labelCount={"Maximum 250 words"}
                name={"aboutMe.aboutMeAnother.text"}
                watch={watch("aboutMe.aboutMeAnother.text")}
                errorMessage={errors?.aboutMe?.aboutMeAnother?.text?.message}
              />
            </div>
          </div>
        </div>
        <div style={{ marginTop: "30px" }}>
          <div className={style.flexClass}>
            <h5 className={style.heading}>Hobbies/Interests</h5>
          </div>

          <div className={style.gridTwo}>
            <TextArea
              star="*"
              register={register}
              className={style.flex}
              placeholder="Mandatory"
              labelCount={"Maximum 250 words"}
              name={"aboutMe.hobbiesInterests"}
              watch={watch("aboutMe.hobbiesInterests")}
              label="Write your interests/hobbies in English"
              errorMessage={errors?.aboutMe?.hobbiesInterests?.message}
            />
            <div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <label className={style.label}>
                  Write your interests/hobbies in the language of your choice (optional)
                </label>
                <div className={style.selectContainer}>
                  <Select
                    name={"aboutMe.hobbiesInterestsAnother.language"}
                    register={register}
                    selectClass={style.selectClass}
                    errorMessage={errors?.aboutMe?.hobbiesInterestsAnother?.language?.message}
                  >
                    <option value={""}>--Select Language--</option>
                    {languages?.map((ele) => (
                      <option value={ele} key={ele}>
                        {ele}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <TextArea
                register={register}
                placeholder="Optional"
                labelCount={"Maximum 250 words"}
                name={"aboutMe.hobbiesInterestsAnother.text"}
                watch={watch("aboutMe.hobbiesInterestsAnother.text")}
                errorMessage={errors?.aboutMe?.hobbiesInterestsAnother?.text?.message}
              />
            </div>
          </div>
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
    </div>
  );
};

export default AboutSection;
